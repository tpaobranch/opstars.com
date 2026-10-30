
"use strict";

/*
  OPSTARS — Creator gallery

  Replace the sample creator data below with creators who have
  consented to publication. Add your own authorized video URLs
  in the "video" field.

  This front-end age screen is not secure age verification.
*/

const creators = [
  {
    id: 1,
    name: "Creator One",
    category: "Featured",
    description: "Discover the latest creator updates and featured work.",
    symbol: "✦",
    color: "linear-gradient(135deg, #f3a6c7, #a969c4)",
    label: "FEATURED",
    video: ""
  },
  {
    id: 2,
    name: "Creator Two",
    category: "Lifestyle",
    description: "Lifestyle, daily moments, and creative inspiration.",
    symbol: "✿",
    color: "linear-gradient(135deg, #f6c9a8, #e88caa)",
    label: "LIFESTYLE",
    video: ""
  },
  {
    id: 3,
    name: "Creator Three",
    category: "Fitness",
    description: "Fitness routines, motivation, and healthy living.",
    symbol: "↗",
    color: "linear-gradient(135deg, #a7d9d0, #5b9ea9)",
    label: "FITNESS",
    video: ""
  },
  {
    id: 4,
    name: "Creator Four",
    category: "Fashion",
    description: "Fashion, personal style, and creative looks.",
    symbol: "◇",
    color: "linear-gradient(135deg, #d5baf5, #9c81d5)",
    label: "FASHION",
    video: ""
  },
  {
    id: 5,
    name: "Creator Five",
    category: "Entertainment",
    description: "Creative entertainment and behind-the-scenes content.",
    symbol: "▶",
    color: "linear-gradient(135deg, #f6d58e, #e99a70)",
    label: "ENTERTAINMENT",
    video: ""
  },
  {
    id: 6,
    name: "Creator Six",
    category: "Featured",
    description: "Meet another featured creator on Opstars.",
    symbol: "✧",
    color: "linear-gradient(135deg, #f3b7d8, #b68bd9)",
    label: "FEATURED",
    video: ""
  }
];

const grid = document.getElementById("creatorGrid");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const resetFilters = document.getElementById("resetFilters");

const ageOverlay = document.getElementById("ageOverlay");
const confirmAge = document.getElementById("confirmAge");
const leaveSite = document.getElementById("leaveSite");

const previewOverlay = document.getElementById("previewOverlay");
const previewContent = document.getElementById("previewContent");
const closePreview = document.getElementById("closePreview");

const mobileMenu = document.getElementById("mobileMenu");
const mainNav = document.querySelector(".main-nav");

let activeCategory = "All";
let previousFocus = null;

/* Basic age confirmation */

function initializeAgeGate() {
  let confirmed = false;

  try {
    confirmed = sessionStorage.getItem("opstarsAgeConfirmed") === "yes";
  } catch (error) {
    // If storage is unavailable, ask again during this visit.
  }

  if (confirmed) {
    ageOverlay.hidden = true;
  } else {
    ageOverlay.hidden = false;
    document.body.classList.add("modal-open");
    confirmAge.focus();
  }
}

confirmAge.addEventListener("click", () => {
  try {
    sessionStorage.setItem("opstarsAgeConfirmed", "yes");
  } catch (error) {
    // The gate will appear again if browser storage is unavailable.
  }

  ageOverlay.hidden = true;
  document.body.classList.remove("modal-open");
  document.getElementById("searchInput").focus();
});

leaveSite.addEventListener("click", () => {
  // Replace this destination with an appropriate neutral page if needed.
  window.location.replace("about:blank");
});

/* Escape HTML before inserting creator-provided text */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return replacements[character];
  });
}

/* Validate video URLs before use */

function getSafeVideoURL(value) {
  if (!value) return "";

  try {
    const url = new URL(value, window.location.href);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "";
    }

    return url.href;
  } catch (error) {
    return "";
  }
}

/* Build the creator cards */

function createCreatorCard(creator) {
  const card = document.createElement("article");
  card.className = "creator-card";

  const thumbnail = document.createElement("div");
  thumbnail.className = "thumbnail";
  thumbnail.style.setProperty("--thumbnail", creator.color);

  const symbol = document.createElement("span");
  symbol.className = "thumbnail-symbol";
  symbol.textContent = creator.symbol;
  symbol.setAttribute("aria-hidden", "true");

  const tag = document.createElement("span");
  tag.className = "thumbnail-tag";
  tag.textContent = creator.label;

  const playButton = document.createElement("button");
  playButton.className = "play-button";
  playButton.type = "button";
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Preview " + creator.name);
  playButton.addEventListener("click", () => openPreview(creator));

  thumbnail.append(symbol, tag, playButton);

  const info = document.createElement("div");
  info.className = "creator-info";

  const nameRow = document.createElement("div");
  nameRow.className = "creator-name-row";

  const name = document.createElement("h3");
  name.textContent = creator.name;

  const verified = document.createElement("span");
  verified.className = "verified";
  verified.textContent = "✓";
  verified.title = "Sample badge — not an actual verification";
  verified.setAttribute("aria-label", "Demo verification badge");

  nameRow.append(name, verified);

  const description = document.createElement("p");
  description.className = "creator-description";
  description.textContent = creator.description;

  const meta = document.createElement("div");
  meta.className = "creator-meta";

  const category = document.createElement("span");
  category.className = "creator-category";
  category.textContent = creator.category;

  const previewLabel = document.createElement("span");
  previewLabel.textContent = "View preview ↗";

  meta.append(category, previewLabel);
  info.append(nameRow, description, meta);
  card.append(thumbnail, info);

  return card;
}

/* Search and category filtering */

function renderCreators() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = creators.filter((creator) => {
    const matchesCategory =
      activeCategory === "All" ||
      creator.category === activeCategory;

    const searchableText = [
      creator.name,
      creator.category,
      creator.description
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  grid.replaceChildren();

  filtered.forEach((creator) => {
    grid.appendChild(createCreatorCard(creator));
  });

  resultCount.textContent =
    filtered.length + (filtered.length === 1 ? " creator" : " creators");

  emptyState.hidden = filtered.length !== 0;
  grid.hidden = filtered.length === 0;
  clearSearch.hidden = searchInput.value.length === 0;
}

searchInput.addEventListener("input", renderCreators);

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderCreators();
  searchInput.focus();
});

document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    document.querySelectorAll(".category-btn").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    renderCreators();
  });

  button.setAttribute(
    "aria-pressed",
    String(button.dataset.category === activeCategory)
  );
});

resetFilters.addEventListener("click", () => {
  activeCategory = "All";
  searchInput.value = "";

  document.querySelectorAll(".category-btn").forEach((button) => {
    const selected = button.dataset.category === "All";
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  renderCreators();
});

/* Creator preview dialog */

function openPreview(creator) {
  previousFocus = document.activeElement;
  previewContent.replaceChildren();

  const title = document.createElement("h2");
  title.id = "previewTitle";
  title.textContent = creator.name;

  const category = document.createElement("p");
  category.textContent = creator.category + " · Opstars creator preview";

  const description = document.createElement("p");
  description.textContent = creator.description;

  previewContent.append(title, category, description);

  const videoURL = getSafeVideoURL(creator.video);

  if (videoURL) {
    const video = document.createElement("video");
    video.className = "preview-video";
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;

    const source = document.createElement("source");
    source.src = videoURL;
    source.type = "video/mp4";

    video.appendChild(source);
    previewContent.appendChild(video);
  } else {
    const note = document.createElement("p");
    note.textContent =
      "This is a demo creator profile. Add an authorized video URL to this creator's video field in index.js to enable playback.";
    previewContent.appendChild(note);
  }

  previewOverlay.hidden = false;
  document.body.classList.add("modal-open");
  closePreview.focus();
}

function hidePreview() {
  previewOverlay.hidden = true;
  document.body.classList.remove("modal-open");
  previewContent.replaceChildren();

  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}

closePreview.addEventListener("click", hidePreview);

previewOverlay.addEventListener("click", (event) => {
  if (event.target === previewOverlay) {
    hidePreview();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!previewOverlay.hidden) {
      hidePreview();
    } else if (!ageOverlay.hidden) {
      // Do not allow the age gate to be dismissed with Escape.
      event.preventDefault();
    }
  }
});

/* Mobile navigation */

mobileMenu.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");

  mobileMenu.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    mobileMenu.setAttribute("aria-expanded", "false");
    mobileMenu.textContent = "☰";
  });
});

/* Footer year */

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

/* Start the website */

renderCreators();
initializeAgeGate();

function showGallery(type) {
  document.getElementById("photos").hidden =
    type !== "photos";

  document.getElementById("videos").hidden =
    type !== "videos";
}

// Switch between Photos and Videos
function showGallery(type) {
  document.getElementById("photos").hidden =
    type !== "photos";

  document.getElementById("videos").hidden =
    type !== "videos";
}
