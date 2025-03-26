import { BASE_URL, isLoggedIn } from "./config.js";
import { getUserIdFromToken } from "./main.js";

/**
 * Updates the favorite items count in the header.
 * This function fetches the count of wishlist items from the API
 * and updates the corresponding element in the UI.
 */
export async function updateFavoriteCount() {
	// Check if the user is logged in
	const token = isLoggedIn();
	if (!token) return;

	try {
		// Fetch the wishlist count from the API
		const response = await fetch(`${BASE_URL}wishlist`, {
			method: "GET", // Use GET instead of POST
			headers: {
				token: token, // Include the authentication token
			},
		});

		// Check if the response is valid
		if (!response.ok) throw new Error("Failed to fetch wishlist count.");

		const result = await response.json();

		// Ensure the response contains a valid structure
		if (result.status === "success" && result.count !== undefined) {
			// Update the favorite count in the header
			const countElement = document.querySelector(".count_favourite");
			if (countElement) {
				countElement.textContent = result.count || 0; // Display the count or 0 if undefined
			}
		} else {
			console.error("Invalid response structure");
		}
	} catch (error) {
		console.error("❌ Error fetching wishlist count:", error);
	}
}

/**
 * Updates the cart items count in the UI.
 * If a count is provided, it updates the UI directly.
 * If no count is provided, it fetches the count from the API based on the logged-in user.
 * @param {number|null} count - The cart item count (optional, defaults to null)
 */
export function updateCartCount(count = null) {
	// Select cart count elements in the header
	const cartCountElement = document.querySelector(".count_item_header");
	const cartCounterElement = document.querySelector("#cart-counter");

	// Check if cart count elements exist
	if (!cartCountElement && !cartCounterElement) {
		console.warn("⚠️ Warning: No cart count elements found!");
		return;
	}

	// If count is not provided, fetch it from the API
	const token = isLoggedIn();
	if (count === null && token) {
		const userId = getUserIdFromToken(token);

		fetch(`${BASE_URL}cart?userId=${userId}`, {
			method: "GET",
			headers: { token: token },
		})
			.then((response) => response.json())
			.then((cartData) => {
				// Extract the cart item count from the response
				const itemCount = cartData.numOfCartItems || 0;
				// Update the UI with the fetched count
				if (cartCountElement) cartCountElement.textContent = itemCount;
				if (cartCounterElement) cartCounterElement.textContent = itemCount;
			})
			.catch((error) => {
				console.error("❌ Error loading cart:", error);
			});
	} else if (count !== null) {
		// If count is provided, update the UI directly
		if (cartCountElement) cartCountElement.textContent = count;
		if (cartCounterElement) cartCounterElement.textContent = count;
	}
}
