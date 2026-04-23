// ==================== AUTHENTICATION FUNCTIONS ====================
const AUTH_KEY = 'isLoggedIn';

function checkLoginStatus() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function requireAuth() {
    if (!checkLoginStatus()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function login(username, password) {
    if (username === 'admin' && password === 'password123') {
        sessionStorage.setItem(AUTH_KEY, 'true');
        return true;
    }
    return false;
}

function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

function updateUIBasedOnLogin() {
    const isLoggedIn = checkLoginStatus();
    const adminBtn = document.getElementById('adminBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (adminBtn) {
        adminBtn.style.display = isLoggedIn ? 'inline-flex' : 'none';
    }
    if (userInfo) {
        userInfo.style.display = isLoggedIn ? 'block' : 'none';
    }
}

// Event listener untuk logout buttons
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
});