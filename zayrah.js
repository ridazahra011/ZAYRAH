// CART DATA STATE
let cart = [];

// DOM ELEMENTS
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCart');
const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountElem = document.getElementById('cartCount');
const cartHeaderCountElem = document.getElementById('cartHeaderCount');
const cartTotalElem = document.getElementById('cartTotal');

// CHECKOUT MODAL ELEMENTS
const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const modalTotalPay = document.getElementById('modalTotalPay');
const toastNotification = document.getElementById('toast');

// TOGGLE CART DRAWER
function openCart() {
    cartPanel.classList.add('active');
    overlay.style.display = 'block';
}

function closeCart() {
    cartPanel.classList.remove('active');
    overlay.style.display = 'none';
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (overlay) overlay.addEventListener('click', closeCart);

// ADD TO CART FUNCTIONALITY
const addToCartBtns = document.querySelectorAll('.add-cart');
addToCartBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        const productName = e.target.getAttribute('data-product');
        const productPrice = parseInt(e.target.getAttribute('data-price'));
        
        // Find image src from the parent product card
        const card = e.target.closest('.product-card');
        const imageSrc = card.querySelector('img').getAttribute('src');

        // Check if product already exists in cart
        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                image: imageSrc,
                quantity: 1
            });
        }

        updateCartUI();
        openCart();
    });
});

// UPDATE CART UI & CALCULATE TOTAL
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let totalAmount = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your shopping bag is currently empty.</p>';
    } else {
        cart.forEach((item, index) => {
            totalAmount += item.price * item.quantity;
            totalItems += item.quantity;

            const itemElem = document.createElement('div');
            itemElem.classList.add('cart-item');
            itemElem.style.cssText = 'display: flex; gap: 15px; margin-bottom: 20px; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px;';
            
            itemElem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 80px; object-fit: cover;">
                <div style="flex-grow: 1;">
                    <h4 style="font-size: 14px; margin-bottom: 5px;">${item.name}</h4>
                    <p style="font-size: 12px; color: #64748b;">PKR ${item.price.toLocaleString()} x ${item.quantity}</p>
                </div>
                <button onclick="removeCartItem(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px;">✕</button>
            `;
            cartItemsContainer.appendChild(itemElem);
        });
    }

    // Update Counts & Totals
    cartCountElem.textContent = totalItems;
    cartHeaderCountElem.textContent = totalItems;
    cartTotalElem.textContent = `PKR ${totalAmount.toLocaleString()}`;
    if (modalTotalPay) modalTotalPay.textContent = `PKR ${totalAmount.toLocaleString()}`;
}

// REMOVE ITEM FROM CART
window.removeCartItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

// CONNECT PROCEED TO CHECKOUT BUTTON
if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your bag is empty! Please add products before proceeding to checkout.');
            return;
        }
        
        // Close Cart Drawer & Overlay
        closeCart();

        // Open Checkout Modal
        checkoutModal.style.display = 'flex';
    });
}

// CLOSE CHECKOUT MODAL
if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });
}

// SUBMIT ORDER FORM
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide Modal
        checkoutModal.style.display = 'none';

        // Clear Cart
        cart = [];
        updateCartUI();

        // Show Success Toast Notification
        if (toastNotification) {
            toastNotification.style.display = 'block';
            setTimeout(() => {
                toastNotification.style.display = 'none';
            }, 4000);
        } else {
            alert('Thank you! Your order has been placed successfully.');
        }

        // Reset Form Fields
        checkoutForm.reset();
    });
}

// CATEGORY FILTERING LOGIC
const filterBtns = document.querySelectorAll('.category-filters button');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.getAttribute('data-category');

        productCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// QUICK CATEGORY FILTER VIA NAVBAR LINKS
window.filterCategory = function(catName) {
    const targetBtn = document.querySelector(`.category-filters button[data-category="${catName}"]`);
    if (targetBtn) targetBtn.click();
};