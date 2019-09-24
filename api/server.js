const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const gauth = require('./g-auth');
const fauth = require('./f-auth');
const { google } = require('googleapis')
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const fileUpload = require('express-fileupload')
var jwt = require('jsonwebtoken');

const app = express();

gauth(passport);
fauth(passport);
app.use(passport.initialize());

app.use(cors());
app.options('*', cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
  res.header("Content-Type", "application/json");
  next();
});



app.set('secretKey', 'nodeRestApi'); // jwt secret token

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieSession({
  name: 'session',
  keys: ['123']
}));
app.use(cookieParser());

app.get('/', (req, res) => {
  if (req.session.token) {
      res.cookie('token', req.session.token);
      res.json({
          status: 'session cookie set'
      });
  
  } else {
      res.cookie('token', '')
      res.json({
          status: 'session cookie not set'
      });
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});


app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.get('/auth/google', passport.authenticate('google', {
  scope: [

    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
}));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect:'/'}),
    (req, res) => {
        // var f = JSON.stringify(req.user)
        req.session.token = req.user.token;

        //res.json({status:"success", token:req.user.token, data:req.user.profile});

        var user = {
          id:req.user.profile._json.sub,
          name:req.user.profile._json.name,
          email:req.user.profile._json.email,
          picture:req.user.profile._json.picture
        }

        res.cookie('token',req.session.token);
        res.cookie('user',user);
        //res.json({bla: JSON.stringify(req.user)});
        // console.log(req.user.profile.displayName);
        // console.log(req.user.profile.emails[0].value);
        // console.log(req.user.profile.photos[0].value);
        res.redirect('http://localhost:8080/');
    }
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect:'/'}),
    (req, res) => {
        // var f = JSON.stringify(req.user)
        req.session.token = req.user.token;

        //res.json({status:"success", token:req.user.token, data:req.user.profile});

        console.log(req.user)

        var user = {
          id:req.user.profile._json.id,
          name:req.user.profile._json.name,
          // email:req.user.profile._json.email,
          // picture:req.user.profile._json.picture
        }

        res.cookie('token',req.session.token);
        res.cookie('user',user);
        //res.json({bla: JSON.stringify(req.user)});
        // console.log(req.user.profile.displayName);
        // console.log(req.user.profile.emails[0].value);
        // console.log(req.user.profile.photos[0].value);
        res.redirect('http://localhost:8080/');
    }
);

function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }else{
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });

}

// file upload
app.use(fileUpload());


app.post('/upload', function (req, res) {
  try {
      // config google drive with client token
      const oauth2Client = new google.auth.OAuth2()
      oauth2Client.setCredentials({
          'access_token': req.body.token
      });

      const drive = google.drive({
          version: 'v3',
          auth: oauth2Client
      });

      //move file to google drive

      let { name: filename, mimetype, data } = req.files.input_file

      const driveResponse = drive.files.create({
          requestBody: {
              name: filename,
              mimeType: mimetype
          },
          media: {
              mimeType: mimetype,
              body: Buffer.from(data).toString()
          }
      });

      driveResponse.then(data => {

        if (data.status == 200) res.redirect('http://localhost:8080/uploader?file=uploaded') // success
        else res.redirect('http://localhost:8080/uploader?file=notuploaded') // unsuccess
           // unsuccess

      }).catch(err => { throw new Error(err) })
  } catch (error) {
    console.log(error);
    
  }

  
  
})

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
 let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// handle errors
app.use(function(err, req, res, next) {
 console.log(err);

  if(err.status === 404)
   res.status(404).json({message: "Not found"});
  else
    res.status(500).json({message: "Something looks wrong :( !!!"});
});
app.listen(3000, function(){
 console.log('Node server listening on port 3000');
});
