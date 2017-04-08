const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


app.use((req, res, next) => {
  //with every access, log some info to file
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

//maintenance above the rest so it isn't loaded in
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

//allow access to /public files
app.use(express.static(__dirname + '/public'));

//gives current year to footer
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

//used in home.hbs, brings welcomeMessage to uppercase
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//loads page for root site directory, sends over object with
//applicable data
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to Tony\'s Website!'
  });
});

//loads about page, sends obj with applicable properties
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

//send obj that is displayed at /bad
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

//logs to console when server is up
app.listen(port, console.log(`Server is up on port ${port}.`));
