const express = require('express');
document.addEventListener('DOMContentLoaded', function() {
    const cart = [];
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.querySelector('.cart-total');

    document.querySelectorAll('.coffee-item').forEach(item => {
        const quantity = item.querySelector('.quantity');
        const price = parseFloat(item.querySelector('.price').textContent.substring(1));

        item.querySelector('.plus').addEventListener('click', function() {
            quantity.textContent = parseInt(quantity.textContent) + 1;
        });

        item.querySelector('.minus').addEventListener('click', function() {
            if (parseInt(quantity.textContent) > 0) {
                quantity.textContent = parseInt(quantity.textContent) - 1;
            }
        });

        item.querySelector('.add-to-cart').addEventListener('click', function() {
            const itemName = item.querySelector('h3').textContent;
            const itemQuantity = parseInt(quantity.textContent);
            if (itemQuantity > 0) {
                const existingItem = cart.find(cartItem => cartItem.name === itemName);
                if (existingItem) {
                    existingItem.quantity += itemQuantity;
                } else {
                    cart.push({ name: itemName, price, quantity: itemQuantity });
                }
                updateCart();
            }
        });
    });

    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;
        cart.forEach(cartItem => {
            const li = document.createElement('li');
            li.textContent = `${cartItem.name} - £${(cartItem.price * cartItem.quantity).toFixed(2)} (x${cartItem.quantity})`;

            // Add "Remove" button
            const removeButton = document.createElement('span');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-item');
            removeButton.addEventListener('click', function() {
                removeItem(cartItem.name);
            });

            li.appendChild(removeButton);
            cartList.appendChild(li);
            total += cartItem.price * cartItem.quantity;
        });

        cartTotal.textContent = `Total: £${total.toFixed(2)}`;
    }

    function removeItem(itemName) {
        const index = cart.findIndex(cartItem => cartItem.name === itemName);
        if (index !== -1) {
            cart.splice(index, 1);
            updateCart();
        }
    }

    // Clear all items in the cart
    document.querySelector('.clear-cart').addEventListener('click', function() {
        cart.length = 0;
        updateCart();
    });

    // Submit Order
    document.querySelector('.submit-order').addEventListener('click', function() {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before submitting.");
            return;
        }

        // Collect order data
        const orderData = {
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        };

        // Send order data to backend
        fetch('/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Order submitted successfully!");
                cart.length = 0; // Clear the cart after successful submission
                updateCart();
            } else {
                alert("Failed to submit order. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            alert("An error occurred. Please try again.");
        });
    });

    const toggleButton = document.getElementById('dark-mode-toggle');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    });
});

const app = express();
const bodyParser = require('body-parser');

// Parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle order submission
app.post('/submit-order', (req, res) => {
    const order = req.body;

    // You can now process this order, for example:
    // Save to a database or send an email
    console.log('Order received:', order);

    // Simulate saving to the database
    // In real use, save the order data to your database

    // Send a response back to the client
    res.json({ success: true, message: "Order submitted successfully" });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
