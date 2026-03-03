// ===============================
// KONFIGURASI GRID
// ===============================
const size = 10;

const themes = {
  rukun_islam: ["SYAHADAT", "SHALAT", "ZAKAT", "PUASA", "HAJI"],
  rukun_iman: ["ALLAH", "MALAIKAT", "KITAB", "RASUL", "KIAMAT", "TAKDIR"],
  shalat_wajib: ["SHUBUH", "DHUHUR", "ASHAR", "MAGHRIB", "ISYA"],
  gerakan_shalat: ["BERDIRI", "TAKBIR", "RUKUK", "SUJUD", "DUDUK", "SALAM"],
  nama_rasul: ["NUH", "IBRAHIM", "MUSA", "ISA", "MUHAMMAD"],
  nama_malaikat: [
    "JIBRIL",
    "MIKAIL",
    "ISRAFIL",
    "IZRAIL",
    "RAKIB",
    "ATID",
    "MUNKAR",
    "NAKIR",
    "MALIK",
    "RIDWAN",
  ],
  nama_kitab: ["ZABUR", "TAURAT", "INJIL", "ALQURAN"],
  rukun_haji: ["IHRAM", "WUQUF", "THAWAF", "SAI", "TAHALLUL", "TERTIB"],
  hukum_islam: ["WAJIB", "SUNNAH", "HARAM", "MAKRUH", "MUBAH"],
  istilah_puasa: ["SAHUR", "IMSAK", "TARAWIH", "QADHA", "FIDYAH", "TERTIB"],
};

let currentWords = [];
let grid = [];
let selectedCells = [];
let foundWords = [];
let isMouseDown = false;
let startTime;
let timerInterval;

// ===============================
// ELEMENT
// ===============================
const gridElement = document.getElementById("grid");
const wordListElement = document.getElementById("wordList");
const timerElement = document.getElementById("timer");
const leaderboardElement = document.getElementById("leaderboard");
const startBtn = document.getElementById("startBtn");
const themeSelect = document.getElementById("themeSelect");

// ===============================
// START GAME
// ===============================
startBtn.addEventListener("click", initGame);

function initGame() {
  const selectedTheme = themeSelect.value;
  currentWords = themes[selectedTheme];

  grid = [];
  selectedCells = [];
  foundWords = [];
  gridElement.innerHTML = "";
  leaderboardElement.style.display = "none";

  gridElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  createEmptyGrid();
  placeWords();
  fillRandomLetters();
  renderGrid();
  renderWordList();
  startTimer();
}

// ===============================
// GRID
// ===============================
function createEmptyGrid() {
  for (let r = 0; r < size; r++) {
    grid[r] = [];
    for (let c = 0; c < size; c++) {
      grid[r][c] = "";
    }
  }
}

function renderGrid() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener("mousedown", handleMouseDown);
      cell.addEventListener("mouseover", handleMouseOver);

      gridElement.appendChild(cell);
    }
  }

  document.addEventListener("mouseup", handleMouseUp);
}

// ===============================
// DRAG LOGIC
// ===============================
function handleMouseDown(e) {
  if (!e.target.classList.contains("cell")) return;
  isMouseDown = true;
  clearSelection();
  selectCell(e.target);
}

function handleMouseOver(e) {
  if (!isMouseDown) return;
  if (!e.target.classList.contains("cell")) return;
  selectCell(e.target);
}

function handleMouseUp() {
  if (!isMouseDown) return;
  isMouseDown = false;
  checkWord();
}

function selectCell(cell) {
  if (selectedCells.includes(cell)) return;
  cell.classList.add("selected");
  selectedCells.push(cell);
}

function clearSelection() {
  selectedCells.forEach((cell) => cell.classList.remove("selected"));
  selectedCells = [];
}

// ===============================
// CEK KATA
// ===============================
function checkWord() {
  const selectedWord = selectedCells.map((c) => c.textContent).join("");
  const reversed = selectedWord.split("").reverse().join("");

  if (
    currentWords.includes(selectedWord) &&
    !foundWords.includes(selectedWord)
  ) {
    markFound(selectedWord);
  } else if (
    currentWords.includes(reversed) &&
    !foundWords.includes(reversed)
  ) {
    markFound(reversed);
  } else {
    clearSelection();
  }
}

function markFound(word) {
  selectedCells.forEach((cell) => {
    cell.classList.remove("selected");
    cell.classList.add("found");
  });

  foundWords.push(word);
  renderWordList();

  if (foundWords.length === currentWords.length) {
    finishGame();
  }
}

// ===============================
// WORD LIST
// ===============================
function renderWordList() {

  const formattedWords = currentWords.map(word => {
    if (foundWords.includes(word)) {
      return `<span class="word-found">${word}</span>`;
    }
    return `<span class="word-pending">${word}</span>`;
  });

  wordListElement.innerHTML =
    `<span class="label-cari">Cari Kata:</span> ` +
    formattedWords.join(", ");
}

// ===============================
// TIMER
// ===============================
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = "Waktu: " + elapsed + " detik";
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// ===============================
// FINISH GAME
// ===============================
function finishGame() {
  stopTimer();

  const totalTime = Math.floor((Date.now() - startTime) / 1000);

  setTimeout(() => {
    const name = prompt("🎉 Selamat! Masukkan nama Anda:");

    if (name && name.trim() !== "") {
      saveScore(name.trim(), totalTime);
      leaderboardElement.style.display = "block";
    }
  }, 200);
}

// ===============================
// LEADERBOARD (PER TEMA)
// ===============================
function saveScore(name, time) {
  const themeKey = themeSelect.value;
  const storageKey = "leaderboard_" + themeKey;

  let scores = JSON.parse(localStorage.getItem(storageKey)) || [];
  scores.push({ name, time });

  scores.sort((a, b) => a.time - b.time);
  scores = scores.slice(0, 5);

  localStorage.setItem(storageKey, JSON.stringify(scores));
  renderLeaderboard();
}

function renderLeaderboard() {
  const themeKey = themeSelect.value;
  const storageKey = "leaderboard_" + themeKey;

  const scores = JSON.parse(localStorage.getItem(storageKey)) || [];

  let html = `
    <h3>🏆 Leaderboard (5 Tercepat)</h3>
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Waktu (detik)</th>
        </tr>
      </thead>
      <tbody>
  `;

  scores.forEach((s, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${s.name}</td>
        <td>${s.time}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  leaderboardElement.innerHTML = html;
}

// ===============================
// PLACE WORDS
// ===============================
function placeWords() {
  currentWords.forEach((word) => {
    placeWordRandomly(word);
  });
}

function placeWordRandomly(word) {
  let placed = false;

  while (!placed) {
    const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    if (direction === "horizontal") {
      if (col + word.length <= size) {
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row][col + i] !== "") {
            fits = false;
            break;
          }
        }
        if (fits) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
          }
          placed = true;
        }
      }
    } else {
      if (row + word.length <= size) {
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col] !== "") {
            fits = false;
            break;
          }
        }
        if (fits) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = word[i];
          }
          placed = true;
        }
      }
    }
  }
}

function fillRandomLetters() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

