import { BASE_URL } from "./config.js";

const form = document.querySelector("form");
const submitButton = document.querySelector("button[type='submit']");

const nameRegex = /^[a-zA-Z\s]{3,20}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegex = /^01[0125][0-9]{8}$/;

function showMessage(message, isError = true) {
	let toastContainer = document.getElementById("toast-container");
	if (!toastContainer) {
		toastContainer = document.createElement("div");
		toastContainer.id = "toast-container";
		document.body.appendChild(toastContainer);
	}

	const toast = document.createElement("div");
	toast.className = `toast ${isError ? "toast-error" : "toast-success"}`;
	toast.innerHTML = `
      <span>${message}</span>
      <button class="close-btn">&times;</button>
  `;

	const closeButton = toast.querySelector(".close-btn");
	closeButton.addEventListener("click", () => toast.remove());

	setTimeout(() => toast.remove(), 5000);

	toastContainer.appendChild(toast);
}

if (form && form.id === "signUpForm") {
	const signUpFields = ["name", "email", "password", "rePassword", "Phone"];
	const validationRules = {
		name: nameRegex,
		email: emailRegex,
		password: passwordRegex,
		Phone: phoneRegex,
	};

	const checkSignUpFields = () => {
		const allValid = signUpFields.every((id) => {
			const input = document.getElementById(id);
			const value = input.value.trim();
			const errorElement = document.getElementById(id + "Error");

			if (id === "rePassword") {
				const password = document.getElementById("password").value;
				const isValid = value === password;
				errorElement.style.display = value && !isValid ? "block" : "none";
				return isValid;
			}

			const isValid = validationRules[id]?.test(value) ?? true;
			errorElement.style.display = value && !isValid ? "block" : "none";
			return isValid;
		});

		submitButton.disabled = !allValid;
	};

	signUpFields.forEach((id) => {
		const input = document.getElementById(id);

		input.addEventListener("input", checkSignUpFields);
	});

	form.addEventListener("submit", async function (event) {
		event.preventDefault();

		const name = document.getElementById("name").value.trim();
		const email = document.getElementById("email").value.trim();
		const password = document.getElementById("password").value;
		const rePassword = document.getElementById("rePassword").value;
		const phone = document.getElementById("Phone").value.trim();

		submitButton.innerHTML =
			'<span class="loader"> <i class="fa-solid fa-spinner"></i></span>';

		const formData = { name, email, password, rePassword, phone };

		try {
			const response = await fetch(`${BASE_URL}auth/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				showMessage("Registration successful! Redirecting...", false);
				setTimeout(() => (window.location.href = "login.html"), 2000);
			} else {
				const errorData = await response.json();
				showMessage(errorData.message || "Registration failed.", true);
			}
		} catch (error) {
			showMessage("An error occurred. Please try again.", true);
		} finally {
			submitButton.innerHTML = "SignUp";
			submitButton.disabled = false;
		}
	});

	submitButton.disabled = true;
}

if (form && form.id === "loginForm") {
	const loginFields = ["email", "password"];

	const checkLoginFields = () => {
		const allValid = loginFields.every((id) => {
			const input = document.getElementById(id);
			const value = input.value.trim();
			const errorElement = document.getElementById(id + "Error");

			if (id === "password" && value !== "") {
				return true;
			}

			if (id === "email" && value !== "") {
				const isValid = emailRegex.test(value);
				errorElement.style.display = isValid ? "none" : "block";
				return isValid;
			}

			if (value === "") {
				if (errorElement) {
					errorElement.style.display = "none";
				}
				return false;
			}

			return true;
		});

		submitButton.disabled = !allValid;
	};

	loginFields.forEach((id) => {
		document.getElementById(id).addEventListener("input", checkLoginFields);
	});

	form.addEventListener("submit", async function (event) {
		event.preventDefault();

		const email = document.getElementById("email").value.trim();
		const password = document.getElementById("password").value;

		submitButton.innerHTML =
			'<span class="loader"><i class="fa-solid fa-spinner"></i></span>';

		const formData = { email, password };

		try {
			const response = await fetch(`${BASE_URL}auth/signin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				const userData = await response.json();
				const user = {
					name: userData.user.name,
					email: userData.user.email,
					token: userData.token,
				};
				localStorage.setItem("user", JSON.stringify(user));
				showMessage("Login successful! Redirecting...", false);
				setTimeout(() => (window.location.href = "index.html"), 2000);
			} else {
				const errorData = await response.json();
				showMessage(errorData.message || "Login failed.", true);
			}
		} catch (error) {
			showMessage("An error occurred. Please try again.", true);
		} finally {
			submitButton.innerHTML = "Login";
			submitButton.disabled = false;
		}
	});

	checkLoginFields();
}
