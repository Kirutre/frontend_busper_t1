function PasswordPolicy() {}

PasswordPolicy.MINIMUM_LENGTH = 8;
PasswordPolicy.MAXIMUM_LENGTH = 256;

PasswordPolicy.LETTERS_REGEX = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
PasswordPolicy.NUMBERS_REGEX = /\d/;
PasswordPolicy.SPECIAL_CHARACTERS_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

PasswordPolicy.validate = function ( password, email ) {
	if ( PasswordPolicy.hasViolations( password, email ) ) {
		throw new Error( 'Invalid password' );
	}
}

PasswordPolicy.hasViolations = function ( password, email ) {
	return (
		!PasswordPolicy.isValidLength( password ) ||
		!PasswordPolicy.hasLetters( password ) ||
		!PasswordPolicy.hasNumbers( password ) ||
		!PasswordPolicy.hasSpecialCharacters( password ) ||
		PasswordPolicy.passwordIncludesEmail( password, email )
	);
}

PasswordPolicy.isValidLength = function ( password ) {
	const sanitizedPassword = PasswordPolicy.removeWhitespace( password );

	return (
		sanitizedPassword.length >= PasswordPolicy.MINIMUM_LENGTH &&
		sanitizedPassword.length <= PasswordPolicy.MAXIMUM_LENGTH
	);
}

PasswordPolicy.removeWhitespace = function ( text ) {
	return text.replace( /\s/g, '' );
}

PasswordPolicy.passwordIncludesEmail = function ( password, email ) {
	return password.toLowerCase().includes( email.toLowerCase() );
}

PasswordPolicy.hasLetters = function ( password ) {
	return PasswordPolicy.LETTERS_REGEX.test( password );
}

PasswordPolicy.hasNumbers = function ( password ) {
	return PasswordPolicy.NUMBERS_REGEX.test( password );
}

PasswordPolicy.hasSpecialCharacters = function ( password ) {
	return PasswordPolicy.SPECIAL_CHARACTERS_REGEX.test( password );
}

PasswordPolicy.getViolations = function ( password, email ) {
	const violations = [];

	if ( !PasswordPolicy.isValidLength( password ) ) {
		violations.push( `debe tener entre ${PasswordPolicy.MINIMUM_LENGTH} y ${PasswordPolicy.MAXIMUM_LENGTH} caracteres que no sean espacios en blanco` );
	}

	if ( !PasswordPolicy.hasLetters( password ) ) {
		violations.push( 'debe tener al menos una letra' );
	}

	if ( !PasswordPolicy.hasNumbers( password ) ) {
		violations.push( 'debe tener al menos un número' );
	}

	if ( !PasswordPolicy.hasSpecialCharacters( password ) ) {
		violations.push( 'debe tener al menos un carácter especial' );
	}

	if ( PasswordPolicy.passwordIncludesEmail( password, email ) ) {
		violations.push( 'no puede contener tu correo' );
	}

	return violations;
}
