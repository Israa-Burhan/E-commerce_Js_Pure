import { BASE_URL, isLoggedIn } from "./config.js";
import { getUserIdFromToken } from "./main.js";
export async function updateFavoriteCount() {
	// تحقق من تسجيل الدخول أولاً
	const token = isLoggedIn();
	if (!token) return;

	try {
		const response = await fetch(`${BASE_URL}wishlist`, {
			method: "GET", // استخدام GET بدلاً من POST
			headers: {
				token: token, // إضافة التوكن للتوثيق
			},
		});

		if (!response.ok) throw new Error("Failed to fetch wishlist count.");

		const result = await response.json();

		// التحقق من أن الاستجابة تحتوي على status و count
		if (result.status === "success" && result.count !== undefined) {
			// تحديث العدد في الهيدر
			const countElement = document.querySelector(".count_favourite");
			if (countElement) {
				countElement.textContent = result.count || 0; // استخدام العدد من الاستجابة
			}
		} else {
			console.error("Invalid response structure");
		}
	} catch (error) {
		console.error("❌ Error fetching wishlist count:", error);
	}
}
export function updateCartCount(count = null) {
	const cartCountElement = document.querySelector(".count_item_header");
	const cartCounterElement = document.querySelector("#cart-counter");

	if (!cartCountElement && !cartCounterElement) {
		console.warn("⚠️ Warning: No cart count elements found!");
		return;
	}
	const token = isLoggedIn();
	if (count === null && token) {
		const userId = getUserIdFromToken(token);

		fetch(`${BASE_URL}cart?userId=${userId}`, {
			method: "GET",
			headers: { token: token },
		})
			.then((response) => response.json())
			.then((cartData) => {
				const itemCount = cartData.numOfCartItems || 0;
				if (cartCountElement) cartCountElement.textContent = itemCount;
				if (cartCounterElement) cartCounterElement.textContent = itemCount;
			})
			.catch((error) => {
				console.error("❌ Error loading cart:", error);
			});
	} else if (count !== null) {
		if (cartCountElement) cartCountElement.textContent = count;
		if (cartCounterElement) cartCounterElement.textContent = count;
	}
}
