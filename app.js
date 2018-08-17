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
    "12017782387": {"name": "Michael", "count": 4, "spoken_to": "Alice, Bob and Charlie"},
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
