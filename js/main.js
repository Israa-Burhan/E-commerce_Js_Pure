import { BASE_URL, isLoggedIn, showToast } from "./config.js";
import { updateCartCount, updateFavoriteCount } from "./updateCount.js";
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const container = document.getElementById("products-container");
const loader = document.getElementById("loader-container");
let allProducts = [];
let cartProducts = [];
let wishlist = [];

/**
 * Fetches all products from the API, handling pagination if necessary.
 * The retrieved products are stored in `allProducts` and displayed on the page.
 */
async function fetchAllProducts() {
	let currentPage = 1;
	let totalPages = 1;

	try {
		do {
			const response = await fetch(`${BASE_URL}products?page=${currentPage}`);
			if (!response.ok)
				throw new Error(`Failed to fetch products (Page: ${currentPage})`);

			const data = await response.json();

			if (data?.data && Array.isArray(data.data)) {
				allProducts = allProducts.concat(data.data);
				totalPages = data.metadata?.numberOfPages || 1;
				currentPage++;
			} else {
				throw new Error("Invalid data format received.");
			}
		} while (currentPage <= totalPages);

		loadProducts(allProducts);
	} catch (error) {}
}

// async function loadProducts(products) {
// 	await fetchFavorites();

// 	loader.style.display = "flex";
// 	container.innerHTML = "";
// 	setTimeout(() => {
// 		if (products.length === 0) {
// 			container.innerHTML = "<p class='no-products'>No products available.</p>";
// 		} else {
// 			products.forEach((product) => {
// 				const productElement = document.createElement("div");
// 				productElement.classList.add("product");
// 				const shortTitle = product.title.split(" ").slice(0, 2).join(" ");
// 				const subcategoryName = product.subcategory?.length
// 					? product.category.name
// 					: "No Category";
// 				productElement.innerHTML = `
// 				<span class="view-details" data-id="${product.id}">
//               <i class="fa-solid fa-eye"></i>
//             </span>
//           <img src="${product.imageCover}" alt="${product.title}">
//           <h2>${shortTitle}</h2>
//           <h3>${subcategoryName}</h3>
//           <p>
//             ${product.price} EGP
//             <span><i class="fa-solid fa-star"></i> ${
// 							product.ratingsAverage || 0
// 						}</span>
//           </p>
//           <div class="product-actions">
//             <button class="add-to-cart" data-id="${
// 							product.id
// 						}">Add to Cart</button>
//             <span class="heart" data-id="${product.id}">
//               <i class="heartIcon ${
// 								wishlist.includes(product.id) ? "fa-solid" : "fa-regular"
// 							} fa-heart"></i>
//             </span>
//           </div>
//         `;
// 				container.appendChild(productElement);
// 			});

// 			document.querySelectorAll(".add-to-cart").forEach((button) => {
// 				button.addEventListener("click", handleAddToCart);
// 			});
// 			document.querySelectorAll(".heart").forEach((heartIcon) => {
// 				heartIcon.addEventListener("click", handleWishlist);
// 			});
// 			document.querySelectorAll(".view-details").forEach((eyeIcon) => {
// 				eyeIcon.addEventListener("click", function () {
// 					const productId = this.getAttribute("data-id");
// 					window.location.href = `product-details.html?id=${productId}`;
// 				});
// 			});
// 		}

// 		loader.style.display = "none";
// 	}, 1000);
// }
async function loadProducts(products) {
	await fetchFavorites();
	displayLoaderAndClearContainer();

	setTimeout(() => {
		renderProducts(products);
	}, 1000);
}

function displayLoaderAndClearContainer() {
	if (loader) loader.style.display = "flex";
	if (container) container.innerHTML = "";
}

function renderProducts(products) {
	if (!container) return;

	if (products.length === 0) {
		container.innerHTML = "<p class='no-products'>No products available.</p>";
	} else {
		products.forEach((product) => {
			const productElement = document.createElement("div");
			productElement.classList.add("product");
			const shortTitle = product.title.split(" ").slice(0, 2).join(" ");
			const subcategoryName = product.subcategory?.length
				? product.category.name
				: "No Category";

			productElement.innerHTML = `
				<span class="view-details" data-id="${product.id}">
              <i class="fa-solid fa-eye"></i>
            </span>
          <img src="${product.imageCover}" alt="${product.title}">
          <h2>${shortTitle}</h2>
          <h3>${subcategoryName}</h3>
          <p>
            ${product.price} EGP
            <span><i class="fa-solid fa-star"></i> ${
							product.ratingsAverage || 0
						}</span>
          </p>
          <div class="product-actions">
            <button class="add-to-cart" data-id="${
							product.id
						}">Add to Cart</button>
            <span class="heart" data-id="${product.id}">
              <i class="heartIcon ${
								wishlist.includes(product.id) ? "fa-solid" : "fa-regular"
							} fa-heart"></i>
            </span>
          </div>
        `;
			container.appendChild(productElement);
		});

		// إضافة الأحداث إلى الأزرار والعناصر
		document.querySelectorAll(".add-to-cart").forEach((button) => {
			button.addEventListener("click", handleAddToCart);
		});
		document.querySelectorAll(".heart").forEach((heartIcon) => {
			heartIcon.addEventListener("click", handleWishlist);
		});
		document.querySelectorAll(".view-details").forEach((eyeIcon) => {
			eyeIcon.addEventListener("click", function () {
				const productId = this.getAttribute("data-id");
				window.location.href = `product-details.html?id=${productId}`;
			});
		});
	}

	if (loader) loader.style.display = "none";
}

fetchAllProducts();

/////////////////////////// by localStorage

// async function addToCart(productId) {
// 	const token = isLoggedIn();
// 	if (!token) {
// 		showToast("Please log in to add products to the cart.", "info");
// 		return;
// 	}

// 	// جلب معرف المستخدم من التوكن (يجب أن يدعمه الـ API)
// 	const userId = getUserIdFromToken(token);
// 	if (!userId) {
// 		console.error("❌ User ID not found.");
// 		return;
// 	}

// 	// جلب سلة المستخدم الحالية
// 	const cartData = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

// 	// تحقق إذا كان المنتج موجودًا في السلة
// 	if (cartData.includes(productId)) {
// 		showToast("This product is already in your cart.", "warning");
// 		return;
// 	}

// 	try {
// 		const response = await fetch(`${BASE_URL}cart`, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 				token: token,
// 			},
// 			body: JSON.stringify({ productId }),
// 		});

// 		if (!response.ok) throw new Error("Failed to add product to cart.");

// 		// تحديث بيانات السلة الخاصة بالمستخدم في localStorage
// 		cartData.push(productId);
// 		localStorage.setItem(`cart_${userId}`, JSON.stringify(cartData));

// 		showToast("✅ Product added to cart successfully!", "success");
// 		updateCartCount();
// 	} catch (error) {
// 		console.error("❌ Error adding to cart:", error);
// 		showToast("An error occurred. Please try again.", "error");
// 	}
// }
// function loadUserCart() {
// 	const token = isLoggedIn();
// 	if (token) {
// 		const userId = getUserIdFromToken(token);
// 		const cartData = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
// 		updateCartCount(cartData.length); // تمرير عدد المنتجات إلى updateCartCount
// 	}
// }
// function updateCartCount(count = null) {
// 	const cartCountElement = document.querySelector(".count_item_header");

// 	// التحقق من وجود العنصر لتجنب الخطأ
// 	if (!cartCountElement) {
// 		console.warn("⚠️ Warning: Element '.count_item_header' not found!");
// 		return;
// 	}

// 	const token = isLoggedIn();
// 	if (count === null && token) {
// 		const userId = getUserIdFromToken(token);
// 		const cartData = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
// 		count = cartData.length;
// 	}

// 	// تعيين العدد، وإذا لم يكن هناك منتجات اجعله 0
// 	cartCountElement.textContent = count || 0;
// }
// document.addEventListener("DOMContentLoaded", () => {
// 	updateCartCount(); // تحديث العدد عند تحميل الصفحة
// });
// function getUserIdFromToken(token) {
// 	try {
// 		if (!token) return null; // تجنب الأخطاء إذا لم يكن هناك توكن
// 		const payload = JSON.parse(atob(token.split(".")[1]));
// 		return payload?.userId || payload?.id || null; // بعض التوكنات قد تستخدم `id` بدلاً من `userId`
// 	} catch (error) {
// 		console.error("Error decoding token:", error);
// 		return null;
// 	}
// }
// function handleAddToCart(event) {
// 	const productId = event.target.getAttribute("data-id");
// 	if (productId) {
// 		addToCart(productId);
// 	}
// }
// document.addEventListener("DOMContentLoaded", loadUserCart);
// document.querySelector(".cart-icon").addEventListener("click", function (e) {
// 	const token = isLoggedIn();
// 	if (!token) {
// 		e.preventDefault(); // منع الانتقال إذا لم يكن المستخدم مسجل دخول
// 		showToast("Please log in to view your cart.", "info");
// 		// window.location.href = "login.html"; // التوجيه لصفحة تسجيل الدخول
// 	}
// });

/////////////// by api data
async function fetchCartData() {
	const token = isLoggedIn();
	if (!token) return;

	try {
		const response = await fetch(`${BASE_URL}cart`, {
			method: "GET",
			headers: { token: token },
		});

		if (!response.ok) {
			cartProducts = [];
			return;
		}

		const data = await response.json();

		if (data && data.data && Array.isArray(data.data.products)) {
			cartProducts = data.data.products.map((product) => product.product._id);
		} else {
			cartProducts = [];
		}
	} catch (error) {
		cartProducts = [];
	}
}

fetchCartData();

async function addToCart(productId) {
	const token = isLoggedIn();
	if (!token) {
		showToast("Please log in to add products to the cart.", "info");
		return;
	}
	const userId = getUserIdFromToken(token);
	if (!userId) {
		return;
	}
	if (cartProducts.includes(productId)) {
		showToast("This product is already in your cart.", "warning");
		return;
	}
	if (loader) loader.style.display = "flex";
	try {
		const response = await fetch(`${BASE_URL}cart`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
			body: JSON.stringify({ productId }),
		});

		if (!response.ok) throw new Error("Failed to add product to cart.");
		loadUserCart();

		showToast("✅ Product added to cart successfully!", "success");
		cartProducts.push(productId);
	} catch (error) {
		showToast("An error occurred. Please try again.", "error");
	} finally {
		setTimeout(() => {
			if (loader) loader.style.display = "none";
		}, 0);
	}
}

function loadUserCart() {
	const token = isLoggedIn();
	if (token) {
		const userId = getUserIdFromToken(token);
		fetch(`${BASE_URL}cart?userId=${userId}`, {
			method: "GET",
			headers: {
				token: token,
			},
		})
			.then((response) => response.json())
			.then((cartData) => {
				updateCartCount(cartData.length);
			})
			.catch((error) => {});
	}
}
export function getUserIdFromToken(token) {
	try {
		if (!token) return null;
		const payload = JSON.parse(atob(token.split(".")[1]));
		return payload?.userId || payload?.id || null;
	} catch (error) {
		console.error("Error decoding token:", error);
		return null;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	updateCartCount();
});

document.addEventListener("DOMContentLoaded", loadUserCart);

function handleAddToCart(event) {
	const productId = event.target.getAttribute("data-id");
	if (productId) {
		addToCart(productId);
	}
}

document.querySelector(".cart-icon").addEventListener("click", function (e) {
	const token = isLoggedIn();
	if (!token) {
		e.preventDefault();
		showToast("Please log in to view your cart.", "info");
	}
});

////////////////////////////////////
async function fetchFavorites() {
	const token = isLoggedIn();
	if (!token) return;

	try {
		const response = await fetch(`${BASE_URL}wishlist`, {
			method: "GET",
			headers: {
				token: token,
			},
		});

		if (!response.ok) {
			return;
		}
		const result = await response.json();
		if (result.status === "success" && result.data.length > 0) {
			wishlist = result.data.map((item) => item._id);
		}
	} catch (error) {
		console.error("❌ Error fetching favorites:", error);
	}
}

async function handleWishlist(event) {
	const token = isLoggedIn(); // التحقق من تسجيل الدخول
	if (!token) {
		showToast("You need to log in first!", "error");
		return;
	}

	const heartIcon = event.currentTarget;
	const productId = heartIcon.getAttribute("data-id");
	const icon = heartIcon.querySelector("i");

	// الحصول على المفضلة من LocalStorage
	let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

	// التحقق إذا كان المنتج موجودًا في المفضلة
	if (wishlist.includes(productId)) {
		// إزالة المنتج من المفضلة

		if (loader) loader.style.display = "flex";
		try {
			const response = await fetch(`${BASE_URL}wishlist/${productId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					token: token,
				},
			});

			const result = await response.json();

			if (response.ok) {
				// تحديث الأيقونة إلى قلب فارغ
				icon.classList.remove("fa-solid", "fa-heart");
				icon.classList.add("fa-regular", "fa-heart");

				// إزالة المنتج من المفضلة في LocalStorage
				wishlist = wishlist.filter((id) => id !== productId);
				localStorage.setItem("wishlist", JSON.stringify(wishlist));

				showToast("Product removed from wishlist", "success");
			} else {
				showToast(`Error: ${result.message}`, "error");
			}
		} catch (error) {
			console.error("❌ Error:", error);
			showToast("Failed to remove from wishlist", "error");
		} finally {
			if (loader) loader.style.display = "none";
		}
	} else {
		if (loader) loader.style.display = "flex";
		// إضافة المنتج إلى المفضلة
		try {
			const response = await fetch(`${BASE_URL}wishlist`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: token,
				},
				body: JSON.stringify({ productId }),
			});

			const result = await response.json();

			if (response.ok) {
				// تحديث الأيقونة إلى قلب ممتلئ
				icon.classList.remove("fa-regular");
				icon.classList.add("fa-solid", "fa-heart");

				// إضافة المنتج إلى المفضلة في LocalStorage
				if (!wishlist.includes(productId)) {
					wishlist.push(productId);
					localStorage.setItem("wishlist", JSON.stringify(wishlist));
				}

				showToast("Product added to wishlist!", "success");
			} else {
				showToast(`Error: ${result.message}`, "error");
			}
		} catch (error) {
			console.error("❌ Error:", error);
			showToast("Failed to add to wishlist", "error");
		} finally {
			if (loader) loader.style.display = "none";
		}
	}
	updateFavoriteCount();
}

document.addEventListener("DOMContentLoaded", () => {
	const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
	const heartIcons = document.querySelectorAll(".heart-icon");

	heartIcons.forEach((heartIcon) => {
		const productId = heartIcon.getAttribute("data-id");
		const icon = heartIcon.querySelector("i");

		if (wishlist.includes(productId)) {
			// إذا كان المنتج في المفضلة، اجعل القلب ممتلئًا
			icon.classList.remove("fa-regular");
			icon.classList.add("fa-solid", "fa-heart");
		} else {
			// إذا لم يكن المنتج في المفضلة، اجعل القلب فارغًا
			icon.classList.remove("fa-solid", "fa-heart");
			icon.classList.add("fa-regular", "fa-heart");
		}
	});
});

document.addEventListener("DOMContentLoaded", function () {
	updateFavoriteCount();
});

document.querySelector("#heart-icon a").addEventListener("click", function (e) {
	const token = isLoggedIn();
	if (!token) {
		e.preventDefault(); // منع الانتقال إذا لم يكن المستخدم مسجل دخول
		showToast("Please log in to view your wishlist.", "info");
	}
});

/////////////////////////////////

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

async function fetchProductDetails() {
	if (!productId) return;

	try {
		const response = await fetch(`${BASE_URL}products/${productId}`);
		if (!response.ok) return;

		const { data } = await response.json();
		displayProductDetails(data);
	} catch (error) {}
}
function displayProductDetails(product) {
	const mainImage = document.getElementById("main-image");
	const title = document.getElementById("product-title");
	const description = document.getElementById("product-description");
	const price = document.getElementById("product-price");
	const rating = document.getElementById("product-rating");
	const brand = document.getElementById("product-brand");
	const quantity = document.getElementById("product-quantity");
	const sold = document.getElementById("product-sold");
	const category = document.getElementById("product-category");
	const thumbnailsContainer = document.getElementById("image-thumbnails");
	const actionsContainer = document.getElementById("product-actions");

	if (mainImage) mainImage.src = product.imageCover || "default.jpg";
	if (title) title.innerText = product.title || "No Title";
	if (description)
		description.innerText = product.description || "No Description";
	if (price)
		price.innerHTML = ` <span>Price :</span>  ${
			product.price ? `${product.price} EGP` : "Not available"
		}`;
	if (rating)
		rating.innerHTML = ` <span>Rating : </span> <i class="fa-solid fa-star star"></i> ${
			product.ratingsAverage || "No ratings"
		}`;
	if (brand)
		brand.innerHTML = `<span>Brand : </span>  ${
			product.brand?.name || "No Brand"
		}`;
	if (quantity)
		quantity.innerHTML = ` <span>Quantity : </span> ${
			product.quantity || "Out of stock"
		}`;
	if (sold) sold.innerHTML = ` <span>Sold : </span> ${product.sold || 0}`;
	if (category)
		category.innerHTML = `<span>Category :</span>  ${
			product.category?.name || "No Category"
		}`;
	if (thumbnailsContainer) {
		thumbnailsContainer.innerHTML = "";
		const wrapper = document.createElement("div");
		wrapper.classList.add("thumbnails-wrapper");

		const leftArrow = document.createElement("button");
		leftArrow.innerHTML = "&#10094;";
		leftArrow.classList.add("thumb-arrow", "left-arrow");

		const rightArrow = document.createElement("button");
		rightArrow.innerHTML = "&#10095;";
		rightArrow.classList.add("thumb-arrow", "right-arrow");

		const thumbnailsTrack = document.createElement("div");
		thumbnailsTrack.classList.add("thumbnails-track");

		product.images?.forEach((imgSrc, index) => {
			const img = document.createElement("img");
			img.src = imgSrc;
			img.classList.add("thumbnail");
			if (index === 0) img.classList.add("selected-thumbnail");

			img.addEventListener("click", () => {
				mainImage.src = imgSrc;
				document
					.querySelectorAll(".thumbnail")
					.forEach((el) => el.classList.remove("selected-thumbnail"));
				img.classList.add("selected-thumbnail");
			});

			thumbnailsTrack.appendChild(img);
		});

		wrapper.appendChild(leftArrow);
		wrapper.appendChild(thumbnailsTrack);
		wrapper.appendChild(rightArrow);
		thumbnailsContainer.appendChild(wrapper);

		leftArrow.addEventListener("click", () => {
			thumbnailsTrack.scrollLeft -= 100;
		});

		rightArrow.addEventListener("click", () => {
			thumbnailsTrack.scrollLeft += 100;
		});
	}

	if (actionsContainer) {
		actionsContainer.innerHTML = `
		  <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          <span class="heart" data-id="${product.id}">
          <i class=" heartIcon  fa-regular fa-heart"></i>
        </span>
		`;

		const cartBtn = document.querySelector(".add-to-cart");
		const heartIcon = document.querySelector(".heart");

		if (cartBtn) cartBtn.addEventListener("click", handleAddToCart);
		if (heartIcon) heartIcon.addEventListener("click", handleWishlist);
	}
}
fetchProductDetails();

///////////////////////////////

function searchProducts(query) {
	if (!query) {
		searchResults.classList.add("hidden");
		return;
	}

	const filteredProducts = allProducts
		.filter((product) =>
			product.title.toLowerCase().includes(query.toLowerCase())
		)
		.slice(0, 4);

	displaySearchResults(filteredProducts);
}

function displaySearchResults(results) {
	searchResults.innerHTML = "";

	if (results.length === 0) {
		searchResults.innerHTML = `<p class="search-item">No products found.</p>`;
		searchResults.classList.remove("hidden");
		return;
	}

	const closeButton = document.createElement("button");
	closeButton.textContent = "Close";
	closeButton.className = "close-btn";
	closeButton.addEventListener("click", () => {
		searchResults.classList.add("hidden");
	});
	searchResults.appendChild(closeButton);

	results.forEach((product) => {
		const searchItem = document.createElement("div");
		searchItem.classList.add("search-item");

		searchItem.innerHTML = `
      <img src="${product.imageCover}" alt="${product.title}">
      <div>
        <p>${product.title.split(" ").slice(0, 3).join(" ")}</p>
        <span>${product.price} EGP</span>
      </div>
    `;
		searchItem.addEventListener("click", () => goToProduct(product._id));

		searchResults.appendChild(searchItem);
	});

	searchResults.classList.remove("hidden");
}

function goToProduct(productId) {
	window.location.href = `product-details.html?id=${productId}`;
}

searchInput.addEventListener("input", (e) => {
	searchProducts(e.target.value.trim());
});

searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	searchProducts(searchInput.value.trim());
});

/////////////////////////////
export function filterProductsByCategory(categoryId) {
	if (categoryId === "all") {
		loadProducts(allProducts);
	} else {
		const filteredProducts = allProducts.filter(
			(product) => product.category._id === categoryId
		);
		loadProducts(filteredProducts);
	}
}
