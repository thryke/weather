const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '33783ab49aa36c8ef3edfe2e994386a1';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', { weather: null, error: null});
});

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if (err) {
      res.render('index', { weather: null, error: 'Error, please try again' });
    } else {
      let weather = JSON.parse(body);
      if (weather.main == undefined) {
        res.render('index', { weather: null, error: 'Error, please try again' });
      } else {
        let condition = weather.weather[0].id;
        let temp = weather.main.temp;
        let weatherText = `Condition id = ${condition}`;

        // Condtion ID's for types of rain (could be subdivided further)
        if ((condition >= 200 && condition <= 202) || (condition >= 230 && condition <= 232) || (condition >= 300 && condition <= 321) || (condition >= 500 && condition <= 531)) {
          let weatherText = `Bring an umbrella, condition = ${condition}, (${weather.weather[0].description})`;
          res.render('index', { weather: weatherText, error: null });
        } else {
          let weatherText = `No need for an umbrella, condition = ${condition}, (${weather.weather[0].description})`;
          res.render('index', { weather: weatherText, error: null });
        }
      }
    }
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
