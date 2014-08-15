var express = require('express');
var router = express.Router();

router.get('/userlist', function(req, res){
    var db = req.db;
    db.collection('userlist').find().toArray(function(err, items){
        res.json(items);
    });
});

router.post('/adduser', function(req, res){
    var db = req.db;

    var newUser = req.body;
    newUser.username = (newUser.firstname + ' ' + newUser.lastname).toLowerCase();

    db.collection('userlist').find({firstname: newUser.firstname, lastname: newUser.lastname}).toArray(function(err, items){
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
        db.collection('userlist').insert(req.body, function(err, result){
            if(err === null){
                res.send(200, 'User ' + newUser.username + ' added successfully');
            }else{
                res.send({msg: err});
            }
        });
    });
});

router.delete('/deleteuser/:id', function(req, res){
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result){
        res.send((result === 1) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

router.post('/getuser/:id', function(req, res){
    var db = req.db,
        userToFetch = req.params.id,
        user = '';

    db.collection('userlist').findById(userToFetch, function(err, result){
        res.send((err === null) ? {err : null, msg: result} : {err : 1, msg: 'error: ' + err});
    });
});

router.post('/signin/:name', function(req, res){
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
                if(err){
                    res.send('There was an error: ' + err);
                }
                else{
                    res.send({msg: ''});
                }
            });
        } else {
            res.send(404, 'User not found');
        }
    });
});

module.exports = router;
