// Authentication Modal System
// This script enables login/signup modals on any page

// Ensure apiUrl function is available (from api-config.js)
if (typeof apiUrl === 'undefined') {
    window.apiUrl = (path) => {
        const BACKEND_URL = 'https://project1-9-xejo.onrender.com';
        return BACKEND_URL ? `${BACKEND_URL}${path}` : path;
    };
}

// Toggle user menu dropdown
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        alert('Đã đăng xuất thành công!');
        window.location.reload();
    }
}
function createAuthModals() {
    const modalsHTML = `
    <!-- Login Modal -->
    <div id="loginModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
                <h2 class="text-xl font-bold">Login</h2>
                <button onclick="closeAuthModals()" class="text-2xl hover:text-gray-200">&times;</button>
            </div>

            <!-- Modal Body -->
            <div class="p-6">
                <form id="loginForm" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Email</label>
                        <input type="email" id="loginEmail" placeholder="your@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Password</label>
                        <div class="relative">
                            <input type="password" id="loginPassword" placeholder="••••••••" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                            <button type="button" onclick="toggleLoginPassword()" class="absolute right-3 top-2 text-gray-500 hover:text-gray-700">
                                <i class="fas fa-eye" id="loginPwIcon"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="rememberMe" class="w-4 h-4 text-indigo-600 rounded">
                        <label for="rememberMe" class="ml-2 text-gray-700">Remember me</label>
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-2 rounded-lg transition">
                        Login
                    </button>
                </form>

                <div class="text-center mb-4">
                    <button onclick="openForgotPasswordModal()" class="text-blue-600 hover:text-blue-800 font-semibold">
                        <i class="fas fa-question-circle mr-1"></i><span data-i18n="forgot_password">Forgot password?</span>
                    </button>
                </div>

                <div class="text-center mt-4">
                    <p class="text-gray-600">Don't have an account? 
                        <button onclick="switchToSignup()" class="text-indigo-600 hover:text-indigo-800 font-bold">Sign up now</button>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Forgot Password Modal -->
    <div id="forgotPasswordModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 class="text-xl font-bold"><span data-i18n="forgot_password_title">Reset Password</span></h2>
                <button onclick="closeAuthModals()" class="text-2xl hover:text-gray-200">&times;</button>
            </div>

            <!-- Modal Body -->
            <div class="p-6">
                <p class="text-gray-600 mb-4" data-i18n="forgot_password_instruction">Enter your email address and we'll send you a reset link.</p>
                
                <form id="forgotPasswordForm" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2" data-i18n="email">Email</label>
                        <input type="email" id="forgotEmail" placeholder="your@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    </div>
                    
                    <button type="submit" id="forgotPasswordBtn" class="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 rounded-lg transition">
                        <span data-i18n="send_reset_link">Send Reset Link</span>
                    </button>
                </form>

                <div id="forgotPasswordMessage" class="hidden mt-4 p-4 rounded-lg text-center"></div>

                <div class="text-center mt-4">
                    <button onclick="switchToLogin()" class="text-green-600 hover:text-green-800 font-bold">
                        <i class="fas fa-arrow-left mr-1"></i><span data-i18n="back_to_login">Back to Login</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Signup Modal -->
    <div id="signupModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
                <h2 class="text-xl font-bold">Sign Up</h2>
                <button onclick="closeAuthModals()" class="text-2xl hover:text-gray-200">&times;</button>
            </div>

            <!-- Modal Body -->
            <div class="p-6">
                <form id="signupForm" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Full Name</label>
                        <input type="text" id="signupName" placeholder="Nguyễn Văn A" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Email</label>
                        <input type="email" id="signupEmail" placeholder="your@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Phone Number (optional)</label>
                        <input type="tel" id="signupPhone" placeholder="0123456789" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Password</label>
                        <div class="relative">
                            <input type="password" id="signupPassword" placeholder="••••••••" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                            <button type="button" onclick="toggleSignupPassword()" class="absolute right-3 top-2 text-gray-500 hover:text-gray-700">
                                <i class="fas fa-eye" id="signupPwIcon"></i>
                            </button>
                        </div>
                        <div id="passwordStrength" class="mt-2">
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div id="strengthBar" class="h-2 rounded-full transition-all bg-gray-300" style="width: 0%"></div>
                            </div>
                            <p class="text-xs text-gray-600 mt-1">Độ mạnh: <span id="strengthText">Chưa nhập</span></p>
                        </div>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                        <div class="relative">
                            <input type="password" id="signupConfirmPassword" placeholder="••••••••" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                            <button type="button" onclick="toggleSignupConfirmPassword()" class="absolute right-3 top-2 text-gray-500 hover:text-gray-700">
                                <i class="fas fa-eye" id="signupConfirmPwIcon"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <input type="checkbox" id="agreeTerms" class="w-4 h-4 text-purple-600 rounded mt-1" required>
                        <label for="agreeTerms" class="ml-2 text-sm text-gray-700">
                            I agree to the <a href="#" class="text-purple-600 hover:text-purple-800">Terms of Service</a> and <a href="#" class="text-purple-600 hover:text-purple-800">Privacy Policy</a>
                        </label>
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 rounded-lg transition">
                        Sign Up
                    </button>
                </form>

                <div class="text-center mt-4">
                    <p class="text-gray-600">Have an account? 
                        <button onclick="switchToLogin()" class="text-purple-600 hover:text-purple-800 font-bold">Log in here</button>
                    </p>
                </div>
            </div>
        </div>
    </div>
    `;

    // Insert modals at the end of body if not already present
    if (!document.getElementById('loginModal')) {
        document.body.insertAdjacentHTML('beforeend', modalsHTML);
    }
}

// Open login modal
function openLoginModal() {
    closeAuthModals();
    document.getElementById('loginModal').classList.remove('hidden');
}

// Open signup modal
function openSignupModal() {
    closeAuthModals();
    document.getElementById('signupModal').classList.remove('hidden');
}

// Close all modals
function closeAuthModals() {
    document.getElementById('loginModal')?.classList.add('hidden');
    document.getElementById('signupModal')?.classList.add('hidden');
    document.getElementById('forgotPasswordModal')?.classList.add('hidden');
    // Reset forgot password form state
    resetForgotPasswordForm();
}

// Open forgot password modal
function openForgotPasswordModal() {
    closeAuthModals();
    resetForgotPasswordForm();
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
}

// Reset forgot password form to initial state
function resetForgotPasswordForm() {
    document.getElementById('forgotPasswordForm')?.reset();
    document.getElementById('forgotPasswordMessage')?.classList.add('hidden');
    const btn = document.getElementById('forgotPasswordBtn');
    if (btn) {
        btn.innerHTML = '<span data-i18n="send_reset_link">Send Reset Link</span>';
        btn.disabled = false;
    }
    if (window.currentLanguage && window.LanguageManager) {
        window.LanguageManager.updatePageLanguage();
    }
}

// Switch to signup from login
function switchToSignup() {
    openSignupModal();
}

// Switch to login from signup
function switchToLogin() {
    openLoginModal();
}

// Toggle login password visibility
function toggleLoginPassword() {
    const input = document.getElementById('loginPassword');
    const icon = document.getElementById('loginPwIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.add('fa-eye');
        icon.classList.remove('fa-eye-slash');
    }
}

// Toggle signup password visibility
function toggleSignupPassword() {
    const input = document.getElementById('signupPassword');
    const icon = document.getElementById('signupPwIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.add('fa-eye');
        icon.classList.remove('fa-eye-slash');
    }
}

// Toggle signup confirm password visibility
function toggleSignupConfirmPassword() {
    const input = document.getElementById('signupConfirmPassword');
    const icon = document.getElementById('signupConfirmPwIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.add('fa-eye');
        icon.classList.remove('fa-eye-slash');
    }
}

// Toggle new password visibility (forgot password)
function toggleNewPassword() {
    const input = document.getElementById('newPassword');
    const icon = document.getElementById('newPwIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.add('fa-eye');
        icon.classList.remove('fa-eye-slash');
    }
}

// Toggle confirm new password visibility (forgot password)
function toggleConfirmNewPassword() {
    const input = document.getElementById('confirmNewPassword');
    const icon = document.getElementById('confirmNewPwIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.add('fa-eye');
        icon.classList.remove('fa-eye-slash');
    }
}

// Check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[@$!%*?&]+/)) strength++;

    const strengths = [
        { text: 'Not entered', color: 'bg-gray-300', width: 0 },
        { text: 'Weak', color: 'bg-red-500', width: 20 },
        { text: 'Medium', color: 'bg-yellow-500', width: 40 },
        { text: 'Good', color: 'bg-blue-500', width: 60 },
        { text: 'Very good', color: 'bg-green-500', width: 80 },
        { text: 'Excellent', color: 'bg-green-600', width: 100 }
    ];

    const info = strengths[strength];
    const bar = document.getElementById('strengthBar');
    bar.style.width = info.width + '%';
    bar.className = `h-2 rounded-full transition-all ${info.color}`;
    document.getElementById('strengthText').textContent = info.text;
}

// Initialize modals
document.addEventListener('DOMContentLoaded', function() {
    createAuthModals();

    // Setup form event listeners
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);
    }

    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('input', (e) => checkPasswordStrength(e.target.value));
    }

    // Close modals when clicking outside
    document.getElementById('loginModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeAuthModals();
    });

    document.getElementById('signupModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeAuthModals();
    });

    document.getElementById('forgotPasswordModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeAuthModals();
    });
});

// State for forgot password flow
let forgotPasswordStep = 1; // 1: request code, 2: verify code and reset

// Handle forgot password submission
async function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value.trim();
    const btn = document.getElementById('forgotPasswordBtn');
    const messageBox = document.getElementById('forgotPasswordMessage');
    
    btn.disabled = true;
    messageBox.classList.add('hidden');
    
    try {
        const response = await fetch(apiUrl('/api/forgot-password'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            messageBox.textContent = 'Reset link sent! Redirecting...';
            messageBox.className = 'show mt-4 p-4 rounded-lg text-center bg-green-100 text-green-800';
            messageBox.classList.remove('hidden');
            
            // Redirect to reset password page after 2 seconds
            setTimeout(() => {
                window.location.href = 'reset-password.html?email=' + encodeURIComponent(email);
            }, 2000);
        } else {
            messageBox.textContent = data.message || 'Failed to send reset link';
            messageBox.className = 'show mt-4 p-4 rounded-lg text-center bg-red-100 text-red-800';
            messageBox.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        messageBox.textContent = 'Server connection error';
        messageBox.className = 'show mt-4 p-4 rounded-lg text-center bg-red-100 text-red-800';
        messageBox.classList.remove('hidden');
    } finally {
        btn.disabled = false;
    }
}

// Handle login submission
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    console.log('🔍 Login attempt:', { email, passwordLength: password.length });

    try {
        const response = await fetch(apiUrl('/api/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        console.log('📡 Response status:', response.status, response.ok);

        const data = await response.json();
        console.log('📦 Response data:', data);

        if (response.ok && data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', email);
            if (rememberMe) {
                localStorage.setItem('savedEmail', email);
            }
            alert('Login successful!');
            closeAuthModals();
            window.location.reload();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Server connection error');
    }
}

// Handle signup submission
async function handleSignupSubmit(e) {
    e.preventDefault();

    const fullname = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp');
        return;
    }

    try {
        const response = await fetch(apiUrl('/api/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullname, email, phone, password })
        });


        const data = await response.json();

        if (response.ok && data.success) {
            alert('Registration successful! Please log in.');
            closeAuthModals();
            switchToLogin();
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Server connection error');
    }
}

// Close modals on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAuthModals();
    }
});

// Update user menu based on login status
function updateUserMenu() {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    
    const loggedInMenu = document.getElementById('loggedInMenu');
    const loggedOutMenu = document.getElementById('loggedOutMenu');
    const userEmail = document.getElementById('userEmail');
    const userDisplayName = document.getElementById('userDisplayName');
    
    if (loggedInMenu && loggedOutMenu) {
        if (token && email) {
            loggedInMenu.classList.remove('hidden');
            loggedOutMenu.classList.add('hidden');
            if (userEmail) userEmail.textContent = email;
            if (userDisplayName) userDisplayName.textContent = email.split('@')[0];
        } else {
            loggedInMenu.classList.add('hidden');
            loggedOutMenu.classList.remove('hidden');
        }
    }
}

// Initialize on page load
window.addEventListener('load', function() {
    createAuthModals();
    updateUserMenu();
});

// Check if user is logged in (for compatibility with existing pages)
function checkUserLoggedIn() {
    updateUserMenu();
}
