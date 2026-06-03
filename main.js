const navWrapper = document.querySelector(".nav-wrapper");

function handleNavScroll() {
  navWrapper.classList.toggle("scrolled", window.scrollY > 60);
}

window.addEventListener("scroll", handleNavScroll, { passive: true });

const navToggle = document.querySelector(".nav-toggle");
const navItems = document.querySelector(".nav-items");

function openNav() {
  navItems.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
}

function closeNav() {
  navItems.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  navToggle.getAttribute("aria-expanded") === "true" ? closeNav() : openNav();
});
navItems
  .querySelectorAll("a, .get-app")
  .forEach((el) => el.addEventListener("click", closeNav));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeNav();
});

const testimonialData = [
  {
    name: "Jane Doe",
    pet: "Husky",
    avatar: "./assets/girl-ellipse.png",
    dogAvatar: "./assets/dog-ellipse.png",
    stars: "./assets/stars.png",
    text: "I really like Tindog for my pet Huskier. Tindog really gave me an accurate and safe results. Will recommend this one!",
  },
  {
    name: "Leo Mendoza",
    pet: "Golden Retriever",
    avatar: "./assets/girl-ellipse.png",
    dogAvatar: "./assets/dog-ellipse.png",
    stars: "./assets/stars.png",
    text: "Tindog paired up my Golden Retriever perfectly. The app is super secure and the matching algorithm really works!",
  },
  {
    name: "Chloe Bautista",
    pet: "Shih Tzu",
    avatar: "./assets/girl-ellipse.png",
    dogAvatar: "./assets/dog-ellipse.png",
    stars: "./assets/stars.png",
    text: "Thanks to this app, my Shih Tzu is no longer bored at home. It's the absolute best way for dogs to socialize and make friends.",
  },
  {
    name: "Ethan Garcia",
    pet: "Labrador",
    avatar: "./assets/girl-ellipse.png",
    dogAvatar: "./assets/dog-ellipse.png",
    stars: "./assets/stars.png",
    text: "Being a new fur parent was intimidating, but Tindog helped me find a local network of dog lovers effortlessly. I highly endorse it!",
  },
  {
    name: "Maya Flores",
    pet: "Pomeranian",
    avatar: "./assets/girl-ellipse.png",
    dogAvatar: "./assets/dog-ellipse.png",
    stars: "./assets/stars.png",
    text: "Our Pomeranian was so shy before we downloaded this. Now we schedule playdates every weekend. Tindog has been an absolute game-changer!",
  },
  {
    name: "Julian Castro",
    pet: "Beagle",
    avatar: "./assets/girl-ellipse.png",
    dogAvatar: "./assets/dog-ellipse.png",
    stars: "./assets/stars.png",
    text: "I love the integrated veterinary features. Not only did my Beagle find a buddy, but we also get solid health tips in the same place.",
  },
  {
    name: "Isabella Roxas",
    pet: "Dalmatian",
    avatar: "./assets/girl-ellipse.png",
    dogAvatar: "./assets/dog-ellipse.png",
    stars: "./assets/stars.png",
    text: "Through the adoption initiative on Tindog, my Dalmatian met a rescue dog that became his best pal. It's such a beautiful and purposeful community.",
  },
  {
    name: "Nathan Ocampo",
    pet: "Corgi",
    avatar: "./assets/girl-ellipse.png",
    dogAvatar: "./assets/dog-ellipse.png",
    stars: "./assets/stars.png",
    text: "Our Corgi loves his new squad. The matchmaking feature is incredibly precise, and every pet owner we've met has been fantastic.",
  },
  {
    name: "Diana Alonzo",
    pet: "Aspin",
    avatar: "./assets/girl-ellipse.png",
    dogAvatar: "./assets/dog-ellipse.png",
    stars: "./assets/stars.png",
    text: "It's so refreshing to see an app that celebrates local breeds. My Aspin easily found playmates here. Absolute perfection!",
  },
];

const CARDS_PER_PAGE_DESKTOP = 3;

const wrapper = document.querySelector(".testimonials-card-wrapper");
const dotsContainer = document.querySelector(".carousel-dots");

let currentPage = 0;
let autoPlayInterval;
let isAnimating = false;

function createCardHTML(data) {
  return `
    <div class="testimonial">
      <div class="avatar-container">
        <div class="avatar1">
          <img src="${data.avatar}" alt="Avatar" />
        </div>
        <div class="avatar2">
          <img src="${data.dogAvatar}" alt="Dog Avatar" />
        </div>
      </div>
      <span class="testimonial-name">${data.name}</span>
      <h4>Pet: ${data.pet}</h4>
      <img class="stars" src="${data.stars}" alt="Stars" />
      <div class="testimonial-description">
        <span class="quote">\u201C</span>
        <p>${data.text}</p>
      </div>
    </div>
  `;
}

function getCardsPerPage() {
  return window.innerWidth >= 1025 ? CARDS_PER_PAGE_DESKTOP : 1;
}

function getTotalPages() {
  return Math.ceil(testimonialData.length / getCardsPerPage());
}

function getPageCards(page) {
  const perPage = getCardsPerPage();
  const start = page * perPage;
  return testimonialData.slice(start, start + perPage);
}

function createSlide(page) {
  const slide = document.createElement("div");
  slide.classList.add("carousel-slide");
  slide.innerHTML = getPageCards(page).map(createCardHTML).join("");
  return slide;
}

function renderCards(page) {
  wrapper.innerHTML = "";
  const slide = createSlide(page);
  slide.classList.add("active");
  wrapper.appendChild(slide);
}

function renderDots() {
  const total = getTotalPages();
  dotsContainer.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === currentPage) dot.classList.add("active");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentPage);
  });
}

function goTo(page) {
  if (isAnimating) return;

  const total = getTotalPages();
  const nextPage = (page + total) % total;
  if (nextPage === currentPage) return;

  isAnimating = true;

  const isWrappingForward = currentPage === total - 1 && nextPage === 0;
  const isWrappingBackward = currentPage === 0 && nextPage === total - 1;
  const goingRight = isWrappingBackward
    ? true
    : isWrappingForward
      ? false
      : nextPage > currentPage;

  const currentSlide = wrapper.querySelector(".carousel-slide.active");
  const nextSlide = createSlide(nextPage);

  nextSlide.style.transform = goingRight
    ? "translateX(100%)"
    : "translateX(-100%)";
  wrapper.appendChild(nextSlide);

  nextSlide.getBoundingClientRect();

  const easing = "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)";
  currentSlide.style.transition = easing;
  nextSlide.style.transition = easing;

  currentSlide.style.transform = goingRight
    ? "translateX(-100%)"
    : "translateX(100%)";
  nextSlide.style.transform = "translateX(0)";

  currentPage = nextPage;
  updateDots();

  currentSlide.addEventListener(
    "transitionend",
    () => {
      currentSlide.remove();
      nextSlide.classList.add("active");
      nextSlide.style.transition = "";
      isAnimating = false;
    },
    { once: true },
  );
}

function next() {
  goTo(currentPage + 1);
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayInterval = setInterval(next, 4000);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

let touchStartX = 0;

wrapper.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
  stopAutoPlay();
});

wrapper.addEventListener("touchend", (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? goTo(currentPage + 1) : goTo(currentPage - 1);
  }
  startAutoPlay();
});

let lastPerPage = getCardsPerPage();

window.addEventListener("resize", () => {
  const newPerPage = getCardsPerPage();
  if (newPerPage !== lastPerPage) {
    lastPerPage = newPerPage;
    currentPage = 0;
    renderCards(currentPage);
    renderDots();
  }
});

renderCards(currentPage);
renderDots();
// startAutoPlay();
