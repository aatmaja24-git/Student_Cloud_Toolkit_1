const BASE_URL = "http://student-toolkit-env.eba-hr5gd8jd.us-east-1.elasticbeanstalk.com";

// Register
async function register() {
    const userInput = document.getElementById("regUser");
    const passInput = document.getElementById("regPass");

    if (!userInput || !passInput) {
        alert("Register form not loaded correctly");
        return;
    }

    const user = userInput.value.trim();
    const pass = passInput.value.trim();

    if (!user || !pass) {
        alert("Please fill all fields");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user,
                password: pass
            })
        });

        const data = await res.json();
        alert(data.message);

        if (res.ok) {
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Register error:", error);
        alert("Error connecting to server");
    }
}

// Login
async function login() {
    const userInput = document.getElementById("loginUser");
    const passInput = document.getElementById("loginPass");

    if (!userInput || !passInput) {
        alert("Login form not loaded correctly");
        return;
    }

    const user = userInput.value.trim();
    const pass = passInput.value.trim();

    if (!user || !pass) {
        alert("Please enter username and password");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user,
                password: pass
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Invalid credentials");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", user);

        alert(data.message || "Login successful");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed");
    }
}

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

// Protect dashboard page
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
}

// Redirect away from login/register if already logged in
function redirectIfLoggedIn() {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = "index.html";
    }
}

// Navigation helpers
function goToLogin() {
    window.location.href = "login.html";
}

function goToRegister() {
    window.location.href = "register.html";
}

// Safe button binding after DOM loads
document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const gotoLoginBtn = document.getElementById("gotoLoginBtn");
    const gotoRegisterBtn = document.getElementById("gotoRegisterBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (registerBtn) {
        registerBtn.addEventListener("click", register);
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", login);
    }

    if (gotoLoginBtn) {
        gotoLoginBtn.addEventListener("click", goToLogin);
    }

    if (gotoRegisterBtn) {
        gotoRegisterBtn.addEventListener("click", goToRegister);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
})