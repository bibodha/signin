Signin
======

Signin system using Nodejs, Express, Jade, and MongoDB

How to install
==============
* Download the entire project
* Download and Install Nodejs from http://www.nodejs.org
* Download and Install MongoDB from http://www.mongodb.org
* Create a directory called 'data/db' in the project root. (This is where mongodb will store the data)
* (Optional) Add `<*mongo-install-dir*>/bin` to PATH

How to run
==========
* Navigate to project root
* Run mongodb by typing `mongod --dbpath data/db` (You may have to navigate to where you installed mongo if you didn't add it to your PATH)
* Run the app by typing `npm start`
* Open your web browser and navigate to [localhost:3000](http://localhost:3000)
* Additionally, you can install [nodemon](http://nodemon.io/) to make developing easier
* To debug 
  * install [node-inspector](https://github.com/node-inspector/node-inspector) 
  * run `node-inspector`
  * Navigate to localhost:8080/debug?port=5858
