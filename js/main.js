const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
