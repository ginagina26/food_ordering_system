// profile.js
const API_BASE = '/food_ordering_system/backend/api';

document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login to view your profile');
        window.location.href = 'login.html';
        return;
    }

    // Load profile data
    loadProfile(user);
    loadOrders(user.id);

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
});

function loadProfile(user) {
    // Set profile avatar
    document.getElementById('profileAvatar').textContent = user.full_name.charAt(0).toUpperCase();

    // Set profile name and email
    document.getElementById('profileName').textContent = user.full_name;
    document.getElementById('profileEmail').textContent = user.email;

    // Set role
    const roleMap = {
        'customer': 'Customer',
        'restaurant_owner': 'Restaurant Owner',
        'admin': 'Administrator'
    };
    document.getElementById('profileRole').textContent = roleMap[user.role] || user.role;

    // Set member since (from created_at if available)
    if (user.created_at) {
        const date = new Date(user.created_at);
        document.getElementById('memberSince').textContent = date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    }

    // Set address
    if (user.address) {
        document.getElementById('userAddress').textContent = user.address;
    }
}

function loadOrders(userId) {
    fetch(`${API_BASE}/orders.php?user_id=${userId}`)
        .then(res => res.json())
        .then(orders => {
            const container = document.getElementById('ordersContainer');

            // Update total orders count
            document.getElementById('totalOrders').textContent = orders.length;

            if (orders.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📦</div>
                        <h3>No orders yet</h3>
                        <p>Start ordering your favorite food!</p>
                    </div>
                `;
                return;
            }

            // Display orders
            container.innerHTML = '';
            orders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'order-card';

                const statusClass = `status-${order.status}`;
                const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                orderCard.innerHTML = `
                    <div class="order-header">
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-status ${statusClass}">${statusText}</div>
                    </div>
                    <div class="order-details">
                        <p><strong>Date:</strong> ${orderDate}</p>
                        <p><strong>Restaurant:</strong> ${order.restaurant_name || 'N/A'}</p>
                    </div>
                    <div class="order-total">Total: TSh ${parseFloat(order.total_amount).toFixed(2)}</div>
                `;

                container.appendChild(orderCard);
            });
        })
        .catch(err => {
            console.error('Error loading orders:', err);
            document.getElementById('ordersContainer').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Error loading orders</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        });
}

// Tab switching function (globally accessible)
window.switchTab = function (tabName) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to selected tab
    if (tabName === 'view') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('viewProfileTab').classList.add('active');
    } else if (tabName === 'edit') {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('editProfileTab').classList.add('active');

        // Populate form with current user data
        const user = JSON.parse(localStorage.getItem('user'));
        document.getElementById('editName').value = user.full_name || '';
        document.getElementById('editEmail').value = user.email || '';
        document.getElementById('editAddress').value = user.address || '';
        document.getElementById('editPassword').value = '';
        document.getElementById('editPasswordConfirm').value = '';

        // Hide any previous messages
        const updateMessage = document.getElementById('updateMessage');
        updateMessage.className = 'update-message';
        updateMessage.textContent = '';
    }
}

// Handle profile form submission
document.addEventListener('DOMContentLoaded', function () {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const user = JSON.parse(localStorage.getItem('user'));
            const updateMessage = document.getElementById('updateMessage');

            // Get form values
            const fullName = document.getElementById('editName').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            const address = document.getElementById('editAddress').value.trim();
            const password = document.getElementById('editPassword').value;
            const passwordConfirm = document.getElementById('editPasswordConfirm').value;

            // Validate passwords if provided
            if (password || passwordConfirm) {
                if (password !== passwordConfirm) {
                    updateMessage.className = 'update-message error';
                    updateMessage.textContent = 'Passwords do not match!';
                    return;
                }
                if (password.length < 6) {
                    updateMessage.className = 'update-message error';
                    updateMessage.textContent = 'Password must be at least 6 characters!';
                    return;
                }
            }

            // Prepare update data
            const updateData = {
                id: user.id,
                full_name: fullName,
                email: email,
                address: address
            };

            // Add password if provided
            if (password) {
                updateData.password = password;
            }

            // Send update request
            fetch(`${API_BASE}/users.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.message && data.message.includes('success')) {
                        // Update localStorage
                        user.full_name = fullName;
                        user.email = email;
                        user.address = address;
                        localStorage.setItem('user', JSON.stringify(user));

                        // Show success message
                        updateMessage.className = 'update-message success';
                        updateMessage.textContent = 'Profile updated successfully!';

                        // Reload profile display
                        loadProfile(user);

                        // Switch back to view tab after 2 seconds
                        setTimeout(() => {
                            switchTab('view');
                        }, 2000);
                    } else {
                        updateMessage.className = 'update-message error';
                        updateMessage.textContent = data.message || 'Failed to update profile';
                    }
                })
                .catch(err => {
                    console.error('Error updating profile:', err);
                    updateMessage.className = 'update-message error';
                    updateMessage.textContent = 'Error updating profile. Please try again.';
                });
        });
    }
});
