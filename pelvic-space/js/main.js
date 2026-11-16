// Paste your online booking link here. Every booking button on the site uses it.
const BOOKING_URL = "https://your-booking-link-here";

// Email where appointment requests should be sent
const CLINIC_EMAIL = "[email address]";

const navLinks = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "About" },
  { href: "services.html", label: "Services" },
  { href: "group-classes.html", label: "Group Classes" },
  { href: "contact.html", label: "Contact" }
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";

const logoSVG = `
  <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
    <circle cx="24" cy="24" r="23" fill="#b8674a"/>
    <path d="M14 15c5 0 7 3.5 9 7s5 7 9 7 4 3 4 5" fill="none" stroke="#fbf7f2" stroke-width="3" stroke-linecap="round"/>
    <circle cx="35" cy="34" r="3" fill="#fbf7f2"/>
  </svg>`;

const logoHTML = `<a href="index.html" class="logo">${logoSVG}<div>Pelvic <span>Space</span></div></a>`;

function buildHeader() {
  const links = navLinks
    .map(l => `<a href="${l.href}" class="${l.href === currentPage ? "active" : ""}">${l.label}</a>`)
    .join("");
  return `
    <div class="progress-bar" id="progress-bar"></div>
    <header class="site-header" id="top">
      <div class="container nav-wrap">
        ${logoHTML}
        <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">&#9776;</button>
        <nav class="site-nav" id="site-nav">${links}</nav>
        <a class="btn btn-small" href="appointment.html">Book now</a>
      </div>
    </header>`;
}

function buildFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            ${logoHTML}
            <p style="margin-top:1rem">Pelvic health physiotherapy by Dhvani Bhanushali, in London, Ontario.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="about.html">About</a>
            <a href="services.html">Services</a>
            <a href="group-classes.html">Group Classes</a>
            <a href="appointment.html">Book an Appointment</a>
          </div>
          <div>
            <h4>Services</h4>
            <a href="pelvic-health.html">Pelvic Health</a>
            <a href="pregnancy-postpartum.html">Pregnancy &amp; Postpartum</a>
            <a href="sports-physiotherapy.html">Sports Physiotherapy</a>
          </div>
          <div>
            <h4>Contact</h4>
            <p>[Clinic street address]<br>London, ON [Postal code]</p>
            <a href="tel:+1XXXXXXXXXX">[Phone number]</a>
            <a href="mailto:${CLINIC_EMAIL}">${CLINIC_EMAIL}</a>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; 2026 Pelvic Space. All rights reserved. &middot;
          <a href="privacy.html">Privacy Policy</a>
        </div>
      </div>
    </footer>`;
}

// Build the shared header and footer
document.getElementById("site-header").innerHTML = buildHeader();
document.getElementById("site-footer").innerHTML = buildFooter();

// Point every booking button at the online booking link
document.querySelectorAll("[data-book]").forEach(a => (a.href = BOOKING_URL));

// Mobile menu
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");
toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen);
});

// Header shadow, progress bar and parallax, all driven by scrolling
// Header shadow, progress bar and gentle parallax
const header = document.querySelector(".site-header");
const progress = document.getElementById("progress-bar");
const parallaxEls = document.querySelectorAll("[data-parallax]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 10);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = max > 0 ? (y / max) * 100 + "%" : "0%";

  if (!reduceMotion) {
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.05;
      el.style.translate = `0 ${y * speed * -1}px`;
    });
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// 1. Give every section a reveal animation, alternating left and right
document.querySelectorAll("main > section").forEach((sec, i) => {
  sec.classList.add("reveal", i % 2 === 0 ? "slide-left" : "slide-right");
});

// 2. Split headings into words so each word animates in one after another
document.querySelectorAll("main h1, main h2").forEach(h => {
  const words = h.textContent.trim().split(/\s+/);
  h.innerHTML = words
    .map((w, i) => `<span class="word" style="--i:${i}">${w}</span>`)
    .join(" ");
});

// 3. Animate elements in when they enter the screen, and reset them when they leave,
//    so the motion plays again every time the user scrolls back to them
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("in", entry.isIntersecting);
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("in"));
}

// If an image link fails to load, show a soft placeholder block instead
document.querySelectorAll("img[data-fallback]").forEach(img => {
  const markFallback = () => img.classList.add("img-fallback");
  img.addEventListener("error", markFallback);
  if (img.complete && img.naturalWidth === 0) markFallback();
});

// Appointment request form: opens an email to the clinic with the details filled in
const form = document.getElementById("appointment-form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Service: ${data.get("service")}`,
      `Preferred day/time: ${data.get("time")}`,
      ``,
      `Message:`,
      `${data.get("message")}`
    ].join("\n");
    const subject = encodeURIComponent("Appointment request from " + data.get("name"));
    window.location.href = `mailto:${CLINIC_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
  });
}