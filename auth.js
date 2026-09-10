// Utility: SHA-256 Cryptographic Hash
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// UI: Toast Alert System
function triggerToast(message, type = "info") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    setTimeout(() => {
        toast.className = "toast hidden";
    }, 3500);
}

// UI: View Toggle (Login <-> Register)
function toggleForm(view) {
    const loginBox = document.getElementById("loginBox");
    const registerBox = document.getElementById("registerBox");

    if (view === "register") {
        loginBox.classList.add("hidden");
        registerBox.classList.remove("hidden");
    } else {
        registerBox.classList.add("hidden");
        loginBox.classList.remove("hidden");
    }
}

// UI: Password Reveal / Mask
function toggleVisibility(inputId, icon) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    icon.classList.toggle("fa-eye", isPassword);
    icon.classList.toggle("fa-eye-slash", !isPassword);
}

// Database Helpers (Multi-User Structure in LocalStorage)
function getUsersDB() {
    return JSON.parse(localStorage.getItem("app_users_db")) || [];
}

function saveUserToDB(user) {
    const users = getUsersDB();
    users.push(user);
    localStorage.setItem("app_users_db", JSON.stringify(users));
}

// Handle Registration
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;

    if (password.length < 6) {
        triggerToast("Password must be at least 6 characters.", "danger");
        return;
    }

    const users = getUsersDB();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        triggerToast("Username is already taken.", "danger");
        return;
    }

    if (users.some(u => u.email === email)) {
        triggerToast("Email is already registered.", "danger");
        return;
    }

    const passwordHash = await hashPassword(password);
    saveUserToDB({ username, email, passwordHash, registeredAt: new Date().toISOString() });

    triggerToast("Registration successful! Please sign in.", "success");
    document.getElementById("registerForm").reset();
    toggleForm("login");
});

// Handle Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    const passwordHash = await hashPassword(password);
    const users = getUsersDB();
    const matchedUser = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === passwordHash
    );

    if (matchedUser) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("active_user", JSON.stringify({
            username: matchedUser.username,
            email: matchedUser.email
        }));

        triggerToast("Authentication successful. Redirecting...", "success");
        setTimeout(() => {
            window.location.href = "welcome.html";
        }, 1000);
    } else {
        triggerToast("Invalid credentials. Please verify your details.", "danger");
    }
});