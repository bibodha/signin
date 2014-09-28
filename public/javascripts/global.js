var SigninModel = function () {
    var self = this,
        user = {},
        dataView = new Slick.Data.DataView(),
        userPropertyList = [
            'kidsId',
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
            {id: "edit", name: "Action", field: "edit", minWidth:100,
                formatter: function(row, cell, value, columnDef, dataContext){
                               return '<a href="#" id="edit-user" data-id="' + dataContext['kidsId'] + '">Edit</a>/'+
                                      '<a href="#" id="delete-user" data-id="' + dataContext['kidsId'] + '">Delete</a>';
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

    self.getUserObjectFromForm = function(type){
        var output = {};
        userPropertyList.forEach(function(fieldName){
            output[fieldName] = $('#' + type + '-input-' + fieldName).val();
        });
        return output;
    };
    self.setUserObjectToForm = function(type, user){
        userPropertyList.forEach(function(fieldName){
            $('#' + type + '-input-' + fieldName).val(user[fieldName]);
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
        return '<a href="#' + dataContext['kidsId'] + '">' + value + '</a>';
    };

    self.populateTable = function () {
        var tableContent = '';
        $.getJSON( '/users/userlist', function( data ) {
            _.forEach(data, function(item){
                item.dateOfBirth = new Date(item.dateOfBirth).toLocaleDateString();
                item.gender === '1' ? item.gender = 'Male' : item.gender = 'Female';
            });
            dataView.setItems(data, 'kidsId');
        });
    };

    self.addUser = function (event, callback) {
        event.preventDefault();

        var errorCount = 0;
        $('#addUser input').each(function(index) {
            if($(this).val() === '') { errorCount++; }
        });

        if(errorCount === 0) {

            var newUser = self.getUserObjectFromForm('add');
            $.ajax({
                type: 'POST',
                data: newUser,
                url: '/users/adduser'
            }).done(function(response) {
                callback();
                toastr.success('User added successfully');
            });
        }
        else {
            toast.error('Please fill in all fields');
            return false;
        }
    };

    self.deleteUser = function (id) {
        var confirmation = confirm('Are you sure you want to delete this user?');

        if (confirmation === true) {
            $.ajax({
                type: 'DELETE',
                url: '/users/deleteuser/' + id
            }).done(function(res) {
                if (res === 'success') {
                }
                else {
                    toastr.error(res.err);
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
        self.setUserObjectToForm('edit', user);
        $('#edit-input-kidsId').val(user.kidsId);
        $('#editUserModal').modal('show');
    };

    self.editUser = function(callback){
        var edit = true,
            user = self.getUserObjectFromForm('edit');


        $.ajax({
            type: 'POST',
            url: '/users/edituser/',
            data: user
        }).done(function(res){
            if(res === "success"){
                self.populateTable();
                callback();
            }
            else{
                toastr.error('Error: ' + res.err);
            }
        }).fail(function(stuff, error){
            toastr.error('Edit user failed.');
        });
    };

    self.signin = function(name){
        $.ajax({
            type: 'POST',
            url: '/users/signin/' + name
        }).done(function(res){
            if(res.err){
                toastr.error('Error: ' + res.err);
            }
            else{
                toastr.success('Welcome ' + name);
                $('#signinTextBox').val('');
            }
        }).fail(function(res){
            toastr.error('Error: ' + res.responseText);
        });
    };
};


/*
 * Do all the work here.
 */

var $body = $(document.body),
    mySignin = new SigninModel();

mySignin.populateTable();

toastr.options.positionClass = 'toast-top-full-width';
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

$body.on('click', '#formEditUserBtn', function(e){
    e.preventDefault();
    mySignin.editUser(function(){
        $('#editUserModal').modal('hide');
    });
});

$body.on('click', '#delete-user', function(e){
    e.preventDefault();
    mySignin.deleteUser($(this).data('id'));
});

//beautification
$('#add-input-dateOfBirth').mask('**/**/****');
$('#edit-input-dateOfBirth').mask('**/**/****');
$('#add-input-dateOfBirth').datepicker();
$('#edit-input-dateOfBirth').datepicker();
$('#add-input-zip').numeric();
$('#edit-input-zip').numeric();
