/**
 * SEVEN SCRUBS — STORE CONTROLLER
 * E-commerce pyjamas de bloc chirurgicaux
 * Gestion catalogue, sélecteur de taille, panier et checkout WhatsApp direct
 */

const SEVEN_STORE = (() => {
  // Constants
  const WHATSAPP_PHONE = '212698040572'; // +212 6.98.04.05.72
  const STORE_CURRENCY = 'DH';

  // Products Data
  const products = {
    women: {
      id: 'seven-women-olive',
      name: 'Pyjama de Bloc SEVEN 7 — Édition Olive & Orange',
      gender: 'Femme',
      colorName: 'Vert Olive / Émeraude Chirurgical',
      accentColor: 'Orange Électrique (Cordons)',
      price: 590,
      oldPrice: 790,
      defaultSize: 'M',
      selectedSize: 'M',
      badge: 'Bestseller Bloc',
      images: [
        { label: 'Porté Face', src: './images/women/model-front.png' },
        { label: 'Porté Dos', src: './images/women/model-back.png' },
        { label: 'Ensemble Face', src: './images/women/scrub-front.png' },
        { label: 'Ensemble Dos', src: './images/women/scrub-back.png' },
        { label: 'Vue Profil', src: './images/women/scrub-side.png' }
      ]
    },
    men: {
      id: 'seven-men-black',
      name: 'Pyjama de Bloc SEVEN 7 — Édition Black & White',
      gender: 'Homme',
      colorName: 'Noir Onyx Profond',
      accentColor: 'Blanc Craie (Cordons & Broderie)',
      price: 590,
      oldPrice: 790,
      defaultSize: 'L',
      selectedSize: 'L',
      badge: 'Streetwear Bloc',
      images: [
        { label: 'Porté Complet', src: './images/men/model-clean.png' },
        { label: 'Ensemble Cargo', src: './images/men/scrub-set.png' },
        { label: 'Poche Poitrine', src: './images/men/detail-chest.png' },
        { label: 'Poche Cargo', src: './images/men/detail-cargo.png' },
        { label: 'Tissu Sergé', src: './images/men/detail-fabric.png' }
      ]
    }
  };

  // Cart State (Persisted in localStorage)
  let cart = [];
  try {
    const saved = localStorage.getItem('seven_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  // DOM Elements Cache
  const els = {
    header: document.querySelector('.site-header'),
    cartCount: document.querySelectorAll('.cart-count-badge'),
    cartDrawer: document.getElementById('cartDrawerOverlay'),
    cartItemsList: document.getElementById('cartItemsList'),
    cartTotalPrice: document.getElementById('cartTotalPrice'),
    sizeModal: document.getElementById('sizeModalOverlay'),
    orderModal: document.getElementById('orderModalOverlay'),
    toast: document.getElementById('toastNotice'),
    quickOrderForm: document.getElementById('quickOrderForm'),
    directOrderForm: document.getElementById('directOrderForm')
  };

  // Initialize
  function init() {
    setupScrollHeader();
    setupGalleryThumbnails();
    setupSizeSelectors();
    setupFilterTabs();
    setupCartEvents();
    setupModals();
    setupForms();
    renderCart();
  }

  // Header scroll shadow
  function setupScrollHeader() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        els.header?.classList.add('scrolled');
      } else {
        els.header?.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Multi-angle Gallery Thumbnails switcher
  function setupGalleryThumbnails() {
    document.querySelectorAll('.product-thumbs-strip').forEach(strip => {
      const targetMainId = strip.dataset.targetMain;
      const mainImg = document.getElementById(targetMainId);
      const thumbs = strip.querySelectorAll('.thumb-item');

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');

          const newSrc = thumb.dataset.imgSrc;
          if (mainImg && newSrc) {
            mainImg.style.opacity = '0.3';
            mainImg.style.transform = 'scale(0.96)';
            setTimeout(() => {
              mainImg.src = newSrc;
              mainImg.style.opacity = '1';
              mainImg.style.transform = 'scale(1)';
            }, 150);
          }
        });
      });
    });
  }

  // Size buttons selector
  function setupSizeSelectors() {
    document.querySelectorAll('.size-buttons-group').forEach(group => {
      const prodKey = group.dataset.product;
      const btns = group.querySelectorAll('.size-btn');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const size = btn.dataset.size;
          if (products[prodKey]) {
            products[prodKey].selectedSize = size;
            showToast(`Taille ${size} sélectionnée pour ${products[prodKey].gender}`);
          }
        });
      });
    });
  }

  // Category filter tabs
  function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.product-card');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Cart operations
  function addToCart(prodKey) {
    const prod = products[prodKey];
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
        color: prod.colorName,
        size: prod.selectedSize,
        price: prod.price,
        image: prod.images[0].src,
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
    const removedName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    renderCart();
    showToast(`${removedName} retiré du panier`);
  }

  function saveCart() {
    try {
      localStorage.setItem('seven_cart', JSON.stringify(cart));
    } catch (e) {}
  }

  function renderCart() {
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Update Badges
    els.cartCount.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    // Update Total Price
    if (els.cartTotalPrice) {
      els.cartTotalPrice.textContent = `${totalPrice} ${STORE_CURRENCY}`;
    }

    // Render Items
    if (!els.cartItemsList) return;

    if (cart.length === 0) {
      els.cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🛍️</div>
          <p style="font-weight:700; color:#fff; margin-bottom:0.5rem;">Votre panier est vide</p>
          <p style="font-size:0.85rem;">Sélectionnez votre tenue de bloc et commandez directement sur WhatsApp.</p>
        </div>
      `;
      return;
    }

    els.cartItemsList.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-specs">Taille : <strong>${item.size}</strong> | ${item.color}</div>
          <div class="cart-item-price-row">
            <span class="cart-item-price">${item.price * item.qty} ${STORE_CURRENCY}</span>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="SEVEN_STORE.updateQty(${index}, -1)" aria-label="Diminuer">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="SEVEN_STORE.updateQty(${index}, 1)" aria-label="Augmenter">+</button>
            </div>
          </div>
        </div>
        <button class="cart-item-delete" onclick="SEVEN_STORE.removeFromCart(${index})" title="Supprimer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    `).join('');
  }

  // Cart Drawer Events
  function setupCartEvents() {
    document.querySelectorAll('.cart-toggle-btn').forEach(btn => {
      btn.addEventListener('click', openCart);
    });

    const closeBtn = document.getElementById('cartCloseBtn');
    closeBtn?.addEventListener('click', closeCart);

    els.cartDrawer?.addEventListener('click', (e) => {
      if (e.target === els.cartDrawer) closeCart();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCart();
        closeModals();
      }
    });
  }

  function openCart() {
    els.cartDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    els.cartDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // WhatsApp Order Generator
  function orderSingleWhatsApp(prodKey) {
    const prod = products[prodKey];
    if (!prod) return;

    const message = `Bonjour SEVEN, je souhaite commander un pyjama de bloc :
- Produit : ${prod.name}
- Modèle : ${prod.gender} (${prod.colorName} / ${prod.accentColor})
- Taille souhaitée : ${prod.selectedSize}
- Quantité : 1
- Prix : ${prod.price} ${STORE_CURRENCY}

Merci de me confirmer la disponibilité et le délai de livraison !`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  function orderCartWhatsApp() {
    if (cart.length === 0) {
      showToast('Votre panier est vide. Veuillez ajouter un article.');
      return;
    }

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const itemsText = cart.map(item => 
      `• ${item.name} | Taille: ${item.size} | Qté: ${item.qty} (${item.price * item.qty} ${STORE_CURRENCY})`
    ).join('\n');

    const message = `Bonjour l'équipe SEVEN 7, je souhaite valider ma commande :

${itemsText}

💰 Total commande : ${totalPrice} ${STORE_CURRENCY}
📦 Mode de paiement : Paiement à la livraison (Cash on Delivery)

Mes coordonnées de livraison :
- Nom complet : 
- Ville : 
- Téléphone : 
- Adresse complète : 

Merci de m'indiquer le créneau d'expédition !`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // General WhatsApp Support Message
  function openGeneralWhatsApp() {
    const message = `Bonjour SEVEN, j'aimerais avoir des renseignements sur vos pyjamas de bloc chirurgicaux (tailles, finitions, commande).`;
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // Modals Setup
  function setupModals() {
    // Size guide triggers
    document.querySelectorAll('.open-size-guide').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        els.sizeModal?.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', closeModals);
    });

    [els.sizeModal, els.orderModal].forEach(overlay => {
      overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) closeModals();
      });
    });
  }

  function closeModals() {
    els.sizeModal?.classList.remove('open');
    els.orderModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Direct COD Order Modal
  function openDirectOrderModal() {
    if (cart.length === 0) {
      showToast('Votre panier est vide !');
      return;
    }
    closeCart();
    els.orderModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Forms setup
  function setupForms() {
    // Quick Interactive Order in Contact section
    els.quickOrderForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const model = document.getElementById('quickModelSelect')?.value;
      const size = document.getElementById('quickSizeSelect')?.value;
      const qty = document.getElementById('quickQtyInput')?.value || 1;
      const name = document.getElementById('quickNameInput')?.value || '';
      const city = document.getElementById('quickCityInput')?.value || '';

      const message = `Bonjour SEVEN, je passe une commande express :
- Modèle : ${model}
- Taille : ${size}
- Quantité : ${qty}
- Nom : ${name}
- Ville : ${city}
- Paiement : À la livraison

Merci de me recontacter pour valider l'envoi !`;

      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      showToast('Redirection vers WhatsApp...');
    });

    // Modal Express Checkout Form
    els.directOrderForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName')?.value;
      const phone = document.getElementById('modalPhone')?.value;
      const city = document.getElementById('modalCity')?.value;
      const address = document.getElementById('modalAddress')?.value;

      const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      const itemsText = cart.map(i => `${i.name} (Taille ${i.size}) x${i.qty}`).join(', ');

      const message = `Bonjour SEVEN, voici ma commande confirmée :
- Articles : ${itemsText}
- Total : ${totalPrice} ${STORE_CURRENCY}
- Client : ${name}
- Tél : ${phone}
- Ville : ${city}
- Adresse : ${address}
- Paiement : Cash à la livraison

Merci de valider l'expédition !`;

      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      closeModals();
      cart = [];
      saveCart();
      renderCart();
      showToast('✓ Commande envoyée avec succès sur WhatsApp !');
    });
  }

  // Toast feedback
  function showToast(text) {
    if (!els.toast) return;
    els.toast.textContent = text;
    els.toast.classList.add('show', 'toast-success');
    clearTimeout(els.toastTimeout);
    els.toastTimeout = setTimeout(() => {
      els.toast.classList.remove('show');
    }, 3200);
  }

  // Public API
  return {
    init,
    addToCart,
    updateQty,
    removeFromCart,
    orderSingleWhatsApp,
    orderCartWhatsApp,
    openGeneralWhatsApp,
    openDirectOrderModal,
    openCart,
    closeCart,
    showToast
  };
})();

document.addEventListener('DOMContentLoaded', SEVEN_STORE.init);
