var SigninModel = function () {
	var self = this,
	userListData = [];


	self.populateTable = function () {

		var tableContent = '';
		$.getJSON( '/users/userlist', function( data ) {
			userListData = data;

			$.each(data, function(){
				tableContent += '<tr>';
				tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
				tableContent += '<td>' + this.email + '</td>';
				tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
				tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
				tableContent += '</tr>';
			});

			$('#userList table tbody').html(tableContent);
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

	self.addUser = function (event) {
		event.preventDefault();

		var errorCount = 0;
		$('#addUser input').each(function(index, val) {
			if($(this).val() === '') { errorCount++; }
		});

		if(errorCount === 0) {

			var newUser = {
				'username': $('#inputUserName').val(),
				'email': $('#inputUserEmail').val(),
				'fullname': $('#inputUserFullname').val(),
				'age': $('#inputUserAge').val(),
				'location': $('#inputUserLocation').val(),
				'gender': $('#inputUserGender').val()
			};

			console.log('New User:', newUser);

			$.ajax({
				type: 'POST',
				data: newUser,
				url: '/users/adduser',
				dataType: 'JSON'
			}).done(function( response ) {
				if (response.msg === '') {
					$('').val('');
					self.populateTable();
				}
				else {
					alert('Error: ' + response.msg);
				}
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
				$('#inputUserName').val(user.username);
				$('#inputUserEmail').val(user.email);
				$('#inputUserFullname').val(user.fullname);
				$('#inputUserAge').val(user.age);
				$('#inputUserLocation').val(user.location);
				$('#inputUserGender').val(user.gender);
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
$body.on('click', '#signinBtn', function(){
	mySignin.signin($('#signinTextBox').val());
});
$body.on('click', '#btnAddUser', mySignin.addUser);
$body.on('click', 'td a.linkedituser', mySignin.editUser);
$body.on('click', 'td a.linkshowuser', mySignin.showUserInfo);
$body.on('click', 'td a.linkdeleteuser', mySignin.deleteUser);
$('#contentTab').tab();
$body.on('click', '#contentTab a', function(e){
	e.preventDefault();
	$('#contentTab li').removeClass('active');
	$('.tab-content div.tab-pane').removeClass('active');
	$(this).addClass('active');
});

$('#signinTextBox').autocomplete({
	source: function(request, response){
	}
});
