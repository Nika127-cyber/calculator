// ===============================
// CALCULATOR PRO — VERSION 1
// ===============================

let currentValue = "0";
let previousValue = null;
let currentOperation = null;
let shouldResetDisplay = false;

let history = JSON.parse(
    localStorage.getItem("calculatorHistory") || "[]"
);

let settings = JSON.parse(
    localStorage.getItem("calculatorSettings") || "{}"
);


// ===============================
// ELEMENTS
// ===============================

const display = document.getElementById("display");
const previousOperation =
    document.getElementById("previousOperation");

const themeButton =
    document.getElementById("themeButton");

const darkModeToggle =
    document.getElementById("darkModeToggle");

const soundToggle =
    document.getElementById("soundToggle");

const vibrationToggle =
    document.getElementById("vibrationToggle");

const animationToggle =
    document.getElementById("animationToggle");

const historyContainer =
    document.getElementById("historyContainer");


// ===============================
// DISPLAY
// ===============================

function updateDisplay() {

    display.textContent = currentValue;

    if (currentValue.length > 12) {
        display.style.fontSize = "42px";
    } else {
        display.style.fontSize = "";
    }
}


// ===============================
// NUMBER INPUT
// ===============================

function inputNumber(number) {

    playFeedback();

    if (
        currentValue === "Error" ||
        shouldResetDisplay
    ) {
        currentValue = number;
        shouldResetDisplay = false;
    } else {

        if (
            currentValue === "0" &&
            number !== "."
        ) {
            currentValue = number;
        } else {
            currentValue += number;
        }
    }

    updateDisplay();
}


// ===============================
// DECIMAL
// ===============================

function inputDecimal() {

    playFeedback();

    if (shouldResetDisplay) {
        currentValue = "0.";
        shouldResetDisplay = false;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}


// ===============================
// CLEAR
// ===============================

function clearCalculator() {

    playFeedback();

    currentValue = "0";
    previousValue = null;
    currentOperation = null;
    shouldResetDisplay = false;

    previousOperation.textContent = "";

    updateDisplay();
}


// ===============================
// SIGN
// ===============================

function toggleSign() {

    playFeedback();

    if (currentValue === "0") {
        return;
    }

    currentValue =
        currentValue.startsWith("-")
            ? currentValue.slice(1)
            : "-" + currentValue;

    updateDisplay();
}


// ===============================
// PERCENT
// ===============================

function calculatePercent() {

    playFeedback();

    const number = parseFloat(currentValue);

    if (isNaN(number)) {
        return;
    }

    currentValue = String(number / 100);

    updateDisplay();
}


// ===============================
// OPERATIONS
// ===============================

function chooseOperation(operation) {

    playFeedback();

    if (currentValue === "Error") {
        return;
    }

    const inputValue = parseFloat(currentValue);

    if (previousValue !== null && currentOperation) {

        const result = calculateResult(
            previousValue,
            inputValue,
            currentOperation
        );

        currentValue = formatResult(result);

        previousValue = result;

    } else {

        previousValue = inputValue;
    }

    currentOperation = operation;
    shouldResetDisplay = true;

    previousOperation.textContent =
        `${formatResult(previousValue)} ${operationSymbol(operation)}`;

    updateDisplay();
}


// ===============================
// CALCULATE
// ===============================

function calculate() {

    playFeedback();

    if (
        previousValue === null ||
        currentOperation === null
    ) {
        return;
    }

    const secondValue = parseFloat(currentValue);

    const result = calculateResult(
        previousValue,
        secondValue,
        currentOperation
    );

    const expression =
        `${formatResult(previousValue)} ${operationSymbol(currentOperation)} ${formatResult(secondValue)}`;

    if (result === "Error") {

        currentValue = "Error";

    } else {

        currentValue = formatResult(result);

        saveHistory(
            expression,
            currentValue
        );
    }

    previousValue = null;
    currentOperation = null;
    shouldResetDisplay = true;

    previousOperation.textContent =
        expression + " =";

    updateDisplay();
}


// ===============================
// MATH ENGINE
// ===============================

function calculateResult(a, b, operation) {

    switch (operation) {

        case "add":
            return a + b;

        case "subtract":
            return a - b;

        case "multiply":
            return a * b;

        case "divide":

            if (b === 0) {
                return "Error";
            }

            return a / b;

        default:
            return b;
    }
}


// ===============================
// OPERATION SYMBOL
// ===============================

function operationSymbol(operation) {

    const symbols = {
        add: "+",
        subtract: "−",
        multiply: "×",
        divide: "÷"
    };

    return symbols[operation] || "";
}


// ===============================
// RESULT FORMAT
// ===============================

function formatResult(value) {

    if (value === "Error") {
        return "Error";
    }

    if (!Number.isFinite(value)) {
        return "Error";
    }

    return String(
        Number(
            value.toFixed(10)
        )
    );
}


// ===============================
// HISTORY
// ===============================

function saveHistory(expression, result) {

    const item = {
        expression,
        result,
        time: Date.now()
    };

    history.unshift(item);

    if (history.length > 50) {
        history = history.slice(0, 50);
    }

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    renderHistory();
}


function renderHistory() {

    if (history.length === 0) {

        historyContainer.innerHTML = `
            <div class="empty-state">

                <div>🧮</div>

                <h3>No calculations yet</h3>

                <p>
                    Your calculations will appear here.
                </p>

            </div>
        `;

        return;
    }

    historyContainer.innerHTML =
        history.map((item, index) => {

            return `
                <div class="history-item">

                    <div>
                        <div class="history-expression">
                            ${escapeHTML(item.expression)}
                        </div>

                        <div class="history-result">
                            = ${escapeHTML(item.result)}
                        </div>
                    </div>

                    <button
                        class="history-delete"
                        onclick="deleteHistory(${index})">
                        ×
                    </button>

                </div>
            `;

        }).join("");
}


function deleteHistory(index) {

    history.splice(index, 1);

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    renderHistory();
}


function clearHistory() {

    history = [];

    localStorage.removeItem(
        "calculatorHistory"
    );

    renderHistory();
}


function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ===============================
// NAVIGATION
// ===============================

const navItems =
    document.querySelectorAll(".nav-item");

const pages = {

    calculator: document.getElementById(
        "calculatorPage"
    ),

    games: document.getElementById(
        "gamesPage"
    ),

    tools: document.getElementById(
        "toolsPage"
    ),

    history: document.getElementById(
        "historyPage"
    ),

    settings: document.getElementById(
        "settingsPage"
    )
};


navItems.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const page =
                button.dataset.page;

            switchPage(page);
        }
    );
});


function switchPage(page) {

    navItems.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === page
        );

    });

    Object.values(pages).forEach(
        pageElement => {
            pageElement.classList.remove(
                "active"
            );
        }
    );

    if (pages[page]) {

        pages[page].classList.add(
            "active"
        );
    }
}


// ===============================
// CALCULATOR BUTTON EVENTS
// ===============================

document
    .querySelectorAll("[data-number]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {
                inputNumber(
                    button.dataset.number
                );
            }
        );

    });


document
    .querySelectorAll("[data-operation]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                chooseOperation(
                    button.dataset.operation
                );

            }
        );

    });


document
    .querySelector('[data-action="clear"]')
    .addEventListener(
        "click",
        clearCalculator
    );


document
    .querySelector('[data-action="sign"]')
    .addEventListener(
        "click",
        toggleSign
    );


document
    .querySelector('[data-action="percent"]')
    .addEventListener(
        "click",
        calculatePercent
    );


document
    .querySelector('[data-action="decimal"]')
    .addEventListener(
        "click",
        inputDecimal
    );


document
    .querySelector('[data-action="equals"]')
    .addEventListener(
        "click",
        calculate
    );


// ===============================
// KEYBOARD SUPPORT
// ===============================

document.addEventListener(
    "keydown",
    event => {

        const key = event.key;

        if (
            key >= "0" &&
            key <= "9"
        ) {
            inputNumber(key);
        }

        else if (key === ".") {
            inputDecimal();
        }

        else if (key === "+") {
            chooseOperation("add");
        }

        else if (key === "-") {
            chooseOperation("subtract");
        }

        else if (key === "*") {
            chooseOperation("multiply");
        }

        else if (key === "/") {
            event.preventDefault();

            chooseOperation("divide");
        }

        else if (
            key === "Enter" ||
            key === "="
        ) {
            calculate();
        }

        else if (key === "Escape") {
            clearCalculator();
        }

        else if (key === "%") {
            calculatePercent();
        }

        else if (key === "Backspace") {

            if (
                currentValue.length > 1
            ) {

                currentValue =
                    currentValue.slice(
                        0,
                        -1
                    );

            } else {

                currentValue = "0";
            }

            updateDisplay();
        }

    }
);


// ===============================
// THEME
// ===============================

function applyTheme(isDark) {

    document.body.classList.toggle(
        "light",
        !isDark
    );

    if (darkModeToggle) {
        darkModeToggle.checked = isDark;
    }

    if (themeButton) {
        themeButton.textContent =
            isDark ? "☀️" : "🌙";
    }

    localStorage.setItem(
        "darkMode",
        isDark
    );
}


const savedDarkMode =
    localStorage.getItem("darkMode");


if (savedDarkMode === null) {

    applyTheme(true);

} else {

    applyTheme(
        savedDarkMode === "true"
    );
}


themeButton.addEventListener(
    "click",
    () => {

        const isDark =
            !document.body.classList.contains(
                "light"
            );

        applyTheme(!isDark);
    }
);


darkModeToggle.addEventListener(
    "change",
    event => {

        applyTheme(
            event.target.checked
        );
    }
);


// ===============================
// SETTINGS
// ===============================

function loadSettings() {

    if (soundToggle) {
        soundToggle.checked =
            settings.sound === true;
    }

    if (vibrationToggle) {
        vibrationToggle.checked =
            settings.vibration !== false;
    }

    if (animationToggle) {
        animationToggle.checked =
            settings.animations !== false;
    }
}


function saveSettings() {

    settings = {

        sound:
            soundToggle.checked,

        vibration:
            vibrationToggle.checked,

        animations:
            animationToggle.checked

    };

    localStorage.setItem(
        "calculatorSettings",
        JSON.stringify(settings)
    );
}


soundToggle.addEventListener(
    "change",
    saveSettings
);

vibrationToggle.addEventListener(
    "change",
    saveSettings
);

animationToggle.addEventListener(
    "change",
    saveSettings
);


// ===============================
// FEEDBACK
// ===============================

function playFeedback() {

    if (
        vibrationToggle &&
        vibrationToggle.checked &&
        navigator.vibrate
    ) {

        navigator.vibrate(8);
    }

    if (
        soundToggle &&
        soundToggle.checked
    ) {

        // Simple browser feedback.
        // Full custom sound system will be
        // added in a later version.
    }
}


// ===============================
// HISTORY BUTTONS
// ===============================

document
    .getElementById("clearHistory")
    .addEventListener(
        "click",
        clearHistory
    );


document
    .getElementById("historyQuickButton")
    .addEventListener(
        "click",
        () => {
            switchPage("history");
        }
    );


// ===============================
// GAME BUTTONS
// ===============================

document
    .querySelectorAll("[data-game]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const game =
                    button.dataset.game;

                alert(
                    `${game.toUpperCase()} game is coming in the next update!`
                );

            }
        );

    });


// ===============================
// TOOL BUTTONS
// ===============================

document
    .querySelectorAll("[data-tool]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const tool =
                    button.dataset.tool;

                alert(
                    `${tool.toUpperCase()} tool is coming in the next update!`
                );

            }
        );

    });


// ===============================
// START
// ===============================

loadSettings();

renderHistory();

updateDisplay();
