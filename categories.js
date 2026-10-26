
"use strict";

const categories = [
  {
    name: "Lifestyle",
    icon: "♡",
    label: "Popular",
    group: "Lifestyle",
    description: "Daily life, personal interests, routines, and inspiration.",
    keywords: "daily life hobbies routines inspiration"
  },
  {
    name: "Fitness",
    icon: "↗",
    label: "Popular",
    group: "Lifestyle",
    description: "Training, movement, wellness, and healthy habits.",
    keywords: "training workouts exercise movement wellness"
  },
  {
    name: "Fashion",
    icon: "✦",
    label: "Popular",
    group: "Creative",
    description: "Personal style, outfits, beauty, and fashion ideas.",
    keywords: "style outfits beauty clothing fashion"
  },
  {
    name: "Entertainment",
    icon: "▶",
    label: "Popular",
    group: "Creative",
    description: "Performances, storytelling, humor, and fun.",
    keywords: "video performance humor stories comedy"
  },
  {
    name: "Photography",
    icon: "◎",
    label: "Creative",
    group: "Creative",
    description: "Portraits, visual storytelling, and photography projects.",
    keywords: "camera portraits pictures visual art"
  },
  {
    name: "Music",
    icon: "♫",
    label: "Creative",
    group: "Creative",
    description: "Music, singing, instruments, and audio creativity.",
    keywords: "songs singing instruments audio"
  },
  {
    name: "Wellness",
    icon: "✿",
    label: "Lifestyle",
    group: "Lifestyle",
    description: "Self-care, mindfulness, balance, and wellbeing.",
    keywords: "self care mindfulness wellbeing balance"
  },
  {
    name: "Art & Design",
    icon: "✎",
    label: "Creative",
    group: "Creative",
    description: "Illustration, design, digital art, and creative work.",
    keywords: "illustration drawing design digital art"
  },
  {
    name: "Travel",
    icon: "⌁",
    label: "Lifestyle",
    group: "Lifestyle",
    description: "Destinations, adventures, and travel experiences.",
    keywords: "travel destinations holidays adventure"
  }
];

const categoryGrid = document.getElementById("categoryGrid");
const categorySearch = document.getElementById("categorySearch");
const categoryCount = document.getElementById("categoryCount");
const clearSearch = document.getElementById("clearSearch");
const emptyState = document.getElementById("emptyState");
const resetFilters = document.getElementById("resetFilters");
const filterButtons = document.querySelectorAll(".filter");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

let selectedFilter = "All";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderCategories() {
  const searchTerm = categorySearch.value.trim().toLowerCase();

  const filtered = categories.filter(category => {
    const matchesSearch = [
      category.name,
      category.description,
      category.label,
      category.keywords
    ].join(" ").toLowerCase().includes(searchTerm);

    const matchesFilter =
      selectedFilter === "All" ||
      category.label === selectedFilter ||
      category.group === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  categoryCount.textContent =
    `${filtered.length} ${filtered.length === 1 ? "category" : "categories"}`;

  categoryGrid.innerHTML = filtered.map(category => `
    <article class="category-card">
      <div class="category-art">
        <span class="category-icon" aria-hidden="true">
          ${escapeHTML(category.icon)}
        </span>
      </div>
      <span class="category-label">
        ${escapeHTML(category.label)}
      </span>
      <h3>${escapeHTML(category.name)}</h3>
      <p>${escapeHTML(category.description)}</p>
      <a class="category-link"
         href="creators.html?category=${encodeURIComponent(category.name)}">
        Explore creators <span aria-hidden="true">↗</span>
      </a>
    </article>
  `).join("");

  emptyState.hidden = filtered.length !== 0;
  categoryGrid.hidden = filtered.length === 0;
}

function setFilter(filter) {
  selectedFilter = filter;

  filterButtons.forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderCategories();
}

filterButtons.forEach(button => {
  button.setAttribute(
    "aria-pressed",
    String(button.dataset.filter === "All")
  );

  button.addEventListener("click", () => {
    setFilter(button.dataset.filter);
  });
});

categorySearch.addEventListener("input", renderCategories);

clearSearch.addEventListener("click", () => {
  categorySearch.value = "";
  renderCategories();
  categorySearch.focus();
});

resetFilters.addEventListener("click", () => {
  categorySearch.value = "";
  setFilter("All");
  categorySearch.focus();
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

document.getElementById("year").textContent = new Date().getFullYear();

renderCategories();
