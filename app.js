var express = require('express'); // Express web server framework
var restler = require('restler'); // REST client library
var config = require('./config/shared');

var app = express();

app.get('/login', function(req, res) {
  var scopes = 'user-self-provisioning';
  res.redirect(config.accounts_host + '/authorize?response_type=code&client_id=' + config.clientId +
    '&redirect_uri=' + encodeURIComponent(config.redirect_uri));
});

app.get('/callback', function(req, res) {
  var code = req.query.code;
  var url = config.accounts_host + '/api/token';
  var data = {
    code: code,
    redirect_uri: config.redirect_uri,
    grant_type: 'authorization_code'
  };

  var headers = {
    'Authorization': 'Basic ' + (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'))
  };

  restler.post(url, {
    data: data,
    headers: headers,
    rejectUnauthorized: false
  }).on('complete', function(tokenresponse, response) {

    console.log('Got token ' + JSON.stringify(tokenresponse));
    var response = '<script>';
    response += 'var target = window.self === window.top ? window.opener : window.parent;';
    response += 'target.postMessage(\'{"type": "token", "success": true, "accessToken":"' + tokenresponse.access_token + '", "refreshToken":"' + tokenresponse.refresh_token + '", "expiresIn":"' + tokenresponse.expires_in + '"}\', "' + config.client_host + '");'
    response += '</script>';

    // todo: deal with error cases
    res.send(response);
  });
});

app.post('/refresh_token', function(req, res) {
  console.log('Refreshed token... ');
  res.header("Access-Control-Allow-Origin", "*");
  var refresh_token = req.query.refresh_token;
  var url = config.accounts_host + '/api/token';
  var data = {
    refresh_token: refresh_token,
    grant_type: 'refresh_token'
  };

  var headers = {
    'Authorization': 'Basic ' + (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'))
  };

  restler.post(url, {
    data: data,
    headers: headers,
    rejectUnauthorized: false
  }).on('success', function(tokenresponse, response) {
    var resp = {
      accessToken: tokenresponse.access_token,
      expiresIn: tokenresponse.expires_in
    };
    console.log('Refreshed token ' + JSON.stringify(resp));
    res.send(JSON.stringify(resp));
  }).on('fail', function(tokenresponse, response) {
    var resp = {
      error: tokenresponse.error,
      error_description: tokenresponse.error_description,
    };
    res.send(JSON.stringify(resp));
  }).on('error', function(tokenresponse, response) {
    var resp = {
        error: tokenresponse.error,
        error_description: tokenresponse.error_description,
      };
    res.send(JSON.stringify(resp));
  });
});

app.all('/*', function(req, res, next) {
  console.log('test');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.use(express.bodyParser());

app.listen(8888);
