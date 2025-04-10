const cardsBuyButtons = document.querySelectorAll( `.buy` );
const cartContainer = document.querySelector(`.shopping-cart`);
const cartItemsContainer = cartContainer.querySelector( `.shopping-cart-items` );


const getCartState = () => {
    return JSON.parse(localStorage.getItem( `cart-container-state` ));
}


const getCurrentSession = () => {
    return JSON.parse(localStorage.getItem( `session` ));
}


const displayCart = () => {
    cartContainer.classList.remove(`d-none`);
}


const hideCart = () => {
    cartContainer.classList.add(`d-none`);
}


const getCardTitle = (event) => {
    const itemToBuyTitle = event.target.closest( `.card-body` ).querySelector( `.card-title` );

    return itemToBuyTitle.textContent;
}


const getCard = (title) => {
    const cards = JSON.parse(localStorage.getItem( `card-container-state` ));
    const cardToBuy = [...cards].find(card => card.title === title);

    return cardToBuy;
}


const updateItems = (itemTitle, userEmail) => {
    const carts = getCartState();

    if (carts.hasOwnProperty( userEmail )) {
        const actualCart = carts[ userEmail ];

        if (actualCart.hasOwnProperty( itemTitle )) {
            actualCart[ itemTitle ]++;
        } else {
            actualCart[ itemTitle ] = 1;
        }

    } else {
        carts[ userEmail ] = {};
        carts[ userEmail ][ itemTitle ] = 1;
    }

    localStorage.setItem( `cart-container-state`, JSON.stringify( carts ));
}


const createItemShop = (itemData, quantity) => {
    const item = `
        <div class="shopping-cart-item">
            <div class="shopping-cart-details">
                <span class="shopping-cart-details-title">${itemData.title}</span>
                <div class="quantity-selector">
                    <i class="fa-solid fa-minus decrease-quantity"></i>
                    <p class="shopping-cart-item-quantity">${quantity}</p>
                    <i class="fa-solid fa-plus increase-quantity"></i>
                </div>
                <span class="shopping-cart-item-price">${itemData.price}$</span>
            </div>
            <button class="btn-delete dlt-shop-cart delete-item-button">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>`;
                
    return item;
}


const getItemTitle = (item) => {
    return item.querySelector(` .shopping-cart-details-title `).textContent;
}


const getItemQuantity = (cart, itemTitle) => {
    return cart[itemTitle];
}


const removeItem = (item, email, itemTitle) => {
    item.remove();

    const carts = getCartState();

    delete carts[email][itemTitle];

    localStorage.setItem( `cart-container-state`, JSON.stringify( carts ));
}


const totalPrice = (items, email) => {
    const price = [...items].reduce((acc, item) => {

        const itemTitle = getItemTitle(item);

        const stock = getCartState()[email][itemTitle];

        const cardPrice = getCard(itemTitle).price;

        const totalItemPrice = cardPrice * stock;

        return acc + totalItemPrice;
    }, 0);

    return price;
}


const setShopItems = (userEmail) => {
    deleteAllItems( cartItemsContainer );

    const cart = getCartState()[ userEmail ];

    for (const [title, quantity] of Object.entries(cart)) {
        const item = getCard(title);

        addItem(cartItemsContainer, `beforeend`, createItemShop(item, quantity));
    }


    const shopItems = cartContainer.querySelectorAll(` .shopping-cart-details `);
    const shopCartPrice = cartContainer.querySelector(` .total-price-shopping-cart `);

    shopCartPrice.textContent = totalPrice(shopItems, userEmail);


    const plusButtons = cartItemsContainer.querySelectorAll(` .fa-plus `);
    const minusButtons = cartItemsContainer.querySelectorAll(` .fa-minus `);

    plusButtons.forEach(button => { 
        button.addEventListener(`click`, event => {
            const actualItem = event.target.closest(` .shopping-cart-details `);

            const itemTitle = getItemTitle(actualItem);

            const itemCardQuantity = getCard(itemTitle).stock;
            const itemCartQuantity = getItemQuantity(cart, itemTitle);


            if (itemCartQuantity < itemCardQuantity) {
                const quantity = actualItem.querySelector(` .shopping-cart-item-quantity `);

                const newValue = parseInt(quantity.textContent) + 1;

                quantity.textContent = newValue;


                cart[itemTitle]++;

                const newState = getCartState();
                newState[userEmail] = cart;

                localStorage.setItem(`cart-container-state`, JSON.stringify(newState));

                shopCartPrice.textContent = totalPrice(shopItems, userEmail);
            }
        });
    });

    minusButtons.forEach(button => { 
        button.addEventListener(`click`, event => {
            const actualItem = event.target.closest(`.shopping-cart-details `);

            const itemTitle = getItemTitle(actualItem);

            const itemCartQuantity = getItemQuantity(cart, itemTitle);

            if (itemCartQuantity > 1) {
                const quantity = actualItem.querySelector(` .shopping-cart-item-quantity `);
                const newValue = parseInt(quantity.textContent) - 1;
                quantity.textContent = newValue;


                cart[itemTitle]--;

                const newState = getCartState();
                newState[userEmail] = cart;

                localStorage.setItem(`cart-container-state`, JSON.stringify(newState));

                shopCartPrice.textContent = totalPrice(shopItems, userEmail);
            } else {
                const itemToDelete = actualItem.closest(` .shopping-cart-item `);

                removeItem(itemToDelete, userEmail, itemTitle);

                const shopItems = cartContainer.querySelectorAll(` .shopping-cart-details `);

                shopCartPrice.textContent = totalPrice(shopItems, userEmail);

                if (Object.keys( getCartState()[userEmail] ).length === 0) {
                    const newCartsState = getCartState();

                    delete newCartsState[userEmail];

                    localStorage.setItem( `cart-container-state`, JSON.stringify( newCartsState ) );

                    hideCart();
                }
            }
        });
    });


    const deleteButtons = cartItemsContainer.querySelectorAll(` .btn-delete `);

    deleteButtons.forEach(button => {
        button.addEventListener(`click`, event => {
            const itemToDelete = event.target.closest(`.shopping-cart-item`);

            const itemTitle = getItemTitle(itemToDelete);

            removeItem(itemToDelete, userEmail, itemTitle);

            const shopItems = cartContainer.querySelectorAll(` .shopping-cart-details `);

            shopCartPrice.textContent = totalPrice(shopItems, userEmail);

            if (Object.keys( getCartState()[userEmail] ).length === 0) {
                const newCartsState = getCartState();

                delete newCartsState[userEmail];

                localStorage.setItem( `cart-container-state`, JSON.stringify( newCartsState ) );

                hideCart();
            }
        });
    });
}


cardsBuyButtons.forEach(button => {
    button.addEventListener(`click`, event => {
        const title = getCardTitle(event);

        const session = getCurrentSession();

        const cart = getCartState()[session.email];

        if (cart && cart.hasOwnProperty(title)) {
            const quantity = cart[title];
            const productQuantity = getCard(title).stock;

            if (quantity >= productQuantity) {
                return;
            }
        }

        updateItems(title, session.email);

        setShopItems(session.email);

        displayCart();
    });
});


const cartUser =  getCartState()[getCurrentSession().email];

if (cartUser !== undefined && Object.keys(cartUser) !== 0) {
    displayCart();

    setShopItems( getCurrentSession().email );
}


const buyModal = document.querySelector( `#buy-modal` );
const buyButton = buyModal.querySelector( `#buy` );

buyButton.addEventListener( `click`, () => {
    const productsRequests = JSON.parse(localStorage.getItem( `product-requests` ));

    const name = buyModal.querySelector( `#client-name` ).value;
    const state = buyModal.querySelector( `#state`).value;
    const direction = buyModal.querySelector( `#direction`).value;
    const postalCode = buyModal.querySelector( `#postal-code`).value;
    const phoneNumber = buyModal.querySelector( `#phone-number` ).value;
    const email = getCurrentSession().email;

    const clientData = `${name}, ${email}, ${phoneNumber}`;
    const fullDirection = `${state}, ${direction}, ${postalCode}`;

    const carts = getCartState();
    const cart = carts[ email ];


    let i = 0;

    for (const [title, quantity] of Object.entries( cart ) ) {
        const productPrice = getCard(title).price;

        const price = productPrice * quantity;

        const date= new Date();

        date.setSeconds(date.getSeconds() + (i + 1) * 2);

        const request = {
            clientData,
            fullDirection,
            product: title,
            quantity,
            price,
            status: `En proceso`,
            date
        };

        i++;

        productsRequests.push(request);

        localStorage.setItem( `product-requests`, JSON.stringify( productsRequests ) );
    };

    delete carts[email];

    localStorage.setItem( `cart-container-state`, JSON.stringify( carts ) );
});