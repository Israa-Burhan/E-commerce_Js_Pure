// script.js
document.addEventListener("DOMContentLoaded", function () {
	emailjs.init("QwmExGjC5OmHbeZNN");

	const contactForm = document.getElementById("contactForm");
	const statusMessage = document.getElementById("statusMessage");

	contactForm.addEventListener("submit", function (e) {
		e.preventDefault();

		const formData = {
			from_name: document.getElementById("name").value,
			from_email: document.getElementById("email").value,
			message: document.getElementById("message").value,
		};

		emailjs
			.send("service_p575mys", "template_cp313bg", formData)
			.then((response) => {
				statusMessage.textContent = "Message sent successfully!";
				statusMessage.style.color = "green";
				contactForm.reset();
			})
			.catch((error) => {
				console.error("Error sending email:", error);
				statusMessage.textContent = "Failed to send message. Try again.";
				statusMessage.style.color = "red";
			});
	});
});
