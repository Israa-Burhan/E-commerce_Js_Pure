import { BASE_URL } from "./config.js";
import { filterProductsByCategory } from "./main.js";

async function fetchBrands() {
	try {
		const response = await fetch(`${BASE_URL}brands`);
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching brands:", error);
	}
}

async function loadBrands() {
	const brandsContainer = document.getElementById("brands-carousel");
	const indicatorsContainer = document.getElementById("carousel-indicators");
	const brands = await fetchBrands();

	if (!brands || brands.length === 0) {
		brandsContainer.innerHTML = "<p>No brands available</p>";
		return;
	}

	const loopBrands = [...brands, ...brands];

	loopBrands.forEach((brand) => {
		const brandItem = document.createElement("div");
		brandItem.className = "brand-item";
		brandItem.innerHTML = `
            <img src="${brand.image}" alt="${brand.name}">
            <p class="brand-name">${brand.name}</p>
        `;
		brandsContainer.appendChild(brandItem);
	});

	for (let i = 0; i < 3; i++) {
		const indicator = document.createElement("span");
		indicator.className = "indicator";
		indicator.addEventListener("click", () => moveToSlide(i));
		indicatorsContainer.appendChild(indicator);
	}

	updateIndicators(0);

	startAutoSlide();
}

let currentSlide = 0;
let autoSlideInterval;

function moveToSlide(index) {
	const carousel = document.getElementById("brands-carousel");
	currentSlide = index;
	const offset = -index * 320;
	carousel.style.transition = "transform 0.5s ease";
	carousel.style.transform = `translateX(${offset}px)`;
	updateIndicators(index % 3);
}

function updateIndicators(index) {
	const indicators = document.querySelectorAll(".indicator");
	indicators.forEach((indicator, i) => {
		indicator.classList.toggle("active", i === index);
	});
}

function startAutoSlide() {
	const brandsContainer = document.getElementById("brands-carousel");
	const brandItems = document.querySelectorAll(".brand-item");

	autoSlideInterval = setInterval(() => {
		currentSlide++;
		moveToSlide(currentSlide);

		if (currentSlide >= brandItems.length / 2) {
			setTimeout(() => {
				brandsContainer.style.transition = "none";
				currentSlide = 0;
				moveToSlide(currentSlide);
			}, 700);
		}
	}, 3000);
}

loadBrands();

////////////////////////////////

const carousel = document.querySelector(".carousel");
const slider = carousel.querySelector(".carousel_track");
let slides = [...slider.children];

slider.prepend(slides[slides.length - 1]);

const createDots = (carousel, initSlides) => {
	const dotsContainer = document.createElement("div");
	dotsContainer.classList.add("carousel_nav");

	initSlides.forEach((slide, index) => {
		const dot = document.createElement("button");
		dot.type = "button";
		dot.classList.add("carousel_dot");
		dot.setAttribute("aria-label", `Slide number ${index + 1}`);
		slide.dataset.position = index;
		slide.classList.contains("is-selected") && dot.classList.add("is-selected");
		dotsContainer.appendChild(dot);
	});

	carousel.appendChild(dotsContainer);

	return dotsContainer;
};

const updateDot = (slide) => {
	const currDot = dotNav.querySelector(".is-selected");
	const targetDot = slide.dataset.position;

	currDot.classList.remove("is-selected");
	dots[targetDot].classList.add("is-selected");
};

const handleArrowClick = (arrow) => {
	arrow.addEventListener("click", () => {
		slides = [...slider.children];
		const currSlide = slider.querySelector(".is-selected");
		currSlide.classList.remove("is-selected");
		let targetSlide;

		if (arrow.classList.contains("jsPrev")) {
			targetSlide = currSlide.previousElementSibling;
			slider.prepend(slides[slides.length - 1]);
		}

		if (arrow.classList.contains("jsNext")) {
			targetSlide = currSlide.nextElementSibling;
			slider.append(slides[0]);
		}

		targetSlide.classList.add("is-selected");
		updateDot(targetSlide);
	});
};

const buttons = carousel.querySelectorAll(".carousel_btn");
buttons.forEach(handleArrowClick);

const handleDotClick = (dot) => {
	const dotIndex = dots.indexOf(dot);
	const currSlidePos = slider.querySelector(".is-selected").dataset.position;
	const targetSlidePos = slider.querySelector(`[data-position='${dotIndex}']`)
		.dataset.position;

	if (currSlidePos < targetSlidePos) {
		const count = targetSlidePos - currSlidePos;
		for (let i = count; i > 0; i--) nextBtn.click();
	}

	if (currSlidePos > targetSlidePos) {
		const count = currSlidePos - targetSlidePos;
		for (let i = count; i > 0; i--) prevBtn.click();
	}
};

const dotNav = createDots(carousel, slides);
const dots = [...dotNav.children];
const prevBtn = buttons[0];
const nextBtn = buttons[1];

dotNav.addEventListener("click", (e) => {
	const dot = e.target.closest("button");
	if (!dot) return;
	handleDotClick(dot);
});

const slideTiming = 5000;
let interval;
const slideInterval = () =>
	(interval = setInterval(() => nextBtn.click(), slideTiming));

carousel.addEventListener("mouseover", () => clearInterval(interval));
carousel.addEventListener("mouseleave", slideInterval);
slideInterval();

/**
 * Dynamically imports the filter function from main.js.
 */

const categoryList = document.getElementById("categoryList");
const categoryBtn = document.querySelector(".category_btn");

let activeCategory = "all";

/**
 * Fetches product categories from the API and displays them in the UI.
 */
async function fetchCategories() {
	try {
		const response = await fetch(`${BASE_URL}categories`);
		const data = await response.json();
		const categories = Array.isArray(data.data) ? data.data : [];
		displayCategories(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
	}
}

/**
 * Displays the fetched categories in the UI and sets up event listeners for filtering.
 * @param {Array} categories - List of product categories
 */
function displayCategories(categories) {
	// Add an "All" category option
	categories.unshift({ name: "All", _id: "all" });

	categoryList.innerHTML = "";
	categories.forEach((category) => {
		let categoryLink = document.createElement("a");
		categoryLink.href = "#";
		categoryLink.textContent = category.name || "No Name";
		categoryLink.setAttribute("data-id", category._id);

		const selectedCategory = activeCategory;

		if (selectedCategory === category._id) {
			categoryLink.classList.add("selected");
		}

		if (selectedCategory !== "all" && category._id === "all") {
			categoryLink.classList.remove("selected");
		}

		categoryLink.addEventListener("click", (e) => {
			e.preventDefault();
			const categoryId = e.target.getAttribute("data-id");
			filterProductsByCategory(categoryId);

			activeCategory = categoryId;

			// Update the selected category UI
			document.querySelectorAll("#categoryList a").forEach((link) => {
				link.classList.remove("selected");
			});
			e.target.classList.add("selected");
		});

		categoryList.appendChild(categoryLink);
	});
}

/**
 * Toggles the category list dropdown when the button is clicked.
 */
categoryBtn.addEventListener("click", () => {
	categoryList.classList.toggle("active");
});

// Fetch and display categories on page load
fetchCategories();
