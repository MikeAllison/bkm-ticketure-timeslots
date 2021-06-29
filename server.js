const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.render('public/index.html'));

app.post('/api/timeslots', (req, res) => {
  const event = {
    name: null,
    timeslots: null
  };

  const eventsPromise = new Promise((resolve, reject) => {
    axios(
      `${process.env.TICKETURE_API}/events/available?id=${req.body.eventId}`
    )
      .then(response => {
        event.name = response.data.event_template._data[0].name;
        resolve();
      })
      .catch(err => {
        reject();
        res.status(500).send();
      });
  });

  const sessionsPromise = new Promise((resolve, reject) => {
    axios(
      `${process.env.TICKETURE_API}/events/${req.body.eventId}/sessions?_ondate=${req.body.eventDate}`
    )
      .then(response => {
        event.timeslots = response.data.event_session._data;
        resolve();
      })
      .catch(err => {
        reject();
        res.status(500).send();
      });
  });

  Promise.all([eventsPromise, sessionsPromise])
    .then(() => {
      res.status(200).json(event);
    })
    .catch(err => {
      res.status(500).send();
    });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port: ${process.env.PORT}`)
);
