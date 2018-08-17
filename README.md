# Nexmo Voice Tutorials - Call Whisper With onAnswer
The scenario of this tutorial is giving the help desk some information before
passing the calls in. This example passes the call center number as the key word
for retrieving relating information for the help desk to get ready for support.

## Background actions:
1. Someone calls a Nexmo number
2. Nexmo forwards the call to the application linked with the number
3. Nexmo requests the NCCO that is defined in the application answer URL
4. This NCCO contains a talk action and a connect action to onAnswer NCCO
5. Nexmo call the help desk and put the caller in the same conversation
6. Nexmo request the onAnswer NCCO and give some information to the help desk
7. Nexmo transfers help desk to the original conversation with the caller

## Step by Step Guide
0. Register Nexmo account, install Nexmo CLI, and sign up ngrok.
1. Use ngrok to prepare a public URL for local web server. Run `./ngrok http 3000`
in terminal and note down the public URL like `https://abcd1234.ngrok.io`.
2. Create a Nexmo app, buy a Nexmo number, and link them.
```
nexmo app:create "OnAnswerTest" https://<ngrok_url>/answer https://<ngrok_url>/event
nexmo number:buy --country_code US --confirm
nexmo link:app <number> <application_id>
```
This could also be achieved in a GUI way on Nexmo.com dashboard.
3. Create a project directory, and run `npm install express --save` in it.
4. Run `npm install dotenv --save` to prepare for using .env file. Rename sample.env
to .env and have the ngrok url, your nexmo number and your own number filled.
5. Create a `app.js` file with following code:
```
require('dotenv').load();

const express = require('express')
const app = express()

app.get('/answer', (req, res) => {
  res.json([
    {
      "action": "talk",
      "text": "Thanks for calling. Connecting you to the help desk now"
    },
    {
      "action": "connect",
      "eventUrl": [process.env.ngrok_url],
      "from": process.env.nexmo_number,
      "endpoint": [{
        "type": "phone",
        "number": process.env.your_number,
        // following code does not work, console log returns "anonymous"
        // "onAnswer": {"url":`${ngrok_url}/on-answer?original=${req.query.from}`}
        // following code does work, as it pass from number to on-answer correctly as console log shows
        "onAnswer": {"url":`${process.env.ngrok_url}/on-answer?original=${process.env.nexmo_number}`}
      }]
    }
  ]);
});

app.get('/on-answer', (req, res) => {
  console.log(`${req.query.original}`);
  const staff = {
    // replace one of the following number with the nexmo number
    "14155550102": {"name": "Michael", "count": 4, "spoken_to": "Alice, Bob and Charlie"},
    "14155550102": {"name": "Don", "count": 2, "spoken_to": "Bob"}
  };

  const caller = staff[req.query.original];

  res.json([
    {
      "action": "talk",
      "text": `There is a help request from ${caller.name}. They have called ${caller.count} times this week and have spoken to ${caller.spoken_to}`
    }
  ]);
});

app.listen(3000, () => console.log('Application listening on port 3000!'));
```
6. Run `node app.js` to start the web server and listen on local port 3000.
7. Call your Nexmo number to verify your call center onAnswer feature.

## Reference:
https://developer.nexmo.com/tutorials/call-whisper-with-on-answer
