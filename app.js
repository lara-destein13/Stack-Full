const autoBind = require('auto-bind');
const bodyParser = require('body-parser');
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const util = require('util');

class WebServer {
  //------------------------------------------------------------------------------------------------
  // constructor
  //------------------------------------------------------------------------------------------------
  constructor() {
    autoBind(this);
    
    // Some constants
    this.port = 3000;

    // The context
    this.clients = [
      {
        firstName: 'Lara',
        lastName: 'DeStein',
        postalCode: '37774',
      },
      {
        firstName: 'Luna',
        lastName: 'DeStein',
        postalCode: '37774',
      },
    ];

    // Create our Express app
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());

    // Create our handlebars instance
    this.handlebars = handlebars.create({});

    // Configure our Express app to use handlebars
    this.app.engine("handlebars", this.handlebars.engine);
    this.app.set("view engine", "handlebars");
    this.app.set('views', './views');

    // Tell express where to find our static css and js files
    this.app.use(express.static(path.join(__dirname, 'public')));

    // Register our HTML endpoints
    this.app.get('/', this.loginPage);
    this.app.get('/client-list-page', this.clientListPage);
    this.app.get('/client-add-page', this.clientAddPage);
    this.app.get('/client-edit-page', this.clientEditPage);

    // Register our API endpoints
    this.app.post('/client-save', this.clientSave);
    this.app.post('/client-remove', this.clientRemove);
    
    // Start our Express server
    this.app.listen(this.port, () => {
      console.log(`WebServer listening at http://localhost:${this.port}`)
    })
  }

  //------------------------------------------------------------------------------------------------
  // clientAddPage
  //------------------------------------------------------------------------------------------------
  clientAddPage(req, res) {
    const context = {};
    res.render('client-add-page', context);
  }

  //------------------------------------------------------------------------------------------------
  // clientEditPage
  //------------------------------------------------------------------------------------------------
  clientEditPage(req, res) {
    const index = req.query.index;
    const context = {
      client: this.clients[index],
    }
    res.render('client-edit-page', context);
  }

  //------------------------------------------------------------------------------------------------
  // clientListPage
  //------------------------------------------------------------------------------------------------
  clientListPage(req, res) {
    const context = {
      clients: this.clients,
    }
    res.render('client-list-page', context);
  }

  //------------------------------------------------------------------------------------------------
  // clientRemove
  //------------------------------------------------------------------------------------------------
  clientRemove(req, res) {
    console.log(JSON.stringify(req.body, null, 4));
  }

  //------------------------------------------------------------------------------------------------
  // clientSave
  //------------------------------------------------------------------------------------------------
  clientSave(req, res) {
    this.clients.push(req.body);
    // res.redirect('client-list-page');
    // res.sendStatus(200);
    res.json({ foo: 'bar' });
  }

  //------------------------------------------------------------------------------------------------
  // loginPage
  //------------------------------------------------------------------------------------------------
  loginPage(req, res) {
    const context = {layout:false};
    res.render('login-page', context);
  }
}

const webServer = new WebServer();

