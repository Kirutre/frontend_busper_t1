const popoverTriggerList = [].slice.call(
	document.querySelectorAll( '[data-bs-toggle="popover"]' )
);

const popoverList = popoverTriggerList.map( ( popoverTriggerElement) => {
	return new bootstrap.Popover( popoverTriggerElement, { html: true } );
} );

