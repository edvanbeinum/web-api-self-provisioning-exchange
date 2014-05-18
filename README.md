# Basic example for authenticate against the Spotify Web API

Authorization Code Flow

This is a small node.js script that authenticates a user using the authorization code flow and fetches data from the Spotify Web API.

## Prerequisites
* Node.js - Download and Install [Node.js](http://www.nodejs.org/download/). You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm

### Tools Prerequisites
* NPM - Node.js package manager, should be installed when you install node.js.

## Quick Install
  The quickest way to get started is to clone the project and utilize it like this:

  Install dependencies:

    $ npm install

  Add your client key and secret to `config/shared.js`

  Run the server

    $ node app.js

  Browse http://localhost:8888/login

    $ open http://localhost:8888/login
  
  Once you have done the oAuth dance, check the console for the access token
