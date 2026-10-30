/**
 * SEVEN 7 SCRUBS — LUXURY APPAREL STORE CONTROLLER
 * Minimalist luxury smartphone lookbook & e-commerce
 * Price: 320 MAD
 */

const SEVEN_STORE = (() => {
  const WHATSAPP_PHONE = '212698040572'; // +212 6.98.04.05.72
  const STORE_CURRENCY = 'MAD';

  // Products catalog
  const products = {
    men: {
      id: 'seven-men',
      name: 'Pyjama de Bloc Seven 7 — Homme',
      titleShort: 'Pyjama de Bloc Seven 7',
      subtitle: 'Bleu Roi Électrique & Cordons Blancs',
      tag: 'Bleu Roi & Blanc',
      price: 320,
      badge: 'Édition Signature • Bleu Roi & Blanc',
      category: 'HOMME',
      availableSizes: ['S', 'M', 'L', 'XL'],
      sizeLabels: { S: 'S', M: 'M standard', L: 'L', XL: 'XL' },
      selectedSize: 'M',
      selectedImageIndex: 0,
      detailsSheet: './images/products/men-blue/details-sheet.png',
      images: [
        { label: '01 / Packshot', tag: 'Studio Packshot', price: '320 MAD', src: './images/products/men-blue/packshot-front.png' },
        { label: '02 / Porté Face', tag: 'Streetwear Face', price: '320 MAD', src: './images/products/men-blue/model-front.png' },
        { label: '03 / Profil 3/4', tag: 'Coupe & Col', price: '320 MAD', src: './images/products/men-blue/model-side.png' },
        { label: '04 / Vue Dos', tag: 'Dos & Poches Cargo', price: '320 MAD', src: './images/products/men-blue/model-back.png' },
        { label: '05 / Zooms HD', tag: 'Finitions Macro', price: '320 MAD', src: './images/products/men-blue/details-sheet.png' }
      ]
    },
    women: {
      id: 'seven-women',
      name: 'Pyjama de Bloc Seven 7 — Femme',
      titleShort: 'Pyjama de Bloc Seven 7',
      subtitle: 'Noir Onyx Profond & Rose Vif',
      tag: 'Noir & Rose Vif',
      price: 320,
      badge: 'Édition Spéciale • Noir & Rose Vif',
      category: 'FEMME',
      availableSizes: ['S', 'M', 'L', 'XL'],
      sizeLabels: { S: 'S', M: 'M cintrée', L: 'L', XL: 'XL' },
      selectedSize: 'M',
      selectedImageIndex: 0,
      detailsSheet: './images/products/women-black-pink/details-sheet.png',
      images: [
        { label: '01 / Packshot', tag: 'Studio Packshot', price: '320 MAD', src: './images/products/women-black-pink/packshot-front.png' },
        { label: '02 / Portée Face', tag: 'Lookbook Face', price: '320 MAD', src: './images/products/women-black-pink/model-front.png' },
        { label: '03 / Profil 3/4', tag: 'Taille Cintrée Peplum', price: '320 MAD', src: './images/products/women-black-pink/model-side.png' },
        { label: '04 / Vue Dos', tag: 'Dos & Boucle Rose', price: '320 MAD', src: './images/products/women-black-pink/model-back.png' },
        { label: '05 / Zooms HD', tag: 'Finitions Macro', price: '320 MAD', src: './images/products/women-black-pink/details-sheet.png' }
      ]
    }
  };

  let activeGender = 'men'; // Default active model

  let cart = [];
  try {
    const saved = localStorage.getItem('seven_cart_luxury_v2');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  function init() {
    setupModelSwitchers();
    setupDrawersAndModals();
    setupVideoControls();
    setupLightbox();
    setupScrollNavigation();
    initAnnouncementMarquee();
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
    updateMacroDetailsSheet();
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
    const mainPriceTag = document.getElementById('mainPriceTag');

    if (titleEl) titleEl.textContent = prod.titleShort;
    if (subEl) subEl.textContent = prod.subtitle;
    if (badgeEl) badgeEl.textContent = prod.badge;
    if (catTagEl) catTagEl.textContent = prod.category;
    if (orderBtnLabel) orderBtnLabel.textContent = `COMMANDER • ${prod.price} ${STORE_CURRENCY}`;
    if (mainPriceTag) mainPriceTag.textContent = `${prod.price} ${STORE_CURRENCY}`;

    // Update Main Model Tab Buttons (HOMME • BLEU ROI / FEMME • NOIR & ROSE)
    document.querySelectorAll('.model-tab-btn').forEach(btn => {
      const isActive = btn.dataset.gender === activeGender;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    // Update Header Swatches & Avatars Active State
    document.querySelectorAll('.avatar-badge-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === activeGender);
    });

    // Update Small Swatches Circles Active State
    document.querySelectorAll('.swatch-circle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === activeGender);
    });

    // Update Drawer Model Buttons
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
        floatingImg.style.transform = 'translateY(12px) scale(0.96)';
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
          class="rail-thumb-btn ${isActive ? 'active' : ''}" 
          data-index="${index}"
          title="${img.label}"
          aria-label="${img.label}"
          aria-selected="${isActive}"
          role="tab"
        >
          <div class="thumb-crop-box">
            <img src="${img.src}" alt="${img.label}" loading="lazy">
          </div>
          <div class="thumb-meta-info">
            <span class="thumb-num-label">${img.label}</span>
            <span class="thumb-price-tag">${img.tag || prod.price + ' ' + STORE_CURRENCY}</span>
          </div>
        </button>
      `;
    }).join('');

    stack.querySelectorAll('.rail-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        selectImageIndex(idx);
      });
    });
  }

  /**
   * Select a specific thumbnail image
   */
  function selectImageIndex(index) {
    const prod = products[activeGender];
    if (!prod || !prod.images[index]) return;

    prod.selectedImageIndex = index;

    document.querySelectorAll('.rail-thumb-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    const floatingImg = document.getElementById('mainFloatingImg');
    if (floatingImg) {
      floatingImg.style.opacity = '0.3';
      floatingImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        floatingImg.src = prod.images[index].src;
        floatingImg.style.opacity = '1';
        floatingImg.style.transform = 'scale(1)';
      }, 140);
    }
  }

  /**
   * Render size pills for active product
   */
  function renderSizeCapsules(prod) {
    const group = document.getElementById('sizeCapsulesGroup');
    if (!group) return;

    group.innerHTML = prod.availableSizes.map(size => {
      const isSelected = size === prod.selectedSize;
      const label = prod.sizeLabels[size] || size;
      return `
        <button 
          class="size-capsule ${isSelected ? 'active' : ''}" 
          data-size="${size}"
          role="radio"
          aria-checked="${isSelected}"
        >${label}</button>
      `;
    }).join('');

    group.querySelectorAll('.size-capsule').forEach(capsule => {
      capsule.addEventListener('click', () => {
        prod.selectedSize = capsule.dataset.size;
        renderSizeCapsules(prod);
      });
    });
  }

  /**
   * Switcher buttons setup (Click handlers for ALL selectors)
   */
  function setupModelSwitchers() {
    // 1. Big Model Tab Buttons (HOMME • BLEU ROI / FEMME • NOIR & ROSE)
    document.querySelectorAll('.model-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchModel(btn.dataset.gender);
      });
    });

    // 2. Header Avatar Badges
    document.querySelectorAll('.avatar-badge-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchModel(btn.dataset.gender);
      });
    });

    // 3. Product Title Row Circles (Blue / Pink Dots)
    document.querySelectorAll('.swatch-circle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchModel(btn.dataset.gender);
      });
    });

    // 4. Drawer Menu Model Switchers
    document.querySelectorAll('.drawer-model-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchModel(btn.dataset.gender);
        closeMenu();
      });
    });

    // 5. Macro Details Switcher Tabs
    document.querySelectorAll('.details-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.details-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetGender = btn.dataset.gender;
        const img = document.getElementById('macroDetailsImage');
        if (img && products[targetGender]) {
          img.style.opacity = '0.3';
          setTimeout(() => {
            img.src = products[targetGender].detailsSheet;
            img.style.opacity = '1';
          }, 150);
        }
      });
    });
  }

  function updateMacroDetailsSheet() {
    const img = document.getElementById('macroDetailsImage');
    const tabs = document.querySelectorAll('.details-tab-btn');
    tabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === activeGender);
    });
    if (img && products[activeGender]) {
      img.src = products[activeGender].detailsSheet;
    }
  }

  /**
   * Video Controls (Play/Pause, Sound)
   */
  function setupVideoControls() {
    const video = document.getElementById('heroCampaignVideo');
    const playBtn = document.getElementById('videoPlayToggleBtn');
    const soundBtn = document.getElementById('videoSoundToggleBtn');

    if (!video) return;

    playBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        playBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
          <span>Pause</span>
        `;
      } else {
        video.pause();
        playBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Lecture</span>
        `;
      }
    });

    soundBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (video.muted) {
        soundBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
          <span>Muet</span>
        `;
      } else {
        soundBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <span>Audio Activé</span>
        `;
      }
    });
  }

  /**
   * Internal Smooth Navigation without window scrolling glitch
   */
  function setupScrollNavigation() {
    const container = document.getElementById('mobileStoreContent');
    const pills = document.querySelectorAll('.nav-pill-link');

    document.querySelectorAll('[data-scroll-to]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = trigger.getAttribute('data-scroll-to');
        const targetEl = document.getElementById(targetId);
        
        if (container && targetEl) {
          // Compute offset relative to the scroll container
          const targetOffset = targetEl.offsetTop;
          container.scrollTo({ top: targetOffset, behavior: 'smooth' });

          // Prevent outer window from moving or leaving gap
          if (window.scrollY !== 0) {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }

          // Update active navigation pill
          pills.forEach(p => {
            p.classList.toggle('active', p.getAttribute('data-scroll-to') === targetId);
          });
        }
      });
    });

    // Auto-update active pill on manual scroll
    if (container) {
      container.addEventListener('scroll', () => {
        if (window.scrollY !== 0) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        const sections = ['heroSection', 'collectionSection', 'lookbookSection', 'detailsSection', 'storySection'];
        const currentScroll = container.scrollTop + 140;
        for (let i = sections.length - 1; i >= 0; i--) {
          const sec = document.getElementById(sections[i]);
          if (sec && sec.offsetTop <= currentScroll) {
            pills.forEach(p => {
              p.classList.toggle('active', p.getAttribute('data-scroll-to') === sections[i]);
            });
            break;
          }
        }
      }, { passive: true });
    }
  }

  /**
   * Image Lightbox Modal
   */
  function setupLightbox() {
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const closeBtn = document.getElementById('closeLightboxBtn');

    if (!lightbox) return;

    document.querySelectorAll('.open-lightbox').forEach(el => {
      el.addEventListener('click', () => {
        const src = el.getAttribute('data-full-src') || el.querySelector('img')?.src;
        const title = el.getAttribute('data-title') || el.querySelector('img')?.alt || 'Vue haute définition SEVEN 7';
        if (src && lightboxImg) {
          lightboxImg.src = src;
          if (lightboxTitle) lightboxTitle.textContent = title;
          lightbox.classList.add('active');
        }
      });
    });

    closeBtn?.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  /**
   * Cart Logic & LocalStorage
   */
  function addActiveToCart() {
    const prod = products[activeGender];
    if (!prod) return;

    const currentImg = prod.images[prod.selectedImageIndex]?.src || prod.images[0].src;
    const existingIndex = cart.findIndex(i => i.id === prod.id && i.size === prod.selectedSize);

    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        id: prod.id,
        name: prod.name,
        tag: prod.tag,
        size: prod.selectedSize,
        price: prod.price,
        image: currentImg,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    showToast(`✓ Ajouté au panier : ${prod.category} (${prod.selectedSize})`);
    openCart();
  }

  function removeFromCart(index) {
    if (cart[index]) {
      cart.splice(index, 1);
      saveCart();
      renderCart();
    }
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

  function saveCart() {
    try {
      localStorage.setItem('seven_cart_luxury_v2', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function renderCart() {
    const badge = document.getElementById('cartCountBadge');
    const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);
    const totalPrice = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

    if (badge) {
      badge.textContent = totalCount;
      badge.classList.toggle('visible', totalCount > 0);
    }

    const totalEl = document.getElementById('cartTotalDisplay');
    if (totalEl) totalEl.textContent = `${totalPrice} ${STORE_CURRENCY}`;

    const listEl = document.getElementById('cartItemsList');
    if (!listEl) return;

    if (cart.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:3rem 1.2rem; color:var(--text-muted);">
          <div style="font-size:2.4rem; margin-bottom:0.75rem;">🛍️</div>
          <p style="font-weight:800; color:var(--text-primary); margin-bottom:0.35rem; font-size:1rem;">Votre panier est vide</p>
          <p style="font-size:0.8rem; line-height:1.4;">Ajoutez votre pyjama de bloc à 320 MAD pour commander directement sur WhatsApp.</p>
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

  /**
   * WhatsApp Order Direct (320 MAD)
   */
  function orderActiveWhatsApp() {
    const prod = products[activeGender];
    if (!prod) return;

    const message = `Bonjour SEVEN 7 ! 👋

Je souhaite commander l'ensemble :
• Modèle : ${prod.name}
• Coloris : ${prod.subtitle}
• Taille sélectionnée : ${prod.selectedSize}
• Tarif : ${prod.price} ${STORE_CURRENCY}
• Livraison : Partout au Maroc (24h-48h)
• Paiement : En espèces à la livraison

Merci de me confirmer la commande et le délai de réception ! 🩺⚡`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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
      message = `Bonjour SEVEN 7 ! 👋

Je souhaite commander :
• Modèle : ${item.name}
• Couleurs : ${item.tag}
• Taille : ${item.size}
• Quantité : ${item.qty}
• Montant : ${item.price * item.qty} ${STORE_CURRENCY}
• Mode : Paiement en espèces à la livraison (Maroc)

Merci de me confirmer la validation de ma commande ! 🩺⚡`;
    } else {
      const itemsList = cart.map(i => 
        `• ${i.name}\n  Taille : ${i.size} | Qté : ${i.qty} | Prix : ${i.price * i.qty} ${STORE_CURRENCY}`
      ).join('\n\n');

      message = `Bonjour SEVEN 7 ! 👋

Je souhaite commander les articles suivants de mon panier :

${itemsList}

• TOTAL COMMANDE : ${totalPrice} ${STORE_CURRENCY}
• Mode de paiement : À la livraison partout au Maroc

Merci de me confirmer la préparation et l'expédition ! 🩺⚡`;
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

  /**
   * Announcement Marquee Engine (Smooth Hardware-Accelerated)
   */
  function initAnnouncementMarquee() {
    const strip = document.querySelector('.luxury-announcement-strip');
    const track = document.querySelector('.announcement-marquee-track');
    if (!strip || !track) return;

    let posX = 0;
    const speed = 0.55;
    let isPaused = false;
    let rAFId = null;

    strip.addEventListener('mouseenter', () => { isPaused = true; });
    strip.addEventListener('mouseleave', () => { isPaused = false; });

    function tick() {
      if (!isPaused) {
        posX -= speed;
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && Math.abs(posX) >= halfWidth) {
          posX = 0;
        }
        track.style.transform = `translate3d(${posX}px, 0, 0)`;
        track.style.webkitTransform = `translate3d(${posX}px, 0, 0)`;
      }
      rAFId = requestAnimationFrame(tick);
    }

    track.style.animation = 'none';
    track.style.webkitAnimation = 'none';
    rAFId = requestAnimationFrame(tick);
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    switchModel,
    selectImageIndex,
    addActiveToCart,
    orderActiveWhatsApp,
    orderCartWhatsApp,
    removeFromCart,
    updateQty,
    openCart,
    closeCart,
    openMenu,
    closeMenu
  };
})();
