var SigninModel = function () {
    var self = this,
        user = {},
        userPropertyList = [
            'firstname',
            'lastname',
            'username',
            'street',
            'city',
            'state',
            'zip',
            'dateOfBirth',
            'gender',
            'school'
        ],
        grid,
        columns = [
            {id: "firstname", name: "First Name", field: "firstname", minWidth: 50},
            {id: "lastname", name: "Last Name", field: "lastname"},
            {id: "username", name: "User Name", field: "username"},
            {id: "street", name: "Street", field: "street"},
            {id: "city", name: "City", field: "city"},
            {id: "state", name: "State", field: "state"},
            {id: "zip", name: "Zip", field: "zip"},
            {id: "dateOfBirth", name: "Date Of Birth", field: "dateOfBirth"},
            {id: "gender", name: "Gender", field: "gender"},
            {id: "school", name: "School", field: "school"}
        ],
        options = {
            enableCellNavigation: true,
            enableColumnReorder: false,
        };

    self.getUserObjectFromForm = function(){
        var output = {};
        userPropertyList.forEach(function(fieldName){
            output[fieldName] = $('#input-' + fieldName).val();
        });
        return output;
    };
    self.setUserObjectToForm = function(user){
        userPropertyList.forEach(function(fieldName){
            $('#input-' + fieldName).val(user[fieldName]);
        });
    };

    self.getUserData = function() {
        var items = '';
        $.getJSON(' /users/userList', function(data){
            items = data;
        }).done(function(data){
            console.log(data);
        });
    };

    self.populateTable = function () {
        var tableContent = '';
        $.getJSON( '/users/userlist', function( data ) {
            userListData = data;

            grid = new Slick.Grid('#myGrid', data, columns, options);
        });
    };

    self.showUserInfo = function (event) {
        event.preventDefault();
        var thisUserName = $(this).attr('rel'),
        arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName),
        thisUserObject = userListData[arrayPosition];

        $('#userInfoName').text(thisUserObject.fullname);
        $('#userInfoAge').text(thisUserObject.age);
        $('#userInfoGender').text(thisUserObject.gender);
        $('#userInfoLocation').text(thisUserObject.location);
    };

    self.addUser = function (event, callback) {
        event.preventDefault();

        var errorCount = 0;
        $('#addUser input').each(function(index) {
            if($(this).val() === '') { errorCount++; }
        });

        if(errorCount === 0) {

            var newUser = self.getUserObjectFromForm();
            $.ajax({
                type: 'POST',
                data: newUser,
                url: '/users/adduser'
            }).done(function(response) {
                callback();
            });
        }
        else {
            alert('Please fill in all fields');
            return false;
        }
    };

    self.deleteUser = function (event) {
        event.preventDefault();
        var confirmation = confirm('Are you sure you want to delete this user?');

        if (confirmation === true) {
            $.ajax({
                type: 'DELETE',
                url: '/users/deleteuser/' + $(this).attr('rel')
            }).done(function( response ) {
                if (response.msg === '') {
                }
                else {
                    alert('Error: ' + response.msg);
                }
                self.populateTable();
            });
        }
        else {
            return false;
        }
    };

    self.editUser = function(event){
        event.preventDefault();
        edit = true;
        $.ajax({
            type: 'POST',
            url: '/users/getuser/' + $(this).attr('rel')
        }).done(function(res){
            if(res.err === null){
                var user = res.msg;
                self.setUserObjectToForm(user);
            }
            else{
                alert('Error: ' + res.msg);
            }
        });
    };

    self.signin = function(name){
        $.ajax({
            type: 'POST',
            url: '/users/signin/' + name
        }).done(function(res){
            if(res.err){
                alert(res.err);
            }
            else{
                $('#signinTextBox').val('');
            }
        });
    };
};

var $body = $(document.body),
    mySignin = new SigninModel();

mySignin.populateTable();

$body.on('submit', '#signinForm', function(event){
    event.preventDefault();
    mySignin.signin($('#signinTextBox').val());
});
$body.on('click', '#formAddUserBtn', function(event){
    mySignin.addUser(event, function(){
        $('#addUserModal').modal('hide');
    });
});
$('#contentTab').tab();
$body.on('click', '#contentTab a', function(e){
    e.preventDefault();
    $('#contentTab li').removeClass('active');
    $('.tab-content div.tab-pane').removeClass('active');
    $(this).addClass('active');
});

$('#input-dateOfBirth').mask('**/**/****');

$('#input-dateOfBirth').datepicker({
    autoclose: true
});

