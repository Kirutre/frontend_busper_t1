const submitButton = document
	.getElementById( 'login-form' )
	.querySelector( 'button' );

submitButton.addEventListener( 'click', handleLogin );

function handleLogin( event ) {
	const email = document.getElementById( 'email' ).value.trim();

	if ( !User.exists( email ) ) {
		if ( shouldDisplayWrongUserAlert() ) {
			displayWrongUserAlert();
		}
	} else {
		const user = User.find( email );
		const password = document.getElementById( 'password' ).value.trim();

		if ( credentialsMatch( user, email, password ) ) {
			setSessionFor( user );
			redirectTo( 'index.html' );
			clearForm();
		} else if ( shouldDisplayWrongUserAlert() ) {
			displayWrongUserAlert();
		}
	}

	event.preventDefault();
}

function displayWrongUserAlert() {
	document.querySelector( 'form' ).insertAdjacentHTML(
		'beforebegin',
		`
		<div class="alert alert-warning alert-dismissible fade show error-wrong-password" role="alert">
			El correo o la contraseña son incorrectos.
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
		`
	);
}

function shouldDisplayWrongUserAlert() {
	return !document.querySelector( '.error-wrong-password' );
}

function credentialsMatch( user, email, password ) {
	return password === user.password;
}

function setSessionFor( user ) {
	const remember = document.getElementById( 'check-me-out' ).checked;

	const session = {
		email: user.email,
		date: new Date(),
		rememberFor30Days: remember
	};

	localStorage.setItem( 'session', JSON.stringify( session ) );
}

function clearForm() {
	const formRegister = document.getElementById("login-form"); 
	formRegister.reset();
}