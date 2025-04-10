const data = {
	currentCell: null,
	currentMark: null,
	currentMarkIndex: null
};

function init() {
	setupPriceEditor();
	setupMarkEditor();

	if ( isAdminLoggedIn() ) {
		setupUserInterface();
	}
}

function setupUserInterface() {
	const adminHelpContainer = document.querySelector( '.admin-help-container' );

	adminHelpContainer.append(
		parseDomFromString(`
			<button type="button" id="services-table-edit-help-popover" class="btn btn-lg btn-secondary mb-4" data-bs-toggle="popover" data-bs-placement="top" title="Ayuda" data-bs-content="Haz click en una de las celdas para cambiar su valor.">
				Ayuda <i class="fa-solid fa-circle-info"></i>
			</button>
		`)
	);

	new bootstrap.Popover(
		document.getElementById( 'services-table-edit-help-popover' ),
		{
			container: 'body'
		}
	);
}

function setupPriceEditor() {
	const savePriceButton = document.getElementById( 'save-new-price-button' );
	savePriceButton.addEventListener( 'click', handleNewPrice );

	const priceCells = getPriceCells();

	if ( isAdminLoggedIn() ) {
		setupPriceCellsDataAttributes( priceCells );
	}

	if ( isLocalStorageItemSet( 'services-table-prices' ) ) {
		setupNewPriceCells( priceCells );
	}
}

function handleNewPrice() {
	const newPrice = getNewPrice();

	if ( isValidPrice( newPrice ) ) {
		setNewPrice( newPrice );
		saveNewPrices( newPrice );
	}

	document.getElementById( 'new-price' ).value = '';
}

function getNewPrice() {
	return parseFloat( document.getElementById( 'new-price' ).value.trim() );
}

function isValidPrice( price ) {
	return parseFloat( price ) > 0.0;
}

function setNewPrice( newPrice ) {
	data.currentCell.textContent = formatNumber( newPrice );
}

function saveNewPrices( newPrice ) {
		const newPrices = JSON.parse( localStorage.getItem( 'services-table-prices' ) );

		newPrices[ data.currentCell.id ] = formatNumber( newPrice );
		localStorage.setItem( 'services-table-prices', JSON.stringify( newPrices ) );
}

function getPriceCells() {
	return [ ...document.querySelectorAll( '.services-table-price' ) ];
}

function setupPriceCellsDataAttributes( priceCells ) {
	for ( const cell of priceCells ) {
		setPriceCellDataAttributes( cell );

		cell.addEventListener( 'click', () => {
			data.currentCell = cell;
		} );
	}
}

function setPriceCellDataAttributes( cell ) {
	cell.dataset.bsToggle = 'modal';
	cell.dataset.bsTarget = '#services-table-edit-price-modal';
}

function setupNewPriceCells( priceCells ) {
	for ( let i = 0; i < priceCells.length; i++ ) {
		const cell = priceCells[ i ];
		const service = cell.id;

		const newPricesLocalStorage = JSON.parse( localStorage.getItem( 'services-table-prices' ) );

		if ( newPricesLocalStorage.hasOwnProperty( service ) ) {
			priceCells[ i ].textContent = newPricesLocalStorage[ service ];
		}
	}
}

function setupMarkEditor() {
	const saveMarkButton = document.getElementById( 'save-new-mark-button' );
	saveMarkButton.addEventListener( 'click', handleNewMark );

	const markCells = getMarkCells();

	if ( isLocalStorageItemSet( 'services-table-marks' ) ) {
		setupNewMarkCells( markCells );
	}

	if ( isAdminLoggedIn() ) {
		setupMarkCellsDataAttributes( markCells );
	}
}

function handleNewMark() {
	const newMarks = JSON.parse( localStorage.getItem( 'services-table-marks' ) );

	if ( isCheckMarkRadioChecked() ) {
		setNewMark( '✅' );
	} else if ( isCrossMarkRadioChecked() ) {
		setNewMark( '❌' );
	}

	saveNewMarks( newMarks );
}

function setNewMark( markType ) {
	data.currentMark.textContent = markType;
}

function isCheckMarkRadioChecked() {
	return document.getElementById( 'services-table-mark-yes' ).checked;
}

function isCrossMarkRadioChecked() {
	return document.getElementById( 'services-table-mark-no' ).checked;
}

function saveNewMarks( newMarks ) {
	newMarks[ data.currentMarkIndex ] = data.currentMark.textContent;

	localStorage.setItem( 'services-table-marks', JSON.stringify( newMarks ) );
}

function getMarkCells() {
	return document.querySelectorAll( '.services-table-mark' );
}

function setupNewMarkCells( markCells ) {
	for ( let i = 0; i < markCells.length; i++ ) {
		const newMarks = JSON.parse( localStorage.getItem( 'services-table-marks' ) );

		if ( newMarks.hasOwnProperty( i.toString() ) ) {
			markCells[ i ].textContent = newMarks[ i.toString() ];
		}
	}
}

function setupMarkCellsDataAttributes( markCells ) {
	for ( const mark of markCells ) {
		setMarkCellDataAttributes( mark );
	}

	for ( let i = 0; i < markCells.length; i++ ) {
		const mark = markCells[ i ];

		mark.addEventListener( 'click', () => {
			data.currentMark = markCells[ i ];
			data.currentMarkIndex = i;
		} );
	}
}

function setMarkCellDataAttributes( cell ) {
	cell.dataset.bsToggle = 'modal';
	cell.dataset.bsTarget = '#services-table-edit-mark-modal';
}

init();
