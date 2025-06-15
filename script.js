// Set baby's birth date
const birthDate = new Date("2024-10-04T00:00:00"); // <-- Edit as needed

// Initialize authentication state
let currentUser = null;

// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCEeMYUSRfmHOGIzshjIbLcUiNUJnxhusA",
	authDomain: "time-capsule-website.firebaseapp.com",
	projectId: "time-capsule-website",
	storageBucket: "time-capsule-website.firebasestorage.app",
	messagingSenderId: "948092733026",
	appId: "1:948092733026:web:ed26f5869dafaa243ef33b",
	measurementId: "G-YCNFL7Q6PD",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

updateCountdown();
updateAge();
setInterval(() => {
	updateCountdown();
	updateAge();
}, 1000);

// Utility functions
function getAge(dateOfBirth) {
	const now = new Date();
	const ageDiff = now - dateOfBirth;
	const days = Math.floor(ageDiff / (1000 * 60 * 60 * 24));
	const years = now.getFullYear() - dateOfBirth.getFullYear();
	const hasHadBirthdayThisYear =
		now.getMonth() > dateOfBirth.getMonth() ||
		(now.getMonth() === dateOfBirth.getMonth() && now.getDate() >= dateOfBirth.getDate());
	const adjustedYears = hasHadBirthdayThisYear ? years : years - 1;
	return { years: adjustedYears, days };
}

function getNextMilestone(birthDate) {
	const now = new Date();
	const age = getAge(birthDate);
	let targetDate;

	if (age.years < 1) {
		// Count months since birth
		const monthsSinceBirth =
			(now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
		const nextMonth = monthsSinceBirth + 1;
		targetDate = new Date(birthDate);
		targetDate.setMonth(birthDate.getMonth() + nextMonth);
	} else {
		//  Annual birthday after 1 year
		targetDate = new Date(birthDate);
		targetDate.setFullYear(now.getFullYear());
		if (now >= targetDate) {
			targetDate.setFullYear(now.getFullYear() + 1);
		}
	}

	return targetDate;
}

function updateCountdown() {
	const targetDate = getNextMilestone(birthDate);
	const now = new Date();
	const diff = targetDate - now;

	const totalSeconds = Math.floor(diff / 1000);
	const days = Math.floor(totalSeconds / (3600 * 24));
	const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	document.getElementById("days").textContent = String(days).padStart(2, "0");
	document.getElementById("hours").textContent = String(hours).padStart(2, "0");
	document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
	document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

function updateAge() {
	const age = getAge(birthDate);
	document.getElementById("baby-age").textContent = `${age.years} year${age.years !== 1 ? "s" : ""} and ${
		age.days
	} day${age.days !== 1 ? "s" : ""}`;
}

function generateCalendar() {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth();
	const currentDate = now.getDate();

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const dayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

	const monthHeader = document.getElementById("calendar-month-header");
	if (monthHeader) {
		monthHeader.textContent = monthNames[currentMonth];
	}

	const calendarGrid = document.getElementById("calendar-days-grid");
	if (!calendarGrid) return;

	calendarGrid.innerHTML = "";

	dayHeaders.forEach((day) => {
		const dayHeader = document.createElement("div");
		dayHeader.className = "day-header";
		dayHeader.textContent = day;
		calendarGrid.appendChild(dayHeader);
	});

	const firstDay = new Date(currentYear, currentMonth, 1);
	const lastDay = new Date(currentYear, currentMonth + 1, 0);
	const daysInMonth = lastDay.getDate();
	const startingDayOfWeek = firstDay.getDay();
	const prevMonth = new Date(currentYear, currentMonth - 1, 0);
	const daysInPrevMonth = prevMonth.getDate();

	let prevMonthDaysToShow = startingDayOfWeek === 0 ? 7 : startingDayOfWeek;

	for (let i = prevMonthDaysToShow - 1; i >= 0; i--) {
		const dayCell = document.createElement("div");
		dayCell.className = "day-cell inv-month";
		dayCell.textContent = daysInPrevMonth - i;
		calendarGrid.appendChild(dayCell);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		const dayCell = document.createElement("div");
		dayCell.className = "day-cell";
		dayCell.textContent = day;

		if (day === currentDate) {
			dayCell.classList.add("current-day");
		}

		const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			dayCell.classList.add("colored");
		}

		calendarGrid.appendChild(dayCell);
	}
	const totalCellsFilled = prevMonthDaysToShow + daysInMonth;
	const remainingCells = 42 - totalCellsFilled; // 6 rows × 7 days = 42 total cells

	for (let day = 1; day <= remainingCells; day++) {
		const dayCell = document.createElement("div");
		dayCell.className = "day-cell inv-month";
		dayCell.textContent = day;
		calendarGrid.appendChild(dayCell);
	}
}

document.addEventListener("DOMContentLoaded", function () {
	generateCalendar();
	initializeCarousel();

	// Initialize navigation after a small delay to ensure all elements are ready
	setTimeout(() => {
		updateNavigation();
	}, 100);

	initializeMilestoneActions();

	disableEditMode();
});

function initializeCarousel() {
	const carouselItems = document.querySelector(".carousel-items");
	const leftButton = document.querySelector(".carousel-control.left");
	const rightButton = document.querySelector(".carousel-control.right");

	if (!carouselItems || !leftButton || !rightButton) return;

	const cardWidth = 392; // 360px image width + 32px padding

	leftButton.addEventListener("click", () => {
		carouselItems.scrollBy({
			left: -cardWidth,
			behavior: "smooth",
		});
	});

	rightButton.addEventListener("click", () => {
		carouselItems.scrollBy({
			left: cardWidth,
			behavior: "smooth",
		});
	});
}

// Update calendar monthly
setInterval(() => {
	const now = new Date();
	const monthHeader = document.getElementById("calendar-month-header");
	if (monthHeader) {
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		const currentMonthName = monthNames[now.getMonth()];

		if (monthHeader.textContent !== currentMonthName) {
			generateCalendar();
		}
	}
}, 60000);

function showPage(pageId) {
	const pages = document.querySelectorAll(".page");
	pages.forEach((page) => page.classList.remove("active"));

	const targetPage = document.getElementById(pageId);
	if (targetPage) {
		targetPage.classList.add("active");
	}
}

function updateHeaderCTA(mode) {
	const headerCta = document.querySelector(".header-cta");
	const ctaText = headerCta.querySelector(".desktop");

	if (mode === "explore") {
		ctaText.innerHTML = "Explore Every Milestone";
	} else if (mode === "home") {
		ctaText.innerHTML = "← Back to Home";
	}
}

const authModal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");
const authForm = document.getElementById("authForm");

closeModal.addEventListener("click", () => {
	authModal.classList.remove("active");
	document.body.style.overflow = "auto";
});

// Close modal when clicking on overlay (outside the modal container)
authModal.addEventListener("click", (e) => {
	if (e.target === authModal) {
		authModal.classList.remove("active");
		document.body.style.overflow = "auto";
	}
});

// Handle form submission
authForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const email = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	const submitButton = authForm.querySelector('button[type="submit"]');
	const errorDiv = document.getElementById("authError");

	// Clear previous error
	errorDiv.style.display = "none";
	errorDiv.textContent = "";

	if (!email || !password) {
		showAuthError("Please enter both email and password.");
		return;
	}

	// Disable button and show loading state
	submitButton.disabled = true;
	submitButton.textContent = "Signing in...";

	try {
		// Sign in with Firebase Auth
		const userCredential = await auth.signInWithEmailAndPassword(email, password);
		const user = userCredential.user;

		console.log("User signed in:", user.email);

		// Close modal
		authModal.classList.remove("active");
		document.body.style.overflow = "auto";

		showPage("milestones-page");
		updateHeaderCTA("home");

		// Reset form
		authForm.reset();
	} catch (error) {
		console.error("Authentication error:", error);

		// Handle specific error cases
		let errorMessage = "";
		switch (error.code) {
			case "auth/user-not-found":
				errorMessage = "No user found with this email address.";
				break;
			case "auth/wrong-password":
				errorMessage = "Incorrect password. Please try again.";
				break;
			case "auth/invalid-email":
				errorMessage = "Please enter a valid email address.";
				break;
			case "auth/too-many-requests":
				errorMessage = "Too many failed attempts. Please try again later.";
				break;
			case "auth/user-disabled":
				errorMessage = "This account has been disabled.";
				break;
			default:
				errorMessage = "Authentication failed. Please check your credentials.";
		}

		showAuthError(errorMessage);
	} finally {
		// Re-enable button
		submitButton.disabled = false;
		submitButton.textContent = "Grant Access";
	}
});

function showAuthError(message) {
	const errorDiv = document.getElementById("authError");
	const statusDiv = document.getElementById("authStatus");

	// Hide status and show error
	statusDiv.style.display = "none";
	errorDiv.textContent = message;
	errorDiv.style.display = "block";
}

function showAuthStatus(message) {
	const errorDiv = document.getElementById("authError");
	const statusDiv = document.getElementById("authStatus");

	// Hide error and show status
	errorDiv.style.display = "none";
	statusDiv.textContent = message;
	statusDiv.style.display = "block";
}

function hideAuthMessages() {
	const errorDiv = document.getElementById("authError");
	const statusDiv = document.getElementById("authStatus");

	errorDiv.style.display = "none";
	statusDiv.style.display = "none";
}

function initializeMilestoneActions() {
	// Initialize milestone modal and form
	const addMilestoneBtn = document.querySelector(".add-milestone-btn");
	const addMilestoneModal = document.getElementById("addMilestoneModal");
	const closeMilestoneModal = document.getElementById("closeMilestoneModal");
	const milestoneForm = document.getElementById("milestoneForm");
	const fileInput = document.getElementById("milestoneFile");
	const fileStatus = document.querySelector(".file-status");

	// Open milestone modal (only if authenticated)
	if (addMilestoneBtn) {
		addMilestoneBtn.addEventListener("click", () => {
			if (!currentUser) {
				alert("Please sign in to add milestones.");
				return;
			}
			addMilestoneModal.classList.add("active");
			document.body.style.overflow = "hidden";
		});
	}

	// Close milestone modal
	if (closeMilestoneModal) {
		closeMilestoneModal.addEventListener("click", () => {
			addMilestoneModal.classList.remove("active");
			document.body.style.overflow = "auto";
		});
	}

	// Close modal when clicking on overlay
	if (addMilestoneModal) {
		addMilestoneModal.addEventListener("click", (e) => {
			if (e.target === addMilestoneModal) {
				addMilestoneModal.classList.remove("active");
				document.body.style.overflow = "auto";
			}
		});
	}

	// Update file status when files are selected
	if (fileInput && fileStatus) {
		fileInput.addEventListener("change", (e) => {
			const files = e.target.files;
			if (files.length === 0) {
				fileStatus.textContent = "No file chosen";
			} else if (files.length === 1) {
				fileStatus.textContent = files[0].name;
			} else {
				fileStatus.textContent = `${files.length} files selected`;
			}
		});
	}

	// Handle milestone form submission
	if (milestoneForm) {
		milestoneForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			if (!currentUser) {
				alert("Please sign in to add milestones.");
				return;
			}

			const title = document.getElementById("milestoneTitle").value;
			const files = fileInput.files;
			const date = document.getElementById("milestoneDate").value;
			const submitButton = milestoneForm.querySelector('button[type="submit"]');

			if (!title || !date) {
				alert("Please fill in all required fields.");
				return;
			}

			// Disable button and show loading state
			submitButton.disabled = true;
			submitButton.textContent = "Saving...";

			try {
				// Here you would typically save the milestone data to Firebase
				console.log("New milestone:", { title, files, date, userId: currentUser.uid });

				// Close modal
				addMilestoneModal.classList.remove("active");
				document.body.style.overflow = "auto";

				// Reset form
				milestoneForm.reset();
				fileStatus.textContent = "No file chosen";

				// Show success message
				alert("Milestone added successfully!");
			} catch (error) {
				console.error("Error adding milestone:", error);
				alert("Error adding milestone. Please try again.");
			} finally {
				// Re-enable button
				submitButton.disabled = false;
				submitButton.textContent = "Save";
			}
		});
	}

	// Handle delete milestone buttons (only if authenticated)
	const deleteButtons = document.querySelectorAll(".delete-milestone");
	deleteButtons.forEach((button) => {
		button.addEventListener("click", (e) => {
			if (!currentUser) {
				alert("Please sign in to delete milestones.");
				return;
			}

			if (confirm("Are you sure you want to delete this milestone?")) {
				// Here you would typically delete the milestone from Firebase
				const milestoneCard = button.closest(".milestone-card");
				if (milestoneCard) {
					milestoneCard.remove();
					console.log("Milestone deleted");
				}
			}
		});
	});

	// Close milestone modal with Escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && addMilestoneModal && addMilestoneModal.classList.contains("active")) {
			addMilestoneModal.classList.remove("active");
			document.body.style.overflow = "auto";
		}
	});
}

// Helper function to create a test user (for development purposes)
function createTestUser() {
	const email = "admin@timecapsule.com";
	const password = "password123";

	auth
		.createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			console.log("Test user created:", userCredential.user.email);
		})
		.catch((error) => {
			if (error.code === "auth/email-already-in-use") {
				console.log("Test user already exists:", email);
			} else {
				console.error("Error creating test user:", error);
			}
		});
}

// Uncomment the line below to create a test user (run once)
// createTestUser();

// Enable edit mode when user is authenticated
function enableEditMode() {
	const addMilestoneBtn = document.querySelector(".add-milestone-btn");
	const deleteButtons = document.querySelectorAll(".delete-milestone");

	if (addMilestoneBtn) {
		addMilestoneBtn.style.display = "flex";
	}

	deleteButtons.forEach((btn) => {
		btn.style.display = "block";
	});
}

// Disable edit mode when user is not authenticated
function disableEditMode() {
	const addMilestoneBtn = document.querySelector(".add-milestone-btn");
	const deleteButtons = document.querySelectorAll(".delete-milestone");

	if (addMilestoneBtn) {
		addMilestoneBtn.style.display = "none";
	}

	deleteButtons.forEach((btn) => {
		btn.style.display = "none";
	});
}

// Add navigation functionality
function updateNavigation() {
	const headerCta = document.querySelector(".header-cta");

	if (headerCta) {
		// Remove existing event listeners by cloning the element
		const newHeaderCta = headerCta.cloneNode(true);
		headerCta.parentNode.replaceChild(newHeaderCta, headerCta);

		newHeaderCta.addEventListener("click", () => {
			const currentPage = document.querySelector(".page.active");

			if (currentPage && currentPage.id === "home-page") {
				if (currentUser) {
					// User is signed in, go to milestones
					showPage("milestones-page");
					updateHeaderCTA("home");
				} else {
					// User not signed in, show auth modal
					const authModal = document.getElementById("authModal");
					if (authModal) {
						authModal.classList.add("active");
						document.body.style.overflow = "hidden";
					}
				}
			} else {
				// On milestones page, go back to home
				showPage("home-page");
				updateHeaderCTA("explore");
			}
		});
	}
}

// Listen for authentication state changes
auth.onAuthStateChanged((user) => {
	currentUser = user;

	if (user) {
		console.log("User is signed in:", user.email);
		// User is signed in, enable edit functionality
		enableEditMode();
	} else {
		console.log("User is signed out");
		// User is signed out, disable edit functionality
		disableEditMode();
	}
});

// Add sign out functionality to navigation
