
// PASSWORD SHOW/HIDE


function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
}

const showPass1 = document.getElementById("showPass1");
if (showPass1) showPass1.onclick = () => togglePassword("password");

const showPass2 = document.getElementById("showPass2");
if (showPass2) showPass2.onclick = () => togglePassword("repassword");

const showLoginPass = document.getElementById("showLoginPass");
if (showLoginPass) showLoginPass.onclick = () => togglePassword("loginPassword");

// EMAIL VALIDATION FUNCTION (ADDED)

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// PASSWORD STRENGTH INDICATOR (ADDED)

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length > 5) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    return strength;
}

const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("strengthText"); // make optional

if (passwordInput && strengthText) {
    passwordInput.addEventListener("input", () => {
        let strength = getPasswordStrength(passwordInput.value);
        let msg = ["Weak ❌", "Medium ⚠️", "Strong ✅"];

        strengthText.textContent = msg[strength] || "Weak ❌";
        strengthText.style.color = strength === 2 ? "green" : strength === 1 ? "orange" : "red";
    });
}



// REGISTRATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();
        let repassword = document.getElementById("repassword").value.trim();

        if (!name || !email || !password || !repassword) {
            alert("❗ All fields are required");
            return;
        }

        if (!isValidEmail(email)) {
            alert("❗ Enter a valid email format");
            return;
        }

        const strongPass = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!strongPass.test(password)) {
            alert("❗ Password must contain:\n- 1 Capital letter\n- 1 Number\n- Min 6 characters");
            return;
        }

        if (password !== repassword) {
            alert("❗ Passwords do not match");
            return;
        }

        // Prevent duplicate registration (ADDED)
        let existingUser = JSON.parse(localStorage.getItem("user"));
        if (existingUser && existingUser.email === email) {
            alert("❗ Email already registered. Please login.");
            return;
        }

        const user = { name, email, password };
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "false");

        alert("🎉 Registration Successful!");
        window.location.href = "login.html";
    });
}


// AUTO-FILL EMAIL INTO LOGIN PAGE (ADDED)

const stored = JSON.parse(localStorage.getItem("user"));
if (stored && document.getElementById("loginEmail")) {
    document.getElementById("loginEmail").placeholder = "Registered: " + stored.email;
}

// LOGIN

const loginForm = document.getElementById("loginForm");
let loginAttempts = 0; // ADDED

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let loginEmail = document.getElementById("loginEmail").value.trim();
        let loginPassword = document.getElementById("loginPassword").value.trim();

        let storedUser = JSON.parse(localStorage.getItem("user"));

        if (!loginEmail || !loginPassword) {
            alert("❗ Enter both fields");
            return;
        }

        if (!storedUser) {
            alert("❗ No user found! Please register first.");
            return;
        }

        if (loginAttempts >= 3) {
            alert("❌ Too many wrong attempts. Try again later.");
            return;
        }

        if (loginEmail === storedUser.email && loginPassword === storedUser.password) {
            alert("✅ Login Successful!");
            localStorage.setItem("isLoggedIn", "true");

            // Auto Logout after 20 minutes (ADDED)
            localStorage.setItem("sessionExpires", Date.now() + 20 * 60 * 1000);

            window.location.href = "navbar.html";
        } else {
            loginAttempts++;
            alert("❌ Incorrect email or password\nAttempts: " + loginAttempts);
        }
    });
}





// PROTECT NAVBAR PAGE

if (window.location.pathname.includes("navbar.html")) {
    const loginStatus = localStorage.getItem("isLoggedIn");

    if (loginStatus !== "true") {
        alert("❌ You must login first!");
        window.location.href = "login.html";
    }
}


//DISPLAY USER NAME IN NAVBAR
const userDisplay = document.getElementById("userNameDisplay");
if (userDisplay) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) userDisplay.innerText = "Hello, " + storedUser.name;
}



// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.setItem("isLoggedIn", "false");
        alert("👋 Logged out successfully");
        window.location.href = "login.html";
    };
}




// Reset forms after submit (ADDED)
function resetAllForms() {
    document.querySelectorAll("input").forEach(i => i.value = "");
}

// Navbar animation (ADDED)
const nav = document.querySelector(".navbar");
if (nav) {
    nav.style.transition = "0.5s";
    nav.onmouseover = () => nav.style.opacity = "0.8";
    nav.onmouseout = () => nav.style.opacity = "1";
}

// Save last visited page (ADDED)
localStorage.setItem("lastPage", window.location.pathname);

// Detect returning user
if (stored && document.getElementById("welcomeBack")) {
    document.getElementById("welcomeBack").innerText =
        "Welcome back, " + stored.name + "! 👋";
}



