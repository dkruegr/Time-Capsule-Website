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
const db = firebase.firestore();
const storage = firebase.storage();

// Configure Firestore settings
db.settings({
  timestampsInSnapshots: true,
});

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
    (now.getMonth() === dateOfBirth.getMonth() &&
      now.getDate() >= dateOfBirth.getDate());
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
      (now.getFullYear() - birthDate.getFullYear()) * 12 +
      (now.getMonth() - birthDate.getMonth());
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
  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0"
  );
  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0"
  );
}

function updateAge() {
  const age = getAge(birthDate);
  document.getElementById("baby-age").textContent = `${age.years} year${
    age.years !== 1 ? "s" : ""
  } and ${age.days} day${age.days !== 1 ? "s" : ""}`;
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
  loadMilestones();

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
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
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
      const files = Array.from(e.target.files);
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

      // Multiple File Submission Support
      const title = document.getElementById("milestoneTitle").value;
      const files = Array.from(fileInput.files);

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
        await addMilestone(title, date, files);

        // Close modal
        addMilestoneModal.classList.remove("active");
        document.body.style.overflow = "auto";

        // Reset form
        milestoneForm.reset();
        fileStatus.textContent = "No file chosen";

        // Reload milestones
        await loadMilestones();

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

  // Close milestone modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      addMilestoneModal &&
      addMilestoneModal.classList.contains("active")
    ) {
      addMilestoneModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
}

// Add milestone to Firestore (multiple file support)
async function addMilestone(title, date, files) {
  try {
    console.log("Adding milestone (multi):", { title, date, files });

    // Normalize files to an array of valid image/video types
    const filesArr = Array.from(files || []).filter(
      (f) => f && (f.type?.startsWith("image/") || f.type?.startsWith("video/"))
    );

    const media = [];

    for (let i = 0; i < filesArr.length; i++) {
      const file = filesArr[i];
      const timestamp = Date.now();
      const safeName = file.name.replace(/\s+/g, "_");
      // (Optional) nest by user for tidy storage
      const fileName = `milestones/${currentUser.uid}/${timestamp}_${i}_${safeName}`;
      const storageRef = storage.ref(fileName);

      console.log("Uploading:", fileName);
      const snapshot = await storageRef.put(file);
      const url = await snapshot.ref.getDownloadURL();

      const type = file.type.startsWith("video/") ? "video" : "image";
      media.push({ type, url, path: fileName });
      console.log(`Uploaded ${type}:`, url);
    }

    // Fallback fields for older UI bits (use the first of each kind)
    let imageUrl = null,
      imagePath = null,
      videoUrl = null,
      videoPath = null;
    const firstImage = media.find((m) => m.type === "image");
    const firstVideo = media.find((m) => m.type === "video");
    if (firstImage) {
      imageUrl = firstImage.url;
      imagePath = firstImage.path;
    }
    if (firstVideo) {
      videoUrl = firstVideo.url;
      videoPath = firstVideo.path;
    }

    const milestoneData = {
      title,
      date,
      media, // <-- new array with ALL uploads
      imageUrl,
      imagePath, // <-- keep for backward-compat
      videoUrl,
      videoPath, // <-- keep for backward-compat
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userId: currentUser.uid,
    };

    console.log("Saving milestone data:", milestoneData);
    const docRef = await db.collection("milestones").add(milestoneData);
    console.log("Milestone added successfully, id:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding milestone:", error);
    throw error;
  }
}

// Load milestones from Firestore
async function loadMilestones() {
  try {
    console.log("Loading milestones...");
    const snapshot = await db
      .collection("milestones")
      .orderBy("date", "desc")
      .get();

    const milestones = [];
    snapshot.forEach((doc) => {
      milestones.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Loaded milestones:", milestones);
    window.allMilestones = milestones; // store globally for lightbox navigation
    displayMilestones(milestones);
    updateHomePage(milestones);

    attachLightboxListeners();
  } catch (error) {
    console.error("Error loading milestones:", error);

    // If it's a permissions error, try to load without authentication
    if (error.code === "permission-denied") {
      console.log("Permission denied, trying to load public milestones...");
      try {
        const snapshot = await db
          .collection("milestones")
          .orderBy("date", "desc")
          .get();

        const milestones = [];
        snapshot.forEach((doc) => {
          milestones.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        window.allMilestones = milestones;
        displayMilestones(milestones);
        updateHomePage(milestones);

        attachLightboxListeners();
      } catch (innerError) {
        console.error("Error loading public milestones:", innerError);
        // Show default content if loading fails
        displayDefaultMilestones();
      }
    } else {
      // Show default content if loading fails
      displayDefaultMilestones();
    }
  }
}

// Display default milestones when database is unavailable
function displayDefaultMilestones() {
  console.log("Displaying default milestones");
  const defaultMilestones = [
    {
      id: "default1",
      title: "Baby's Birth",
      date: birthDate.toISOString().split("T")[0],
      imageUrl: null,
    },
  ];

  displayMilestones([]);
  updateHomePage(defaultMilestones);
}

// Display milestones in the explore page
function displayMilestones(milestones) {
  const milestonesContainer = document.querySelector(".milestones-container");

  // Clear existing milestone cards (keep the title)
  const title = milestonesContainer.querySelector(
    ".milestones-container-title"
  );
  milestonesContainer.innerHTML = "";
  milestonesContainer.appendChild(title);

  milestones.forEach((milestone) => {
    const milestoneCard = createMilestoneCard(milestone);
    milestonesContainer.appendChild(milestoneCard);
  });
  attachLightboxListeners(); // <-- Important
  initLazyLoading();
}

function initLazyLoading() {
  const lazyMedia = document.querySelectorAll(".lazy-thumb");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const src = el.getAttribute("data-src");

        if (src) {
          // load image/video
          el.setAttribute("src", src);
          el.removeAttribute("data-src");

          // add fade-in effect
          el.classList.add("loaded");
        }

        obs.unobserve(el);
      }
    });
  }, { rootMargin: "150px" }); // load just before scrolling into view

  lazyMedia.forEach(el => observer.observe(el));
}




// Create milestone card element
function createMilestoneCard(milestone) {
  const card = document.createElement("div");
  card.className = "milestone-card";
  card.dataset.milestoneId = milestone.id;

  // Build a normalized media array for this card (works for new + old milestones)
  let allMedia = Array.isArray(milestone.media) ? milestone.media.slice() : [];

  if (
    (!allMedia || allMedia.length === 0) &&
    (milestone.imageUrl || milestone.videoUrl)
  ) {
    if (milestone.imageUrl) {
      allMedia = [
        {
          type: "image",
          url: milestone.imageUrl,
          path: milestone.imagePath || null,
        },
      ];
    } else if (milestone.videoUrl) {
      allMedia = [
        {
          type: "video",
          url: milestone.videoUrl,
          path: milestone.videoPath || null,
        },
      ];
    }
  }

  // Store the full media array on the card for lightbox navigation
  card.dataset.media = JSON.stringify(allMedia || []);

  // Use first media item for the visible thumbnail
  let thumbHtml = "";
  const first = allMedia[0];
  if (first) {
    if (first.type === "video") {
      thumbHtml = `<video class="lazy-thumb" data-src="${first.url}" muted playsinline preload="metadata"></video>`;
    } else {
      thumbHtml = `<img class="lazy-thumb" data-src="${first.url}" alt="${milestone.title}">`;
    }
  }

  card.innerHTML = `
    <div class="milestone-image">
      ${thumbHtml}
    </div>
    <div>
      <div class="blue-heading">${milestone.title}</div>
      <p>${formatDate(milestone.date)}</p>
    </div>
    <button class="delete-milestone" title="Delete" style="${
      currentUser ? "display: block" : "display: none"
    }">
      <img src="images/icons/trash.svg" alt="Delete" />
    </button>
  `;

  // Delete functionality
  const deleteBtn = card.querySelector(".delete-milestone");
  deleteBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Please sign in to delete milestones.");
      return;
    }

    if (confirm("Are you sure you want to delete this milestone?")) {
      try {
        // Prefer deleting all media paths when available; else fall back to single path
        const hasArray = Array.isArray(allMedia) && allMedia.length > 0;
        const singleFallback =
          milestone.imagePath || milestone.videoPath || null;

        await deleteMilestone(
          milestone.id,
          hasArray ? allMedia : singleFallback ? [singleFallback] : []
        );

        card.remove();
        await loadMilestones(); // Refresh lists
        console.log("Milestone deleted successfully");
      } catch (error) {
        console.error("Error deleting milestone:", error);
        alert("Error deleting milestone. Please try again.");
      }
    }
  });

  return card;
}

// Delete milestone from Firestore and ALL its media from Storage
async function deleteMilestone(milestoneId, mediaOrPaths) {
  try {
    // Normalize to an array of paths
    const items = Array.isArray(mediaOrPaths)
      ? mediaOrPaths
      : mediaOrPaths
      ? [mediaOrPaths]
      : [];
    const paths = items
      .map((it) => (typeof it === "string" ? it : it && it.path))
      .filter((p) => !!p); // only truthy

    // Delete each file (skip if missing)
    for (const p of paths) {
      try {
        console.log("Deleting file from storage:", p);
        await storage.ref(p).delete();
      } catch (e) {
        console.warn("Could not delete file (may not exist):", p, e);
        // continue to delete the doc anyway
      }
    }

    // Delete the Firestore document last
    await db.collection("milestones").doc(milestoneId).delete();
    console.log("Milestone document deleted:", milestoneId);
  } catch (error) {
    console.error("Error deleting milestone:", error);
    throw error;
  }
}

// Update home page with milestone data
function updateHomePage(milestones) {
  updateCarousel(milestones);
  updateRecentMilestone(milestones);
  updateUpcomingMilestone(milestones);
  updateMilestoneOverview(milestones);
}

// Update carousel with milestones
function updateCarousel(milestones) {
  const carouselItems = document.querySelector(".carousel-items");
  if (!carouselItems) return;

  carouselItems.innerHTML = "";

  // Show up to 4 most recent milestones in carousel
  const recentMilestones = milestones.slice(0, 4);

  if (recentMilestones.length === 0) {
    // Show baby's birthday if no milestones
    const card = document.createElement("div");
    card.className = "carousel-card";
    card.innerHTML = `
			<div class="blue-heading">Baby's Birth</div>
			<div class="image-wrapper"></div>
			<p class="card-date">${formatDate(birthDate.toISOString().split("T")[0])}</p>
		`;
    carouselItems.appendChild(card);
  } else {
    recentMilestones.forEach((milestone) => {
      let mediaHtml = "";

      if (milestone.videoUrl) {
        // Preview video without autoplay/controls — lightbox will handle playback
        mediaHtml = `<video src="${milestone.videoUrl}" muted playsinline preload="metadata"></video>`;
      } else if (milestone.imageUrl) {
        mediaHtml = `<img src="${milestone.imageUrl}" alt="${milestone.title}">`;
      }

      const card = document.createElement("div");
      card.className = "carousel-card";
      card.innerHTML = `
				<div class="blue-heading">${milestone.title}</div>
				<div class="image-wrapper">
					${mediaHtml}
				</div>
				<p class="card-date">${formatDate(milestone.date)}</p>
			`;
      carouselItems.appendChild(card);
    });
  }
  // Attach lightbox listeners after rendering
  attachLightboxListeners();
}

// Update recent milestone section
function updateRecentMilestone(milestones) {
  const recentMilestoneSection = document.querySelector(
    ".recent-milestones .milestone-item"
  );
  if (!recentMilestoneSection) return;

  const now = new Date();
  const pastMilestones = milestones.filter((m) => new Date(m.date) <= now);

  if (pastMilestones.length === 0) {
    // Show baby's birthday if no past milestones
    recentMilestoneSection.innerHTML = `
			<p class="milestone-title">Baby's Birth</p>
			<p class="milestone-date">${formatDate(
        birthDate.toISOString().split("T")[0]
      )}</p>
		`;
  } else {
    const mostRecent = pastMilestones[0];
    recentMilestoneSection.innerHTML = `
			<p class="milestone-title">${mostRecent.title}</p>
			<p class="milestone-date">${formatDate(mostRecent.date)}</p>
		`;
  }
}

// Update upcoming milestone section
function updateUpcomingMilestone(milestones) {
  const upcomingMilestoneSection = document.querySelector(
    ".upcoming-milestones .milestone-item"
  );
  if (!upcomingMilestoneSection) return;

  const now = new Date();
  const futureMilestones = milestones
    .filter((m) => new Date(m.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (futureMilestones.length === 0) {
    // Calculate next birthday
    const nextBirthday = getNextMilestone(birthDate);
    const age = getAge(birthDate);
    const nextAge = age.years + 1;

    upcomingMilestoneSection.innerHTML = `
			<p class="milestone-title">${
        nextAge === 1
          ? "Baby's First Birthday"
          : `${nextAge}${getOrdinalSuffix(nextAge)} Birthday`
      }</p>
			<p class="milestone-date">${formatDate(
        nextBirthday.toISOString().split("T")[0]
      )}</p>
		`;
  } else {
    const nextMilestone = futureMilestones[0];
    upcomingMilestoneSection.innerHTML = `
			<p class="milestone-title">${nextMilestone.title}</p>
			<p class="milestone-date">${formatDate(nextMilestone.date)}</p>
		`;
  }
}

// Update milestone overview statistics
function updateMilestoneOverview(milestones) {
  const overviewStats = document.querySelectorAll(".overview-stat");
  if (overviewStats.length < 2) return;

  // Total milestones
  overviewStats[0].textContent = `Total Milestones: ${milestones.length}`;

  // Next milestone
  const now = new Date();
  const futureMilestones = milestones
    .filter((m) => new Date(m.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (futureMilestones.length === 0) {
    const age = getAge(birthDate);
    const nextAge = age.years + 1;
    overviewStats[1].textContent = `Next Milestone: ${
      nextAge === 1
        ? "First Birthday"
        : `${nextAge}${getOrdinalSuffix(nextAge)} Birthday`
    }`;
  } else {
    overviewStats[1].textContent = `Next Milestone: ${futureMilestones[0].title}`;
  }
}

// Utility function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// Utility function to get ordinal suffix
function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
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
    // Load milestones after authentication
    loadMilestones();
  } else {
    console.log("User is signed out");
    // User is signed out, disable edit functionality
    disableEditMode();
    // Still load milestones for viewing
    loadMilestones();
  }
});

// Upload Logic
const fileInput = document.getElementById("milestoneFile");
const uploadButton = document.getElementsByClassName("save-milestone-btn")[0];

if (uploadButton) {
  uploadButton.addEventListener("click", () => {
    const files = fileInput.files;
    if (!files.length) return;

    const imageUrls = [];
    const uploadPromises = [];

    [...files].forEach((file) => {
      const filePath = `uploads/${Date.now()}_${file.name}`;
      const storageRef = firebase.storage().ref(filePath);

      const uploadTask = storageRef
        .put(file)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          console.log("Uploaded:", url);
          imageUrls.push(url);
        })
        .catch((err) => {
          console.error(`Upload failed for ${file.name}:`, err);
        });

      uploadPromises.push(uploadTask);
    });

    Promise.all(uploadPromises)
      .then(() => {
        console.log("All files uploaded:", imageUrls);

        // TODO: Attach imageUrls to milestone and save to Firestore
        // You can create a milestoneData object here and save it
      })
      .catch((err) => {
        console.error("One or more uploads failed:", err);
      });
  });
}

// Lightbox Scrim Logic
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox-scrim");
  const mediaContainer = document.getElementById("lightbox-media-container");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const spinner = document.getElementById("lightbox-spinner"); 

  let currentMedia = [];
  let currentIndex = 0;

  function showSpinner() {
    if (spinner) spinner.style.display = "block";
  }

  function hideSpinner() {
    if (spinner) spinner.style.display = "none";
  }

  function showMedia(index) {
    if (!currentMedia.length) return;
    const media = currentMedia[index];
    mediaContainer.innerHTML = "";

    showSpinner(); // start loading

    if (media.type === "video") {
      const video = document.createElement("video");
      video.src = media.url;
      video.controls = true;
      video.autoplay = false; // no autoplay
      video.muted = true; // muted preview
      video.style.maxWidth = "100%";
      video.style.maxHeight = "80vh";

      // hide spinner when video metadata is ready
      video.addEventListener("loadeddata", hideSpinner);
      video.addEventListener("error", hideSpinner);

      mediaContainer.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = media.url;
      img.alt = "";
      img.style.maxWidth = "100%";
      img.style.maxHeight = "80vh";

      // hide spinner when image is loaded
      img.onload = hideSpinner;
      img.onerror = hideSpinner;

      mediaContainer.appendChild(img);
    }
  }

  function openLightbox(mediaArray, startIndex = 0) {
    currentMedia = mediaArray;
    currentIndex = startIndex;
    showMedia(currentIndex);
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    currentMedia = [];
    currentIndex = 0;
	hideSpinner();
  }

  function showPrev() {
    currentIndex =
      (currentIndex - 1 + currentMedia.length) % currentMedia.length;
    showMedia(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentMedia.length;
    showMedia(currentIndex);
  }

  // --- Swipe support for mobile ---
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  if (swipeDistance > 50) {
    // Swipe right → previous media
    showPrev();
  } else if (swipeDistance < -50) {
    // Swipe left → next media
    showNext();
  }
}

const lightboxContent = document.getElementById("lightbox-content");

lightboxContent.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

lightboxContent.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});


  // Event Listeners
  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Attach to milestone cards
  window.attachLightboxListeners = function () {
    const milestoneCards = document.querySelectorAll(".milestone-card");
    milestoneCards.forEach((card) => {
      card
        .querySelectorAll(".milestone-image img, .milestone-image video")
        .forEach((el, idx) => {
          el.style.cursor = "pointer";
          el.addEventListener("click", () => {
            const milestoneId = card.dataset.milestoneId;
            const milestone = window.allMilestones?.find(
              (m) => m.id === milestoneId
            );
            if (milestone && milestone.media && milestone.media.length) {
              openLightbox(milestone.media, idx);
            } else {
              // Fallback to single media
              openLightbox([
                {
                  type:
                    el.tagName.toLowerCase() === "video" ? "video" : "image",
                  url: el.src,
                },
              ]);
            }
          });
        });
    });
  };
});
