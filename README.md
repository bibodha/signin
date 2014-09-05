Signin
======

Signin system using Nodejs, Express, Jade, and MongoDB

How to install
==============
* Download the entire project
* Download and Install Nodejs from http://www.nodejs.org
* Download and Install MongoDB from http://www.mongodb.org
* Run `npm install` to pull down all the required dependencies
* Create a directory called 'data/db' in the project root. (This is where mongodb will store the data)
* (Optional but highly recommended) Add `<*mongo-install-dir*>/bin` to PATH

How to run
==========
* Navigate to project root
* Run mongodb by typing `npm run mongo` (This will only work if you added mongo to your path)
  * If mongo is not added to your path, run `<*mongo-install-dir*>/bin/mongod --dbpath data/db` 
* Run the app by typing `npm start`
* Open your web browser and navigate to [localhost:3000](http://localhost:3000)
* Additionally, you can install [nodemon](http://nodemon.io/) to make developing easier
  * If nodemon is installed, you can run it using `npm run nodemon`
* To debug 
  * Install [node-inspector](https://github.com/node-inspector/node-inspector) 
  * Run npm with debug flag on: `npm start --debug`
    * Alternatly, you can run `npm run nodemon`. It will start nodemon with debug flag on.
  * Run `node-inspector` using `npm run debug`
  * Navigate to [http://localhost:8080/debug?port=5858](http://localhost:8080/debug?port=5858)
