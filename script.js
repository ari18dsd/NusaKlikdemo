/**
 * ============================================================================
 * NUSAKLIK STORE — LOGIKA UTAMA (VANILLA JAVASCRIPT)
 * ============================================================================
 * Mengelola tema dinamis, render produk, pencarian, filter kategori,
 * pengurutan harga, keranjang belanja (localStorage), checkout WhatsApp,
 * serta hidrasi halaman detail produk dan halaman informasi.
 * ============================================================================
 */

(function () {
  "use strict";

  var CFG = window.NUSAKLIK_CONFIG || {};
  var CART_STORAGE_KEY = "nusaklik_store_cart_v1";
  var IN_PAGES_DIR = window.location.pathname.indexOf("/pages/") !== -1;
  var BASE_PATH = IN_PAGES_DIR ? "../" : "";

  var state = {
    category: "semua",
    collection: "semua",
    search: "",
    sort: "default",
    checkoutItems: [],
    checkoutMode: "cart"
  };

  /* ------------------------------------------------------------------------
     UTILITAS PATH, FORMAT RUPIAH, & ESCAPING HTML
     ------------------------------------------------------------------------ */

  function assetUrl(relPath) {
    if (!relPath) return "";
    if (/^(https?:|data:|\/)/i.test(relPath)) return relPath;
    return BASE_PATH + relPath;
  }

  function pageUrl(pagePath) {
    if (!pagePath) return BASE_PATH + "index.html";
    if (IN_PAGES_DIR) {
      return pagePath.indexOf("pages/") === 0
        ? pagePath.replace(/^pages\//, "")
        : BASE_PATH + pagePath;
    }
    return pagePath;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatRupiah(amount) {
    var num = Number(amount) || 0;
    if (num === 0) return "Gratis";
    return "Rp " + num.toLocaleString("id-ID");
  }

  function getEffectivePrice(product) {
    if (
      product.discountPrice !== null &&
      product.discountPrice !== undefined &&
      product.discountPrice >= 0
    ) {
      return Number(product.discountPrice);
    }
    return Number(product.price) || 0;
  }

  function findProductById(id) {
    var products = CFG.products || [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) return products[i];
    }
    return null;
  }

  /* ------------------------------------------------------------------------
     PENERAPAN TEMA & FAVICON DARI CONFIG.JS
     ------------------------------------------------------------------------ */

  function applyThemeAndFavicon() {
    var theme = CFG.theme || {};
    var root = document.documentElement;
    var varMap = {
      primary: "--nk-primary",
      primaryHover: "--nk-primary-hover",
      navy: "--nk-navy",
      lightBlue: "--nk-light-blue",
      accent: "--nk-accent",
      bgCanvas: "--nk-bg",
      surface: "--nk-surface",
      textPrimary: "--nk-text",
      textMuted: "--nk-muted"
    };

    Object.keys(varMap).forEach(function (key) {
      if (theme[key]) {
        root.style.setProperty(varMap[key], theme[key]);
      }
    });

    if (CFG.store && CFG.store.favicon) {
      var fav = document.querySelector('link[rel="icon"]');
      if (fav) {
        fav.setAttribute("href", assetUrl(CFG.store.favicon));
      }
    }
  }

  /* ------------------------------------------------------------------------
     PENYIMPANAN KERANJANG (LOCALSTORAGE)
     ------------------------------------------------------------------------ */

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      // Abaikan jika penyimpanan browser dibatasi
    }
    updateCartBadge();
  }

  function getCartCount() {
    return getCart().reduce(function (sum, item) {
      return sum + (Number(item.qty) || 0);
    }, 0);
  }

  function updateCartBadge() {
    var countEl = document.getElementById("nk-cart-count");
    if (countEl) {
      countEl.textContent = String(getCartCount());
    }
  }

  function addToCart(productId, qty) {
    var product = findProductById(productId);
    if (!product) return;
    var addQty = Math.max(1, Number(qty) || 1);
    var cart = getCart();
    var found = false;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        cart[i].qty += addQty;
        found = true;
        break;
      }
    }

    if (!found) {
      cart.push({ id: productId, qty: addQty });
    }

    saveCart(cart);
    renderCartDrawer();
    showToast('"' + product.name + '" ditambahkan ke keranjang.');
  }

  function updateCartQty(productId, delta) {
    var cart = getCart();
    var next = [];
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        var newQty = cart[i].qty + delta;
        if (newQty > 0) {
          next.push({ id: cart[i].id, qty: newQty });
        }
      } else {
        next.push(cart[i]);
      }
    }
    saveCart(next);
    renderCartDrawer();
  }

  function removeFromCart(productId) {
    var cart = getCart().filter(function (item) {
      return item.id !== productId;
    });
    saveCart(cart);
    renderCartDrawer();
  }

  function clearCart() {
    saveCart([]);
    renderCartDrawer();
    showToast("Keranjang belanja telah dikosongkan.");
  }

  function getCartDetailedItems() {
    var cart = getCart();
    var items = [];
    cart.forEach(function (entry) {
      var product = findProductById(entry.id);
      if (product) {
        var unitPrice = getEffectivePrice(product);
        var originalPrice = Number(product.price) || 0;
        items.push({
          product: product,
          qty: entry.qty,
          unitPrice: unitPrice,
          originalPrice: originalPrice,
          subtotal: unitPrice * entry.qty
        });
      }
    });
    return items;
  }

  /* ------------------------------------------------------------------------
     TOAST NOTIFIKASI
     ------------------------------------------------------------------------ */

  var toastTimer = null;

  function showToast(message) {
    var toast = document.getElementById("nk-toast");
    var msgEl = document.getElementById("nk-toast-msg");
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.classList.add("is-visible");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3200);
  }

  /* ------------------------------------------------------------------------
     HEADER, FOOTER, DRAWER KERANJANG, & MODAL CHECKOUT BERSAMA
     ------------------------------------------------------------------------ */

  function getActivePageKey() {
    var path = window.location.pathname;
    if (path.indexOf("tentang-kami") !== -1) return "tentang";
    if (path.indexOf("kontak") !== -1) return "kontak";
    if (path.indexOf("cara-pembelian") !== -1) return "cara-beli";
    if (path.indexOf("cara-pembayaran") !== -1) return "cara-bayar";
    if (path.indexOf("faq") !== -1) return "faq";
    if (path.indexOf("produk") !== -1) return "katalog";
    if (!IN_PAGES_DIR) return "beranda";
    return "";
  }

  function renderSharedLayout() {
    var store = CFG.store || {};
    var contact = CFG.contact || {};
    var active = getActivePageKey();

    var headerHost = document.getElementById("nk-header");
    if (headerHost) {
      headerHost.innerHTML =
        '<header class="site-header">' +
        '  <div class="container header-inner">' +
        '    <a href="' + pageUrl("index.html") + '" class="brand-link" aria-label="' + escapeHtml(store.name) + ' - Beranda">' +
        '      <img src="' + assetUrl(store.logoHeader) + '" alt="' + escapeHtml(store.name) + '" class="brand-logo-img" />' +
        "    </a>" +
        '    <nav class="main-nav" aria-label="Navigasi Utama">' +
        '      <a href="' + pageUrl("index.html") + '" class="nav-link ' + (active === "beranda" ? "is-active" : "") + '">Beranda</a>' +
        '      <a href="' + pageUrl("index.html") + '#katalog" class="nav-link ' + (active === "katalog" ? "is-active" : "") + '">Katalog</a>' +
        '      <a href="' + pageUrl("pages/cara-pembelian.html") + '" class="nav-link ' + (active === "cara-beli" ? "is-active" : "") + '">Cara Beli</a>' +
        '      <a href="' + pageUrl("pages/tentang-kami.html") + '" class="nav-link ' + (active === "tentang" ? "is-active" : "") + '">Tentang Kami</a>' +
        '      <a href="' + pageUrl("pages/kontak.html") + '" class="nav-link ' + (active === "kontak" ? "is-active" : "") + '">Kontak</a>' +
        "    </nav>" +
        '    <div class="header-actions">' +
        '      <button type="button" class="cart-trigger" id="nk-open-cart-btn" aria-label="Buka keranjang belanja">' +
        '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
        '        <span class="cart-trigger-label">Keranjang</span>' +
        '        <span class="cart-count" id="nk-cart-count">0</span>' +
        "      </button>" +
        '      <button type="button" class="mobile-menu-btn" id="nk-mobile-menu-btn" aria-label="Buka menu navigasi" aria-expanded="false">' +
        '        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
        "      </button>" +
        "    </div>" +
        "  </div>" +
        '  <div class="mobile-nav-drawer" id="nk-mobile-nav">' +
        '    <div class="mobile-nav-list">' +
        '      <a href="' + pageUrl("index.html") + '" class="mobile-nav-link ' + (active === "beranda" ? "is-active" : "") + '">Beranda</a>' +
        '      <a href="' + pageUrl("index.html") + '#katalog" class="mobile-nav-link">Katalog Produk</a>' +
        '      <a href="' + pageUrl("pages/cara-pembelian.html") + '" class="mobile-nav-link ' + (active === "cara-beli" ? "is-active" : "") + '">Cara Pembelian</a>' +
        '      <a href="' + pageUrl("pages/cara-pembayaran.html") + '" class="mobile-nav-link ' + (active === "cara-bayar" ? "is-active" : "") + '">Cara Pembayaran</a>' +
        '      <a href="' + pageUrl("pages/faq.html") + '" class="mobile-nav-link ' + (active === "faq" ? "is-active" : "") + '">FAQ</a>' +
        '      <a href="' + pageUrl("pages/tentang-kami.html") + '" class="mobile-nav-link ' + (active === "tentang" ? "is-active" : "") + '">Tentang Kami</a>' +
        '      <a href="' + pageUrl("pages/kontak.html") + '" class="mobile-nav-link ' + (active === "kontak" ? "is-active" : "") + '">Kontak</a>' +
        "    </div>" +
        "  </div>" +
        "</header>";
    }

    var footerHost = document.getElementById("nk-footer");
    if (footerHost) {
      footerHost.innerHTML =
        '<footer class="site-footer">' +
        '  <div class="container">' +
        '    <div class="footer-grid">' +
        "      <div>" +
        '        <img src="' + assetUrl(store.logoFooter) + '" alt="' + escapeHtml(store.name) + '" class="footer-logo" />' +
        '        <p class="footer-tagline">' + escapeHtml(store.tagline) + "</p>" +
        '        <p class="footer-desc">' + escapeHtml(store.description) + "</p>" +
        "      </div>" +
        "      <div>" +
        '        <h3 class="footer-heading">Jelajahi</h3>' +
        '        <ul class="footer-links">' +
        '          <li><a href="' + pageUrl("index.html") + '">Beranda</a></li>' +
        '          <li><a href="' + pageUrl("index.html") + '#katalog">Katalog Produk</a></li>' +
        '          <li><a href="' + pageUrl("pages/tentang-kami.html") + '">Tentang Kami</a></li>' +
        '          <li><a href="' + pageUrl("pages/kontak.html") + '">Kontak Kami</a></li>' +
        "        </ul>" +
        "      </div>" +
        "      <div>" +
        '        <h3 class="footer-heading">Panduan & Kebijakan</h3>' +
        '        <ul class="footer-links">' +
        '          <li><a href="' + pageUrl("pages/cara-pembelian.html") + '">Cara Pembelian</a></li>' +
        '          <li><a href="' + pageUrl("pages/cara-pembayaran.html") + '">Cara Pembayaran</a></li>' +
        '          <li><a href="' + pageUrl("pages/faq.html") + '">FAQ</a></li>' +
        '          <li><a href="' + pageUrl("pages/kebijakan-privasi.html") + '">Kebijakan Privasi</a></li>' +
        '          <li><a href="' + pageUrl("pages/syarat-ketentuan.html") + '">Syarat & Ketentuan</a></li>' +
        "        </ul>" +
        "      </div>" +
        "      <div>" +
        '        <h3 class="footer-heading">Informasi Toko</h3>' +
        '        <ul class="footer-contact-list">' +
        "          <li>WhatsApp: " + escapeHtml(contact.whatsappDisplay) + "</li>" +
        "          <li>Email: " + escapeHtml(contact.email) + "</li>" +
        "          <li>Jam Layanan: " + escapeHtml(contact.operationalHours) + "</li>" +
        "          <li>" + escapeHtml(contact.address) + "</li>" +
        "        </ul>" +
        "      </div>" +
        "    </div>" +
        '    <div class="footer-bottom">' +
        "      <span>&copy; " + escapeHtml(store.copyrightYear || "2026") + " " + escapeHtml(store.name) + ". Seluruh hak cipta dilindungi.</span>" +
        "      <span>" + escapeHtml(store.tagline) + "</span>" +
        "    </div>" +
        "  </div>" +
        "</footer>";
    }

    var overlaysHost = document.getElementById("nk-overlays");
    if (overlaysHost) {
      overlaysHost.innerHTML =
        '<div class="backdrop" id="nk-backdrop"></div>' +
        '<aside class="cart-drawer" id="nk-cart-drawer" aria-label="Keranjang Belanja" aria-hidden="true">' +
        '  <div class="drawer-header">' +
        '    <h2 class="drawer-title">Keranjang Belanja</h2>' +
        '    <button type="button" class="icon-close-btn" id="nk-close-cart-btn" aria-label="Tutup keranjang">' +
        '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        "    </button>" +
        "  </div>" +
        '  <div class="drawer-body" id="nk-cart-body"></div>' +
        '  <div class="drawer-footer" id="nk-cart-footer"></div>' +
        "</aside>" +
        '<div class="modal-dialog" id="nk-checkout-modal" role="dialog" aria-modal="true" aria-labelledby="nk-checkout-title" aria-hidden="true">' +
        '  <div class="modal-card">' +
        '    <div class="modal-header">' +
        '      <h2 class="modal-title" id="nk-checkout-title">Checkout via WhatsApp</h2>' +
        '      <button type="button" class="icon-close-btn" id="nk-close-checkout-btn" aria-label="Tutup jendela checkout">' +
        '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        "      </button>" +
        "    </div>" +
        '    <div class="modal-body">' +
        '      <div class="order-summary-box" id="nk-checkout-summary"></div>' +
        '      <div class="form-group">' +
        '        <label class="form-label" for="nk-buyer-name">Nama Anda (Opsional)</label>' +
        '        <input type="text" id="nk-buyer-name" class="form-control" placeholder="Contoh: Budi Santoso" />' +
        "      </div>" +
        '      <div class="form-group">' +
        '        <label class="form-label" for="nk-buyer-note">Catatan Pesanan (Opsional)</label>' +
        '        <input type="text" id="nk-buyer-note" class="form-control" placeholder="Contoh: Kirim tautan unduh ke email saya" />' +
        "      </div>" +
        '      <div>' +
        '        <span class="form-label">Pratinjau Pesan WhatsApp</span>' +
        '        <div class="wa-preview-box" id="nk-wa-preview"></div>' +
        "      </div>" +
        '      <a id="nk-wa-launch-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block">' +
        '        Kirim Pesanan ke WhatsApp' +
        "      </a>" +
        "    </div>" +
        "  </div>" +
        "</div>" +
        '<div class="toast-banner" id="nk-toast" role="status" aria-live="polite">' +
        '  <span id="nk-toast-msg"></span>' +
        '  <button type="button" class="btn btn-sm btn-outline" id="nk-toast-cart-btn" style="background:#fff;border-color:#fff;color:#0b2545;">Lihat</button>' +
        "</div>";
    }

    bindSharedEvents();
    updateCartBadge();
    renderCartDrawer();
  }

  function bindSharedEvents() {
    var mobileBtn = document.getElementById("nk-mobile-menu-btn");
    var mobileNav = document.getElementById("nk-mobile-nav");
    if (mobileBtn && mobileNav) {
      mobileBtn.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("is-open");
        mobileBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var openCartBtn = document.getElementById("nk-open-cart-btn");
    var closeCartBtn = document.getElementById("nk-close-cart-btn");
    var toastCartBtn = document.getElementById("nk-toast-cart-btn");
    var backdrop = document.getElementById("nk-backdrop");
    var closeCheckoutBtn = document.getElementById("nk-close-checkout-btn");

    if (openCartBtn) openCartBtn.addEventListener("click", openCartDrawer);
    if (toastCartBtn) toastCartBtn.addEventListener("click", openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeAllOverlays);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", closeCheckoutModal);
    if (backdrop) backdrop.addEventListener("click", closeAllOverlays);

    var buyerName = document.getElementById("nk-buyer-name");
    var buyerNote = document.getElementById("nk-buyer-note");
    if (buyerName) buyerName.addEventListener("input", updateWhatsAppPreview);
    if (buyerNote) buyerNote.addEventListener("input", updateWhatsAppPreview);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllOverlays();
    });
  }

  function openCartDrawer() {
    renderCartDrawer();
    var drawer = document.getElementById("nk-cart-drawer");
    var backdrop = document.getElementById("nk-backdrop");
    if (drawer) {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
    }
    if (backdrop) backdrop.classList.add("is-open");
  }

  function closeCartDrawer() {
    var drawer = document.getElementById("nk-cart-drawer");
    if (drawer) {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
    }
  }

  function closeCheckoutModal() {
    var modal = document.getElementById("nk-checkout-modal");
    var backdrop = document.getElementById("nk-backdrop");
    var drawer = document.getElementById("nk-cart-drawer");
    if (modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }
    if (backdrop && (!drawer || !drawer.classList.contains("is-open"))) {
      backdrop.classList.remove("is-open");
    }
  }

  function closeAllOverlays() {
    closeCartDrawer();
    closeCheckoutModal();
    var backdrop = document.getElementById("nk-backdrop");
    if (backdrop) backdrop.classList.remove("is-open");
  }

  /* ------------------------------------------------------------------------
     RENDER ISI DRAWER KERANJANG
     ------------------------------------------------------------------------ */

  function renderCartDrawer() {
    var bodyEl = document.getElementById("nk-cart-body");
    var footerEl = document.getElementById("nk-cart-footer");
    if (!bodyEl || !footerEl) return;

    var items = getCartDetailedItems();

    if (items.length === 0) {
      bodyEl.innerHTML =
        '<div class="cart-empty">' +
        "  <h4>Keranjang Masih Kosong</h4>" +
        "  <p>Pilih produk digital dari katalog untuk mulai berbelanja.</p>" +
        '  <a href="' + pageUrl("index.html") + '#katalog" class="btn btn-primary btn-sm" id="nk-empty-browse-btn">Jelajahi Katalog</a>' +
        "</div>";
      footerEl.innerHTML = "";
      var browseBtn = document.getElementById("nk-empty-browse-btn");
      if (browseBtn) browseBtn.addEventListener("click", closeAllOverlays);
      return;
    }

    var totalQty = 0;
    var subtotalAll = 0;
    var savingsAll = 0;

    var html = '<div class="cart-items-list">';
    items.forEach(function (item) {
      var p = item.product;
      totalQty += item.qty;
      subtotalAll += item.subtotal;
      if (item.originalPrice > item.unitPrice) {
        savingsAll += (item.originalPrice - item.unitPrice) * item.qty;
      }

      html +=
        '<div class="cart-item">' +
        '  <img src="' + assetUrl(p.image) + '" alt="' + escapeHtml(p.name) + '" class="cart-item-img" />' +
        "  <div>" +
        '    <h4 class="cart-item-title">' + escapeHtml(p.name) + "</h4>" +
        '    <div class="cart-item-price">' + formatRupiah(item.unitPrice) + " &times; " + item.qty + " = " + formatRupiah(item.subtotal) + "</div>" +
        '    <div class="cart-item-controls">' +
        '      <div class="qty-stepper">' +
        '        <button type="button" class="qty-btn" data-cart-dec="' + escapeHtml(p.id) + '" aria-label="Kurangi jumlah">-</button>' +
        '        <span class="qty-val">' + item.qty + "</span>" +
        '        <button type="button" class="qty-btn" data-cart-inc="' + escapeHtml(p.id) + '" aria-label="Tambah jumlah">+</button>' +
        "      </div>" +
        '      <button type="button" class="remove-item-btn" data-cart-del="' + escapeHtml(p.id) + '">Hapus</button>' +
        "    </div>" +
        "  </div>" +
        "</div>";
    });
    html += "</div>";
    bodyEl.innerHTML = html;

    var footerHtml =
      '<div class="summary-row"><span>Total Item</span><span>' + totalQty + " produk</span></div>" +
      '<div class="summary-row"><span>Subtotal</span><span>' + formatRupiah(subtotalAll) + "</span></div>";

    if (savingsAll > 0) {
      footerHtml +=
        '<div class="summary-row"><span>Hemat Promo</span><span>-' + formatRupiah(savingsAll) + "</span></div>";
    }

    footerHtml +=
      '<div class="summary-total"><span>Total Pembayaran</span><span>' + formatRupiah(subtotalAll) + "</span></div>" +
      '<div class="drawer-actions">' +
      '  <button type="button" class="btn btn-primary btn-block" id="nk-cart-checkout-btn">Checkout via WhatsApp</button>' +
      '  <button type="button" class="btn btn-outline btn-block btn-sm" id="nk-clear-cart-btn">Kosongkan Keranjang</button>' +
      "</div>";

    footerEl.innerHTML = footerHtml;

    bodyEl.querySelectorAll("[data-cart-inc]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        updateCartQty(btn.getAttribute("data-cart-inc"), 1);
      });
    });

    bodyEl.querySelectorAll("[data-cart-dec]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        updateCartQty(btn.getAttribute("data-cart-dec"), -1);
      });
    });

    bodyEl.querySelectorAll("[data-cart-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        removeFromCart(btn.getAttribute("data-cart-del"));
      });
    });

    var checkoutBtn = document.getElementById("nk-cart-checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        openCheckoutModal(getCartDetailedItems(), "cart");
      });
    }

    var clearBtn = document.getElementById("nk-clear-cart-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", clearCart);
    }
  }

  /* ------------------------------------------------------------------------
     CHECKOUT WHATSAPP (KERANJANG & BELI SEKARANG)
     ------------------------------------------------------------------------ */

  function openBuyNowCheckout(productId, qty) {
    var product = findProductById(productId);
    if (!product) return;
    var count = Math.max(1, Number(qty) || 1);
    var unitPrice = getEffectivePrice(product);
    var items = [
      {
        product: product,
        qty: count,
        unitPrice: unitPrice,
        originalPrice: Number(product.price) || 0,
        subtotal: unitPrice * count
      }
    ];
    openCheckoutModal(items, "direct");
  }

  function openCheckoutModal(items, mode) {
    if (!items || items.length === 0) return;
    state.checkoutItems = items;
    state.checkoutMode = mode || "cart";

    closeCartDrawer();

    var summaryBox = document.getElementById("nk-checkout-summary");
    if (summaryBox) {
      var totalAll = 0;
      var tableHtml =
        '<table class="order-summary-table">' +
        "<thead><tr><th>Produk</th><th>Jumlah</th><th>Harga Satuan</th><th>Subtotal</th></tr></thead><tbody>";

      items.forEach(function (item) {
        totalAll += item.subtotal;
        tableHtml +=
          "<tr>" +
          "<td>" + escapeHtml(item.product.name) + "</td>" +
          "<td>" + item.qty + "</td>" +
          "<td>" + formatRupiah(item.unitPrice) + "</td>" +
          "<td>" + formatRupiah(item.subtotal) + "</td>" +
          "</tr>";
      });

      tableHtml +=
        "</tbody></table>" +
        '<div class="summary-total" style="margin-bottom:0;margin-top:12px;">' +
        "<span>Total Pembayaran</span><span>" + formatRupiah(totalAll) + "</span>" +
        "</div>";

      summaryBox.innerHTML = tableHtml;
    }

    updateWhatsAppPreview();

    var modal = document.getElementById("nk-checkout-modal");
    var backdrop = document.getElementById("nk-backdrop");
    if (modal) {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }
    if (backdrop) backdrop.classList.add("is-open");
  }

  function buildWhatsAppMessage() {
    var storeName = (CFG.store && CFG.store.name) || "NusaKlik Store";
    var items = state.checkoutItems || [];
    var nameInput = document.getElementById("nk-buyer-name");
    var noteInput = document.getElementById("nk-buyer-note");
    var buyerName = nameInput ? nameInput.value.trim() : "";
    var buyerNote = noteInput ? noteInput.value.trim() : "";

    var totalAll = 0;
    var lines = [];
    lines.push("Halo " + storeName + ", saya ingin memesan produk digital berikut:");
    lines.push("");

    items.forEach(function (item, idx) {
      totalAll += item.subtotal;
      lines.push(idx + 1 + ". " + item.product.name);
      lines.push("   Jumlah: " + item.qty);
      lines.push("   Harga Satuan: " + formatRupiah(item.unitPrice));
      lines.push("   Subtotal: " + formatRupiah(item.subtotal));
    });

    lines.push("");
    lines.push("Total Pembayaran: " + formatRupiah(totalAll));

    if (buyerName) {
      lines.push("Nama Pemesan: " + buyerName);
    }
    if (buyerNote) {
      lines.push("Catatan: " + buyerNote);
    }

    lines.push("");
    lines.push("Mohon informasi langkah pembayaran dan akses unduh produknya. Terima kasih.");
    return lines.join("\n");
  }

  function updateWhatsAppPreview() {
    var previewEl = document.getElementById("nk-wa-preview");
    var launchBtn = document.getElementById("nk-wa-launch-btn");
    var message = buildWhatsAppMessage();

    if (previewEl) {
      previewEl.textContent = message;
    }

    if (launchBtn) {
      var rawWa = (CFG.contact && CFG.contact.whatsappNumber) || "6281234567890";
      var cleanWa = String(rawWa).replace(/[^0-9]/g, "");
      var waHref = "https://wa.me/" + cleanWa + "?text=" + encodeURIComponent(message);
      launchBtn.setAttribute("href", waHref);
    }
  }

  /* ------------------------------------------------------------------------
     PEMBUATAN KARTU PRODUK REUSABLE
     ------------------------------------------------------------------------ */

  function createProductCardHtml(product) {
    var effPrice = getEffectivePrice(product);
    var hasDiscount =
      product.discountPrice !== null &&
      product.discountPrice !== undefined &&
      product.discountPrice < product.price;
    var isFree = effPrice === 0;

    var tagHtml = "";
    if (isFree || (product.badge && product.badge.toLowerCase() === "gratis")) {
      tagHtml = '<span class="product-tag product-tag--free">Gratis</span>';
    } else if (product.badge && product.badge.toLowerCase() === "promo") {
      tagHtml = '<span class="product-tag product-tag--promo">Promo</span>';
    }

    var priceHtml = "";
    if (isFree) {
      priceHtml = '<span class="price-current price-current--free">Gratis</span>';
      if (product.price > 0) {
        priceHtml += '<span class="price-original">' + formatRupiah(product.price) + "</span>";
      }
    } else {
      priceHtml = '<span class="price-current">' + formatRupiah(effPrice) + "</span>";
      if (hasDiscount) {
        priceHtml += '<span class="price-original">' + formatRupiah(product.price) + "</span>";
      }
    }

    var detailHref = pageUrl("pages/produk.html") + "?id=" + encodeURIComponent(product.id);

    return (
      '<article class="product-card">' +
      '  <a href="' + detailHref + '" class="product-cover-wrap" aria-label="Lihat detail ' + escapeHtml(product.name) + '">' +
      '    <img src="' + assetUrl(product.image) + '" alt="' + escapeHtml(product.name) + '" class="product-cover-img" loading="lazy" />' +
      tagHtml +
      "  </a>" +
      '  <div class="product-body">' +
      '    <div class="product-category">' + escapeHtml(product.category) + "</div>" +
      '    <h3 class="product-title"><a href="' + detailHref + '">' + escapeHtml(product.name) + "</a></h3>" +
      '    <p class="product-excerpt">' + escapeHtml(product.shortDescription) + "</p>" +
      '    <div class="product-price-row">' +
      priceHtml +
      "    </div>" +
      '    <div class="product-actions">' +
      '      <a href="' + detailHref + '" class="btn btn-outline btn-sm">Detail</a>' +
      '      <button type="button" class="btn btn-navy btn-sm" data-add-cart="' + escapeHtml(product.id) + '">+ Keranjang</button>' +
      '      <button type="button" class="btn btn-primary btn-sm product-actions-buy" data-buy-now="' + escapeHtml(product.id) + '">Beli Sekarang</button>' +
      "    </div>" +
      "  </div>" +
      "</article>"
    );
  }

  function bindProductActionButtons(container) {
    if (!container) return;

    container.querySelectorAll("[data-add-cart]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        addToCart(btn.getAttribute("data-add-cart"), 1);
      });
    });

    container.querySelectorAll("[data-buy-now]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openBuyNowCheckout(btn.getAttribute("data-buy-now"), 1);
      });
    });
  }

  /* ------------------------------------------------------------------------
     HIDRASI HALAMAN BERANDA (INDEX.HTML)
     ------------------------------------------------------------------------ */

  function initHomePage() {
    var heroRoot = document.getElementById("nk-hero-section");
    if (!heroRoot) return;

    // 1. Hero Content & Banner
    var hero = CFG.hero || {};
    var store = CFG.store || {};
    var heroKicker = document.getElementById("nk-hero-kicker");
    var heroTitle = document.getElementById("nk-hero-title");
    var heroSub = document.getElementById("nk-hero-sub");
    var heroPrimary = document.getElementById("nk-hero-cta");
    var heroSecondary = document.getElementById("nk-hero-secondary");
    var heroImg = document.getElementById("nk-hero-img");

    if (heroKicker) heroKicker.textContent = hero.kicker || store.tagline;
    if (heroTitle) heroTitle.textContent = hero.headline || "";
    if (heroSub) heroSub.textContent = hero.subheadline || "";
    if (heroPrimary) heroPrimary.textContent = hero.primaryCta || "Jelajahi Katalog";
    if (heroSecondary) heroSecondary.textContent = hero.secondaryCta || "Cara Pembelian";
    if (heroImg && store.heroBanner) {
      heroImg.setAttribute("src", assetUrl(store.heroBanner));
      heroImg.setAttribute("alt", store.name + " - Produk Digital");
    }

    // 2. Kategori Produk
    renderCategories();

    // 3. Produk Unggulan (3 Produk Sorotan)
    var featuredGrid = document.getElementById("nk-featured-grid");
    if (featuredGrid) {
      var featuredItems = (CFG.products || []).filter(function (p) {
        return p.featured;
      });
      featuredGrid.innerHTML = featuredItems.map(createProductCardHtml).join("");
      bindProductActionButtons(featuredGrid);
    }

    // 4. Promo Banner
    var promo = CFG.promo || {};
    var promoImg = document.getElementById("nk-promo-img");
    var promoKicker = document.getElementById("nk-promo-kicker");
    var promoTitle = document.getElementById("nk-promo-title");
    var promoDesc = document.getElementById("nk-promo-desc");
    var promoCta = document.getElementById("nk-promo-cta");

    if (promoImg && store.promoBanner) promoImg.setAttribute("src", assetUrl(store.promoBanner));
    if (promoKicker) promoKicker.textContent = promo.kicker || "";
    if (promoTitle) promoTitle.textContent = promo.title || "";
    if (promoDesc) promoDesc.textContent = promo.description || "";
    if (promoCta) {
      promoCta.textContent = promo.ctaLabel || "Lihat Produk Promo";
      promoCta.addEventListener("click", function () {
        state.category = "semua";
        state.collection = "promo";
        syncFilterUI();
        renderCatalog();
        var katalogEl = document.getElementById("katalog");
        if (katalogEl) katalogEl.scrollIntoView({ behavior: "smooth" });
      });
    }

    // 5. Keunggulan Toko & Studio Image
    var advImg = document.getElementById("nk-about-studio-img");
    if (advImg && store.aboutImage) advImg.setAttribute("src", assetUrl(store.aboutImage));

    var advGrid = document.getElementById("nk-advantages-grid");
    if (advGrid && Array.isArray(CFG.advantages)) {
      advGrid.innerHTML = CFG.advantages
        .map(function (adv) {
          return (
            '<div class="advantage-item">' +
            '  <img src="' + assetUrl(adv.icon) + '" alt="" class="advantage-icon" aria-hidden="true" />' +
            '  <h3 class="advantage-title">' + escapeHtml(adv.title) + "</h3>" +
            '  <p class="advantage-desc">' + escapeHtml(adv.description) + "</p>" +
            "</div>"
          );
        })
        .join("");
    }

    // 6. Testimoni
    var testiGrid = document.getElementById("nk-testimonials-grid");
    if (testiGrid && Array.isArray(CFG.testimonials)) {
      testiGrid.innerHTML = CFG.testimonials
        .map(function (item) {
          return (
            '<article class="testimonial-card">' +
            '  <p class="testimonial-quote">&ldquo;' + escapeHtml(item.quote) + '&rdquo;</p>' +
            '  <div class="testimonial-author">' +
            '    <div class="testimonial-name">' + escapeHtml(item.name) + "</div>" +
            '    <div class="testimonial-meta">' + escapeHtml(item.role) + " &middot; " + escapeHtml(item.organization) + "</div>" +
            "  </div>" +
            "</article>"
          );
        })
        .join("");
    }

    // 7. Toolbar Pencarian, Tab Koleksi, & Urutkan Harga
    bindCatalogControls();

    // Cek parameter URL jika ada filter awal
    var params = new URLSearchParams(window.location.search);
    var catParam = params.get("kategori");
    var colParam = params.get("koleksi");
    if (catParam) state.category = catParam;
    if (colParam) state.collection = colParam;

    syncFilterUI();
    renderCatalog();
  }

  function renderCategories() {
    var grid = document.getElementById("nk-category-grid");
    if (!grid || !Array.isArray(CFG.categories)) return;

    grid.innerHTML = CFG.categories
      .map(function (cat) {
        var activeClass = state.category === cat.id ? "is-active" : "";
        return (
          '<button type="button" class="category-btn ' + activeClass + '" data-cat-id="' + escapeHtml(cat.id) + '">' +
          '  <span class="category-icon-box">' +
          '    <img src="' + assetUrl(cat.icon) + '" alt="" aria-hidden="true" />' +
          "  </span>" +
          "  <span>" + escapeHtml(cat.name) + "</span>" +
          "</button>"
        );
      })
      .join("");

    grid.querySelectorAll("[data-cat-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.category = btn.getAttribute("data-cat-id");
        syncFilterUI();
        renderCatalog();
      });
    });
  }

  function bindCatalogControls() {
    var searchInput = document.getElementById("nk-search-input");
    var clearSearchBtn = document.getElementById("nk-search-clear");
    var sortSelect = document.getElementById("nk-sort-select");
    var tabBtns = document.querySelectorAll("[data-collection-tab]");

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.search = searchInput.value.trim();
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle("is-visible", state.search.length > 0);
        }
        renderCatalog();
      });
    }

    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener("click", function () {
        searchInput.value = "";
        state.search = "";
        clearSearchBtn.classList.remove("is-visible");
        renderCatalog();
        searchInput.focus();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        renderCatalog();
      });
    }

    tabBtns.forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.collection = tab.getAttribute("data-collection-tab");
        syncFilterUI();
        renderCatalog();
      });
    });
  }

  function syncFilterUI() {
    document.querySelectorAll("[data-cat-id]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-cat-id") === state.category);
    });

    document.querySelectorAll("[data-collection-tab]").forEach(function (tab) {
      tab.classList.toggle(
        "is-active",
        tab.getAttribute("data-collection-tab") === state.collection
      );
    });
  }

  function renderCatalog() {
    var grid = document.getElementById("nk-catalog-grid");
    var countLabel = document.getElementById("nk-catalog-count");
    if (!grid) return;

    var products = (CFG.products || []).slice();

    // Filter kategori
    if (state.category && state.category !== "semua") {
      products = products.filter(function (p) {
        return p.category === state.category;
      });
    }

    // Filter koleksi (Semua, Unggulan, Terbaru, Populer, Promo, Gratis)
    if (state.collection === "unggulan") {
      products = products.filter(function (p) {
        return p.featured;
      });
    } else if (state.collection === "terbaru") {
      products = products.filter(function (p) {
        return p.isNew;
      });
    } else if (state.collection === "populer") {
      products = products.filter(function (p) {
        return p.popular;
      });
    } else if (state.collection === "promo") {
      products = products.filter(function (p) {
        return (
          (p.discountPrice !== null && p.discountPrice !== undefined && p.discountPrice < p.price) ||
          (p.badge && p.badge.toLowerCase() === "promo")
        );
      });
    }

    // Filter pencarian
    if (state.search) {
      var q = state.search.toLowerCase();
      products = products.filter(function (p) {
        return (
          p.name.toLowerCase().indexOf(q) !== -1 ||
          p.category.toLowerCase().indexOf(q) !== -1 ||
          p.shortDescription.toLowerCase().indexOf(q) !== -1
        );
      });
    }

    // Pengurutan harga
    if (state.sort === "price-asc") {
      products.sort(function (a, b) {
        return getEffectivePrice(a) - getEffectivePrice(b);
      });
    } else if (state.sort === "price-desc") {
      products.sort(function (a, b) {
        return getEffectivePrice(b) - getEffectivePrice(a);
      });
    } else if (state.sort === "popular") {
      products.sort(function (a, b) {
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      });
    }

    if (countLabel) {
      countLabel.textContent = "Menampilkan " + products.length + " produk";
    }

    if (products.length === 0) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column: 1 / -1;">' +
        "  <h3>Produk Tidak Ditemukan</h3>" +
        "  <p>Tidak ada produk yang cocok dengan kata kunci atau filter kategori saat ini.</p>" +
        '  <button type="button" class="btn btn-primary btn-sm" id="nk-reset-filter-btn">Reset Semua Filter</button>' +
        "</div>";
      var resetBtn = document.getElementById("nk-reset-filter-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          state.category = "semua";
          state.collection = "semua";
          state.search = "";
          state.sort = "default";
          var searchEl = document.getElementById("nk-search-input");
          var sortEl = document.getElementById("nk-sort-select");
          var clearEl = document.getElementById("nk-search-clear");
          if (searchEl) searchEl.value = "";
          if (sortEl) sortEl.value = "default";
          if (clearEl) clearEl.classList.remove("is-visible");
          syncFilterUI();
          renderCatalog();
        });
      }
      return;
    }

    grid.innerHTML = products.map(createProductCardHtml).join("");
    bindProductActionButtons(grid);
  }

  /* ------------------------------------------------------------------------
     HIDRASI HALAMAN DETAIL PRODUK (PAGES/PRODUK.HTML)
     ------------------------------------------------------------------------ */

  function initProductDetailPage() {
    var root = document.getElementById("nk-pdp-root");
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var productId = params.get("id");
    var product = findProductById(productId) || (CFG.products && CFG.products[0]);

    if (!product) {
      root.innerHTML =
        '<div class="empty-state"><h3>Produk tidak ditemukan</h3><a href="../index.html" class="btn btn-primary">Kembali ke Beranda</a></div>';
      return;
    }

    document.title = product.name + " — " + ((CFG.store && CFG.store.name) || "NusaKlik Store");

    var crumbName = document.getElementById("nk-pdp-crumb-name");
    if (crumbName) crumbName.textContent = product.name;

    var effPrice = getEffectivePrice(product);
    var hasDiscount =
      product.discountPrice !== null &&
      product.discountPrice !== undefined &&
      product.discountPrice < product.price;
    var isFree = effPrice === 0;

    var priceHtml = isFree
      ? '<span class="price-current price-current--free" style="font-size:24px;">Gratis</span>'
      : '<span class="price-current" style="font-size:24px;">' + formatRupiah(effPrice) + "</span>";

    if (hasDiscount) {
      priceHtml += '<span class="price-original" style="font-size:16px;">' + formatRupiah(product.price) + "</span>";
    }

    var specsRows = "";
    if (product.specs) {
      Object.keys(product.specs).forEach(function (label) {
        specsRows +=
          "<tr><th>" + escapeHtml(label) + "</th><td>" + escapeHtml(product.specs[label]) + "</td></tr>";
      });
    }

    var badgeText = isFree
      ? "Gratis"
      : product.badge
      ? product.badge
      : "Produk Digital";

    root.innerHTML =
      '<div class="pdp-grid">' +
      '  <div class="pdp-gallery">' +
      '    <img src="' + assetUrl(product.image) + '" alt="' + escapeHtml(product.name) + '" />' +
      "  </div>" +
      '  <div class="pdp-module">' +
      '    <div class="product-category">' + escapeHtml(product.category) + " &middot; " + escapeHtml(badgeText) + "</div>" +
      '    <h1 class="page-title" style="font-size:clamp(1.5rem,2.5vw,2rem);margin-bottom:12px;">' + escapeHtml(product.name) + "</h1>" +
      '    <div class="product-price-row" style="margin-top:0;margin-bottom:18px;">' + priceHtml + "</div>" +
      '    <p style="color:var(--nk-muted);margin:0 0 22px;">' + escapeHtml(product.fullDescription || product.shortDescription) + "</p>" +
      '    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
      '      <span class="form-label" style="margin:0;">Jumlah:</span>' +
      '      <div class="qty-stepper">' +
      '        <button type="button" class="qty-btn" id="nk-pdp-qty-dec" aria-label="Kurangi jumlah">-</button>' +
      '        <span class="qty-val" id="nk-pdp-qty-val">1</span>' +
      '        <button type="button" class="qty-btn" id="nk-pdp-qty-inc" aria-label="Tambah jumlah">+</button>' +
      "      </div>" +
      "    </div>" +
      '    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
      '      <button type="button" class="btn btn-navy" id="nk-pdp-add-cart">+ Keranjang</button>' +
      '      <button type="button" class="btn btn-primary" id="nk-pdp-buy-now">Beli Sekarang</button>' +
      "    </div>" +
      '    <table class="pdp-specs-table" aria-label="Spesifikasi Produk">' +
      "      <tbody>" + specsRows + "</tbody>" +
      "    </table>" +
      "  </div>" +
      "</div>";

    var pdpQty = 1;
    var qtyValEl = document.getElementById("nk-pdp-qty-val");
    var decBtn = document.getElementById("nk-pdp-qty-dec");
    var incBtn = document.getElementById("nk-pdp-qty-inc");
    var addBtn = document.getElementById("nk-pdp-add-cart");
    var buyBtn = document.getElementById("nk-pdp-buy-now");

    if (decBtn && qtyValEl) {
      decBtn.addEventListener("click", function () {
        if (pdpQty > 1) {
          pdpQty -= 1;
          qtyValEl.textContent = String(pdpQty);
        }
      });
    }
    if (incBtn && qtyValEl) {
      incBtn.addEventListener("click", function () {
        pdpQty += 1;
        qtyValEl.textContent = String(pdpQty);
      });
    }
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        addToCart(product.id, pdpQty);
      });
    }
    if (buyBtn) {
      buyBtn.addEventListener("click", function () {
        openBuyNowCheckout(product.id, pdpQty);
      });
    }

    // Produk Terkait
    var relatedHost = document.getElementById("nk-related-products");
    if (relatedHost) {
      var related = (CFG.products || [])
        .filter(function (item) {
          return item.id !== product.id;
        })
        .slice(0, 3);
      relatedHost.innerHTML = related.map(createProductCardHtml).join("");
      bindProductActionButtons(relatedHost);
    }
  }

  /* ------------------------------------------------------------------------
     HIDRASI HALAMAN INFORMASI (PEMBAYARAN, KONTAK, FAQ, TENTANG KAMI)
     ------------------------------------------------------------------------ */

  function initSubpages() {
    // 1. Halaman Cara Pembayaran
    var paymentHost = document.getElementById("nk-payment-methods");
    if (paymentHost && Array.isArray(CFG.paymentMethods)) {
      paymentHost.innerHTML = CFG.paymentMethods
        .map(function (pm, idx) {
          return (
            '<div class="info-card">' +
            '  <div class="info-card-step">Metode ' + (idx + 1) + "</div>" +
            "  <h3>" + escapeHtml(pm.name) + "</h3>" +
            '  <p style="font-weight:700;color:var(--nk-navy);margin-bottom:4px;" class="tabular-nums">' + escapeHtml(pm.accountNumber) + "</p>" +
            '  <p style="margin-bottom:10px;">a.n. ' + escapeHtml(pm.accountHolder) + "</p>" +
            '  <p style="font-size:13px;margin-bottom:14px;">' + escapeHtml(pm.note) + "</p>" +
            '  <button type="button" class="btn btn-outline btn-sm" data-copy-text="' + escapeHtml(pm.accountNumber) + '">Salin Nomor</button>' +
            "</div>"
          );
        })
        .join("");

      paymentHost.querySelectorAll("[data-copy-text]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var text = btn.getAttribute("data-copy-text");
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
              showToast("Nomor pembayaran disalin: " + text);
            });
          } else {
            showToast("Nomor pembayaran: " + text);
          }
        });
      });
    }

    // 2. Halaman Kontak
    var contactInfoHost = document.getElementById("nk-contact-info");
    if (contactInfoHost && CFG.contact) {
      var c = CFG.contact;
      contactInfoHost.innerHTML =
        '<div class="info-card">' +
        "  <h3>Informasi Layanan Pelanggan</h3>" +
        '  <p style="margin-bottom:16px;">Hubungi tim kami untuk pertanyaan produk, panduan instalasi template, atau konfirmasi pembayaran.</p>' +
        '  <div style="display:flex;flex-direction:column;gap:12px;font-size:14px;">' +
        "    <div><strong>WhatsApp:</strong><br/>" + escapeHtml(c.whatsappDisplay) + "</div>" +
        "    <div><strong>Email:</strong><br/>" + escapeHtml(c.email) + "</div>" +
        "    <div><strong>Jam Operasional:</strong><br/>" + escapeHtml(c.operationalHours) + "</div>" +
        "    <div><strong>Alamat:</strong><br/>" + escapeHtml(c.address) + "</div>" +
        "  </div>" +
        "</div>";
    }

    var contactForm = document.getElementById("nk-contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = (document.getElementById("nk-contact-name") || {}).value || "";
        var topic = (document.getElementById("nk-contact-topic") || {}).value || "";
        var msg = (document.getElementById("nk-contact-message") || {}).value || "";
        var storeName = (CFG.store && CFG.store.name) || "NusaKlik Store";

        var fullText =
          "Halo " + storeName + ",\n" +
          "Nama: " + name.trim() + "\n" +
          "Topik: " + topic.trim() + "\n" +
          "Pesan: " + msg.trim();

        var waNum = String((CFG.contact && CFG.contact.whatsappNumber) || "6281234567890").replace(/[^0-9]/g, "");
        var waLink = "https://wa.me/" + waNum + "?text=" + encodeURIComponent(fullText);

        var resultBox = document.getElementById("nk-contact-result");
        if (resultBox) {
          resultBox.innerHTML =
            '<div class="order-summary-box" style="margin-top:16px;">' +
            '  <p style="margin:0 0 10px;font-weight:600;color:var(--nk-navy);">Pesan Anda siap dikirim melalui WhatsApp:</p>' +
            '  <a href="' + waLink + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Buka WhatsApp Sekarang</a>' +
            "</div>";
        }
      });
    }

    // 3. Halaman Tentang Kami (Logo Utama & Foto Studio)
    var aboutLogo = document.getElementById("nk-about-logo-main");
    if (aboutLogo && CFG.store) {
      aboutLogo.setAttribute("src", assetUrl(CFG.store.logoMain));
      aboutLogo.setAttribute("alt", CFG.store.name);
    }

    var aboutPhoto = document.getElementById("nk-about-page-img");
    if (aboutPhoto && CFG.store) {
      aboutPhoto.setAttribute("src", assetUrl(CFG.store.aboutImage));
    }

    // 4. Accordion FAQ
    document.querySelectorAll(".faq-question").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        if (!item) return;
        var isOpen = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }

  /* ------------------------------------------------------------------------
     INISIALISASI SAAT DOM SIAP
     ------------------------------------------------------------------------ */

  document.addEventListener("DOMContentLoaded", function () {
    applyThemeAndFavicon();
    renderSharedLayout();
    initHomePage();
    initProductDetailPage();
    initSubpages();
  });
})();
