const autoBind = require('auto-bind');
const bodyParser = require('body-parser');
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const util = require('util');

const PORT = process.env.PORT || 3001;
const app = express();

class WebServer {
  //------------------------------------------------------------------------------------------------
  // constructor
  //------------------------------------------------------------------------------------------------
  constructor() {
    autoBind(this);
    
    // Some constants
    /* this.port = 3000; */

    // Each client is assigned a unique id
    this.nextid = 0;

    // Create a couple clients so we have something to look at in the clients page
    this.clients = []; 
    this.newClient('Lara', 'DeStein', '37774', 'laraemail@email.com', '(787) 656-7878'); 
    this.newClient('Luna', 'DeStein', '37774', 'lunaemail@email.com', '(787) 656-7879'); 
    
    // Create our Express app
    /* this.app = express(); */
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());

    // Create our handlebars instance
    this.handlebars = handlebars.create({});

    // Configure our Express app to use handlebars
    app.engine("handlebars", this.handlebars.engine);
    app.set("view engine", "handlebars");
    app.set('views', './views');

    // Tell express where to find our static css and js files
    app.use(express.static(path.join(__dirname, 'public')));

    // Register our HTML endpoints
    app.get('/', this.loginPage);
    app.get('/api/client-list-page', this.clientListPage);
    app.get('/api/client-add-page', this.clientAddPage);
    app.get('/api/client-edit-page', this.clientEditPage);

    // Register our API endpoints
    app.post('/client-save', this.clientSave);
    app.post('/client-update', this.clientUpdate);
    app.post('/client-remove', this.clientRemove);
    
    // Start our Express server
    app.listen(PORT, () => {
      console.log(`API server now on port ${PORT}!`);
    });
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


