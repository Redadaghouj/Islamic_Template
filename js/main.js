// API Links

// Hadith:
// https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-malik.min.json
// https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-malik1.min.json

// Surah Name :
// http://api.alquran.cloud/v1/meta

// Surah :
// http://api.alquran.cloud/v1/quran/quran-uthmani

// Azan :
// http://api.aladhan.com/v1/timingsByCity?city=tangier&country=Morocco&method=8

// Global

function scrollToSection(sectionName) {
  sectionName.scrollIntoView();
}

// Header

let header = document.querySelector(".header");
let navbar = document.querySelector(".header ul");
let headerContainer = document.querySelector(".header .container");
let hadithContainer = document.querySelector(".hadith-container");
let navbarToggleBtn = document.querySelector(".toggle-btn");

window.addEventListener("scroll", navScrollY);
navbar.addEventListener("click", navScrollTo);
navbarToggleBtn.addEventListener("click", () => {
  navbar.classList.toggle("active");
});
function navScrollY() {
  //Scroll nav & to top page
  if (window.scrollY > 100) {
    header.classList.add("active");
    headerContainer.style.height = "80px";
    scrollToTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    headerContainer.style.height = "70px";
    scrollToTopBtn.classList.remove("active");
  }
}

function navScrollTo(e) {
  if (e.target.dataset.filter) {
    let section = document.querySelector(`.${e.target.dataset.filter}`);
    activeClassChanger(e.target);
    scrollToSection(section);
  }
}

function activeClassChanger(target) {
  document.querySelector("header ul li.active").classList.remove("active");
  target.classList.add("active");
}

// Hadith

let hadithButtons = document.querySelector(".hadith-buttons");
let hadithNbr = document.querySelector(".hadith-nbr");
let exploreBtn = document.querySelector(".explore-btn");
let hadithSection = document.querySelector(".hadith");

window.addEventListener("load", getHadithApi);

hadithButtons.addEventListener("click", hadithChanger);
exploreBtn.addEventListener("click", () => {
  scrollToSection(hadithSection);
});

let hadithIndex = 0;
let hadiths;

async function getHadithApi() {
  let url =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-malik.min.json";

  let res = await fetch(url);
  let data = await res.json();
  hadiths = data.hadiths;
  addHadiths();
}

function addHadiths() {
  hadithContainer.textContent = hadiths[hadithIndex].text;
}

function hadithChanger(e) {
  if (e.target.classList.contains("next-hadith-btn")) {
    hadithIndex === 1857 ? (hadithIndex = 0) : hadithIndex++;
  } else if (e.target.classList.contains("prev-hadith-btn")) {
    hadithIndex === 0 ? (hadithIndex = 1857) : hadithIndex--;
  }
  hadithNbr.textContent = `1858/${hadithIndex + 1}`;
  addHadiths();
}

// Quran

let surahsContainer = document.querySelector(".surah-container");

(async function getSurahNameApi() {
  let url = "http://api.alquran.cloud/v1/meta";

  let res = await fetch(url);
  let data = await res.json();
  let surahs = data.data.surahs.references;
  drawSurahNameUi(surahs);
})();

function drawSurahNameUi(surahs) {
  surahs.forEach((surah) => {
    surahsContainer.innerHTML += `
    <div class="surah-items" data-nbr="${surah.number}">
      <p data-nbr="${surah.number}">${surah.name}</p>
      <p data-nbr="${surah.number}">${surah.englishName}</p>
    </div>
    `;
  });
}

// Pop-up (Quran)

let popUpPage = document.querySelector(".pop-up");
let popUpPageCloseBtn = document.querySelector(".pop-up .icon");
let popUpPageContainer = document.querySelector(".pop-up .container");

surahsContainer.addEventListener("click", async (e) => {
  if (e.target.dataset.nbr) {
    let surahs = await getSurahApi();
    drawSurahUi(surahs, e.target.dataset.nbr);
    popUpPage.classList.add("active");
  }
});

popUpPageCloseBtn.addEventListener("click", () => {
  popUpPage.classList.remove("active");
});

async function getSurahApi() {
  let url = "http://api.alquran.cloud/v1/quran/quran-uthmani";

  let res = await fetch(url);
  let data = await res.json();
  let surahs = data.data.surahs;
  return surahs;
}

function drawSurahUi(surahs, nbr) {
  popUpPage.scrollTop = 0;
  popUpPageContainer.innerHTML = "";
  surahs[nbr - 1].ayahs.forEach((ayah) => {
    popUpPageContainer.innerHTML += `
    <p>${ayah.text}</p>
    `;
  });
}

// Azan

let azanContainer = document.querySelector(".azan-cards");

(async function getAzanApi() {
  let url =
    "http://api.aladhan.com/v1/timingsByCity?city=tangier&country=Morocco&method=8";

  let res = await fetch(url);
  let data = await res.json();
  let azanTime = data.data.timings;
  drawAzanUi(azanTime);
})();

function drawAzanUi(azanTime) {
  let azanAr = [
    "الفجر",
    "الشروق",
    "الظهر",
    "العصر",
    "الغروب",
    "المغرب",
    "العشاء",
    "الإمساك",
  ];

  let i = 0;
  for (let azan in azanTime) {
    if (i < 8) {
      azanContainer.innerHTML += `
        <div class="azan-card-items">
          <h1 class="azan-time">${azanTime[azan]}</h1>
          <div class="azan-name">${azanAr[i++]}</div>
          <div class="cube"></div>
        </div>`;
    }
  }
}

/* Scroll Top */

let scrollToTopBtn = document.querySelector(".scroll-top");

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
});
