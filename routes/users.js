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
    db.query('SELECT * FROM "signin"."kids" WHERE firstName like $1 AND lastName like $2',
            ['%' + newUser.firstname + '%', '%' + newUser.lastname+ '%'], function(err, result){
        var length = result.rows.length;
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
        newUser.gender === 'Male' ? newUser.gender = 1 : newUser.gender = 0;
        var query ="INSERT INTO signin.kids(firstname, lastname, username, street, city, state, zip, \"dateOfBirth\", gender, school) VALUES ('" +
                    newUser.firstname + "' , '" +
                    newUser.lastname + "', '" +
                    newUser.username + "', '" +
                    newUser.street + "', '" +
                    newUser.city + "', '" +
                    newUser.state + "', '" +
                    newUser.zip + "', '" +
                    newUser.dateOfBirth + "', '" +
                    newUser.gender + "', '" +
                    newUser.school +"')";

        db.query(query, function(err, result){
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
    db.query('DELETE FROM "signin"."kids" WHERE "kidsId" = $1', [userToDelete], function(err, result){
        if(err === null){
            res.send(200, "success");
        }
        else{
            res.send({err: err.message});
        }
    });
});

router.post('/edituser', isLoggedIn, function(req, res){
    var db = req.db,
        user = req.body;
    user.gender === 'Male' ? user.gender = 1 : user.gender = 0;
    var queryStr = "UPDATE signin.kids SET firstname='" + user.firstname + "', lastName='" + user.lastname +
               "', street='" + user.street + "', city='" + user.city + "', state='" + user.state + "', zip='" + user.zip +
               "', \"dateOfBirth\"='" + user.dateOfBirth + "', gender='" + user.gender + "', school ='" + user.school + "' WHERE \"kidsId\" = " + user.kidsId;
    db.query(queryStr, function(err, result){
        if(err === null){
            res.send(200, "success");
        }
        else{
            res.send({err: err.message});
        }
    });
});

router.post('/signin/:name', isLoggedIn, function(req, res){
    var db = req.db,
    username = req.params.name.toLowerCase(),
    user;

    db.query('SELECT * FROM "signin"."kids" where "kids"."username" like $1', ['%' + username + '%'], function(err, result){
        user = result.rows[0];
        if(err){
            res.send(404, 'User not found');
        }
        if(user){
            query = 'INSERT INTO signin."kidsSignin" ("kidsId") VALUES('+ user.kidsId+')';
            db.query(query, function(err, result){
                if(err === null){
                    res.send(200, result.rows[0]);
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
