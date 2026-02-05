// DOM Elements
const userTypeOptions = document.querySelectorAll('.type-option');
const userTypeInput = document.getElementById('user_type');
const registerForm = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');
const passwordStrength = document.getElementById('password-strength');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

// User Type Selection
userTypeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        userTypeOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Update hidden input value
        const type = option.getAttribute('data-type');
        userTypeInput.value = type;
        
        // Optional: Update form based on user type
        updateFormForUserType(type);
    });
});

// Password Strength Indicator
passwordInput.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    // Check password strength
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Update strength indicator
    const width = strength * 25;
    passwordStrength.style.width = width + '%';
    
    // Update color based on strength
    if (strength <= 1) {
        passwordStrength.style.backgroundColor = '#e74c3c';
    } else if (strength <= 3) {
        passwordStrength.style.backgroundColor = '#f39c12';
    } else {
        passwordStrength.style.backgroundColor = '#27ae60';
    }
});

// Password Confirmation
confirmPasswordInput.addEventListener('input', function() {
    const password = passwordInput.value;
    const confirmPassword = this.value;
    
    if (password !== confirmPassword) {
        passwordError.textContent = 'Passwords do not match';
        this.style.borderColor = '#e74c3c';
    } else {
        passwordError.textContent = '';
        this.style.borderColor = '#27ae60';
    }
});

// Email Validation
emailInput.addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        this.style.borderColor = '#e74c3c';
    } else {
        emailError.textContent = '';
        this.style.borderColor = '#27ae60';
    }
});

// Form Submission
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const email = emailInput.value;
    
    let isValid = true;
    
    // Check password match
    if (password !== confirmPassword) {
        passwordError.textContent = 'Passwords do not match';
        confirmPasswordInput.style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailInput.style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    // If form is valid, submit (in real app, this would send to server)
    if (isValid) {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // In a real application, you would send data to your server here
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            console.log('Registration data:', data);
            
            // Show success message (in real app, redirect to login or dashboard)
            alert('Account created successfully! Please check your email for verification.');
            
            // Reset form
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Reset user type selection
            userTypeOptions.forEach(opt => opt.classList.remove('active'));
            userTypeOptions[0].classList.add('active');
            userTypeInput.value = 'customer';
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            
        }, 2000);
    }
});

// Helper function to update form based on user type
function updateFormForUserType(type) {
    // You can customize form behavior based on user type
    const addressField = document.getElementById('address');
    
    switch(type) {
        case 'restaurant':
            addressField.placeholder = 'Enter restaurant address';
            break;
        case 'rider':
            addressField.placeholder = 'Enter your home address';
            break;
        default:
            addressField.placeholder = 'Enter your address';
    }
}

// Initialize form based on default selection
updateFormForUserType('customer');