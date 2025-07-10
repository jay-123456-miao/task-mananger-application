"use strict";

const signUpbtn = document.querySelector(".btn");
const usernameError = document.querySelector(".username-error");
const passwordError = document.querySelector(".password-error");
const form = document.getElementById("signup-form");

form.addEventListener("submit", function (e) {
  // Prevent default submission
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const newpassword = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("confirm_password").value;

  let hasError = false;

  // Reset errors
  usernameError.textContent = "";
  passwordError.textContent = "";
  usernameError.style.display = "none";
  passwordError.style.display = "none";

  // Validate username
  if (!username) {
    usernameError.style.display = "block";
    usernameError.textContent = "Username must be a valid string.";
    hasError = true;
  }

  // Validate password match
  if (newpassword !== passwordConfirm) {
    console.log("what is going on");
    passwordError.style.display = "block";
    passwordError.textContent = "Passwords do not match.";
    hasError = true;
  }

  // Submit the form if no error
  if (!hasError) {
    console.log("bello");
    form.submit(); // ✅ Now allow the form to go to Flask backend
  }
});
