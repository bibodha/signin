var SigninModel = function () {
	var self = this,
		userListData = [],
		userPropertyList = [
			'username',
			'email',
			'fullname',
			'age',
			'location',
			'gender'
		];

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

			$.each(data, function(i){
				tableContent += '<tr id=row' + i + '>';
				tableContent += '<td class="username"><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
				tableContent += '<td class="fullname">' + this.fullname + '</td>';
				tableContent += '<td class="email">' + this.email + '</td>';
				tableContent += '<td class="location">' + this.location + '</td>';
				tableContent += '<td class="age">' + this.age + '</td>';
				tableContent += '<td class="gender">' + this.gender+ '</td>';
				tableContent += '<td class="delete"><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
				tableContent += '<td class="edit"><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
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
		$('#addUser input').each(function(index) {
			if($(this).val() === '') { errorCount++; }
		});

		if(errorCount === 0) {

			var newUser = self.setUserObjectToForm();

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
$body.on('click', '#signinBtn', function(){
	mySignin.signin($('#signinTextBox').val());
});
$body.on('click', '#btnAddUser', mySignin.addUser);
$body.on('click', 'td a.linkshowuser', mySignin.showUserInfo);
$body.on('click', 'td a.linkdeleteuser', mySignin.deleteUser);
$('#contentTab').tab();
$body.on('click', '#contentTab a', function(e){
	e.preventDefault();
	$('#contentTab li').removeClass('active');
	$('.tab-content div.tab-pane').removeClass('active');
	$(this).addClass('active');
});
$body.on('click', '.linkedituser', function(){
	$(this).parent().parent().children('td').each(function(index, value){
		var rowId = $(this.parentElement).attr('id');
		if(value.className === 'gender'){
			var currentSelect = value.innerText;
			this.innerHTML = '<select id="editGenderDropDown"><option value="Male">Male</option><option value="Female">Female</option></select>';
			if(currentSelect === "Male"){
				$('#' + rowId + ' #editGenderDropDown').prop('selectedIndex', 0);
			}
			else{
				$('#' + rowId + ' #editGenderDropDown').prop('selectedIndex', 1);
			}
		}
		else if(value.className === 'delete'){

		}
		else if(value.className === 'edit'){
			this.innerHTML = '<a href="#" id="editUpdate">Update</a>/<a href="#" id="editCancel">Cancel</a>'
		}
		else{
			this.innerHTML = '<input type="text" id="edit' + value.className + '" value="'+this.innerText+'"></input>';
		}
	});
});

$body.on('click', 'editUpdate', function(){
	var updateObj = {};
	updateObj['fullname'] = $(this).parent().attr('#fullname').val();
});

$('#signinTextBox').autocomplete({
});
