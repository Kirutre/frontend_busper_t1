const cardContainer = document.querySelector(`#card-container`);
const newCardModal = document.querySelector(`#new-card-modal`);
const sendDataButton = document.querySelector(`#send`);


const getCardsState = () => {
    return JSON.parse(localStorage.getItem( `card-container-state` ));
}


const readNewCardData = async (event) => {
    const title = newCardModal.querySelector(`#product-title`).value;
    const price = newCardModal.querySelector(`#product-price`).value;
	const stock = newCardModal.querySelector(`#product-stock`).value;
	const imageInput = newCardModal.querySelector(`#product-image`);

    const titles = getCardsState().map(card => card.title );

    if (titles.includes(title)) {
        event.preventDefault();

        return;
    }

	let image = null;
    
	if (imageInput.files.length > 0) {
        image = await getImageFromInput( imageInput.files[0] );
	} else {
        event.preventDefault();

        return;
    }

	const data = {
        title, price, stock, image
	};

	return data;
}


const getImageFromInput = (input) => {
    const reader = new FileReader();

	return new Promise((resolve, _) => {
        reader.addEventListener('load', () => resolve(reader.result));
		reader.readAsDataURL(input);
	});
}


const createCard = (cardData) => {
    const img = cardData.image ? 
    `<img class="bd-placeholder-img card-img-top" width="100%" height="225" src="${cardData.image}" preserveAspectRatio="xMidYMid slice" focusable="false"></img>` : 
    '';
    
    const newCard = `
        <div class="col">
            <div class="card shadow-sm">
                ${img}
                <div class="card-body">
                    <h5 class="card-title">${cardData.title}</h5>
                    <p class="card-text">${cardData.price} $</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-secondary buy">Comprar</button>
                            <button type="button" class="btn btn-sm btn-outline-secondary delete d-none">Eliminar</button>
                        </div>
                        <small class="text-body-secondary">${cardData.stock} en stock</small>
                    </div>
                </div>
            </div>
        </div>`;
    
    return newCard;
}


const saveCardsState = (newItem) => {
    const itemState =  getCardsState();

    itemState.push( newItem );
    
    localStorage.setItem(`card-container-state`, JSON.stringify( itemState ));
}


sendDataButton.addEventListener( 'click', async (event) => {
    const newCardData = await readNewCardData(event);
    addItem(cardContainer, `beforeend`, createCard(newCardData));
    saveCardsState(newCardData);
});


const setCards = () => {
    const state = getCardsState();
    
    deleteAllItems( cardContainer );
        
    state.forEach(card => {
        addItem(cardContainer, `beforeend`, createCard(card));
    });
}

setCards();


const cardsDeleteButtons = cardContainer.querySelectorAll(`.delete`);

cardsDeleteButtons.forEach(button => {
    button.addEventListener(`click`, event => {
        const cardToDelete = event.target.closest(`.col`);

        const state = getCardsState();

        const newState = [...state].filter(card => card.title !== cardToDelete.querySelector(`.card-title`).textContent);

        localStorage.setItem(`card-container-state`, JSON.stringify(newState));
        
        cardToDelete.remove();
    })
});


if (isAdminLoggedIn()) {
    const addCardButton = document.querySelector( `#add-new-card-button-container` );
    addCardButton.classList.remove( `d-none` );

    cardsDeleteButtons.forEach(button => {
        button.classList.remove( `d-none` );
    });
}