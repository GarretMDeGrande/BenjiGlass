// Header Scroll
let header = document.querySelector("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("shadow", window.scrollY > 0);
});

// Products Array
const products = [
  {
    id: 9,
    buy: "https://buy.stripe.com/14k4h13OTaAQgUw002",
    description: "beads1.html",
    title: "Autumn Hoodie",
    price: 264.9,
    tax: .10,
    standard: 10.0,
    express: 15.0,
    image: "images/beads1.jpg",
  },
  {
    id: 10,
    buy: "https://buy.stripe.com/14k4h13OTaAQgUw002",
    description: "beads1.html",
    title: "FUSION HOODIE",
    price: 295,
    tax: .10,
    standard: 10.0,
    express: 15.0,
    image: "images/beads2.jpg",
  },
  {
    id: 11,
    buy: "https://buy.stripe.com/14k4h13OTaAQgUw002",
    description: "beads1.html",
    title: "Chestnut Brown",
    price: 74.9,
    tax: .10,
    standard: 10.0,
    express: 15.0,
    image: "https://pangaia.com/cdn/shop/products/Recycled-Cashmere-Core-Hoodie-Chestnut-Brown-Male-1.jpg?v=1663947464&width=1426",
  },
  {
    id: 12,
    buy: "https://buy.stripe.com/14k4h13OTaAQgUw002",
    description: "beads1.html",
    title: "Nike Sportswear",
    price: 80,
    tax: .10,
    standard: 10.0,
    express: 15.0,
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/sportswear-club-mens-french-terry-crew-neck-sweatshirt-tdFDRc.png",
  },
];

// Get the products list and elements
const productList = document.getElementById("productList");
const cartItemsElement = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");

// Store Cart Items In Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render Products On Page
function renderProducts() {
  productList.innerHTML = products
    .map(
      (product) => `
        <div class="product">
          <a href="${product.description}">
            <img src="${product.image}" alt="${product.title}" class="product-img" />
          </a>
          <div class="product-info">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <a class="add-to-cart" data-id="${product.id}">Add to cart</a>
            <a href="${product.buy}" class="add-to-cart1" data-id="${product.buy}">Buy Now</a>
          </div>
        </div>
      `
    )
    .join("");
   // Add to cart
  const addToCartButtons = document.getElementsByClassName("add-to-cart");
  for (let i = 0; i < addToCartButtons.length; i++) {
    const addToCartButton = addToCartButtons[i];
    addToCartButton.addEventListener("click", addToCart);
  }
}

// Add to cart
function addToCart(event) {
  const productID = parseInt(event.target.dataset.id);
  const product = products.find((product) => product.id === productID);

  if (product) {
    const existingItem = cart.find((item) => item.id === productID);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        tax: product.tax,
        standard: product.standard,
        express: product.express,
        image: product.image,
        quantity: 1,
        selectedShipping: 'standard'  // Default to standard shipping
      };
      cart.push(cartItem);
    }
    event.target.textContent = "Added";
    updateCartIcon();
    saveToLocalStorage();
    renderCartItems();
    calculateCartTotlal();
  }
}

// Remove from cart
function removeFromCart(event) {
  const productID = parseInt(event.target.dataset.id);
  cart = cart.filter((item) => item.id !== productID);
  saveToLocalStorage();
  renderCartItems();
  calculateCartTotlal();
  updateCartIcon();
}
// Quantity Change
function changeQuantity(event) {
  const productID = parseInt(event.target.dataset.id);
  const quantity = parseInt(event.target.value);

  if (quantity > 0) {
    const cartItem = cart.find((item) => item.id === productID);
    if (cartItem) {
      cartItem.quantity = quantity;
      saveToLocalStorage();
      calculateCartTotlal();
      updateCartIcon();
    }
  }
}
// SaveToLocalStorage
function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render Cart Items
function renderCartItems() {
  cartItemsElement.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}" />
          <div class="cart-item-info">
            <h2 class="cart-item-title">${item.title}</h2>
            <input
              class="cart-item-quantity"
              type="number"
              min="1"
              value="${item.quantity}"
              data-id="${item.id}"
            />
            <p>Shipping Method</p>
            <select class="cart-item-shipping" data-id="${item.id}">
              <option value="standard">Standard 5-7 Business Days ($${item.standard.toFixed(2)})</option>
             <option value="express">Express 2-5 Business Days ($${item.express.toFixed(2)})</option>
            </select>
          </div>
          <h2 class="cart-item-price">$${item.price.toFixed(2)}</h2>
          <button class="remove-from-cart" data-id="${item.id}">Remove</button>
        </div>
      `
    )
    .join("");
  document.querySelectorAll(".cart-item-shipping").forEach(select => {
    select.addEventListener('change', handleShippingChange);
  });
   // Remove From Cart
  const removeButtons = document.getElementsByClassName("remove-from-cart");
  for (let i = 0; i < removeButtons.length; i++) {
    const removeButton = removeButtons[i];
    removeButton.addEventListener("click", removeFromCart);
  }
  // Quantity Change
  const quantityInputs = document.querySelectorAll(".cart-item-quantity");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", changeQuantity);
  });
}

// Calculate Cart Total
function calculateCartTotlal() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalTax = cart.reduce((sum, item) => sum + item.price * item.tax * item.quantity, 0);
  const totalShipping = cart.reduce((sum, item) => sum + (item.selectedShipping === 'express' ? item.express : item.standard) * item.quantity, 0);
  const total = subtotal + totalTax + totalShipping;

  const subtotalFormatted = `$${subtotal.toFixed(2)}`;
  const totalTaxFormatted = `$${totalTax.toFixed(2)}`;
  const totalShippingFormatted = `$${totalShipping.toFixed(2)}`;
  const totalFormatted = `$${total.toFixed(2)}`;

  const cartTotalText = `SubTotal: ${subtotalFormatted}\nTaxAmount: ${totalTaxFormatted}\nShipping: ${totalShippingFormatted}\nTotal: ${totalFormatted}`;
  cartTotalElement.textContent = cartTotalText;
}

function handleShippingChange(event) {
  const productID = parseInt(event.target.dataset.id);
  const selectedShipping = event.target.value;
  const cartItem = cart.find((item) => item.id === productID);
  if (cartItem) {
    cartItem.selectedShipping = selectedShipping;
    saveToLocalStorage();
    calculateCartTotlal();
  }
}

// Check If On Cart Page
if (window.location.pathname.includes("cart.html")) {
  renderCartItems();
  calculateCartTotlal();
} else if (window.location.pathname.includes("success.html")) {
  clearCart();
} else {
  renderProducts();
}

// Empty Cart on successfull payment
function clearCart() {
  cart = [];
  saveToLocalStorage();
  updateCartIcon();
}

// Cart Icon Quantity
const cartIcon = document.getElementById("cart-icon");

function updateCartIcon() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartIcon = document.getElementById("cart-icon");
  if (cartIcon) {
    cartIcon.setAttribute("data-quantity", totalQuantity);
  }
}

updateCartIcon();

function updateCartIconOnCartChange() {
  updateCartIcon();
}

window.addEventListener("storage", updateCartIconOnCartChange);


function clearCart() {
  cart = [];
  saveToLocalStorage();
  updateCartIcon();
}

// Initial rendering and calculation
renderProducts();
renderCartItems();
calculateCartTotlal();

