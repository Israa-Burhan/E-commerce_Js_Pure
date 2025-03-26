import { BASE_URL, isLoggedIn, showToast } from "./config.js";
import { updateCartCount } from "./updateCount.js";
const loader = document.getElementById("loader-container");

async function fetchCartData() {
	const token = isLoggedIn();
	if (!token) {
		showToast("Please log in to view your cart.", "info");
		return;
	}
	loader.style.display = "flex";
	try {
		const response = await fetch(`${BASE_URL}cart`, {
			method: "GET",
			headers: { token: token },
		});

		if (!response.ok) throw new Error("Failed to fetch cart data.");

		const data = await response.json();

		if (data && data.data && Array.isArray(data.data.products)) {
			displayCartData(data.data.products);
		} else {
			throw new Error("Unexpected data format.");
		}
	} catch (error) {
		console.error("❌ Error fetching cart data:", error);
		showToast("Failed to load cart. Please try again.", "error");
	} finally {
		loader.style.display = "none";
	}
}

function displayCartData(cartData) {
	const cartBody = document.getElementById("cart-body");

	cartBody.innerHTML = "";

	let totalPrice = 0;

	if (!cartData || cartData.length === 0) {
		cartBody.innerHTML = "<tr><td colspan='6'>Your cart is empty.</td></tr>";
		return;
	}

	cartData.forEach((item) => {
		const productTotal = item.price * item.count;
		totalPrice += productTotal;

		const cartItem = document.createElement("tr");
		cartItem.innerHTML = `
      <td><img src="${item.product.imageCover}" alt="${item.product.title}" ></td>
      <td>${item.product.title}</td>
      <td>${item.price} EGP</td>
      <td>
        <button class="decrease-qty" data-id="${item.product.id}">-</button>
        <span class="quantity" data-id="${item.product.id}">${item.count}</span>
        <button class="increase-qty" data-id="${item.product.id}">+</button>
      </td>
      <td>${productTotal}</td>
      <td>
        <button class="remove-item" data-id="${item.product.id}">Remove</button>
      </td>
    `;
		cartBody.appendChild(cartItem);
	});

	const totalPriceElem = document.getElementById("total-price");
	if (totalPriceElem) {
		totalPriceElem.textContent = ` ${totalPrice} EGP`;
	}

	document.querySelectorAll(".remove-item").forEach((button) => {
		button.addEventListener("click", handleRemoveItem);
	});

	document.querySelectorAll(".increase-qty").forEach((button) => {
		button.addEventListener("click", handleIncreaseQty);
	});

	document.querySelectorAll(".decrease-qty").forEach((button) => {
		button.addEventListener("click", handleDecreaseQty);
	});
}

async function handleIncreaseQty(event) {
	const productId = event.target.dataset.id;
	await updateCartQuantity(productId, "increase");
}

async function handleDecreaseQty(event) {
	const productId = event.target.dataset.id;
	await updateCartQuantity(productId, "decrease");
}

async function updateCartQuantity(productId, action) {
	const token = isLoggedIn();
	const quantityElement = document.querySelector(
		`.quantity[data-id='${productId}']`
	);
	let currentQuantity = parseInt(quantityElement.textContent, 10);

	if (action === "increase") {
		currentQuantity++;
	} else if (action === "decrease" && currentQuantity > 1) {
		currentQuantity--;
	} else {
		return;
	}

	try {
		const response = await fetch(`${BASE_URL}cart/${productId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
			body: JSON.stringify({ count: currentQuantity }),
		});

		if (!response.ok) throw new Error("Failed to update item quantity.");

		fetchCartData();
		showToast("✅ Cart Quantity updated successfully.", "success");
	} catch (error) {
		console.error("❌ Error updating item:", error);
		showToast("Failed to update item. Please try again.", "error");
	}
}

async function handleRemoveItem(event) {
	const productId = event.target.dataset.id;
	const token = isLoggedIn();

	try {
		const response = await fetch(`${BASE_URL}cart/${productId}`, {
			method: "DELETE",
			headers: { token: token },
		});

		if (!response.ok) throw new Error("Failed to remove item from cart.");

		fetchCartData();
		showToast("✅ Product removed from cart.", "success");
	} catch (error) {
		console.error("❌ Error removing item:", error);
		showToast("Failed to remove item. Please try again.", "error");
	}

	updateCartCount();
}

async function clearCart() {
	const token = isLoggedIn();

	try {
		const response = await fetch(`${BASE_URL}cart`, {
			method: "DELETE",
			headers: { token: token },
		});

		if (!response.ok) throw new Error("Failed to clear cart.");

		fetchCartData();
		showToast("✅ All products removed from cart.", "success");
	} catch (error) {
		console.error("❌ Error clearing cart:", error);
		showToast("Failed to clear cart. Please try again.", "error");
	}

	updateCartCount();
}
document.addEventListener("DOMContentLoaded", () => {
	fetchCartData();
	const clearCartBtn = document.getElementById("clear-cart-btn");
	if (clearCartBtn) {
		clearCartBtn.addEventListener("click", clearCart);
	}
});
