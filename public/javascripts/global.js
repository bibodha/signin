var signinModel = {
	var userListData : [],
		edit : false;

	var SigninModel: function(){

	}
	var populateTable : function(){
		var tableContent = '';

		$.getJSON('/users/userlist', function(data){
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

	var showUserInfo : function(event){
		event.preventDefault();

		var thisUserName = $(this).attr('rel');

		var arrayPosition = userListData.map(function(arrayItem) {
			return arrayItem.username; 
		}).indexOf(thisUserName);

		var thisUserObject = userListData[arrayPosition];

		$('#userInfoName').text(thisUserObject.fullname);
		$('#userInfoAge').text(thisUserObject.age);
		$('#userInfoGender').text(thisUserObject.gender);
		$('#userInfoLocation').text(thisUserObject.location);
	};

	var addUser : function(event){
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
			}

			$.ajax({
				type: 'POST',
				data: newUser,
				url: '/users/adduser',
				dataType: 'JSON'
			}).done(function( response ) {
				if (response.msg === '') {
					$('#addUser fieldset input').val('');
					populateTable();
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

	var deleteUser : function(event){
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
				populateTable();
			});
		}
		else {
			return false;
		}
	};

	var editUser : function(event){
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

	var signin : function(name){
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

$(document).ready(function(){
	var signin = new SigninModel();
	signin.populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	$('#userList table tbody').on('click', 'td a.linkedituser', editUser);
	$('#contentTab').tab();
	$('#contentTab a').click(function(e){
		e.preventDefault();
		$('#contentTab li').removeClass('active');
		$('.tab-content div.tab-pane').removeClass('active');
		$(this).addClass('active');
	});

	$('#signinTextBox').autocomplete({
		source: function(request, response){
		}
	});
	$('#signinBtn').click(function(){
		signin($('#signinTextBox').val());
	});
};