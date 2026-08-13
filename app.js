const slides = [
  ...Array.from({ length: 29 }, (_, index) => index + 1),
  ...Array.from({ length: 19 }, (_, index) => index + 34),
];

const projects = [
  { title: "携程", start: 1, end: 16 },
  { title: "Avatar", start: 17, end: 23 },
  { title: "AI", start: 24, end: 51 },
];

const waterfall = document.querySelector("#waterfall");
const projectNav = document.querySelector("#project-nav");
const currentPage = document.querySelector("#current-page");
const currentProject = document.querySelector("#current-project");
const progressBar = document.querySelector("#progress-bar");
const headerProgress = document.querySelector("#header-progress");
const openProjects = document.querySelector("#open-projects");
const closeProjects = document.querySelector("#close-projects");

function slidePath(page) {
  return `./slides/${String(page).padStart(2, "0")}.webp`;
}

function renderSlides() {
  const fragment = document.createDocumentFragment();

  slides.forEach((slide, index) => {
    const article = document.createElement("article");
    article.className = "portfolio-slide";
    article.id = `slide-${slide}`;
    article.dataset.index = String(index);
    article.dataset.slide = "";

    const meta = document.createElement("div");
    meta.className = "slide-meta";
    meta.innerHTML = `<span>KEN · PORTFOLIO</span><span>${String(index + 1).padStart(2, "0")} / 48</span>`;

    const image = document.createElement("img");
    image.src = slidePath(slide);
    image.alt = `Ken 的作品集第 ${index + 1} 张`;
    image.width = 1920;
    image.height = 1080;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";
    if (index === 0) image.fetchPriority = "high";

    article.append(meta, image);
    fragment.append(article);
  });

  waterfall.append(fragment);
}

function updateProgress(index) {
  const slide = slides[index] ?? 1;
  const project = projects.find((item) => slide >= item.start && slide <= item.end);
  const displayedPage = index + 1;

  currentPage.textContent = String(displayedPage).padStart(2, "0");
  currentProject.textContent = project?.title ?? "项目";
  progressBar.style.width = `${(displayedPage / slides.length) * 100}%`;
  headerProgress.setAttribute("aria-label", `当前第 ${displayedPage} 张，共 ${slides.length} 张`);
}

function openProjectNav() {
  projectNav.classList.add("open");
  projectNav.setAttribute("aria-hidden", "false");
  document.body.classList.add("nav-open");
  closeProjects.focus();
}

function closeProjectNav() {
  projectNav.classList.remove("open");
  projectNav.setAttribute("aria-hidden", "true");
  document.body.classList.remove("nav-open");
}

function jumpToProject(start) {
  closeProjectNav();
  window.setTimeout(() => {
    document.querySelector(`#slide-${start}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

renderSlides();
updateProgress(0);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    updateProgress(Number(visible.target.dataset.index ?? 0));
  },
  { rootMargin: "-18% 0px -58%", threshold: [0.05, 0.35, 0.65] },
);

document.querySelectorAll("[data-slide]").forEach((slide) => observer.observe(slide));
document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => jumpToProject(Number(button.dataset.project)));
});

openProjects.addEventListener("click", openProjectNav);
closeProjects.addEventListener("click", closeProjectNav);
document.querySelector("#project-backdrop").addEventListener("click", closeProjectNav);
document.querySelector("#browse-from-start").addEventListener("click", () => jumpToProject(1));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectNav.classList.contains("open")) {
    closeProjectNav();
    openProjects.focus();
  }
});
