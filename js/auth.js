// Authentication JavaScript

// User Type Selection
document.addEventListener('DOMContentLoaded', function() {
    // Handle user type selection in registration
    const typeOptions = document.querySelectorAll('.type-option');
    const userTypeInput = document.getElementById('user_type');
    const restaurantInfo = document.getElementById('restaurantInfo');
    const restaurantName = document.getElementById('restaurant_name');
    const cuisineType = document.getElementById('cuisine_type');
    
    if (typeOptions.length > 0) {
        typeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                typeOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Update hidden input
                const type = this.getAttribute('data-type');
                userTypeInput.value = type;
                
                // Show/hide restaurant info
                if (type === 'restaurant') {
                    restaurantInfo.style.display = 'block';
                    restaurantName.required = true;
                    cuisineType.required = true;
                } else {
                    restaurantInfo.style.display = 'none';
                    restaurantName.required = false;
                    cuisineType.required = false;
                }
            });
        });
    }
    
    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // For demo purposes - redirect to dashboard
            console.log('Login attempt:', { email, password });
            alert('Login successful! Redirecting to dashboard...');
            
            // Simulate API call
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }
    
    // Registration Form Validation
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Password validation
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm_password');
        const passwordError = document.getElementById('password-error');
        const passwordStrength = document.getElementById('password-strength');
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 'Weak';
            let color = '#dc3545';
            
            if (password.length >= 8) {
                if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
                    strength = 'Strong';
                    color = '#28a745';
                } else {
                    strength = 'Medium';
                    color = '#ffc107';
                }
            }
            
            passwordStrength.textContent = `Password strength: ${strength}`;
            passwordStrength.style.color = color;
        });
        
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                passwordError.textContent = 'Passwords do not match';
            } else {
                passwordError.textContent = '';
            }
        });
        
        // Form submission
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const terms = document.getElementById('terms');
            if (!terms.checked) {
                alert('Please agree to the Terms & Conditions');
                return;
            }
            
            if (passwordInput.value !== confirmPasswordInput.value) {
                alert('Passwords do not match');
                return;
            }
            
            // Collect form data
            const formData = {
                user_type: userTypeInput.value,
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                password: passwordInput.value,
                address: document.getElementById('address').value
            };
            
            // Add restaurant info if applicable
            if (userTypeInput.value === 'restaurant') {
                formData.restaurant_name = restaurantName.value;
                formData.cuisine_type = cuisineType.value;
            }
            
            console.log('Registration data:', formData);
            alert('Registration successful! Redirecting to login...');
            
            // Simulate API call
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
});

// Demo Login Function
function demoLogin(type) {
    const demos = {
        customer: {
            email: 'customer@demo.com',
            password: 'demo123'
        },
        restaurant: {
            email: 'restaurant@demo.com',
            password: 'demo123'
        },
        rider: {
            email: 'rider@demo.com',
            password: 'demo123'
        }
    };
    
    const demo = demos[type];
    if (!demo) return;
    
    // Auto-fill login form
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && passwordInput) {
        emailInput.value = demo.email;
        passwordInput.value = demo.password;
        
        // Auto-submit after a delay
        setTimeout(() => {
            if (document.getElementById('loginForm')) {
                document.getElementById('loginForm').dispatchEvent(new Event('submit'));
            }
        }, 500);
    } else {
        alert(`Demo ${type} login\nEmail: ${demo.email}\nPassword: ${demo.password}`);
    }
}

// Password Visibility Toggle (Optional Enhancement)
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}