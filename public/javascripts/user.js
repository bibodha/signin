var bcrypt = require('bcrypt-nodejs');
var mongo = require('mongoskin');

var generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

var validPassword = function(username, password){
    return bcrypt.compareSync(password, getPassword(password));
};

var getPassword = function(username){
  return generateHash(username);
}
