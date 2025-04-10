function ImageReplacer( numberOfImagesInGallery, numberOfTotalImages ) {
	this.numberOfImagesInGallery = numberOfImagesInGallery;
	this.numberOfTotalImages = numberOfTotalImages;

	this.images = this.getImagesFromGallery();
	this.imageIds = this.getImageIds();
}

ImageReplacer.IMAGE_FILENAME_REGEX = /[^\/]+$/;

ImageReplacer.prototype.getImageIds = function () {
	return range( 1, this.numberOfTotalImages + 1 );
}

ImageReplacer.prototype.getImagesFromGallery = function () {
	const gallery = document.querySelector( '.gallery-all' );
	const images = gallery.querySelectorAll( 'img[src*=gallery-]' );

	return images;
}

ImageReplacer.prototype.setLastShuffle = function () {
	localStorage.setItem( 'gallery-shuffle', JSON.stringify( this.imageIds ) );
}

ImageReplacer.prototype.getLastShuffle = function() {
	return JSON.parse( localStorage.getItem( 'gallery-shuffle' ) );
}

ImageReplacer.prototype.replaceGallery = function ( shouldShuffle = false ) {
	if ( shouldShuffle ) {
		this.imageIds = shuffle( this.imageIds );
		this.setLastShuffle( this.imageIds );
	} else {
		this.imageIds = this.getLastShuffle();
	}

	for ( let i = 0; i < this.numberOfImagesInGallery; i++ ) {
		const image = this.images[ i ];

		const newImageId = this.imageIds[ i ];
		const newImage = `gallery-${newImageId}.jpg`;

		this.replaceImage( image, newImage );
	}
}

ImageReplacer.prototype.replaceImage = function ( oldImage, newImage ) {
	oldImage.src = oldImage.src.replace(
		ImageReplacer.IMAGE_FILENAME_REGEX,
		newImage
	);
}

function setupButton( replacer ) {
	const button = parseDomFromString(`
		<button id="shuffle-gallery-button" class="col-md-5 btn btn-outline-primary">
			Alternar imágenes
		</button>`
	);

	button.addEventListener( 'click', () => {
		replacer.replaceGallery( true );
	} );


	const section = document.getElementById( 'gallery-section' );
	section.append( button );
}

function areImagesNonDefault() {
	return isLocalStorageItemSet( 'gallery-shuffle' );
}

function init( replacer ) {
	if ( isAdminLoggedIn() ) {
		setupButton( replacer );
	}

	if ( areImagesNonDefault() ) {
		replacer.replaceGallery();
	}
}

const replacer = new ImageReplacer( 6, 20 );

init( replacer );
