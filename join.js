
"use strict";

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const creatorForm = document.getElementById("creatorForm");
const creatorBio = document.getElementById("creatorBio");
const bioCount = document.getElementById("bioCount");
const formMessage = document.getElementById("formMessage");

document.getElementById("year").textContent =
  new Date().getFullYear();

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

creatorBio.addEventListener("input", () => {
  bioCount.textContent = creatorBio.value.length;
});

function showMessage(message) {
  formMessage.textContent = message;
  formMessage.className = "form-message visible info";
}

creatorForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!creatorForm.checkValidity()) {
    creatorForm.reportValidity();
    return;
  }

  const linkValue = document.getElementById("creatorLink").value.trim();

  if (linkValue) {
    try {
      const parsedURL = new URL(linkValue);

      if (!["http:", "https:"].includes(parsedURL.protocol)) {
        showMessage("Please use a valid HTTPS or HTTP portfolio link.");
        return;
      }
    } catch {
      showMessage("Please enter a valid portfolio URL.");
      return;
    }
  }

  showMessage(
    "Your form passed the browser checks. This is a demo only: " +
    "your application has NOT been sent or saved. A secure backend " +
    "or approved form service must be connected before real applications."
  );

  formMessage.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});
