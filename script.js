// Toggle password visibility
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const input = document.getElementById(targetId);
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("fa-eye-slash");
  });
});

// Forms
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotForm = document.getElementById("forgotForm");

document.getElementById("showSignup").addEventListener("click", e => {
  e.preventDefault();
  loginForm.classList.remove("active");
  signupForm.classList.add("active");
});
document.getElementById("showLogin").addEventListener("click", e => {
  e.preventDefault();
  signupForm.classList.remove("active");
  forgotForm.classList.remove("active");
  loginForm.classList.add("active");
});
document.getElementById("showForgot").addEventListener("click", e => {
  e.preventDefault();
  loginForm.classList.remove("active");
  forgotForm.classList.add("active");
});
document.getElementById("backToLogin").addEventListener("click", e => {
  e.preventDefault();
  forgotForm.classList.remove("active");
  loginForm.classList.add("active");
});

// Login validation + redirection
loginForm.addEventListener("submit", () => {
  const role = document.getElementById("loginRole").value;
  const user = document.getElementById("loginUsername").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();
  const error = document.getElementById("loginError");
  const success = document.getElementById("loginSuccess");

  if (!role || !user || !pass) {
    error.textContent = "⚠ Please fill all login fields.";
    error.style.display = "block"; success.style.display = "none";
    loginForm.classList.add("shake"); setTimeout(()=>loginForm.classList.remove("shake"),400);
  } else {
    success.textContent = `✅ Logged in as ${role}. Redirecting...`;
    success.style.display = "block"; error.style.display = "none";
    loginForm.classList.add("pulse"); 
    setTimeout(()=>loginForm.classList.remove("pulse"),600);

    // Redirect after short delay (simulate processing)
    setTimeout(() => {
      if (role === "admin") {
        window.location.href = "e-gram-admin-dashboard/admin-dashboard.html";
      } else if (role === "officer") {
        window.location.href = "e-gram-officer-dashboard/officer-dashboard.html";
      } else if (role === "citizen") {
        window.location.href = "e-gram-user-dashboard/user-dashboard.html";
      } else {
        error.textContent = "⚠ Invalid role selected.";
        error.style.display = "block";
      }
    }, 1500);
  }
});

// Signup validation
signupForm.addEventListener("submit", () => {
  const role = document.getElementById("signupRole").value;
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const user = document.getElementById("signupUsername").value.trim();
  const pass = document.getElementById("signupPassword").value.trim();
  const confirm = document.getElementById("signupConfirm").value.trim();
  const error = document.getElementById("signupError");
  const success = document.getElementById("signupSuccess");

  if (!role || !name || !email || !user || !pass || !confirm) {
    error.textContent = "⚠ Please fill all registration fields.";
    error.style.display = "block"; success.style.display = "none";
    signupForm.classList.add("shake"); setTimeout(()=>signupForm.classList.remove("shake"),400);
  } else if (pass !== confirm) {
    error.textContent = "⚠ Passwords do not match.";
    error.style.display = "block"; success.style.display = "none";
    signupForm.classList.add("shake"); setTimeout(()=>signupForm.classList.remove("shake"),400);
  } else {
    success.textContent = "✅ Registration successful! You can login now.";
    success.style.display = "block"; error.style.display = "none";
    signupForm.classList.add("pulse"); setTimeout(()=>signupForm.classList.remove("pulse"),600);
  }
});

// Forgot password validation
forgotForm.addEventListener("submit", () => {
  const email = document.getElementById("forgotEmail").value.trim();
  const pass = document.getElementById("forgotPassword").value.trim();
  const confirm = document.getElementById("forgotConfirm").value.trim();
  const error = document.getElementById("forgotError");
  const success = document.getElementById("forgotSuccess");

  if (!email || !pass || !confirm) {
    error.textContent = "⚠ Please fill all reset fields.";
    error.style.display = "block"; success.style.display = "none";
    forgotForm.classList.add("shake"); setTimeout(()=>forgotForm.classList.remove("shake"),400);
  } else if (pass !== confirm) {
    error.textContent = "⚠ Passwords do not match.";
    error.style.display = "block"; success.style.display = "none";
    forgotForm.classList.add("shake"); setTimeout(()=>forgotForm.classList.remove("shake"),400);
  } else {
    success.textContent = "✅ Password reset successful! Please login.";
    success.style.display = "block"; error.style.display = "none";
    forgotForm.classList.add("pulse"); setTimeout(()=>forgotForm.classList.remove("pulse"),600);
  }
});
