var SigninModel = function () {
    var self = this,
        user = {},
        dataView = new Slick.Data.DataView(),
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
            'school',
            'edit'
        ],
        columns = [
            {id: "firstname", name: "First Name", field: "firstname", minWidth: 100},
            {id: "lastname", name: "Last Name", field: "lastname", minWidth: 100},
            {id: "username", name: "User Name", field: "username", minWidth: 100},
            {id: "street", name: "Street", field: "street", minWidth: 150},
            {id: "city", name: "City", field: "city", minWidth: 100},
            {id: "state", name: "State", field: "state", maxWidth: 50},
            {id: "zip", name: "Zip", field: "zip", maxWidth: 50},
            {id: "dateOfBirth", name: "DOB", field: "dateOfBirth", minWidth:87},
            {id: "gender", name: "Gender", field: "gender", maxWidth:62},
            {id: "school", name: "School", field: "school", minWidth: 100},
            {id: "edit", name: "", field: "edit", minWidth:100, 
                formatter: function(row, cell, value, columnDef, dataContext){ 
                               return '<a href="#" id="edit-user" data-id="' + dataContext['_id'] + '">Edit</a>/'+ 
                                      '<a href="#" id="delete-user" data-id="' + dataContext['_id'] + '">Delete</a>';
                }
            }
        ],
        options = {
            enableCellNavigation: true,
            enableColumnReorder: false,
        },
        grid = new Slick.Grid('#myGrid', dataView, columns, options);

        grid.setSelectionModel(new Slick.RowSelectionModel());

        dataView.onRowCountChanged.subscribe(function(e, args){
            grid.updateRowCount();
            grid.render();
        });

        dataView.onRowsChanged.subscribe(function(e, args){
            grid.invalidateRows(args.rows);
            grid.render();
        });

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

    var linkFormatter = function ( row, cell, value, columnDef, dataContext ) {
        return '<a href="#' + dataContext['_id'] + '">' + value + '</a>';
    };

    self.populateTable = function () {
        var tableContent = '';
        $.getJSON( '/users/userlist', function( data ) {
            data.forEach(function(item){
                item.edit='Edit/Delete';
            });
            userListData = data;
            dataView.setItems(data, '_id');
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
                alert(response);
            });
        }
        else {
            alert('Please fill in all fields');
            return false;
        }
    };

    self.deleteUser = function (id) {
        var confirmation = confirm('Are you sure you want to delete this user?');

        if (confirmation === true) {
            $.ajax({
                type: 'DELETE',
                url: '/users/deleteuser/' + id
            }).done(function( response ) {
                if (response.msg === '') {
                }
                else {
                    alert('Error: ' + response.msg);
                }
            });
        }
        else {
            return false;
        }
    };

    self.populateEdit = function(){
        var selectedRow = grid.getSelectedRows(),
            user = grid.getDataItem(selectedRow);
        self.setUserObjectToForm(user);
        $('.modal-title').text('Edit User');
        $('#addUserModal').modal('show');
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
                alert('welcome ' + name);
                $('#signinTextBox').val('');
            }
        }).fail(function(res){
            alert(res.responseText);
        });
    };
};


/*
 * Do all the work here.
 */

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

$body.on('click', '#edit-user', function(e){
    e.preventDefault();
    mySignin.populateEdit();
});

$body.on('click', '#delete-user', function(e){
    e.preventDefault();
    mySignin.deleteUser($(this).data('id'));
});

//beautification
$('#input-dateOfBirth').mask('**/**/****');
$('#input-dateOfBirth').datepicker();
$('#input-zip').numeric();

