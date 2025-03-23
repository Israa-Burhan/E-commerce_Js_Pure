/**
 * Handles opening the side menu when the button is clicked.
 */
document.getElementById("openMenuBtn").addEventListener("click", function () {
	document.getElementById("sideMenu").classList.add("open");
});

/**
 * Handles closing the side menu when the button is clicked.
 */
document.getElementById("closeMenuBtn").addEventListener("click", function () {
	document.getElementById("sideMenu").classList.remove("open");
});

/**
 * Manages user authentication state and updates the UI accordingly.
 * - Displays login/signup buttons if no user is logged in.
 * - Displays a welcome message and a logout button if a user is logged in.
 */
document.addEventListener("DOMContentLoaded", () => {
	const loginSignupBtns = document.querySelector(".login_signup");
	const user = JSON.parse(localStorage.getItem("user"));

	if (user) {
		loginSignupBtns.innerHTML = `
			<span>Welcome, ${user.name}</span>
			<button id="logoutBtn" class="btn">Logout</button>
		`;

		document.getElementById("logoutBtn").addEventListener("click", () => {
			localStorage.removeItem("user");

			// Remove cart data specific to the user
			const userId = user.id || user.email;
			localStorage.removeItem(`cart_${userId}`);

			document.querySelector(".count_item_header").textContent = 0;

			// Redirect to the homepage after logout
			window.location.href = "index.html";
		});
	} else {
		loginSignupBtns.innerHTML = `
			<a href="login.html" class="btn">Login <i class="fa-solid fa-right-to-bracket"></i></a>
			<a href="register.html" class="btn">Sign Up <i class="fa-solid fa-user-plus"></i></a>
		`;
	}
});

/**
 * Highlights the active navigation link based on the current page.
 */
document.addEventListener("DOMContentLoaded", function () {
	let currentPage = window.location.pathname.split("/").pop();

	if (currentPage === "" || currentPage === "index.html") {
		currentPage = "index.html";
	}

	const navItems = document.querySelectorAll(".nav_item");

	navItems.forEach((item) => {
		if (item.dataset.page === currentPage) {
			item.classList.add("active");
		}
	});
});
