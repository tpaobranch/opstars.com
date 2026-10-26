
"use strict";

// Demo profiles only. Replace these with authorized, verified profiles.
const creators = [
  {
    name: "Alex Morgan",
    handle: "@alexcreates",
    category: "Lifestyle",
    initials: "AM",
    featured: true,
    bio: "Lifestyle, daily routines, and creative inspiration."
  },
  {
    name: "Jordan Lee",
    handle: "@jordanmoves",
    category: "Fitness",
    initials: "JL",
    featured: true,
    bio: "Fitness routines, wellness, and active living."
  },
  {
    name: "Taylor Reed",
    handle: "@taylorstyle",
    category: "Fashion",
    initials: "TR",
    featured: false,
    bio: "Fashion ideas, styling, and personal expression."
  },
  {
    name: "Riley Parker",
    handle: "@rileyoncamera",
    category: "Entertainment",
    initials: "RP",
    featured: true,
    bio: "Entertainment, storytelling, and behind-the-scenes."
  },
  {
    name: "Casey Brooks",
    handle: "@caseyday",
    category: "Lifestyle",
    initials: "CB",
    featured: false,
    bio: "Everyday moments, hobbies, and lifestyle content."
  },
  {
    name: "Jamie Ellis",
    handle: "@jamieactive",
    category: "Fitness",
    initials: "JE",
    featured: false,
    bio: "Movement, training, and healthy habits."
  }
];

const grid = document.getElementById("creatorGrid");
const searchInput = document.getElementById("creatorSearch");
const clearSearch = document.getElementById("clearSearch");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const resetFilters = document.getElementById("resetFilters");
const filterButtons = document.querySelectorAll(".filter");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

let selectedCategory = "All";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderCreators() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filtered = creators.filter(creator => {
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Featured" && creator.featured) ||
      creator.category === selectedCategory;

    const searchableText = [
      creator.name,
      creator.handle,
      creator.category,
      creator.bio
    ].join(" ").toLowerCase();

    return matchesCategory && searchableText.includes(searchTerm);
  });

  resultCount.textContent =
    `${filtered.length} ${filtered.length === 1 ? "creator" : "creators"}`;

  grid.innerHTML = filtered.map(creator => `
    <article class="creator-card">
      <div class="creator-cover">
        <span class="category-tag">${escapeHTML(creator.category)}</span>
        ${creator.featured
          ? '<span class="featured-tag">Featured</span>'
          : ""}
        <div class="creator-avatar" aria-label="Profile initials">
          ${escapeHTML(creator.initials)}
        </div>
      </div>
      <div class="creator-info">
        <h3>${escapeHTML(creator.name)}</h3>
        <p class="creator-handle">${escapeHTML(creator.handle)}</p>
        <p class="creator-bio">${escapeHTML(creator.bio)}</p>
        <div class="creator-bottom">
          <span class="creator-category">
            ${escapeHTML(creator.category)}
          </span>
          <a class="profile-link"
             href="mailto:creators@example.com?subject=${encodeURIComponent(
               "Creator profile inquiry: " + creator.handle
             )}">
            Profile inquiry ↗
          </a>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filtered.length > 0;
  grid.hidden = filtered.length === 0;
}

function setCategory(category) {
  selectedCategory = category;

  filterButtons.forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderCreators();
}

filterButtons.forEach(button => {
  button.setAttribute(
    "aria-pressed",
    String(button.dataset.category === "All")
  );

  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
  });
});

searchInput.addEventListener("input", renderCreators);

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderCreators();
  searchInput.focus();
});

resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  setCategory("All");
  searchInput.focus();
});

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent =
  new Date().getFullYear();

renderCreators();
