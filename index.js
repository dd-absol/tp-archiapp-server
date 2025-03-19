var express = require('express'); //import de la bibliothèque Express
var bodyParser = require('body-parser');
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

app.get("/", (req, res) => {
  res.send("Hello");
})

app.get('/test/*', (req, res) => {
  const msg = req.url.substring("/test/".length);
  res.json({ "msg": msg });
});

const isNumeric = (msg) => {
  return msg.match(/^[0-9]+$/);
}

// cpt section of the api
let cpt = 0;
app.get('/cpt/query', (req, res) => {
  res.json({ "cpt": cpt });
})

app.get('/cpt/inc', (req, res) => {
  if (req.query.v == undefined) {
    cpt++;
    res.json({ "code": 0 });
  } else if (isNumeric(req.query.v)) {
    cpt += parseInt(req.query.v);
    res.json({ "code": 0 });
  } else {
    res.json({ "code": -1 });
  }
})

// msg section of the api
let allMsgs = [
  {"author": "server", "msg": "Hello World"},
  {"author": "server", "msg": "foobar"},
  {"author": "server", "msg": "CentraleSupelec forever"},
];

app.get('/msg/get/*', (req, res) => {
  const msg_index = req.url.substring("/msg/get/".length);
  if (isNumeric(msg_index)) {
    const index = parseInt(msg_index);
    if (index < allMsgs.length) {
      res.json({ "code": 1, "msg": allMsgs[index] });
      return;
    }
  }

  res.json({ "code": 0 });
});

app.get('/msg/nbr', (req, res) => {
  res.json({"nbr": allMsgs.length});
})

app.get('/msg/getAll', (req, res) => {
  res.json(allMsgs);
});

app.post('/msg/post', bodyParser.json(), (req, res) => {
  console.log(req.body);

  let author = "anonymous";
  if (req.body.author != undefined && req.body.author != "") {
    author = req.body.author;
  }

  const msg = {
    "author": author,
    "msg": req.body.msg
  }

  console.log(msg);

  allMsgs.push(msg);
  res.json({"index": allMsgs.length - 1});
})

app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

