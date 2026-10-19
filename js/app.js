/**
 * SEVEN SCRUBS — STORE CONTROLLER (Mobile-First)
 * Conception épurée, ultra-rapide et optimisée smartphone
 */

const SEVEN_STORE = (() => {
  const WHATSAPP_PHONE = '212698040572'; // +212 6.98.04.05.72
  const STORE_CURRENCY = 'DH';

  // Products Data with the user's authentic cutouts
  const products = {
    women: {
      id: 'seven-women',
      name: 'Pyjama de Bloc Femme — Vert Olive & Orange',
      gender: 'Femme',
      tag: 'Vert Olive & Orange',
      price: 590,
      oldPrice: 790,
      selectedSize: 'M',
      selectedImage: './images/women/model-front.png',
      images: [
        { label: 'Porté Face', src: './images/women/model-front.png' },
        { label: 'Porté Dos', src: './images/women/model-back.png' },
        { label: 'Ensemble Face', src: './images/women/scrub-front.png' },
        { label: 'Ensemble Dos', src: './images/women/scrub-back.png' },
        { label: 'Vue Profil', src: './images/women/scrub-side.png' }
      ]
    },
    men: {
      id: 'seven-men',
      name: 'Pyjama de Bloc Homme — Noir & Blanc',
      gender: 'Homme',
      tag: 'Noir & Blanc',
      price: 590,
      oldPrice: 790,
      selectedSize: 'L',
      selectedImage: './images/men/model-front.png',
      images: [
        { label: 'Porté Face', src: './images/men/model-front.png' },
        { label: 'Porté Dos', src: './images/men/model-back.png' },
        { label: 'Ensemble Face', src: './images/men/scrub-front.png' },
        { label: 'Ensemble Dos', src: './images/men/scrub-back.png' },
        { label: 'Lifestyle Maroc', src: './images/men/model-lifestyle.jpg' }
      ]
    }
  };

  let cart = [];
  try {
    const saved = localStorage.getItem('seven_cart_v2');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  // Active filter: 'all', 'women', 'men'
  let currentFilter = 'all';

  function init() {
    setupFilterNav();
    setupGallerySwitchers();
    setupSizePills();
    setupCartDrawer();
    setupModals();
    setupStickyBottomBar();
    renderCart();
  }

  // Sticky bottom bar on mobile
  function setupStickyBottomBar() {
    const stickyBar = document.getElementById('mobileStickyBar');
    if (!stickyBar) return;

    window.addEventListener('scroll', () => {
      // Show when scrolled past hero (approx 350px)
      if (window.scrollY > 300) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }, { passive: true });
  }

  // Filter tabs (Tous / Femme / Homme)
  function setupFilterNav() {
    const pills = document.querySelectorAll('.category-pill');
    const cards = document.querySelectorAll('.product-mobile-card');

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        currentFilter = filter;

        cards.forEach(card => {
          if (filter === 'all' || card.dataset.gender === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });

        // Update sticky bar product reference if specific
        updateStickyBarAction();
      });
    });
  }

  function updateStickyBarAction() {
    const stickyBtn = document.getElementById('stickyWhatsAppBtn');
    if (!stickyBtn) return;

    if (currentFilter === 'women') {
      stickyBtn.onclick = () => orderWhatsApp('women');
      stickyBtn.innerHTML = `<span>💬 Commander Femme (Olive & Orange) • 590 DH</span>`;
    } else if (currentFilter === 'men') {
      stickyBtn.onclick = () => orderWhatsApp('men');
      stickyBtn.innerHTML = `<span>💬 Commander Homme (Noir & Blanc) • 590 DH</span>`;
    } else {
      stickyBtn.onclick = () => {
        // Scroll to boutique or open WhatsApp
        const boutique = document.getElementById('catalogue');
        if (boutique) {
          boutique.scrollIntoView({ behavior: 'smooth' });
        } else {
          openWhatsAppGeneral();
        }
      };
      stickyBtn.innerHTML = `<span>💬 Commander sur WhatsApp • 590 DH</span>`;
    }
  }

  // Gallery image switchers
  function setupGallerySwitchers() {
    ['women', 'men'].forEach(key => {
      const thumbs = document.querySelectorAll(`.thumb-btn[data-product="${key}"]`);
      const mainImg = document.getElementById(`mainImg-${key}`);

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');

          const newSrc = thumb.dataset.src;
          if (mainImg && newSrc) {
            mainImg.style.opacity = '0.3';
            setTimeout(() => {
              mainImg.src = newSrc;
              mainImg.style.opacity = '1';
              products[key].selectedImage = newSrc;
            }, 120);
          }
        });
      });
    });
  }

  // Size pills
  function setupSizePills() {
    ['women', 'men'].forEach(key => {
      const sizeBtns = document.querySelectorAll(`.size-pill[data-product="${key}"]`);
      sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          sizeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const size = btn.dataset.size;
          products[key].selectedSize = size;
          showToast(`Taille ${size} sélectionnée (${products[key].gender})`);
        });
      });
    });
  }

  // Direct WhatsApp order for 1 product
  function orderWhatsApp(key) {
    const prod = products[key];
    if (!prod) return;

    const message = `Bonjour SEVEN, je souhaite commander :
- Modèle : ${prod.name}
- Couleurs : ${prod.tag}
- Taille : ${prod.selectedSize}
- Quantité : 1
- Prix : ${prod.price} ${STORE_CURRENCY}
- Mode : Paiement à la livraison au Maroc

Merci de me confirmer la commande et la livraison !`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // Add to cart
  function addToCart(key) {
    const prod = products[key];
    if (!prod) return;

    const existingIndex = cart.findIndex(
      item => item.id === prod.id && item.size === prod.selectedSize
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        id: prod.id,
        name: prod.name,
        gender: prod.gender,
        tag: prod.tag,
        size: prod.selectedSize,
        price: prod.price,
        image: prod.selectedImage || prod.images[0].src,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    openCart();
    showToast(`✓ ${prod.name} (${prod.selectedSize}) ajouté au panier !`);
  }

  function updateQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    renderCart();
  }

  function removeFromCart(index) {
    if (!cart[index]) return;
    const name = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    renderCart();
    showToast(`${name} retiré`);
  }

  function saveCart() {
    try {
      localStorage.setItem('seven_cart_v2', JSON.stringify(cart));
    } catch (e) {}
  }

  function renderCart() {
    const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);
    const totalPrice = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

    document.querySelectorAll('.cart-counter').forEach(el => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });

    const totalEl = document.getElementById('cartTotalDisplay');
    if (totalEl) totalEl.textContent = `${totalPrice} ${STORE_CURRENCY}`;

    const listEl = document.getElementById('cartItemsList');
    if (!listEl) return;

    if (cart.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
          <div style="font-size:2.5rem; margin-bottom:0.75rem;">🛍️</div>
          <p style="font-weight:700; color:#fff; margin-bottom:0.25rem;">Votre panier est vide</p>
          <p style="font-size:0.85rem;">Sélectionnez votre tenue et commandez sur WhatsApp.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = cart.map((item, idx) => `
      <div class="cart-row">
        <div class="cart-row-thumb">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-row-info">
          <div class="cart-row-title">${item.name}</div>
          <div class="cart-row-sub">Taille : <strong>${item.size}</strong> • ${item.tag}</div>
          <div class="cart-row-bottom">
            <span class="cart-row-price">${item.price * item.qty} ${STORE_CURRENCY}</span>
            <div class="cart-qty-ctrl">
              <button onclick="SEVEN_STORE.updateQty(${idx}, -1)">-</button>
              <span>${item.qty}</span>
              <button onclick="SEVEN_STORE.updateQty(${idx}, 1)">+</button>
            </div>
          </div>
        </div>
        <button class="cart-del-btn" onclick="SEVEN_STORE.removeFromCart(${idx})" title="Supprimer">✕</button>
      </div>
    `).join('');
  }

  // Cart Drawer
  function setupCartDrawer() {
    document.querySelectorAll('.open-cart-btn').forEach(b => b.addEventListener('click', openCart));
    document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'cartOverlay') closeCart();
    });
  }

  function openCart() {
    document.getElementById('cartOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    document.getElementById('cartOverlay')?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function orderCartWhatsApp() {
    if (cart.length === 0) {
      showToast('Votre panier est vide !');
      return;
    }

    const totalPrice = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
    const items = cart.map(i => `• ${i.name} (Taille ${i.size}) x${i.qty} = ${i.price * i.qty} DH`).join('\n');

    const message = `Bonjour SEVEN, je valide ma commande :

${items}

💰 Total : ${totalPrice} ${STORE_CURRENCY}
📦 Paiement : À la livraison

Mes coordonnées de livraison :
- Nom : 
- Téléphone : 
- Ville : 
- Adresse / Clinique : `;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // General WhatsApp
  function openWhatsAppGeneral() {
    const message = `Bonjour SEVEN, j'aimerais avoir des informations sur vos pyjamas de bloc (tailles, finitions, commande).`;
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // Sizing Modal
  function setupModals() {
    document.querySelectorAll('.open-sizes-modal').forEach(b => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('sizesModal')?.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    document.querySelectorAll('.close-modal-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.app-modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
      });
    });

    document.querySelectorAll('.app-modal').forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) {
          m.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('mobileToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  return {
    init,
    orderWhatsApp,
    orderCartWhatsApp,
    openWhatsAppGeneral,
    addToCart,
    updateQty,
    removeFromCart,
    openCart,
    closeCart,
    showToast
  };
})();

document.addEventListener('DOMContentLoaded', SEVEN_STORE.init);
