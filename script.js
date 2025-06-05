// Set baby's birth date
const birthDate = new Date("2024-10-04T00:00:00"); // <-- Edit as needed

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

function updateMilestoneLabel() {
	const age = getAge(birthDate);
	const monthsSinceBirth =
		(new Date().getFullYear() - birthDate.getFullYear()) * 12 + (new Date().getMonth() - birthDate.getMonth());
	let label;

	if (age.years < 1) {
		label = `Countdown to ${monthsSinceBirth + 1} month${monthsSinceBirth + 1 > 1 ? "s" : ""} milestone`;
	} else {
		label = `Countdown to ${age.years + 1} year${age.years + 1 > 1 ? "s" : ""} birthday`;
	}

	document.getElementById("milestone-label").textContent = label;
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

// Run both updates
updateCountdown();
updateAge();
setInterval(() => {
	updateCountdown();
	updateAge();
	updateMilestoneLabel();
}, 1000);

// -------------------------------------
// Utility: Open overlay by ID
// -------------------------------------
function openOverlayById(id) {
	const overlay = document.getElementById(id);
	if (overlay) overlay.classList.add("show");
}

// -------------------------------------
// Utility: Close overlay by ID
// -------------------------------------
function closeOverlayById(id) {
	const overlay = document.getElementById(id);
	if (overlay) overlay.classList.remove("show");
}

// -------------------------------------
// Utility: Close overlay on outside click
// -------------------------------------
function initOutsideClickClose(overlay) {
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) {
			overlay.classList.remove("show");
		}
	});
}

// -------------------------------------
// 1. Floating Add Milestone Button
// -------------------------------------
const addMilestoneBtn = document.querySelector(".floating-add-button");
if (addMilestoneBtn) {
	addMilestoneBtn.addEventListener("click", () => {
		openOverlayById("addmilestoneOverlay");
	});
}

// -------------------------------------
// 2. General Overlay Triggers via data-target
// (for edit + upload)
// -------------------------------------
const overlayTriggers = document.querySelectorAll("[data-target]");
overlayTriggers.forEach((trigger) => {
	trigger.addEventListener("click", () => {
		const targetId = trigger.getAttribute("data-target");
		openOverlayById(targetId);
	});
});

// -------------------------------------
// 3. Close overlays when X icon is clicked
// -------------------------------------
document
	.querySelectorAll(
		".overlayadd .overlay-header img, .overlayedit .overlay-header img, .overlayupload .overlay-header img"
	)
	.forEach((closeBtn) => {
		closeBtn.addEventListener("click", () => {
			const overlay = closeBtn.closest(".overlayadd, .overlayedit, .overlayupload");
			if (overlay) overlay.classList.remove("show");
		});
	});

// -------------------------------------
// 4. Close overlays when Save button is clicked
// -------------------------------------
document
	.querySelectorAll(".overlayadd .save-button, .overlayedit .save-button, .overlayupload .upload-button")
	.forEach((saveBtn) => {
		saveBtn.addEventListener("click", () => {
			const overlay = saveBtn.closest(".overlayadd, .overlayedit, .overlayupload");
			if (overlay) overlay.classList.remove("show");
		});
	});

// -------------------------------------
// 5. Close overlays when clicking outside
// -------------------------------------
document.querySelectorAll(".overlayadd, .overlayedit, .overlayupload").forEach((overlay) => {
	initOutsideClickClose(overlay);
});
