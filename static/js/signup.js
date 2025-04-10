const submitButton = document.querySelector( 'button[type=submit]' );

submitButton.addEventListener( 'click', handleSignup );

function handleSignup( event ) {
	const email = document.getElementById( 'email' ).value;

	if ( User.exists( email ) ) {
		if ( shouldUserAlreadyExistsAlert() ) {
			displayUserAlreadyExistsAlert();
		}
	} else {
		const passwordInput = document.getElementById( 'password' );
		const passwordConfirmInput = document.getElementById( 'password-confirm' );

		if ( passwordInput.value === passwordConfirmInput.value ) {
			passwordConfirmInput.setCustomValidity( '' );

			const password = passwordConfirmInput.value;

			if ( PasswordPolicy.hasViolations( password, email ) ) {
				const violations = PasswordPolicy.getViolations( password, email );

				if ( shouldDisplayPasswordViolationsAlert() ) {
					displayPasswordViolationsAlert( violations );
				} else {
					const violationsMessage = document.querySelector( '.error-bad-password' );

					violationsMessage.replaceWith(
						parseDomFromString(
							createPasswordViolationsAlert( violations )
						)
					);
				}
			} else {
				const user= User.create(email, password);
				User.save(user);
				setSessionFor(user);
				redirectTo('index.html');
				clearForm();
			}
		} else {
			passwordConfirmInput.setCustomValidity( 'Las contraseñas no coinciden' );
			passwordConfirmInput.reportValidity();
		}
	}

	event.preventDefault();
}

function shouldUserAlreadyExistsAlert() {
	return !document.querySelector( '.error-user-already-exists' );
}

function displayUserAlreadyExistsAlert() {
	document.querySelector( 'form' ).insertAdjacentHTML(
		'beforebegin',
		`
		<div class="alert alert-warning alert-dismissible fade show error-user-already-exists" role="alert">
			Un usuario con este correo ya existe
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>`
	);
}

function displayPasswordViolationsAlert( violations ) {
	const message = createPasswordViolationsAlert( violations );

	document.querySelector( 'form' ).insertAdjacentHTML(
		'beforebegin', message
	);
}

function createPasswordViolationsAlert( violations ) {
	let violationsMessage = '';

	for ( const violation of violations ) {
		violationsMessage += `<li>${violation}</li>`;
	}

	return (
		`
		<div class="alert alert-warning alert-dismissible fade show error-bad-password" role="alert">
			La contraseña que ingresaste no es válida:
			<ul>
				${violationsMessage}
			</ul>
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
		`
	);
}

function shouldDisplayPasswordViolationsAlert() {
	return !document.querySelector( '.error-bad-password' );
}

function clearForm() {
	const formRegister = document.getElementById("signup-form"); 
	  formRegister.reset();
  }

  function setSessionFor(user) {
		const session = {
		email: user.email,
		date: new Date(),
		rememberFor30Days: false,
	}
	localStorage.setItem(`session`, JSON.stringify(session));
	
}