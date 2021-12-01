const autoBind = require('auto-bind');
const bodyParser = require('body-parser');
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const util = require('util');

const PORT = process.env.PORT || 3000;

class WebServer {
  //------------------------------------------------------------------------------------------------
  // constructor
  //------------------------------------------------------------------------------------------------
  constructor() {
    autoBind(this);
    
    // Some constants
    /* this.PORT = 3000; */

    // Each client is assigned a unique id
    this.nextid = 0;

    // Create a couple clients so we have something to look at in the clients page
    this.clients = []; 
    this.newClient('Lara', 'DeStein', '37774', 'laraemail@email.com', '(787) 656-7878'); 
    this.newClient('Luna', 'DeStein', '37774', 'lunaemail@email.com', '(787) 656-7879'); 
    
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
    this.app.post('/client-update', this.clientUpdate);
    this.app.post('/client-remove', this.clientRemove);
    
    // Start our Express server
    this.app.listen(this.PORT, () => {
      console.log(`WebServer listening at http://localhost:${PORT}`)
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
  // newClient
  //------------------------------------------------------------------------------------------------
  newClient(firstName, lastName, postalCode, email, phone) {
    var newClient = {
      firstName,
      lastName,
      postalCode,
      email,
      phone,
      id: this.nextid,
    };
    
    this.nextid += 1;
    this.clients.push(newClient);
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
    var newClient = req.body;
    newClient.id = this.nextid;
    this.nextid += 1;
    this.clients.push(newClient);
    res.json({ });
  }

 //------------------------------------------------------------------------------------------------
  // clientUpdate
  //------------------------------------------------------------------------------------------------
  clientUpdate(req, res) {
    const edits = req.body;
    for (let i = 0; i < this.clients.length; i += 1) {
      const client = this.clients[i];
      if (client.id === parseInt(edits.id)) {
        client.firstName = edits.firstName;
        client.lastName = edits.lastName;
        client.postalCode = edits.postalCode;
        client.email = edits.email;
        client.phone = edits.phone;
      }
    }
    res.json({ });
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

