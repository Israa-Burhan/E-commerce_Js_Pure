export const BASE_URL = "https://ecommerce.routemisr.com/api/v1/";

export function showToast(message, type = "info") {
	const toast = document.createElement("div");
	toast.className = `toast toast-${type}`;
	toast.innerHTML = `${message} <button class="close-btn">&times;</button>`;
	document.body.appendChild(toast);

	const closeButton = toast.querySelector(".close-btn");
	closeButton.addEventListener("click", () => toast.remove());

	setTimeout(() => toast.remove(), 3000);
}

export function isLoggedIn() {
	const user = JSON.parse(localStorage.getItem("user"));
	return user?.token || null;
}
