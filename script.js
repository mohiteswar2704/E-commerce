
const cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
    if (!localStorage.getItem('loginUser')) {
        alert('Please login.');
        location.href = 'login.html';
        return;
    }
    cart.push({ name, price: Number(price) });
    saveCart();
    alert(name + ' added to cart');
}

function showCart() {
    const box = document.getElementById('cart-items');
    if (!box) return;
    box.innerHTML = '';
    let total = 0;
    cart.forEach((item, i) => {
        const p = Number(item.price) || 0;
        total += p;
        box.insertAdjacentHTML('beforeend', `<p>${item.name} - $${p.toFixed(2)} <button onclick="removeFromCart(${i})">Remove</button></p>`);
    });
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerText = 'Total: $' + total.toFixed(2);
}

function removeFromCart(i) {
    cart.splice(i, 1);
    saveCart();
    showCart();
}


function updateAddButtons() {
    const logged = !!localStorage.getItem('loginUser');
    const buttons = document.querySelectorAll('button[onclick*="addToCart"]');
    buttons.forEach(btn => {
        const orig = btn.dataset.origOnclick || btn.getAttribute('onclick');
        if (!logged) {
            if (!btn.dataset.origOnclick) btn.dataset.origOnclick = orig;
            btn.onclick = (e) => { e && e.preventDefault(); alert('Please login to add items to cart'); location.href = 'login.html'; };
            btn.innerText = 'Add to Cart';
        } else {
            if (btn.dataset.origOnclick) btn.setAttribute('onclick', btn.dataset.origOnclick);
            if (btn.dataset.origOnclick) delete btn.dataset.origOnclick;
            btn.innerText = 'Add to Cart';
        }
    });
}

function init() {
   
    const user = localStorage.getItem('loginUser');
    const ud = document.getElementById('user-display');
    const mainH2 = document.querySelector('.main h2');
    const loginBtn = document.getElementById('login-btn');
    if (user) {
        if (ud) ud.innerText = 'Welcome! ' + user;
        if (mainH2) mainH2.innerText = 'Welcome to MyShop! ' + user;
        if (loginBtn) { loginBtn.innerText = 'Logout'; loginBtn.onclick = () => { localStorage.removeItem('loginUser'); init(); }; }
    } else {
        if (ud) ud.innerText = '';
        if (mainH2) mainH2.innerText = 'Welcome to MyShop!';
        if (loginBtn) { loginBtn.innerText = 'Login'; loginBtn.onclick = () => location.href = 'login.html'; }
    }
    updateAddButtons();
    showCart();
    window.addEventListener('storage', (e) => { if (e.key === 'loginUser') init(); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();