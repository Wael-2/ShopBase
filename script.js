const products = [{
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    category: "electronics",
    stock: 5,
    rating: "5/5",
    description: "Noise cancelling wireless headphones",
    image: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ymx1ZXRvb3RoJTIwaGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D"
   },
   {
    id: 2,
    name: "Mechanical Keyboard",
    price: 129.99,
    category: "electronics",
    stock: 2,
    rating: "4/5",
    description: "Mechanical Keyboard connected via Bluetooth",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3uU_UI6036pmvzir8o4nbDlw4pb8D5BLdE-4SDrbfOw&s=10"
   },
   {
    id: 3,
    name: "Coffee Mug",
    price: 14.99,
    category: "home",
    stock: 30,
    rating: "4/5",
    description: "Coffe Mug designed for the home and office",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVNNYYvxXpUj0UN3qQoV0uaPLN8-NVAs-frMfwumgiWA&s=10"
   },
   {
    id: 4,
    name: "Running Shoes",
    price: 89.99,
    category: "clothing",
    stock: 0,
    rating: "4/5",
    description: "Running Shoes for every type of weather",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT25xOjyFGQ9ivwepnSOLnGtXxiVH3q6zmQw37khhQZSw&s=10"
   },
   {
    id: 5,
    name: "USB-C Hub",
    price: 39.99,
    category: "electronics",
    stock: 17,
    rating: "4/5",
    description: "USB-C Hub saves your devices data and uploads it onto other devices",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhXTkWlrs7eYk7BbIu7ietmx08g38xN98Zvh2voMHs3Q&s=10"
   },
   {
    id: 6,
    name: "Desk Lamp",
    price: 34.99,
    category: "home",
    stock: 10,
    rating: "5/5",
    description: "Desk lamp perfect for long working hours on the desk",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPhevD46CixpmJL31xOcM4Sn-gI37HgiS23n7oq2Fdyg&s=10"
   },
   {
    id: 7,
    name: "Backpack",
    price: 59.99,
    category: "clothing",
    stock: 0,
    rating: "4/5",
    description: "Backpack made for all uses whether wandering, climbing, work or just for personal use",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFcP_5EfOOPXwvI1EKqi0dSHvrRrbVhV2gMHGDp0tNJQ&s=10"
   },
   {
    id: 8,
    name: "Bluetooth Speaker",
    price: 64.99,
    category: "electronics",
    stock: 22,
    rating: "5/5",
    description: "Speaker connected via Bluetooth excellent for gaming and movie experiences",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAeI6ENdDj9shUDtzy57g3OEHl8vJI8b6r_EWmgQP39w&s=10"
   }
];

const searchProduct = document.querySelector('#search');
const categoryFilter = document.querySelector(".category");
const sortFilter = document.querySelector(".sort");

function updateProducts() {

    const searchInput = searchProduct.value.toLowerCase();
    const currentCategory = categoryFilter.value;
    const currentSort = sortFilter.value;
    
    let productsToDisplay = products;

    productsToDisplay = productsToDisplay.filter(product => product.name.toLowerCase().includes(searchInput));

    productsToDisplay = productsToDisplay.filter(product => {
        return currentCategory === "" || product.category === currentCategory;
    });

    productsToDisplay = [...productsToDisplay];
    if(currentSort === "price-highest") {
        productsToDisplay.sort((a, b) => b.price - a. price);
    }else if(currentSort === "price-lowest") {
        productsToDisplay.sort((a, b) => a.price - b.price);
    }else if(currentSort === "a-z") {
        productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
    }else if(currentSort === "z-a") {
        productsToDisplay.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderProducts(productsToDisplay);
};

searchProduct.addEventListener('input', updateProducts);
categoryFilter.addEventListener('change', updateProducts);
sortFilter.addEventListener('change', updateProducts);

const productList = document.querySelector('.product-list');
const cartButton = document.querySelector('.cart-button');
const cartCount = document.querySelector('.cart-count');
const cart = JSON.parse(localStorage.getItem("cart")) || [];
function addToCart(productId) {
    const product = products.find(product => product.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    const currentQuantity = cartItem ? cartItem.quantity: 0;

    if (currentQuantity >= product.stock) {
        alert("This product is out of stock.");
        return;
    }
    if(cartItem) {
        cartItem.quantity += 1;
    }else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    updateCartCount();
    renderCart();
};
const cartUi = document.querySelector('.cart-ui');
const cartUiContent = document.querySelector('.cart-ui-content');
const removeCartUi = document.createElement("button");
removeCartUi.classList.add("remove-cart-ui");
removeCartUi.textContent = "X";
cartUi.appendChild(removeCartUi);

const promoInput = document.createElement("input");
promoInput.placeholder = "Promo Code";
const applyButton = document.createElement("button");
applyButton.textContent = "Use Discount Code";
let appliedDiscount = 0;
const discountCodes = {
    SAVE10: 0.10,
    SAVE20: 0.20
};
function calculatePrice() {
    const subtotal = cart.reduce((total, cartItem) => {
       const product = products.find(product => product.id === cartItem.id);

       return total + product.price * cartItem.quantity}, 0);

    const discount = subtotal * appliedDiscount;
    const discountedTotal = subtotal - discount;
    const tax = subtotal * 0.19;
    const total = discountedTotal + tax;
    
    const subtotalText = document.createElement("p");
    subtotalText.textContent = `Subtotal: ${subtotal.toFixed(2)}`;
    const taxText = document.createElement("p");
    taxText.textContent = `Tax: ${tax.toFixed(2)}`;   
    const totalText = document.createElement("p");
    totalText.textContent = `Total: ${total.toFixed(2)}`;
    cartUiContent.append(subtotalText, taxText, totalText, promoInput, applyButton);

    return total;
};

function checkOut(total) {
    const confirmCheckout = document.createElement("div");
    confirmCheckout.classList.add("checkout");
    
    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Checkout";

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    
    const confirmOrder = document.createElement("p");
    confirmOrder.textContent = "Order confirmed!";

    const orderId = document.createElement("p");
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    orderId.textContent = `Order: #${orderNumber}`;

    const itemNumber = document.createElement("p");
    itemNumber.textContent = `Items: ${cartCount.textContent}`;

    const totalPrice = document.createElement("p");
    totalPrice.textContent = `Total: ${total.toFixed(2)}`;

    const thankYou = document.createElement("p");
    thankYou.textContent = "Thank you for your purchase.";

    const finish = document.createElement("button");
    finish.textContent = "Finish";

    confirmCheckout.append(confirmOrder, orderId, itemNumber, totalPrice, thankYou, finish);

    cartUiContent.append(confirmCheckout, checkoutButton, overlay);

    checkoutButton.addEventListener('click', (event) => {
        event.stopPropagation();
        
        if(cart.length === 0) {
            alert("Items need to be purchased for checkout");
            return;
        }else if(cart.length > 0 && userName.value === "" && userEmail.value === ""){
            alert("Name and email adress required for checkout");
            return;
        }else if(cart.length > 0 && userName.value === ""){
            alert("Please enter your name");
            return;
        }else if(cart.length > 0 && userEmail.value === ""){
            alert("Please enter your email adress");
            return;
        }else if(cart.length > 0 && !userEmail.checkValidity()){
            alert("Please enter a valid email adress");
            return;
        }else {
        confirmCheckout.classList.add("visible");
        overlay.classList.add("visible");
        }
    });

    finish.addEventListener('click', (event) => {
        event.stopPropagation();
        
        for(const cartItem of cart) {
            const product = products.find(product => product.id === cartItem.id);
            product.stock -= cartItem.quantity;
        }
        cart.length = 0;
        updateCartCount();
        confirmCheckout.classList.remove("visible");
        overlay.classList.remove("visible");
        cartUi.classList.remove("visible");
        
    });
};

function renderCart() {
        cartUiContent.innerHTML = "";

    for(const cartItem of cart) {
        const product = products.find(product => product.id === cartItem.id);
        
        const cartRow = document.createElement("div");
        cartRow.classList.add('cart-row');

        const name = document.createElement("p");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = `€${product.price}`;

        const quantity = document.createElement("p");
        quantity.textContent = `Quantity: ${cartItem.quantity}`;

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "-";
        decreaseButton.dataset.action = "decrease";
        decreaseButton.dataset.productId = product.id;

        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.dataset.action = "increase";
        increaseButton.dataset.productId = product.id;

        cartRow.append(name, price, quantity, decreaseButton, increaseButton);
        cartUiContent.appendChild(cartRow);
    };
    const total = calculatePrice();
    checkOut(total);
    clearCart();
    userData();
};


const userName = document.createElement("input");
userName.placeholder = "Max Mustermann";
userName.required = true;
const userEmail = document.createElement("input");
userEmail.placeholder = "maxmustermann123@gmail.com";
userEmail.type = "email";
userEmail.required = true;
function userData() {
    cartUiContent.append(userName, userEmail);
};


function clearCart() {
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear Cart";
    cartUiContent.appendChild(clearButton);

    clearButton.addEventListener('click', (event) => {
        event.stopPropagation();

        if(cart.length === 0) {
            alert("Cart is already empty");
            return;
        } else {
            cart.length = 0;
            updateCartCount();
            renderCart();
        }
    });
};

cartButton.addEventListener('click', () => {
    renderCart();
    cartUi.classList.add('visible');
});

removeCartUi.addEventListener('click', () => {
    cartUi.classList.remove('visible');
});

cartUiContent.addEventListener('click', (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    };

    const productId = Number(button.dataset.productId);
    const action = button.dataset.action;

    const cartItem = cart.find(item => item.id === productId);

    if(action==="increase") {
        addToCart(productId);
        return;
    }
    else if(action==="decrease"){
        cartItem.quantity -=1;
    }
    if (cartItem.quantity === 0) {
        cart.splice(cart.indexOf(cartItem), 1);
    }
    updateCartCount();
    renderCart();
});

function updateCartCount() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0); 
    localStorage.setItem("cart", JSON.stringify(cart));
};

const modalHidden = document.querySelector('.hidden-modal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.close-modal');
const modalImage = document.querySelector('.modal-image');
const modalName = document.querySelector('.modal-name');
const modalPrice = document.querySelector('.modal-price');
const modalCategory = document.querySelector('.modal-category');
const modalStock = document.querySelector('.modal-stock');
const modalRating = document.querySelector('.modal-rating');
const modalDescription = document.querySelector('.modal-description');
const modalButton = document.querySelector('.modal-add-cart');
let selectedProduct = null;
modalButton.addEventListener('click', () => {
    const productId = selectedProduct.id;
    addToCart(productId);
    modalHidden.classList.remove('visible');
});
closeModal.addEventListener('click', () => {
    modalHidden.classList.remove('visible');
});

function renderProducts(productsToRender = products) {
    productList.innerHTML = "";
  for (const product of productsToRender) {
    const productCard = document.createElement("article");
    productCard.classList.add("product-card");
    productList.appendChild(productCard);

    const productImage = document.createElement("img");
    productImage.classList.add("product-image");
    productImage.src = product.image;
    productCard.appendChild(productImage);

    const productMeta = document.createElement("div");
    productMeta.classList.add("product-meta");
    productCard.appendChild(productMeta);

    const productName= document.createElement("p");
    productName.classList.add("product-details");
    productName.textContent = product.name;
    productMeta.appendChild(productName);

    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    productPrice.textContent = product.price;
    productMeta.appendChild(productPrice);

    const productRating = document.createElement("p");
    productRating.classList.add("product-rating");
    productRating.textContent = product.rating;
    productMeta.appendChild(productRating);

    const addCart = document.createElement("button");
    addCart.classList.add("add-cart");
    addCart.dataset.productId = product.id;
    addCart.textContent = "Add to Cart";
    productCard.appendChild(addCart);
    addCart.addEventListener('click', (event) => {
        event.stopPropagation();

        const productId = Number(event.currentTarget.dataset.productId);

        addToCart(productId);

        renderCart();
    });

    productCard.addEventListener('click', () => {

    modalHidden.classList.add('visible');

    modalImage.src = product.image;

    modalName.textContent = "Product: " + product.name;

    modalPrice.textContent = "Price: " + product.price;

    modalCategory.textContent = "Category: " + product.category;

    modalStock.textContent = "Stock: " + product.stock;

    modalRating.textContent = "Rating: " + product.rating;

    modalDescription.textContent = "Description: " + product.description;

    selectedProduct = product;
    });
};
};
renderProducts();
updateCartCount();

applyButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const code = promoInput.value;
    if (discountCodes[code] && cart.length > 0) {
        appliedDiscount = discountCodes[code];
        renderCart();
    }else if(code === "") {
        alert("Please enter a discount code");
        return;
    }else if(discountCodes[code] && cart.length === 0) {
        alert("Products need to be added to apply discount");
        return;
    }else {
        alert("Invalid discount code");
        return;
    }
});




