document.addEventListener('DOMContentLoaded', function() {
    // ========== MOBILE MENU TOGGLE ==========
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('toggle');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking links
        document.querySelectorAll('.mobile-links a, .mobile-actions a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('toggle');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ========== HEADER SCROLL EFFECT ==========
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ========== CURRENCY CONVERTER ==========
    const currencyConverter = {
        rates: { USD: 0.055, EUR: 0.050 }, // Example conversion rates (ZAR to USD/EUR)
        products: [
            { name: "Noir Essence", price: 1299 },
            { name: "Golden Amber", price: 1499 },
            { name: "Jasmine Bloom", price: 1199 },
            { name: "Citrus Zest", price: 999 }
        ],
        
        init: function() {
            const currencyDropdown = document.querySelector('.currency-dropdown');
            if (!currencyDropdown) return;
            
            document.querySelectorAll('.currency-dropdown a').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const currency = e.target.getAttribute('data-currency');
                    this.updateCurrency(currency);
                });
            });
        },
        
        updateCurrency: function(currency) {
            const currencyBtn = document.querySelector('.currency-btn');
            if (!currencyBtn) return;
            
            // Update button text
            currencyBtn.innerHTML = `<i class="fas fa-money-bill-wave"></i> ${currency}`;
            
            // Update all prices on page
            document.querySelectorAll('.product-card').forEach((card, index) => {
                const priceElement = card.querySelector('.product-price');
                if (!priceElement) return;
                
                const product = this.products[index];
                if (!product) return;
                
                if (currency === 'ZAR') {
                    priceElement.textContent = `R${product.price.toLocaleString('en-ZA')}.00`;
                } else {
                    const convertedPrice = (product.price * this.rates[currency]).toLocaleString('en-US', {
                        style: 'currency',
                        currency: currency
                    });
                    priceElement.textContent = convertedPrice;
                }
            });
        }
    };
    currencyConverter.init();

    // ========== QUICK VIEW MODAL ==========
    const modalManager = {
        init: function() {
            this.modal = document.getElementById('quickViewModal');
            if (!this.modal) return;
            
            // Close modal when clicking close button or outside
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('close-modal')) {
                    this.closeModal();
                }
            });
            
            // Initialize quick view buttons
            document.querySelectorAll('.quick-view-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productCard = btn.closest('.product-card');
                    if (productCard) {
                        this.openModal(productCard);
                    }
                });
            });
        },
        
        openModal: function(productCard) {
            if (!this.modal) return;
            
            const img = productCard.querySelector('.product-img').style.backgroundImage;
            const name = productCard.querySelector('.product-name').textContent;
            const price = productCard.querySelector('.product-price').textContent;
            const desc = productCard.querySelector('.product-description').textContent;
            
            this.modal.querySelector('.modal-content').innerHTML = `
                <div class="modal-product-container">
                    <div class="modal-product-image" style="background-image: ${img}"></div>
                    <div class="modal-product-info">
                        <span class="close-modal">&times;</span>
                        <h2>${name}</h2>
                        <p class="modal-product-price">${price}</p>
                        <p class="modal-product-desc">${desc}</p>
                        
                        <div class="modal-product-options">
                            <div class="form-group">
                                <label>Size</label>
                                <select class="size-select">
                                    <option value="50ml">50ml - ${price}</option>
                                    <option value="100ml">100ml - ${this.calculateLargeSizePrice(price)}</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Quantity</label>
                                <input type="number" class="quantity-input" value="1" min="1">
                            </div>
                        </div>
                        
                        <button class="btn add-to-cart modal-add-to-cart">Add to Cart</button>
                        <button class="btn btn-outline modal-wishlist">Add to Wishlist</button>
                    </div>
                </div>
            `;
            
            // Add event listeners to new modal buttons
            this.modal.querySelector('.modal-add-to-cart')?.addEventListener('click', this.addToCartFromModal);
            this.modal.style.display = 'flex';
            document.body.classList.add('no-scroll');
        },
        
        calculateLargeSizePrice: function(price) {
            const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
            const largePrice = numericPrice * 1.7;
            return price.includes('R') 
                ? `R${largePrice.toLocaleString('en-ZA')}.00`
                : `$${largePrice.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        },
        
        closeModal: function() {
            if (!this.modal) return;
            this.modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        },
        
        addToCartFromModal: function() {
            const modal = document.getElementById('quickViewModal');
            if (!modal) return;
            
            const productName = modal.querySelector('h2').textContent;
            const price = modal.querySelector('.modal-product-price').textContent;
            const size = modal.querySelector('.size-select').value;
            const quantity = modal.querySelector('.quantity-input').value;
            
            console.log(`Added to cart: ${quantity}x ${productName} (${size}) - ${price}`);
            alert(`${quantity}x ${productName} (${size}) added to cart!`);
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    };
    modalManager.init();

    // ========== ADD TO CART FUNCTIONALITY ==========
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') && !e.target.classList.contains('modal-add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            if (!productCard) return;
            
            const productName = productCard.querySelector('.product-name').textContent;
            const price = productCard.querySelector('.product-price').textContent;
            
            console.log(`Added to cart: ${productName} - ${price}`);
            alert(`${productName} added to cart!`);
        }
    });

    // ========== NEWSLETTER FORM ==========
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            console.log(`Newsletter subscription: ${email}`);
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }

    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== CART FUNCTIONALITY (SIMPLIFIED) ==========
    class ShoppingCart {
        constructor() {
            this.items = [];
            this.init();
        }
        
        init() {
            // In a real app, you would load cart from localStorage or API
            console.log('Cart initialized');
        }
        
        addItem(product, quantity, size) {
            this.items.push({ product, quantity, size });
            console.log('Cart updated:', this.items);
            // In real app, update UI and localStorage
        }
    }
    
    // Initialize cart
    const cart = new ShoppingCart();
});