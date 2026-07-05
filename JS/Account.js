const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const tabs = document.querySelectorAll(".tab-btn");

function showLogin() {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
}

function showRegister() {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    tabs[1].classList.add("active");
    tabs[0].classList.remove("active");
}

/* ==============================
   REGISTER
============================== */
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = registerForm.querySelector(
        'input[type="text"]'
    ).value;

    const email = registerForm.querySelector(
        'input[type="email"]'
    ).value;

    const passwords = registerForm.querySelectorAll(
        'input[type="password"]'
    );

    const password = passwords[0].value;
    const confirmPassword = passwords[1].value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        alert("An account with this email already exists.");
        return;
    }

    users.push({
        username,
        email,
        password
    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Account created successfully!");

    registerForm.reset();

    // Return to login screen
    showLogin();
});

/* ==============================
   LOGIN
============================== */
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const loginInput = loginForm.querySelector(
        'input[type="text"]'
    ).value;

    const password = loginForm.querySelector(
        'input[type="password"]'
    ).value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u =>
            (u.email === loginInput ||
             u.username === loginInput) &&
            u.password === password
    );

    if (!user) {
        alert("Invalid username/email or password.");
        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    window.location.href = "Dashboard.html";
});