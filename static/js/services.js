function createRequest() {
	const select = document.getElementById( 'service' );

	const id = select.value;
	const name = select.options[ select.selectedIndex ].text;

	const customer = document.getElementById( 'name' ).value.trim();
	const price = document.getElementById( id ).textContent.trim();
	const details = {
		telephone: document.getElementById( 'telephone-number' ).value.trim(),
		email: document.getElementById( 'email' ).value.trim(),
		model: document.getElementById( 'model' ).value.trim(),
		operatingSystem: document.getElementById( 'operating-system' ).value.trim(),
		description: document.getElementById( 'description' ).value.trim()
	};
	const date = new Date();
	const status = 'En proceso';

	return {
		name, customer, price, details, date, status
	};
}

function saveRequest( request ) {
	const requests = JSON.parse( localStorage.getItem( 'sales-tracker-requests' ) );

	requests.push( request );
	localStorage.setItem( 'sales-tracker-requests', JSON.stringify( requests ) );
}

function handleSubmit( event ) {
	const request = createRequest();

	if ( isRequestValid( request ) ) {
		saveRequest( request );
	} else {
		event.preventDefault();
	}
}

function isRequestValid( request ) {
	return (
		request.customer &&
		request.details.telephone &&
		request.details.model
	);
}

function init() {
	const form = document.querySelector( '#request-service-modal form' );

	form.addEventListener( 'submit', handleSubmit );
}

init();
