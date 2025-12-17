let basketItems = [];
        let currentId = 0; // Simple unique ID generator

        function generateUniqueId() {
            return currentId++;
        }
        
        // Custom non-blocking message box utility
        function showMessage(message) {
            const box = document.getElementById('message-box');
            box.textContent = message;
            box.classList.add('visible');
            setTimeout(() => {
                box.classList.remove('visible');
            }, 3000);
        }

        function updateBasketCount() {
            const count = basketItems.length;
            const countElement = document.getElementById('basket-count');
            if (countElement) {
                countElement.textContent = `Basket (${count})`;
            }
        }

        function addToBasket(productName, price) {
            const newItem = {
                id: generateUniqueId(),
                name: productName,
                price: price
            };
            basketItems.push(newItem);
            updateBasketCount();
            renderBasket(); // Update modal content
            showMessage(`${productName} added to basket.`);
        }

        function removeItem(id) {
            const initialCount = basketItems.length;
            // Filter out the item with the matching ID
            basketItems = basketItems.filter(item => item.id !== id);
            
            if (basketItems.length < initialCount) {
                updateBasketCount();
                renderBasket();
                showMessage(`Item removed from basket.`);
            }
        }

        function renderBasket() {
            const content = document.getElementById('basket-content');
            const summary = document.getElementById('basket-summary');
            let total = 0;
            let html = '';

            if (basketItems.length === 0) {
                html = '<p style="text-align:center; color:#6b7280; margin-top: 2.5rem;">Your basket is currently empty.</p>';
                summary.innerHTML = '<p style="font-size:1.125rem; font-weight:500;">Total: $0.00</p>';
            } else {
                basketItems.forEach(item => {
                    total += item.price;
                    html += `
                        <div class="item-row">
                            <div>
                                <p style="font-weight:500;">${item.name}</p>
                                <p style="font-size:0.875rem; color:#6b7280;">$${item.price.toFixed(2)}</p>
                            </div>
                            <button onclick="removeItem(${item.id})">
                                Remove
                            </button>
                        </div>
                    `;
                });
                
                summary.innerHTML = `
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary" style="width:100%;" onclick="showMessage('Proceeding to Checkout!'); closeBasket();">
                        Proceed to Checkout
                    </button>
                `;
            }
            content.innerHTML = html;
        }

        function openBasket() {
            document.getElementById('basket-modal').classList.add('open');
            document.getElementById('basket-overlay').classList.add('open');
            renderBasket(); // Ensure basket is rendered when opened
        }

        function closeBasket() {
            document.getElementById('basket-modal').classList.remove('open');
            document.getElementById('basket-overlay').classList.remove('open');
        }
        
        // JS for filtering luxury products
        function filterProducts(category, event) {
            showMessage(`Displaying: ${category} items`);
            
            // Toggle active state on filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.currentTarget.classList.add('active'); 
            
            // Simulate filtering
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'All' || cardCategory === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Initialize on window load
        window.onload = () => {
             // Find the 'All' button and trigger the filter function on it.
             const allButton = document.querySelector('.filter-btn[onclick*="All"]');
             if (allButton) {
                // Simulate the click event to activate the button and filter
                filterProducts('All', { currentTarget: allButton });
             }
             
             // Ensure initial basket count is updated
             updateBasketCount();
        };
