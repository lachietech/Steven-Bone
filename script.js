const divisions = [
  {
    number: "01",
    slug: "prawn-farming",
    label: "Prawn farming",
    title: "32 gram earth-pond shrimp",
    icon: "prawn",
    accent: "#79c0f2",
    summary: "Prawn farming built around premium size, healthy ponds and consistent quality.",
    detail:
      "Bone's grows prawns in earth ponds with a clear performance standard, producing shrimp that reach an exceptional 32 grams. From pond preparation through to harvest handling, the operation is tuned for quality, size and reliability.",
    points: ["32 gram shrimp", "Earth-pond production", "Quality-led harvest handling"],
  },
  {
    number: "02",
    slug: "hydroponics",
    label: "Hydroponics",
    title: "Controlled growing systems",
    icon: "sprout",
    accent: "#4699df",
    summary: "Hydroponic growing systems built around efficiency, consistency and clean production.",
    detail:
      "Bone's hydroponics operation focuses on practical growing systems that make smart use of water, space and inputs. It is designed for clean, controlled production and dependable growing performance.",
    points: ["Controlled growing", "Efficient water use", "Consistent production"],
  },
  {
    number: "03",
    slug: "trailers",
    label: "Trailer building",
    title: "All kinds of trailers",
    icon: "factory",
    accent: "#78aee8",
    summary: "Trailer building for real work, with builds shaped around all kinds of hauling needs.",
    detail:
      "Bone's builds all kinds of trailers with practical fabrication, durable materials and a clear understanding of how they need to perform. From farm use through to general transport needs, each build is made for the job at hand.",
    points: ["All kinds of trailers", "Purpose-built fabrication", "Built for working conditions"],
  },
  {
    number: "04",
    slug: "organics",
    label: "Vermiculture",
    title: "Vermiculture",
    icon: "leaf",
    accent: "#a8d7fb",
    summary: "Vermiculture systems and worm-based inputs that strengthen soil health over time.",
    detail:
      "Bone's vermiculture operation focuses on worm-driven soil improvement and practical biological inputs for productive land. It is a grounded approach to fertility built around healthier soils, resilience and long-term farm performance.",
    points: ["Worm-based systems", "Soil biology focus", "Farm-ready inputs"],
  },
  {
    number: "05",
    slug: "transport",
    label: "Transport company",
    title: "Road transport",
    icon: "truck",
    accent: "#dfefff",
    summary: "Dependable regional transport backed by people who understand the load.",
    detail:
      "The transport division connects products, equipment and regional businesses with capable road freight support. It brings the same practical thinking found across the wider Bone's operation.",
    points: ["Regional capability", "Agricultural freight", "Reliable coordination"],
  },
];

const menu = document.querySelector(".mobile-menu");
const menuButton = document.querySelector(".menu-button");
const menuClose = document.querySelector(".mobile-menu__close");
const divisionFeature = document.querySelector(".division-feature");
const divisionTabs = [...document.querySelectorAll(".division-tabs [data-division]")];
const divisionLinks = [...document.querySelectorAll("a[data-division]")];
const contactForm = document.querySelector("#contact-form");
const formSuccess = document.querySelector("#form-success");
const sendAnotherButton = document.querySelector("#send-another");

function openMenu() {
  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
  menuClose.focus();
}

function closeMenu() {
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function selectDivision(index) {
  const division = divisions[index];
  if (!division) return;

  divisionTabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === index;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  divisionFeature.id = division.slug;
  divisionFeature.style.setProperty("--accent", division.accent);
  divisionFeature.querySelector('[data-feature="label"]').textContent = division.label;
  divisionFeature.querySelector('[data-feature="title"]').textContent = division.title;
  divisionFeature.querySelector('[data-feature="summary"]').textContent = division.summary;
  divisionFeature.querySelector('[data-feature="detail"]').textContent = division.detail;
  divisionFeature.querySelector('[data-feature="number"]').textContent = division.number;
  divisionFeature
    .querySelector('[data-feature="icon"] use')
    .setAttribute("href", `#icon-${division.icon}`);
  divisionFeature.querySelector('[data-feature="points"]').innerHTML = division.points
    .map((point) => `<li><span>+</span> ${point}</li>`)
    .join("");
}

menuButton.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

divisionTabs.forEach((tab) => {
  tab.addEventListener("click", () => selectDivision(Number(tab.dataset.division)));
});

divisionLinks.forEach((link) => {
  link.addEventListener("click", () => selectDivision(Number(link.dataset.division)));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.classList.add("is-hidden");
  formSuccess.classList.remove("is-hidden");
});

sendAnotherButton.addEventListener("click", () => {
  contactForm.reset();
  formSuccess.classList.add("is-hidden");
  contactForm.classList.remove("is-hidden");
  contactForm.querySelector("input").focus();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
