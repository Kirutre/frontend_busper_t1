function User( { email, password } ) {
	this.email = email;
	this.password = password;
	this.role=`regular`;
}

User.create = function ( email, password ) {
	if ( !User.shouldCreate( email, password ) ) {
		return;
	}

	return new User( {
		email,
		password,
	} );
}

User.shouldCreate = function ( email, password ) {
	if ( User.exists( email ) ) {
		console.debug( 'User already exists' );

		return false;
	}

	try {
		PasswordPolicy.validate( password, email );
	} catch {
		console.log( `Invalid password, not creating an account for ${email}` );

		return false;
	}

	return true;
}

User.exists = function ( email ) {
	const users = User.getAll();

	if ( !isLocalStorageItemSet( 'users' ) ) {
		return false;
	}

	return users.some( user => user.email === email );
}

User.find = function ( email ) {
	return User.getAll().find( user => user.email === email );
}

User.save = function ( user ) {
	if ( !user ) {
		return;
	}

	const users = User.getAll();

	users.push( user );
	localStorage.setItem( 'users', JSON.stringify( users ) );
}

User.setRole = function ( email, role ) {
	const users = User.getAll();

	const userIndex = users.findIndex( user => {
		return user.email === email;
	} );

	users[ userIndex ].role = role;
	localStorage.setItem( 'users', JSON.stringify( users ) );
}

User.getAll = function () {
	return JSON.parse( localStorage.getItem( 'users' ) );
}