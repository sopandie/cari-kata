const words = {
  hewan: ["KUCING", "SAPI", "GAJAH", "AYAM", "KUDA"],
  buah: ["APEL", "MANGGA", "PISANG", "JERUK", "ANGGUR"],
  warna: ["MERAH", "BIRU", "HIJAU", "KUNING", "PUTIH"],
  kendaraan: ["MOBIL", "PESAWAT", "MOTOR", "SEPEDA", "KERETA"],
  sayur: ["BAYAM", "TOGE", "LABU", "WORTEL", "TOMAT"]

};

const gridSize = 10;
let currentWords = [];
let grid = [];
let selectedCells = [];
let score = 0;

function startGame() {
  score = 0;
  document.getElementById("score").innerText = score;

  const category = document.getElementById("category").value;
  currentWords = words[category];

  generateGrid();
  renderGrid();
  showWords();
}

function generateGrid() {
  grid = Array(gridSize).fill().map(() => Array(gridSize).fill(""));

  currentWords.forEach(word => {
    placeWord(word);
  });

  // isi huruf kosong dengan random
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
}

function placeWord(word) {
  let placed = false;

  while (!placed) {
    let direction = Math.random() > 0.5 ? "horizontal" : "vertical";

    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);

    if (direction === "horizontal" && col + word.length <= gridSize) {
      let fits = true;

      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== "" && grid[row][col + i] !== word[i]) {
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

    if (direction === "vertical" && row + word.length <= gridSize) {
      let fits = true;

      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== "" && grid[row + i][col] !== word[i]) {
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

function renderGrid() {
  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = "";

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.innerText = grid[r][c];
      div.dataset.row = r;
      div.dataset.col = c;
      div.addEventListener("click", selectLetter);
      gridElement.appendChild(div);
    }
  }
}

function showWords() {
  document.getElementById("wordList").innerHTML =
    "Cari Kata: " + currentWords.join(", ");
}

function selectLetter() {
  if (this.classList.contains("found")) return;

  this.classList.toggle("selected");

  selectedCells = Array.from(document.querySelectorAll(".selected"));
  let formedWord = selectedCells.map(cell => cell.innerText).join("");

  if (currentWords.includes(formedWord)) {
    selectedCells.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("found");
    });

    score += 10;
    document.getElementById("score").innerText = score;
    selectedCells = [];

    if (score === currentWords.length * 10) {
      setTimeout(() => alert("🎉 Hebat! Semua kata ditemukan!"), 200);
    }
  }
}

function openFullscreen() {
  let elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

// otomatis fullscreen saat halaman diklik pertama kali
document.addEventListener("click", function () {
  openFullscreen();
}, { once: true });
