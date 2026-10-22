/**
 * SEVEN 7 — LUXURY APPAREL STORE CONTROLLER
 * Minimalist luxury mobile-first e-commerce
 */

const SEVEN_STORE = (() => {
  const WHATSAPP_PHONE = '212698040572'; // +212 6.98.04.05.72
  const STORE_CURRENCY = 'DH';

  // Products catalog
  const products = {
    women: {
      id: 'seven-women',
      name: 'Pyjama de Bloc Seven 7 — Femme',
      titleShort: 'Pyjama de Bloc Seven 7',
      subtitle: 'Vert Olive Chirurgical & Cordons Orange',
      tag: 'Vert Olive & Orange',
      price: 590,
      oldPrice: 790,
      badge: 'Édition Chirurgicale • Vert Olive & Orange',
      category: 'FEMME',
      availableSizes: ['S', 'M', 'L'],
      sizeLabels: { S: 'S', M: 'M', L: 'L' },
      selectedSize: 'M',
      selectedImageIndex: 0,
      images: [
        { label: '01 / Face', price: '590 DH', src: './images/women/scrub-front-cutout.png' },
        { label: '02 / Porté', price: '590 DH', src: './images/women/model-front-cutout.png' },
        { label: '03 / Dos', price: '590 DH', src: './images/women/scrub-back-cutout.png' },
        { label: '04 / Profil', price: '590 DH', src: './images/women/scrub-side-cutout.png' }
      ]
    },
    men: {
      id: 'seven-men',
      name: 'Pyjama de Bloc Seven 7 — Homme',
      titleShort: 'Pyjama de Bloc Seven 7',
      subtitle: 'Noir Onyx Profond & Cordons Blanc Craie',
      tag: 'Noir & Blanc',
      price: 590,
      oldPrice: 790,
      badge: 'Édition Chirurgicale • Noir & Blanc',
      category: 'HOMME',
      availableSizes: ['M'],
      sizeLabels: { M: 'M standard' },
      selectedSize: 'M',
      selectedImageIndex: 0,
      images: [
        { label: '01 / Face', price: '590 DH', src: './images/men/scrub-front-cutout.png' },
        { label: '02 / Dos', price: '590 DH', src: './images/men/scrub-back-cutout.png' },
        { label: '03 / Profil', price: '590 DH', src: './images/men/scrub-side-cutout.png' },
        { label: '04 / Porté', price: '590 DH', src: './images/men/model-front-cutout.png' }
      ]
    }
  };

  let activeGender = 'women'; // Default active model

  let cart = [];
  try {
    const saved = localStorage.getItem('seven_cart_luxury');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  function init() {
    setupModelSwitchers();
    setupSizeCapsules();
    setupDrawersAndModals();
    setupIntroScreen();
    renderCurrentProduct(true);
    renderCart();
  }

  /**
   * Switch between Femme (women) and Homme (men)
   */
  function switchModel(gender) {
    if (!products[gender] || gender === activeGender) return;
    activeGender = gender;
    renderCurrentProduct(false);
  }

  /**
   * Render active model product details & left rail thumbnails
   */
  function renderCurrentProduct(immediate) {
    const prod = products[activeGender];
    if (!prod) return;

    // Update Text Elements
    const titleEl = document.getElementById('productTitle');
    const subEl = document.getElementById('productSubtitle');
    const badgeEl = document.getElementById('garmentBadgeText');
    const catTagEl = document.getElementById('railCategoryTag');
    const orderBtnLabel = document.getElementById('orderBtnLabel');

    if (titleEl) titleEl.textContent = prod.titleShort;
    if (subEl) subEl.textContent = prod.subtitle;
    if (badgeEl) badgeEl.textContent = prod.badge;
    if (catTagEl) catTagEl.textContent = prod.category;
    if (orderBtnLabel) orderBtnLabel.textContent = `COMMANDER • ${prod.price} ${STORE_CURRENCY}`;

    // Update Swatches & Avatars Active State
    document.querySelectorAll('.swatch-circle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === activeGender);
    });

    document.querySelectorAll('.avatar-badge-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === activeGender);
    });

    document.querySelectorAll('.drawer-model-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === activeGender);
    });

    // Update Size Selection
    renderSizeCapsules(prod);

    // Render Left Thumbnails Stack
    renderRailThumbnails(prod);

    // Update Main Floating Garment Image
    const activeImageSrc = prod.images[prod.selectedImageIndex]?.src || prod.images[0].src;
    const floatingImg = document.getElementById('mainFloatingImg');
    if (floatingImg) {
      if (immediate) {
        floatingImg.src = activeImageSrc;
      } else {
        floatingImg.style.opacity = '0.2';
        floatingImg.style.transform = 'translateY(10px) scale(0.96)';
        setTimeout(() => {
          floatingImg.src = activeImageSrc;
          floatingImg.style.opacity = '1';
          floatingImg.style.transform = 'translateY(0px) scale(1)';
        }, 160);
      }
    }
  }

  /**
   * Populate Left Rail Thumbnails
   */
  function renderRailThumbnails(prod) {
    const stack = document.getElementById('railThumbsStack');
    if (!stack) return;

    stack.innerHTML = prod.images.map((img, index) => {
      const isActive = index === prod.selectedImageIndex;
      return `
        <button 
          class="rail-thumb-item ${isActive ? 'active' : ''}" 
          data-index="${index}"
          role="tab"
          aria-selected="${isActive ? 'true' : 'false'}"
          title="${img.label}"
        >
          <img class="rail-thumb-img" src="${img.src}" alt="${img.label}">
          <span class="rail-thumb-price">${img.price}</span>
        </button>
      `;
    }).join('');

    // Attach click events
    stack.querySelectorAll('.rail-thumb-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        selectThumbnailImage(idx);
      });
    });
  }

  /**
   * Change Active Thumbnail in the Left Rail
   */
  function selectThumbnailImage(index) {
    const prod = products[activeGender];
    if (!prod || !prod.images[index]) return;

    prod.selectedImageIndex = index;

    // Update active class on thumbnails
    document.querySelectorAll('.rail-thumb-item').forEach(btn => {
      const isAct = parseInt(btn.dataset.index, 10) === index;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });

    // Animate Main Floating Garment Image
    const floatingImg = document.getElementById('mainFloatingImg');
    if (floatingImg) {
      floatingImg.style.opacity = '0.2';
      floatingImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        floatingImg.src = prod.images[index].src;
        floatingImg.style.opacity = '1';
        floatingImg.style.transform = 'scale(1)';
      }, 140);
    }
  }

  /**
   * Setup Listeners for Gender / Model Switching
   */
  function setupModelSwitchers() {
    // Bottom Two Circle Swatches
    document.querySelectorAll('.swatch-circle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchModel(btn.dataset.gender);
      });
    });

    // Header Avatars
    document.querySelectorAll('.avatar-badge-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchModel(btn.dataset.gender);
      });
    });

    // Drawer Menu Model Options
    document.querySelectorAll('.drawer-model-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        switchModel(btn.dataset.gender);
        closeMenu();
      });
    });

    // Back button in header: returns to intro screen
    document.getElementById('headerBackBtn')?.addEventListener('click', () => {
      showIntro();
    });
  }

  /**
   * Get formatted size label for active product
   */
  function getSizeDisplay(prod) {
    return prod.sizeLabels?.[prod.selectedSize] || prod.selectedSize;
  }

  /**
   * Render dynamic size capsules for active product
   */
  function renderSizeCapsules(prod) {
    const container = document.getElementById('sizeCapsulesGroup');
    if (!container) return;

    if (!prod.availableSizes.includes(prod.selectedSize)) {
      prod.selectedSize = prod.availableSizes[0];
    }

    container.innerHTML = prod.availableSizes.map(size => {
      const isSelected = size === prod.selectedSize;
      const label = prod.sizeLabels?.[size] || size;
      return `
        <button 
          class="size-capsule ${isSelected ? 'active' : ''}" 
          data-size="${size}" 
          role="radio" 
          aria-checked="${isSelected ? 'true' : 'false'}"
        >
          ${label}
        </button>
      `;
    }).join('');

    container.querySelectorAll('.size-capsule').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.size;
        prod.selectedSize = size;
        container.querySelectorAll('.size-capsule').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        showToast(`Taille ${getSizeDisplay(prod)} sélectionnée`);
      });
    });
  }

  /**
   * Setup Size Capsules
   */
  function setupSizeCapsules() {
    renderSizeCapsules(products[activeGender]);
  }

  /**
   * Direct WhatsApp Order for Active Product
   */
  function orderActiveWhatsApp() {
    const prod = products[activeGender];
    if (!prod) return;

    const sizeDisplay = getSizeDisplay(prod);
    const message = `Bonjour SEVEN, je souhaite commander :
•  Modèle : ${prod.name}
•  Couleurs : ${prod.tag}
•  Taille : ${sizeDisplay}
•  Quantité : 1
•  Prix : ${prod.price} ${STORE_CURRENCY}
•  Mode : Paiement à la livraison au Maroc

Merci de me confirmer la commande et le délai de livraison !`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  /**
   * Add Active Product to Cart
   */
  function addActiveToCart() {
    const prod = products[activeGender];
    if (!prod) return;

    const currentImg = prod.images[prod.selectedImageIndex]?.src || prod.images[0].src;
    const sizeDisplay = getSizeDisplay(prod);

    const existingIndex = cart.findIndex(
      item => item.id === prod.id && item.size === sizeDisplay
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        id: prod.id,
        name: prod.name,
        tag: prod.tag,
        size: sizeDisplay,
        price: prod.price,
        image: currentImg,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    openCart();
    showToast(`✓ ${prod.titleShort} (${sizeDisplay}) ajouté au panier !`);
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
      localStorage.setItem('seven_cart_luxury', JSON.stringify(cart));
    } catch (e) {}
  }

  function renderCart() {
    const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);
    const totalPrice = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

    const badge = document.getElementById('cartCountBadge');
    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }

    const totalEl = document.getElementById('cartTotalDisplay');
    if (totalEl) totalEl.textContent = `${totalPrice} ${STORE_CURRENCY}`;

    const listEl = document.getElementById('cartItemsList');
    if (!listEl) return;

    if (cart.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted);">
          <div style="font-size:2.2rem; margin-bottom:0.5rem;">🛍️</div>
          <p style="font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">Votre panier est vide</p>
          <p style="font-size:0.75rem;">Ajoutez votre pyjama de bloc pour commander sur WhatsApp.</p>
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
              <button onclick="SEVEN_STORE.updateQty(${idx}, -1)" aria-label="Moins">-</button>
              <span>${item.qty}</span>
              <button onclick="SEVEN_STORE.updateQty(${idx}, 1)" aria-label="Plus">+</button>
            </div>
          </div>
        </div>
        <button class="cart-del-btn" onclick="SEVEN_STORE.removeFromCart(${idx})" title="Supprimer">✕</button>
      </div>
    `).join('');
  }

  function orderCartWhatsApp() {
    if (cart.length === 0) {
      showToast('Votre panier est vide !');
      return;
    }

    const totalPrice = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

    let message = '';
    if (cart.length === 1) {
      const item = cart[0];
      message = `Bonjour SEVEN, je souhaite commander :
•  Modèle : ${item.name}
•  Couleurs : ${item.tag}
•  Taille : ${item.size}
•  Quantité : ${item.qty}
•  Prix : ${item.price * item.qty} ${STORE_CURRENCY}
•  Mode : Paiement à la livraison au Maroc

Merci de me confirmer la commande et le délai de livraison !`;
    } else {
      const itemsList = cart.map(i => 
        `•  Modèle : ${i.name}\n   Couleurs : ${i.tag}\n   Taille : ${i.size}\n   Quantité : ${i.qty}\n   Prix : ${i.price * i.qty} ${STORE_CURRENCY}`
      ).join('\n\n');

      message = `Bonjour SEVEN, je souhaite commander :

${itemsList}

•  Total : ${totalPrice} ${STORE_CURRENCY}
•  Mode : Paiement à la livraison au Maroc

Merci de me confirmer la commande et le délai de livraison !`;
    }

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  /**
   * Drawers and Modals Setup
   */
  function setupDrawersAndModals() {
    // Menu Drawer
    const openMenuBtn = document.getElementById('openMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuOverlay = document.getElementById('menuDrawerOverlay');

    openMenuBtn?.addEventListener('click', openMenu);
    closeMenuBtn?.addEventListener('click', closeMenu);
    menuOverlay?.addEventListener('click', (e) => {
      if (e.target === menuOverlay) closeMenu();
    });

    // Cart Drawer
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
      btn.addEventListener('click', openCart);
    });
    document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
    const cartOverlay = document.getElementById('cartOverlay');
    cartOverlay?.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });

    // Size Guide Modal
    document.querySelectorAll('.open-sizes-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSizeModal();
      });
    });
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', closeSizeModal);
    });
    const sizesModal = document.getElementById('sizesModal');
    sizesModal?.addEventListener('click', (e) => {
      if (e.target === sizesModal) closeSizeModal();
    });

    // Replay intro from menu
    document.getElementById('replayIntroBtn')?.addEventListener('click', () => {
      closeMenu();
      showIntro();
    });
  }

  function openMenu() {
    document.getElementById('menuDrawerOverlay')?.classList.add('active');
  }

  function closeMenu() {
    document.getElementById('menuDrawerOverlay')?.classList.remove('active');
  }

  function openCart() {
    document.getElementById('cartOverlay')?.classList.add('active');
  }

  function closeCart() {
    document.getElementById('cartOverlay')?.classList.remove('active');
  }

  function openSizeModal() {
    document.getElementById('sizesModal')?.classList.add('active');
  }

  function closeSizeModal() {
    document.getElementById('sizesModal')?.classList.remove('active');
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

  /* ================= INTRO SCREEN CONTROLLER ================= */
  let introTimer = null;

  function setupIntroScreen() {
    const overlay = document.getElementById('introScreenOverlay');
    if (!overlay) return;

    // Check if user has URL param to skip intro (?skipIntro=1)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('skipIntro')) {
      overlay.classList.add('intro-hidden');
      return;
    }

    const bar = document.getElementById('introProgressBar');
    const enterBtn = document.getElementById('introEnterBtn');
    const skipBtn = document.getElementById('introSkipBtn');

    // Trigger smooth progress bar fill
    if (bar) {
      setTimeout(() => {
        bar.classList.add('animate');
      }, 100);
    }

    // Auto-transition to main home page after 3.8s
    introTimer = setTimeout(() => {
      closeIntro();
    }, 3800);

    // Click on CTA button or Skip
    enterBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeIntro();
    });

    skipBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeIntro();
    });
  }

  function closeIntro() {
    if (introTimer) {
      clearTimeout(introTimer);
      introTimer = null;
    }
    const overlay = document.getElementById('introScreenOverlay');
    if (!overlay || overlay.classList.contains('intro-closing') || overlay.classList.contains('intro-hidden')) return;

    overlay.classList.add('intro-closing');
    setTimeout(() => {
      overlay.classList.add('intro-hidden');
      overlay.classList.remove('intro-closing');
    }, 650);
  }

  function showIntro() {
    const overlay = document.getElementById('introScreenOverlay');
    if (!overlay) return;

    overlay.classList.remove('intro-hidden', 'intro-closing');
    const bar = document.getElementById('introProgressBar');
    if (bar) {
      bar.classList.remove('animate');
      void bar.offsetWidth; // Force reflow
      bar.classList.add('animate');
    }

    if (introTimer) clearTimeout(introTimer);
    introTimer = setTimeout(() => {
      closeIntro();
    }, 4500);
  }

  return {
    init,
    switchModel,
    selectThumbnailImage,
    orderActiveWhatsApp,
    orderCartWhatsApp,
    addActiveToCart,
    updateQty,
    removeFromCart,
    openCart,
    closeCart,
    openMenu,
    closeMenu,
    showIntro,
    closeIntro,
    showToast
  };
})();

document.addEventListener('DOMContentLoaded', SEVEN_STORE.init);
