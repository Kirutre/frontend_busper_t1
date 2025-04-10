const DEBUG = false;

function main() {
	setupLocalStorage();
	setupMockUsers();

	if ( DEBUG ) {
		if ( shouldRedirect() ) {
			redirectTo( 'signup.html' );
		}
	}

	setupInterface();

	removeSessionAfter();
}

function setupLocalStorage() {
	if ( !isLocalStorageItemSet( 'users' ) ) {
		localStorage.setItem( 'users', JSON.stringify( [] ) );
	}

	if ( !isLocalStorageItemSet( 'services-table-prices' ) ) {
		localStorage.setItem( 'services-table-prices', JSON.stringify( {} ) );
	}

	if ( !isLocalStorageItemSet( 'services-table-marks' ) ) {
		localStorage.setItem( 'services-table-marks', JSON.stringify( {} ) );
	}

	if ( !isLocalStorageItemSet( 'sales-tracker-requests' ) ) {
		localStorage.setItem( 'sales-tracker-requests', JSON.stringify( [] ) );
	}

	if ( !isLocalStorageItemSet( `card-container-state` ) ) {
		localStorage.setItem( `card-container-state`, JSON.stringify( [
			{	image: `static/images/tienda1.jpg`,
				title: `MEMORIA RAM ADATA DDR4 8GB 3200MHZ`,
				price: 25,
				stock: 4 },

			{	image: `static/images/tienda2.jpg`,
				title: `Memoria RAM Kingston DDR4 8GB 2400MHZ`,
				price: 12,
				stock: 7 },

			{	image: `static/images/tienda3.jpg`,
				title: `Memoria RAM Samsung DDR5 8GB 4800MHZ`,
				price: 30,
				stock: 2 },

			{	image: `static/images/tienda4.jpg`,
				title: `Procesador Intel Core I5-10400 hasta 4.3GHZ 6 núcleos / 12 hilos`,
				price: 190,
				stock: 1 },

			{	image: `static/images/tienda5.jpg`,
				title: `Procesador AMD Ryzen 9 7950X hasta 5.7GHZ 16 núcleos / 32 hilos`,
				price: 805,
				stock: 3 },

			{	image: `static/images/tienda6.jpg`,
				title: `Procesador Intel Celeron G5905 hasta 3.5GHZ 2 núcleos`,
				price: 49,
				stock: 10 }
		] ) );
	}

	if (!isLocalStorageItemSet( `cart-container-state` )) {
		localStorage.setItem( `cart-container-state`, JSON.stringify( {} ) );
	}

	if (!isLocalStorageItemSet( `product-requests` )) {
		localStorage.setItem( `product-requests`, JSON.stringify( [] ) );
	}
}

function setupMockUsers() {
	const genericAdmin = User.create( 'staff@busper.org', 'password-123' );

	User.save( genericAdmin );

	User.setRole( 'staff@busper.org', `admin` );
}

function setupInterface() {
	if ( titleContains( 'Registrarse' ) || titleContains( 'Acceder' ) ) {
		return;
	}

	setupLogoutButton();

	hideUserAccessNavItemsIfLoggedIn();
	showUserAccessNavItemsIfLoggedOut();
	setupUserText();
}

function shouldRedirect() {
	return !( isSessionActive() || titleContains( 'Registrarse') || titleContains( 'Acceder' ) );
}

function hideNavItem( itemId ) {
	document.querySelector( `#nav-item-${itemId}` ).classList.add( 'd-none' );
}

function showNavItem( itemId ) {
	document.querySelector( `#nav-item-${itemId}` ).classList.remove( 'd-none' );
}

function hideUserAccessNavItemsIfLoggedIn() {
	if ( isSessionActive() ) {
		hideNavItem( 'login' );
		hideNavItem( 'signup' );
	}
}

function showUserAccessNavItemsIfLoggedOut() {
	if ( !isSessionActive() ) {
		showNavItem( 'login' );
		showNavItem( 'signup' );

		hideNavItem( 'logout' );
		document.querySelector( '.nav-item.dropdown' ).classList.add( 'd-none' );
	}else if (!isAdminLoggedIn()){
		document.querySelector( '.nav-item.dropdown' ).classList.add( 'd-none' );
	}
}

function setupLogoutButton() {
	const link = document.querySelector( '#nav-item-logout' ).querySelector( 'a' );

	link.addEventListener( 'click', () => {
		localStorage.removeItem( 'session' );
	} );
}

function setupUserText() {
	if ( isSessionActive() ) {
		const userArea = document.querySelector( '.nav-user-text' );
		const email = JSON.parse( localStorage.getItem( 'session' ) ).email;

		userArea.insertAdjacentHTML(
			'afterbegin',
			`
				<button class="nav-link btn btn-outline-dark" style="color: white;">
					<i class="fa-solid fa-user"></i>&nbsp;${email}
				</button>
			`
		);
	}
}

function removeSessionAfter() {
	if ( isSessionActive() ) {
		const currentDate = new Date();
		const session = JSON.parse( localStorage.getItem( 'session' ) );

		const loginDate = Date.parse( session.date );
		const remember = session.rememberFor30Days;

		const differenceTime = Math.abs( currentDate - loginDate );
		const differenceDays = Math.floor( differenceTime / ( 1000 * 60 * 60 * 24 ) );

		if ( remember ) {
			if ( differenceDays > 30 ) {
				localStorage.removeItem( 'session' );
			}
		} else if ( differenceDays > 1 ) {
			localStorage.removeItem( 'session' );
		}
	}
}

main();
