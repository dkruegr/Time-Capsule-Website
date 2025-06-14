// Set baby's birth date
const birthDate = new Date("2024-10-04T00:00:00"); // <-- Edit as needed

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
	initializeNavigation();
	initializeMilestoneActions();
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

function initializeNavigation() {
	const headerCta = document.querySelector(".header-cta");

	if (headerCta) {
		headerCta.addEventListener("click", () => {
			const currentPage = document.querySelector(".page.active");

			if (currentPage && currentPage.id === "home-page") {
				authModal.classList.add("active");
				document.body.style.overflow = "hidden";
			} else {
				showPage("home-page");
				updateHeaderCTA("explore");
			}
		});
	}

	initializeMilestoneActions();
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
authForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	if (username && password) {
		// Close modal
		authModal.classList.remove("active");
		document.body.style.overflow = "auto";

		showPage("milestones-page");
		updateHeaderCTA("home");

		// Reset form
		authForm.reset();
	} else {
		alert("Please enter both username and password.");
	}
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && authModal.classList.contains("active")) {
		authModal.classList.remove("active");
		document.body.style.overflow = "auto";
	}
});

// milestone actions
// function initializeMilestoneActions() {
// 	// Add milestone button
// 	const addMilestoneBtn = document.querySelector(".add-milestone-btn");
// 	if (addMilestoneBtn) {
// 		addMilestoneBtn.addEventListener("click", () => {
// 			alert("Add Milestone functionality - Coming Soon!");
// 		});
// 	}

// 	// Edit buttons
// 	const editButtons = document.querySelectorAll(".edit-btn");
// 	editButtons.forEach((btn) => {
// 		btn.addEventListener("click", (e) => {
// 			e.stopPropagation();
// 			alert("Edit functionality - Coming Soon!");
// 		});
// 	});

// 	// Share buttons
// 	const shareButtons = document.querySelectorAll(".share-btn");
// 	shareButtons.forEach((btn) => {
// 		btn.addEventListener("click", (e) => {
// 			e.stopPropagation();
// 			alert("Share functionality - Coming Soon!");
// 		});
// 	});

// 	// Delete buttons
// 	const deleteButtons = document.querySelectorAll(".delete-btn");
// 	deleteButtons.forEach((btn) => {
// 		btn.addEventListener("click", (e) => {
// 			e.stopPropagation();
// 			if (confirm("Are you sure you want to delete this milestone?")) {
// 				const card = btn.closest(".milestone-card");
// 				if (card) {
// 					card.style.opacity = "0";
// 					card.style.transform = "scale(0.8)";
// 					setTimeout(() => {
// 						card.remove();
// 					}, 300);
// 				}
// 			}
// 		});
// 	});
// }
