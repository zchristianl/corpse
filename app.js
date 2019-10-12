const express = require('express');

let app = express();

app.get('/', (req, res) => {
  res.send('ci with travis');
});

let server = app.listen(3000, () => {
  console.log('App running on port 3000');
});

module.exports = server;
