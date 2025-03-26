import { BASE_URL, isLoggedIn, showToast } from "./config.js";
import { updateFavoriteCount } from "./updateCount.js";

const loader = document.getElementById("loader-container");

/**
 * Fetches the user's favorite products from the API.
 * If the user is not logged in, a message is displayed.
 */
async function fetchFavorites() {
	const token = isLoggedIn();
	if (!token) {
		showToast("Please log in to view your favorites.", "info");

		return;
	}
	loader.style.display = "flex";
	try {
		const response = await fetch(`${BASE_URL}wishlist`, {
			method: "GET",
			headers: {
				token: token,
			},
		});

		if (!response.ok) throw new Error("Failed to fetch favorites.");

		const result = await response.json();

		if (result.status === "success" && result.data.length > 0) {
			displayFavorites(result.data);
		} else {
			showToast("No favorites found.", "info");
		}
	} catch (error) {
		console.error("❌ Error fetching favorites:", error);
		showToast("Error fetching favorites.", "error");
	} finally {
		loader.style.display = "none";
	}
}
// Fetch and display favorite products on page load
document.addEventListener("DOMContentLoaded", function () {
	fetchFavorites();
});

/**
 * Displays the list of favorite products in the table.
 * @param {Array} favorites - List of favorite products.
 */
function displayFavorites(favorites) {
	const tableBody = document.querySelector("#favorites-table tbody");
	tableBody.innerHTML = "";

	favorites.forEach((favorite) => {
		const row = document.createElement("tr");

		// Create and append image cell
		const imageCell = document.createElement("td");
		const image = document.createElement("img");
		image.src = favorite.imageCover;
		image.alt = favorite.title;
		image.width = 50;
		image.height = 50;
		imageCell.appendChild(image);

		// Create and append title cell
		const titleCell = document.createElement("td");
		titleCell.textContent = favorite.title;

		// Create and append price cell
		const priceCell = document.createElement("td");
		priceCell.textContent = `${favorite.price} `;

		// Create and append actions cell
		const actionsCell = document.createElement("td");
		const removeButton = document.createElement("button");
		removeButton.textContent = "Remove";
		removeButton.classList.add("remove-from-favorites");
		removeButton.dataset.id = favorite.id;

		// Add event listener for remove button
		removeButton.addEventListener("click", (event) => {
			const productId = event.target.dataset.id;
			if (productId) {
				handleRemoveFavorite(productId);
			} else {
				console.error("Product ID is missing.");
				showToast("Product information is incomplete.", "error");
			}
		});

		actionsCell.appendChild(removeButton);

		row.appendChild(imageCell);
		row.appendChild(titleCell);
		row.appendChild(priceCell);
		row.appendChild(actionsCell);

		tableBody.appendChild(row);
	});
}

/**
 * Handles the removal of a product from the favorites list.
 * @param {string} productId - The ID of the product to remove.
 */
async function handleRemoveFavorite(productId) {
	const token = isLoggedIn();

	if (!productId) {
		console.error("Product ID is missing.");
		showToast("Product ID is missing. Please try again.", "error");
		return;
	}

	try {
		const response = await fetch(`${BASE_URL}wishlist/${productId}`, {
			method: "DELETE",
			headers: { token: token },
		});

		// if (!response.ok) throw new Error("Failed to remove item from favorites.");

		await fetchFavorites();
		showToast("✅ Product removed from favorites.", "success");
	} catch (error) {
		showToast("Failed to remove item. Please try again.", "error");
	}

	updateFavoriteCount();
}
