if ( !isAdminLoggedIn() ) {
	redirectTo( 'login.html' );
}

const data = { currentRow: null, currentProductRow: null };

function createRow( { name, customer, price, details, date, status } ) {
	const popover = createPopover( {} );
	const localeDate = new Date( date ).toLocaleString( 'es-ES', {} );

	const colorClass = getColorClass( status );

	const row =
		`
		<tr id="${date}">
			<th scope="row" class="sales-tracker-type">${name}</td>
			<td class="sales-tracker-requester">${customer}</td>
			<td class="sales-tracker-details">${popover.outerHTML}</td>
			<td class="sales-tracker-price text-success">${formatNumber( price )} <span class="fw-bold">$</span></td>
			<td class="sales-tracker-date">${localeDate}</td>
			<td class="sales-tracker-status ${colorClass}">
				<a href="" class="change-status-link fw-bold link-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#change-status-modal">
					${status}
				</a>
			</td>
		</tr>
		`;

	return [ row, date ];
}

function createPopover( details ) {
	const popover = parseDomFromString(`
		<button class="btn btn-secondary" data-bs-toggle="popover" data-bs-placement="top">
			Ver detalles
		</button>
	`);

	return popover;
}

function getColorClass( status ) {
	switch ( status ) {
		case 'En proceso':
			return 'bg-secondary';
		case 'Aceptado':
			return 'bg-success';
		case 'Rechazado':
			return 'bg-danger';
		case 'Finalizado':
			return 'bg-primary';
	}
}

function addRow( row, date ) {
	const table = document
		.getElementById( 'sales-tracker' )
		.querySelector( 'tbody' );
	const newRow = table.insertRow();

	newRow.innerHTML = row;
	newRow.setAttribute( 'id', date );
}

function addPopoverData( details, popoverIndex ) {
	const popovers = document.querySelectorAll( 'button[data-bs-toggle=popover]' );
	const popover = popovers[ popoverIndex ];

	let content = '';

	for ( const [ key, value ] of Object.entries( details ) ) {
		const name = convertKeyToName( key );

		content += `<li>${name}: ${value || 'n/a' }</li>`;
	}

	new bootstrap.Popover( popover, {
		html: true,
		title: 'Detalles de la solicitud',
		content: `<ul>${content}</ul>`
	} );
}

function convertKeyToName( key ) {
	switch ( key ) {
		case 'telephone':
			return 'Teléfono';
		case 'email':
			return 'Correo';
		case 'model':
			return 'Modelo';
		case 'operatingSystem':
			return 'Sistema operativo';
		case 'description':
			return 'Descripción';
	}
}

function getStatusCells() {
	return document.querySelectorAll( '.sales-tracker-status' );
}

function getStatus() {
	const radios = document.querySelectorAll( 'input[name=status-radio]' );

	for ( const radio of radios ) {
		if ( radio.checked ) {
			return radio.id;
		}
	}
}

function setupStatusButtons() {
	const buttons = document.querySelectorAll( '.change-status-link' );

	for ( const button of buttons ) {
		button.addEventListener( 'click', handleStatusButton );
	}
}

function handleStatusButton( event ) {
	data.currentRow = event.target.closest( 'tr' );
}

function setupStatusModal() {
	const saveButton = document.getElementById( 'save-new-status-button' );

	saveButton.addEventListener( 'click', handleStatusForm );
}

function handleStatusForm( event ) {
	const status = getStatus();

	const rowsData = JSON.parse( localStorage.getItem( 'sales-tracker-requests' ) );
	const row = rowsData.find( ( rowData ) => rowData.date === data.currentRow.id );

	row.status = convertStatusIdToName( status );
	localStorage.setItem( 'sales-tracker-requests', JSON.stringify( rowsData ) );
	data.currentRow.querySelector( '.sales-tracker-status a' ).textContent = row.status;


	data.currentRow.querySelector( '.sales-tracker-status' ).classList.remove( 'bg-secondary' );
	data.currentRow.querySelector( '.sales-tracker-status' ).classList.remove( 'bg-success' );
	data.currentRow.querySelector( '.sales-tracker-status' ).classList.remove( 'bg-danger' );
	data.currentRow.querySelector( '.sales-tracker-status' ).classList.remove( 'bg-primary' );

	const colorClass = getColorClass( convertStatusIdToName( status ) );
	data.currentRow.querySelector( '.sales-tracker-status' ).classList.add( colorClass );

	handleRevenue();
}

function convertStatusIdToName( status ) {
	switch ( status ) {
		case 'status-on-hold':
			return 'En proceso';
		case 'status-executed':
			return 'Aceptado';
		case 'status-rejected':
			return 'Rechazado';
		case 'status-done':
			return 'Finalizado';
	}
}

function convertIdStatusToName( id ) {
	switch ( id ) {
		case 'En proceso':
			return 'status-on-hold';
		case 'Aceptado':
			return 'status-executed';
		case 'Rechazado':
			return 'status-rejected';
		case 'status-done':
			return 'Finalizado';
	}
}

function handleRevenue() {
	const priceSpan = document.getElementById( 'services-revenue' );
	priceSpan.textContent = formatNumber( getRevenue() );
}

function getRevenue() {
	const data = JSON.parse( localStorage.getItem( 'sales-tracker-requests' ) );
	const doneRequests = data.filter( ( request ) => request.status === 'Finalizado' );

	const currentDate = new Date();

	const last30DaysDates = doneRequests.filter( ( request ) => {
		const date = new Date( request.date );
		const differenceTime = Math.abs( currentDate - date );
		const differenceDays = Math.floor( differenceTime / ( 1000 * 60 * 60 * 24 ) );

		return differenceDays <= 30;
	} );

	return last30DaysDates.reduce( ( sum, request ) => sum + parsePrice( request.price ), 0 );
}

function parsePrice( price ) {
	return parseInt( price.replace( /\s/g, '' ) );
}

function handleLastUpdate() {
	const lastUpdateArea = document.getElementById( 'sales-tracker-last-update' );
	const data = JSON.parse( localStorage.getItem( 'sales-tracker-requests' ) );

	if ( !data.length ) {
		lastUpdateArea.textContent = new Date().toLocaleString( 'es-ES', {} );

		return;
	}

	const dates = data.map( ( request ) => new Date( request.date ) );
	const newest = new Date( Math.max( ...dates ) );

	lastUpdateArea.textContent = newest.toLocaleString( 'es-ES', {} );
}

function init() {
	const rowsData = JSON.parse( localStorage.getItem( 'sales-tracker-requests' ) );

	for ( const data of rowsData ) {
		const [ row, date ] = createRow( data );

		addRow( row, date );
	}

	for ( let i = 0; i < rowsData.length; i++ ) {
		const data = rowsData[ i ];

		addPopoverData( data.details, i );
	}

	setupStatusButtons();
	setupStatusModal();

	handleRevenue();
	handleProductRevenue();
	handleLastUpdate();
}

init();

function insertProduct( product ) {
	const table = document
		.querySelector( '#sales-tracker-products' )
		.querySelector( 'tbody' );

	const row = table.insertRow();
	row.innerHTML = createProductRow( product );
	row.dataset.id = product.date;
}

function createProductRow( product ) {
	const date = new Date( product.date ).toLocaleString( 'es-ES', {} );
	const colorClass = getColorClass( product.status );

	return (`
		<tr id="p-${date}">
			<th scope="row" class="p-product">${product.product}</td>
			<td class="p-name">${product.clientData}</td>
			<td class="p-direction">${product.fullDirection}</td>
			<td class="p-price text-success">${product.price} <b>$</b></td>
			<td class="p-quantity">${product.quantity}</td>
			<td class="p-date">${date}</td>
			<td class="p-status sales-tracker-status ${colorClass}">
				<a href="" class="change-product-status-link fw-bold link-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#change-product-status-modal">
				${product.status}
				</a>
			</td>
		</tr>
	`);
}


function getProductRequests() {
	return JSON.parse(
		localStorage.getItem(
			'product-requests'
		)
	);
}

function setupProductStatusButtons() {
	const buttons = document.querySelectorAll( '.change-product-status-link' );

	for ( const button of buttons ) {
		button.addEventListener( 'click', event => {
			const row = event.target.closest( 'tr' );
			data.currentProductRow = row;
		} );
	}
}

function handleProductStatusForm( row ) {
	const rowsData = JSON.parse( localStorage.getItem( 'product-requests' ) );

	const request = rowsData.find( ( rowData ) => rowData.date === data.currentProductRow.dataset.id );

	const status = convertStatusIdToName( getProductStatus() );
	request.status = status;

	localStorage.setItem( 'product-requests', JSON.stringify( rowsData ) );
	data.currentProductRow.querySelector( '.p-status a' ).textContent = status;

	data.currentProductRow.querySelector( '.p-status' ).classList.remove( 'bg-secondary' );
	data.currentProductRow.querySelector( '.p-status' ).classList.remove( 'bg-success' );
	data.currentProductRow.querySelector( '.p-status' ).classList.remove( 'bg-danger' );
	data.currentProductRow.querySelector( '.p-status' ).classList.remove( 'bg-primary' );

	const colorClass = getColorClass( status );
	data.currentProductRow.querySelector( '.p-status' ).classList.add( colorClass );

	handleProductRevenue();
}

function getProductStatus() {
	const radios = document.querySelectorAll( 'input[name=status-p-radio]' );

	for ( const radio of radios ) {
		if ( radio.checked ) {
			return radio.id.replace( 'p-', '' );
		}
	}
}

function handleProductRevenue() {
	const priceSpan = document.getElementById( 'services-products-revenue' );
	priceSpan.textContent = formatNumber( getProductRevenue() );
}

function getProductRevenue() {
	const products = getProductRequests();

	return products
		.filter( product => product.status === 'Finalizado' )
		.reduce( ( sum, product ) => sum + product.price, 0 );
}

const products = getProductRequests();

for ( const product of products ) {
	insertProduct( product );
}

function setupProductStatusModal() {
	const saveButton = document.getElementById( 'save-new-product-status-button' );

	saveButton.addEventListener( 'click', handleProductStatusForm );
}

setupProductStatusButtons();
setupProductStatusModal();