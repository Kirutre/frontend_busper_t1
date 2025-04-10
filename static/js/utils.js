const parser = new DOMParser();

function titleContains( string ) {
	return document.title.split( ' ' )[ 0 ] === string;
}

function redirectTo( path ) {
	window.location.href = path;
}

function shuffle( array ) {
	const result = [ ...array ];

	for ( let i = result.length - 1; i > 0; i-- ) {
		const j = Math.floor( Math.random() * ( i + 1 ) );

		[ result[ i ], result[ j ] ] = [ result[ j ], result[ i ] ];
	}

	return result;
}


function range( start = 0, stop = 0 ) {
	const result = [];

	if ( stop === 0 ) {
		return result;
	}

	for ( let i = start; i < stop; i++ ) {
		result.push( i );
	}

	return result;
}

function isSessionActive() {
	if (isSessionActive)
	return localStorage.getItem( 'session' ) !== null;
}

function formatNumber( number ) {
  return number.toString().replace(
  	/\B(?=(\d{3})+(?!\d))/g, ' '
  );
}

function isLocalStorageItemSet( item ) {
	return Object.hasOwn( localStorage, item );
}

function isSessionStorageItemSet( item ) {
	return Object.hasOwn( sessionStorage, item );
}

function parseDomFromString( html ) {
	return parser.parseFromString( html, 'text/html' )
		.body
		.firstElementChild;
}

function parseDomElementsFromString( html ) {
	const template = document.createElement( 'template' );

	template.innerHTML = html.trim();

	return template.content.children;
}

function isAdminLoggedIn(){
	if (!isSessionActive()){
		return false;
	}

	const users = User.getAll();
	const session = JSON.parse( localStorage.getItem ( `session` ) );
	const user = users.find( ( user ) => user.email === session.email);

	return isUserAdmin ( user );
}

function isUserAdmin( user ) {
	return user.role === 'admin';
}

//Las siguientes funciones las añadio Pernalete
const addItem = (container, position, itemData) => {
    container.insertAdjacentHTML( position, itemData );
}

const deleteAllItems = (container) => {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}