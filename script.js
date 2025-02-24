const quranContainer = document.getElementById("quran-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const themeToggle = document.getElementById("theme-toggle");
const quranAudio = document.getElementById("quran-audio");
const surahInfo = document.getElementById("surah-info");

let currentPage = localStorage.getItem("page") ? parseInt(localStorage.getItem("page")) : 1;
let progress = Math.min(Math.ceil(currentPage / 20), 30); // Max 30 Juz

function updateProgress() {
    progressBar.value = progress;
    progressText.textContent = `${progress}/30 Juz`;
    localStorage.setItem("progress", progress);
}

function loadPage(page) {
    quranContainer.innerHTML = "<p>Memuat ayat...</p>";
    
    fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`)
        .then(res => res.json())
        .then(data => {
            quranContainer.innerHTML = "";
            const ayahs = data.data.ayahs;
            
            if (ayahs.length > 0) {
                // Ambil info surat
                const surahName = ayahs[0].surah.englishName;
                const totalAyahs = ayahs[0].surah.numberOfAyahs;
                surahInfo.innerHTML = `<i class="fas fa-book"></i> ${surahName} - ${totalAyahs} Ayat`;

                // Tampilkan Ayat
                ayahs.forEach(ayat => {
                    let ayatDiv = document.createElement("div");
                    ayatDiv.classList.add("ayat");
                    ayatDiv.innerHTML = `<strong>${ayat.numberInSurah}.</strong> ${ayat.text}`;
                    ayatDiv.addEventListener("click", () => {
                        playAyatAudio(ayat.number);
                    });
                    quranContainer.appendChild(ayatDiv);
                });
            }
        });

    pageInfo.textContent = `Halaman ${page} / 604`;
    currentPage = page;
    progress = Math.min(Math.ceil(currentPage / 20), 30);
    updateProgress();
    localStorage.setItem("page", page);
}

function playAyatAudio(ayatNumber) {
    quranAudio.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayatNumber}.mp3`;
    quranAudio.play();
}

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        loadPage(currentPage - 1);
    }
});

nextPageBtn.addEventListener("click", () => {
    if (currentPage < 604) {
        loadPage(currentPage + 1);
    }
});

// Mode Gelap dengan Penyimpanan
if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = "☀ Mode Terang";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        themeToggle.innerHTML = "☀ Mode Terang";
        localStorage.setItem("dark-mode", "enabled");
    } else {
        themeToggle.innerHTML = "🌙 Mode Gelap";
        localStorage.setItem("dark-mode", "disabled");
    }
});

loadPage(currentPage);
updateProgress();
