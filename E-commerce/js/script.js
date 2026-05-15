const products = [
  {
    id: 1,
    name: "NovaBook Pro",
    category: "laptop",
    price: 89999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    description: "Ultra-slim performance laptop for creators and developers."
  },
  {
    id: 2,
    name: "ZenPhone X",
    category: "phone",
    price: 54999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    description: "Flagship smartphone with premium display and battery."
  },
  {
    id: 3,
    name: "Aura Buds",
    category: "audio",
    price: 4999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Wireless earbuds with deep bass and active noise cancelation."
  },
  {
    id: 4,
    name: "Pulse Watch",
    category: "watch",
    price: 9999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "Smartwatch with fitness tracking and AMOLED display."
  },
  {
    id: 5,
    name: "Cyber Mouse",
    category: "accessory",
    price: 2499,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    description: "Precision mouse built for gaming and productivity."
  },
  {
    id: 6,
    name: "Edge Keyboard",
    category: "accessory",
    price: 5999,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80",
    description: "Mechanical keyboard with RGB lighting and hotkeys."
  }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = cart.length;
}

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

function renderProducts(list, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = list.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="price-row">
        <span class="price">${formatPrice(p.price)}</span>
        <a class="small-btn" href="product.html?id=${p.id}">View</a>
      </div>
      <div class="card-actions">
        <button class="small-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

window.addToCart = function(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    cart.push(product);
    saveCart();
    alert(product.name + " added to cart!");
  }
};

function renderFeatured() {
  renderProducts(products.slice(0, 4), "featured-products");
}

function renderAllProducts() {
  const search = document.getElementById("search");
  const filter = document.getElementById("filter");
  const list = document.getElementById("product-list");

  if (!list) return;

  function apply() {
    let filtered = [...products];
    if (search && search.value.trim()) {
      const q = search.value.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filter && filter.value !== "all") {
      filtered = filtered.filter(p => p.category === filter.value);
    }
    renderProducts(filtered, "product-list");
  }

  if (search) search.addEventListener("input", apply);
  if (filter) filter.addEventListener("change", apply);
  apply();
}

function renderSingleProduct() {
  const box = document.getElementById("product-detail");
  if (!box) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const p = products.find(item => item.id === Number(id)) || products[0];

  box.innerHTML = `
    <div><img src="${p.image}" alt="${p.name}"></div>
    <div>
      <p class="tag">${p.category.toUpperCase()}</p>
      <h1>${p.name}</h1>
      <p style="color:var(--muted);margin:16px 0 20px;">${p.description}</p>
      <div class="price" style="font-size:1.8rem;margin-bottom:18px;">${formatPrice(p.price)}</div>
      <button class="btn btn-primary" onclick="addToCart(${p.id})">Add to Cart</button>
      <p style="margin-top:18px;color:var(--muted);">Premium build quality, fast shipping, and secure checkout.</p>
    </div>
  `;
}

function renderCart() {
  const box = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!box || !totalEl) return;

  if (!cart.length) {
    box.innerHTML = `<div class="cart-summary"><h3>Your cart is empty</h3></div>`;
    totalEl.textContent = "0";
    return;
  }

  let total = 0;
  box.innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <div class="cart-summary" style="margin-bottom:14px;">
        <div>
          <h3>${item.name}</h3>
          <p style="color:var(--muted);">${item.description}</p>
        </div>
        <div>
          <p>${formatPrice(item.price)}</p>
          <button class="small-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  totalEl.textContent = total.toLocaleString("en-IN");
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
};

function mobileMenu() {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  if (btn && menu) {
    btn.addEventListener("click", () => menu.classList.toggle("show"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  mobileMenu();
  renderFeatured();
  renderAllProducts();
  renderSingleProduct();
  renderCart();
});
