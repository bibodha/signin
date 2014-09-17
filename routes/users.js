var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

router.get('/userlist', isLoggedIn, function(req, res){
    var db = req.db;
    db.query('SELECT * FROM signin.kids', function(err, result){
        res.json(result.rows);
    });
});

router.post('/adduser', isLoggedIn, function(req, res){
    var db = req.db;

    var newUser = req.body;
    newUser.username = (newUser.firstname + ' ' + newUser.lastname).toLowerCase();
    db.query('SELECT * FROM signin.kids WHERE firstName = $1 AND lastName = $2', [newUser.firstname, newUser.lastname], function(err, result){
        var length = items.length;
        if(length > 0){
            var lastUsername = items[length - 1].username;
            var num = parseInt(lastUsername.split(' ')[2]);
            if(num.toString() === "NaN"){
                num = 1;
            }
            else{
                num++;
            }
            newUser.username += ' ' + num;
        }
        db.query('INSERT INTO signin.kids (firstName, lastName, userName, street, city, state, zip, dateOfBirth, gender, school) VALUES ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9)',
                  [newUser.firstname, newUser.lastname, newUser.street, newUser.city, newUser.state, newUser.zip,
                   newUser.dateOfBirth, newUser.gender, newUser.school], function(err, result){
                     if(err){
                       res.send(err);
                     }
                     else {
                       res.send(200, result);
                     }
                   });
    });
});

router.delete('/deleteuser/:id', isLoggedIn, function(req, res){
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result){
        if(err === null){
            res.send(200, result);
        }
        else{
            res.send(err);
        }
    });
});

router.post('/edituser', isLoggedIn, function(req, res){
    var db = req.db,
        user = req.body,
        id = new ObjectId(user._id);
        //deleting id because mongo will also attempt to update it causing problems.
        delete(user._id);
    db.collection('userlist').update({_id: id}, {$set: user}, function(err, result){
        if(err === null){
            res.send(200, result);
        }
        else{
            res.send({msg: err});
        }
    });
});

router.post('/getuser/:id', isLoggedIn, function(req, res){
    var db = req.db,
        userToFetch = req.params.id,
        user = '';

    db.collection('userlist').findById(userToFetch, function(err, result){
        if(err === null){
            res.send(200, result);
        }
        else{
            res.send(err);
        }
    });
});

router.post('/signin/:name', isLoggedIn, function(req, res){
    var db = req.db,
    date = new Date,
    name = req.params.name.toLowerCase(),
    user;

    db.collection('userlist').findOne({username: name}, function(err, result){
        user = result;
        if(err){
            res.send(404, 'User not found');
        }
        if(user){
            db.collection('signin').insert({userId: user._id, signinTime: date.toLocaleString()}, function(err, result){
                if(err === null){
                    res.send(200, result);
                }
                else{
                    res.send('There was an error: ' + err);
                }
            });
        } else {
            res.send(404, 'User not found');
        }
    });
});

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
  if (req.isAuthenticated()){
    return next();
  } else {
  // if they aren't redirect them to the home page
    res.redirect('/login');
  }
};

module.exports = router;
