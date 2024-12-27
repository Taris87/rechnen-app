// DOM-Elemente
const questionEL = document.getElementById("question");
const formEL = document.getElementById("form");
const inputEL = document.getElementById("input");
const scoreEL = document.getElementById("score");
const btnEL = document.querySelector(".btn");

// Überprüfen, ob alle Elemente korrekt geladen sind
if (!questionEL || !formEL || !inputEL || !scoreEL || !btnEL) {
  console.error("Einige DOM-Elemente sind nicht verfügbar.");
}

// Variablen
let score = JSON.parse(localStorage.getItem("score") || "0");
score = Math.max(score, 0); // Sicherstellen, dass der Score nicht negativ ist
scoreEL.innerHTML = `Punkte: ${score}`;

// Maximale Punktzahl, bei der das Quiz endet
const MAX_SCORE = 41;

// Variablen für die aktuelle Frage und Antwort
let num1, num2, operator, correctAnswer;

// Überprüfen, ob das Quiz abgeschlossen ist
if (score >= MAX_SCORE) {
  showCompletionPopup();
} else {
  // Frage generieren und anzeigen
  ({ num1, num2, operator } = generateQuestion(score));

  // Zeige Frage
  if ((operator === "-" || operator === "/") && num1 < num2) {
    [num1, num2] = [num2, num1];
  }
  questionEL.innerText = `Was ergibt ${num1} ${operator} ${num2} = ?`;

  // Berechne die korrekte Antwort
  correctAnswer = calculateAnswer(num1, num2, operator);
}

// Event-Listener für submit
formEL.addEventListener("submit", (e) => {
  e.preventDefault();
  const userAnswer = +inputEL.value;

  // Überprüfen, ob der Benutzer eine gültige Zahl eingegeben hat
  if (isNaN(userAnswer)) {
    alert("Bitte gib eine gültige Zahl ein!");
    return;
  }

  // Punkte aktualisieren
  if (userAnswer === correctAnswer) {
    score += 1; // Richtig beantwortet
  } else {
    score = Math.max(score - 1, 0); // Falsch beantwortet, aber sicherstellen, dass der Score nicht negativ wird
  }

  // Nächste Frage generieren
  ({ num1, num2, operator } = generateQuestion(score));

  // Zeige die neue Frage
  questionEL.innerText = `Was ergibt ${num1} ${operator} ${num2} = ?`;

  // Berechne die neue korrekte Antwort
  correctAnswer = calculateAnswer(num1, num2, operator);

  // Score im Local Storage speichern
  updateLocalStorage();

  // Score im UI aktualisieren
  scoreEL.innerHTML = `Punkte: ${score}`;

  // reset input field
  inputEL.value = "";
});

// Local Storage aktualisieren
function updateLocalStorage() {
  if (score === MAX_SCORE) {
    showCompletionPopup();
  }
  localStorage.setItem("score", JSON.stringify(score));
}

// Funktion zum Generieren der Frage basierend auf dem Score
function generateQuestion(score) {
  const ranges = [
    { max: 6, range: 10, operator: "+" },
    { max: 11, range: 20, operator: "+" },
    { max: 16, range: 10, operator: "-" },
    { max: 21, range: 20, operator: "-" },
    { max: 26, range: 10, operator: "*" },
    { max: 31, range: 20, operator: "*" },
    { max: 36, range: 10, operator: "/" },
    { max: 41, range: 20, operator: "/" },
  ];

  const level = ranges.find(({ max }) => score < max) || {};
  const range = level.range || 10;
  const operator = level.operator || "+";

  let num1 = Math.ceil(Math.random() * range);
  let num2 = Math.ceil(Math.random() * range);

  // Sicherstellen, dass die Zahlen innerhalb des gewünschten Bereichs liegen
  if (range === 20) {
    if (num1 < 10) {
      num1 += 10;
    } else if (num2 < 10) {
      num2 += 10;
    }
  }

  if (operator === "/") {
    while (num1 % num2 !== 0 || num2 === 0) {
      num2 = Math.ceil(Math.random() * range);
    }
  }

  return { num1, num2, operator };
}

// Funktion zur Berechnung der korrekten Antwort
function calculateAnswer(num1, num2, operator) {
  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return num1 / num2;
    default:
      throw new Error("Ungültiger Operator! Seite neu laden.");
  }
}

// Funktion zum Anzeigen des Abschluss-Popups
function showCompletionPopup() {
  const popup = document.createElement("div");
  popup.id = "completion-popup";
  popup.innerHTML = `
    <div class="popup-content">
      <h2>🎉<span>Herzlichen Glückwunsch!</span>🎉</h2>
      <p>Du hast alle Aufgaben geschafft!</p>
      <button id="restart-btn">Neustart</button>
    </div>
  `;
  document.body.appendChild(popup);

  const restartBtn = document.getElementById("restart-btn");
  restartBtn.addEventListener("click", () => {
    score = 0;
    updateLocalStorage();
    location.reload(); // Neustart des Quiz
  });

  // CSS für Pop-Up
  const style = document.createElement("style");
  style.innerHTML = `
     #completion-popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .popup-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
    .popup-content h2 {
      margin: 0 0 10px;
    }
    .popup-content span {
      font-weight: bold;
    }
    .popup-content p {
      margin: 0 0 20px;
    }
    #restart-btn {
      padding: 10px 20px;
      background: lightgreen;
      color: lightcoral;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    #restart-btn:hover {
      background: lightcoral;
      color: lightgreen;
    }
  `;
  document.head.appendChild(style);
}

// Button Hover-Effekt
btnEL.addEventListener("mouseover", (e) => {
  const x = e.pageX - btnEL.offsetLeft;
  const y = e.pageY - btnEL.offsetTop;

  btnEL.style.setProperty("--xPos", `${x}px`);
  btnEL.style.setProperty("--yPos", `${y}px`);
});
