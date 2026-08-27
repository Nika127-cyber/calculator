/* =========================================================
   CALCULATOR PRO
   Version 2.0
   Core Calculator + History + Themes + Settings
   + Scientific Calculator
   + Keyboard Support
   + Memory Functions
   + Calculation History
   + Game System
   + Tools System
   + LocalStorage
========================================================= */

"use strict";

/* =========================================================
   APP STATE
========================================================= */

const App = {

    calculator: {
        current: "0",
        previous: null,
        operator: null,
        waiting: false,
        expression: "",
        memory: 0
    },

    settings: {
        darkMode: true,
        sound: false,
        vibration: true,
        animations: true,
        scientific: false
    },

    history: [],

    games: {
        math: {
            score: 0,
            highScore: 0,
            time: 60,
            active: false,
            timer: null,
            correct: 0,
            wrong: 0
        },

        tap: {
            score: 0,
            highScore: 0,
            active: false,
            startTime: null,
            targetTime: null
        },

        memory: {
            score: 0,
            highScore: 0,
            active: false,
            cards: [],
            selected: [],
            matched: [],
            moves: 0
        }
    }

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    document.querySelectorAll(selector);


/* =========================================================
   SAFE LOCAL STORAGE
========================================================= */

function loadStorage(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.warn(
            `Could not load ${key}`,
            error
        );

        return fallback;
    }
}


function saveStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.warn(
            `Could not save ${key}`,
            error
        );
    }
}


/* =========================================================
   LOAD SAVED DATA
========================================================= */

function loadAppData() {

    const savedSettings =
        loadStorage(
            "calculatorProSettings",
            null
        );

    const savedHistory =
        loadStorage(
            "calculatorProHistory",
            []
        );

    const savedGameScores =
        loadStorage(
            "calculatorProGameScores",
            {}
        );


    if (savedSettings) {

        App.settings = {
            ...App.settings,
            ...savedSettings
        };

    }


    if (Array.isArray(savedHistory)) {

        App.history = savedHistory;

    }


    if (savedGameScores.math) {

        App.games.math.highScore =
            Number(savedGameScores.math) || 0;

    }


    if (savedGameScores.tap) {

        App.games.tap.highScore =
            Number(savedGameScores.tap) || 0;

    }


    if (savedGameScores.memory) {

        App.games.memory.highScore =
            Number(savedGameScores.memory) || 0;

    }

}


/* =========================================================
   SAVE SETTINGS
========================================================= */

function saveSettings() {

    saveStorage(
        "calculatorProSettings",
        App.settings
    );

}


/* =========================================================
   SAVE GAME SCORES
========================================================= */

function saveGameScores() {

    saveStorage(
        "calculatorProGameScores",
        {
            math:
                App.games.math.highScore,

            tap:
                App.games.tap.highScore,

            memory:
                App.games.memory.highScore
        }
    );

}


/* =========================================================
   DISPLAY
========================================================= */

function updateDisplay() {

    const display =
        $("#display");

    const previous =
        $("#previousOperation");


    if (!display) {
        return;
    }


    display.textContent =
        App.calculator.current;


    if (previous) {

        previous.textContent =
            App.calculator.expression || "";

    }


    const length =
        App.calculator.current.length;


    if (length > 14) {

        display.style.fontSize =
            "34px";

    } else if (length > 10) {

        display.style.fontSize =
            "42px";

    } else {

        display.style.fontSize =
            "";

    }

}


/* =========================================================
   FEEDBACK
========================================================= */

function feedback() {

    if (
        App.settings.vibration &&
        navigator.vibrate
    ) {

        navigator.vibrate(8);

    }


    if (App.settings.sound) {

        playButtonSound();

    }

}


function playButtonSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        const context =
            new AudioContext();

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();

        oscillator.frequency.value =
            520;

        gain.gain.value =
            0.025;

        oscillator.connect(gain);

        gain.connect(
            context.destination
        );

        oscillator.start();

        oscillator.stop(
            context.currentTime + 0.035
        );

    } catch (error) {

        console.warn(
            "Sound unavailable",
            error
        );

    }

}


/* =========================================================
   NUMBER INPUT
========================================================= */

function inputNumber(number) {

    feedback();


    if (
        App.calculator.current ===
        "Error" ||
        App.calculator.waiting
    ) {

        App.calculator.current =
            String(number);

        App.calculator.waiting =
            false;

    } else {

        if (
            App.calculator.current === "0"
        ) {

            App.calculator.current =
                String(number);

        } else {

            App.calculator.current +=
                String(number);

        }

    }


    updateDisplay();

}


/* =========================================================
   DECIMAL
========================================================= */

function inputDecimal() {

    feedback();


    if (App.calculator.waiting) {

        App.calculator.current =
            "0.";

        App.calculator.waiting =
            false;

        updateDisplay();

        return;
    }


    if (
        !App.calculator.current.includes(".")
    ) {

        App.calculator.current += ".";

    }


    updateDisplay();

}


/* =========================================================
   CLEAR
========================================================= */

function clearCalculator() {

    feedback();

    App.calculator.current =
        "0";

    App.calculator.previous =
        null;

    App.calculator.operator =
        null;

    App.calculator.waiting =
        false;

    App.calculator.expression =
        "";

    updateDisplay();

}


/* =========================================================
   DELETE
========================================================= */

function deleteLastDigit() {

    feedback();


    if (
        App.calculator.current ===
        "Error"
    ) {

        clearCalculator();

        return;

    }


    if (
        App.calculator.current.length <= 1
    ) {

        App.calculator.current =
            "0";

    } else {

        App.calculator.current =
            App.calculator.current.slice(
                0,
                -1
            );

    }


    updateDisplay();

}


/* =========================================================
   SIGN
========================================================= */

function toggleSign() {

    feedback();


    if (
        App.calculator.current ===
        "0" ||
        App.calculator.current ===
        "Error"
    ) {

        return;

    }


    if (
        App.calculator.current.startsWith("-")
    ) {

        App.calculator.current =
            App.calculator.current.slice(1);

    } else {

        App.calculator.current =
            "-" +
            App.calculator.current;

    }


    updateDisplay();

}


/* =========================================================
   PERCENT
========================================================= */

function percentage() {

    feedback();


    const number =
        parseFloat(
            App.calculator.current
        );


    if (Number.isNaN(number)) {
        return;
    }


    App.calculator.current =
        formatNumber(
            number / 100
        );


    updateDisplay();

}


/* =========================================================
   OPERATION SYMBOL
========================================================= */

function operationSymbol(operation) {

    const symbols = {

        add: "+",

        subtract: "−",

        multiply: "×",

        divide: "÷"

    };


    return symbols[operation] || "";

}


/* =========================================================
   MATH ENGINE
========================================================= */

function calculateOperation(
    first,
    second,
    operation
) {

    switch (operation) {

        case "add":
            return first + second;

        case "subtract":
            return first - second;

        case "multiply":
            return first * second;

        case "divide":

            if (second === 0) {

                return "Error";

            }

            return first / second;

        default:
            return second;

    }

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(value) {

    if (value === "Error") {
        return "Error";
    }


    if (!Number.isFinite(value)) {
        return "Error";
    }


    return String(
        Number(
            Number(value).toFixed(10)
        )
    );

}


/* =========================================================
   CHOOSE OPERATION
========================================================= */

function chooseOperation(operation) {

    feedback();


    if (
        App.calculator.current ===
        "Error"
    ) {

        return;

    }


    const current =
        parseFloat(
            App.calculator.current
        );


    if (Number.isNaN(current)) {
        return;
    }


    if (
        App.calculator.previous !== null &&
        App.calculator.operator &&
        !App.calculator.waiting
    ) {

        const result =
            calculateOperation(
                App.calculator.previous,
                current,
                App.calculator.operator
            );


        if (result === "Error") {

            App.calculator.current =
                "Error";

            App.calculator.previous =
                null;

            App.calculator.operator =
                null;

            updateDisplay();

            return;

        }


        App.calculator.previous =
            result;

        App.calculator.current =
            formatNumber(result);

    } else {

        App.calculator.previous =
            current;

    }


    App.calculator.operator =
        operation;

    App.calculator.waiting =
        true;


    App.calculator.expression =
        `${formatNumber(
            App.calculator.previous
        )} ${operationSymbol(
            operation
        )}`;


    updateDisplay();

}


/* =========================================================
   EQUALS
========================================================= */

function calculate() {

    feedback();


    if (
        App.calculator.previous === null ||
        App.calculator.operator === null
    ) {

        return;

    }


    const second =
        parseFloat(
            App.calculator.current
        );


    if (Number.isNaN(second)) {
        return;
    }


    const first =
        App.calculator.previous;

    const operator =
        App.calculator.operator;


    const result =
        calculateOperation(
            first,
            second,
            operator
        );


    const expression =
        `${formatNumber(first)} ${operationSymbol(operator)} ${formatNumber(second)}`;


    if (result === "Error") {

        App.calculator.current =
            "Error";

        App.calculator.expression =
            expression;

    } else {

        App.calculator.current =
            formatNumber(result);

        App.calculator.expression =
            `${expression} =`;

        addHistory(
            expression,
            App.calculator.current
        );

    }


    App.calculator.previous =
        null;

    App.calculator.operator =
        null;

    App.calculator.waiting =
        true;


    updateDisplay();

}


/* =========================================================
   HISTORY
========================================================= */

function addHistory(
    expression,
    result
) {

    const item = {

        id:
            Date.now(),

        expression,

        result,

        date:
            new Date().toLocaleString()

    };


    App.history.unshift(item);


    if (App.history.length > 100) {

        App.history =
            App.history.slice(0, 100);

    }


    saveStorage(
        "calculatorProHistory",
        App.history
    );


    renderHistory();

}


/* =========================================================
   RENDER HISTORY
========================================================= */

function renderHistory() {

    const container =
        $("#historyContainer");


    if (!container) {
        return;
    }


    if (App.history.length === 0) {

        container.innerHTML = `

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


    container.innerHTML =
        App.history.map(item => `

            <div
                class="history-item"
                data-history-id="${item.id}"
            >

                <div>

                    <div class="history-expression">
                        ${escapeHTML(
                            item.expression
                        )}
                    </div>

                    <div class="history-result">
                        = ${escapeHTML(
                            item.result
                        )}
                    </div>

                    <small>
                        ${escapeHTML(item.date)}
                    </small>

                </div>

                <button
                    class="history-delete"
                    data-delete-history="${item.id}"
                >
                    ×
                </button>

            </div>

        `).join("");


    $$("#historyContainer [data-delete-history]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteHistory(
                        Number(
                            button.dataset
                                .deleteHistory
                        )
                    );

                }
            );

        });

}


/* =========================================================
   DELETE HISTORY
========================================================= */

function deleteHistory(id) {

    App.history =
        App.history.filter(
            item =>
                item.id !== id
        );


    saveStorage(
        "calculatorProHistory",
        App.history
    );


    renderHistory();

}


/* =========================================================
   CLEAR HISTORY
========================================================= */

function clearHistory() {

    if (App.history.length === 0) {
        return;
    }


    const confirmed =
        window.confirm(
            "Clear all calculation history?"
        );


    if (!confirmed) {
        return;
    }


    App.history = [];


    saveStorage(
        "calculatorProHistory",
        []
    );


    renderHistory();

}


/* =========================================================
   MEMORY
========================================================= */

function memoryClear() {

    App.calculator.memory =
        0;

}


function memoryRecall() {

    App.calculator.current =
        formatNumber(
            App.calculator.memory
        );

    updateDisplay();

}


function memoryAdd() {

    const value =
        parseFloat(
            App.calculator.current
        );


    if (!Number.isNaN(value)) {

        App.calculator.memory +=
            value;

    }

}


function memorySubtract() {

    const value =
        parseFloat(
            App.calculator.current
        );


    if (!Number.isNaN(value)) {

        App.calculator.memory -=
            value;

    }

}


/* =========================================================
   KEYBOARD
========================================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key;


            if (
                key >= "0" &&
                key <= "9"
            ) {

                inputNumber(key);

                return;

            }


            if (key === ".") {

                inputDecimal();

                return;

            }


            if (key === "+") {

                chooseOperation(
                    "add"
                );

                return;

            }


            if (key === "-") {

                chooseOperation(
                    "subtract"
                );

                return;

            }


            if (key === "*") {

                chooseOperation(
                    "multiply"
                );

                return;

            }


            if (key === "/") {

                event.preventDefault();

                chooseOperation(
                    "divide"
                );

                return;

            }


            if (
                key === "Enter" ||
                key === "="
            ) {

                calculate();

                return;

            }


            if (key === "Escape") {

                clearCalculator();

                return;

            }


            if (key === "Backspace") {

                deleteLastDigit();

                return;

            }


            if (key === "%") {

                percentage();

            }

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    $$(".nav-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;

                    switchPage(page);

                }
            );

        });

}


function switchPage(page) {

    $$(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });


    const pages = {

        calculator:
            $("#calculatorPage"),

        games:
            $("#gamesPage"),

        tools:
            $("#toolsPage"),

        history:
            $("#historyPage"),

        settings:
            $("#settingsPage")

    };


    Object.values(pages)
        .forEach(element => {

            if (element) {

                element.classList.remove(
                    "active"
                );

            }

        });


    if (pages[page]) {

        pages[page].classList.add(
            "active"
        );

    }

}


/* =========================================================
   THEME
========================================================= */

function applyTheme() {

    document.body.classList.toggle(
        "light",
        !App.settings.darkMode
    );


    const button =
        $("#themeButton");


    if (button) {

        button.textContent =
            App.settings.darkMode
                ? "☀️"
                : "🌙";

    }


    const toggle =
        $("#darkModeToggle");


    if (toggle) {

        toggle.checked =
            App.settings.darkMode;

    }


    saveSettings();

}


function setupTheme() {

    applyTheme();


    const themeButton =
        $("#themeButton");


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            () => {

                App.settings.darkMode =
                    !App.settings.darkMode;

                applyTheme();

            }
        );

    }


    const darkToggle =
        $("#darkModeToggle");


    if (darkToggle) {

        darkToggle.addEventListener(
            "change",
            event => {

                App.settings.darkMode =
                    event.target.checked;

                applyTheme();

            }
        );

    }

}


/* =========================================================
   SETTINGS
========================================================= */

function setupSettings() {

    const sound =
        $("#soundToggle");

    const vibration =
        $("#vibrationToggle");

    const animations =
        $("#animationToggle");


    if (sound) {

        sound.checked =
            App.settings.sound;


        sound.addEventListener(
            "change",
            event => {

                App.settings.sound =
                    event.target.checked;

                saveSettings();

            }
        );

    }


    if (vibration) {

        vibration.checked =
            App.settings.vibration;


        vibration.addEventListener(
            "change",
            event => {

                App.settings.vibration =
                    event.target.checked;

                saveSettings();

            }
        );

    }


    if (animations) {

        animations.checked =
            App.settings.animations;


        animations.addEventListener(
            "change",
            event => {

                App.settings.animations =
                    event.target.checked;

                document.body.classList.toggle(
                    "no-animations",
                    !App.settings.animations
                );

                saveSettings();

            }
        );

    }

}


/* =========================================================
   CALCULATOR BUTTON SETUP
========================================================= */

function setupCalculatorButtons() {

    $$("[data-number]")
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


    $$("[data-operation]")
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


    const clear =
        $('[data-action="clear"]');

    if (clear) {

        clear.addEventListener(
            "click",
            clearCalculator
        );

    }


    const sign =
        $('[data-action="sign"]');

    if (sign) {

        sign.addEventListener(
            "click",
            toggleSign
        );

    }


    const percent =
        $('[data-action="percent"]');

    if (percent) {

        percent.addEventListener(
            "click",
            percentage
        );

    }


    const decimal =
        $('[data-action="decimal"]');

    if (decimal) {

        decimal.addEventListener(
            "click",
            inputDecimal
        );

    }


    const equals =
        $('[data-action="equals"]');

    if (equals) {

        equals.addEventListener(
            "click",
            calculate
        );

    }


    const historyButton =
        $("#historyQuickButton");

    if (historyButton) {

        historyButton.addEventListener(
            "click",
            () => {

                switchPage(
                    "history"
                );

            }
        );

    }


    const clearHistoryButton =
        $("#clearHistory");

    if (clearHistoryButton) {

        clearHistoryButton.addEventListener(
            "click",
            clearHistory
        );

    }

}


/* =========================================================
   SCIENTIFIC FUNCTIONS
========================================================= */

function scientificCalculate(
    type
) {

    const value =
        parseFloat(
            App.calculator.current
        );


    if (Number.isNaN(value)) {
        return;
    }


    let result;


    switch (type) {

        case "sin":

            result =
                Math.sin(
                    value * Math.PI / 180
                );

            break;


        case "cos":

            result =
                Math.cos(
                    value * Math.PI / 180
                );

            break;


        case "tan":

            result =
                Math.tan(
                    value * Math.PI / 180
                );

            break;


        case "sqrt":

            result =
                value < 0
                    ? "Error"
                    : Math.sqrt(value);

            break;


        case "square":

            result =
                value * value;

            break;


        case "cube":

            result =
                value * value * value;

            break;


        case "log":

            result =
                value <= 0
                    ? "Error"
                    : Math.log10(value);

            break;


        case "ln":

            result =
                value <= 0
                    ? "Error"
                    : Math.log(value);

            break;


        case "inverse":

            result =
                value === 0
                    ? "Error"
                    : 1 / value;

            break;


        case "pi":

            result =
                Math.PI;

            break;


        case "e":

            result =
                Math.E;

            break;


        default:

            return;

    }


    App.calculator.current =
        formatNumber(result);


    App.calculator.waiting =
        true;


    updateDisplay();

}


/* =========================================================
   TOOL: PERCENTAGE
========================================================= */

function percentageOf(
    amount,
    percent
) {

    return (
        Number(amount) *
        Number(percent) /
        100
    );

}


/* =========================================================
   TOOL: BMI
========================================================= */

function calculateBMI(
    weight,
    height
) {

    const w =
        Number(weight);

    const h =
        Number(height) / 100;


    if (
        !Number.isFinite(w) ||
        !Number.isFinite(h) ||
        h <= 0
    ) {

        return null;

    }


    return (
        w /
        (h * h)
    );

}


/* =========================================================
   TOOL: GEOMETRY
========================================================= */

const Geometry = {

    rectangleArea(width, height) {

        return (
            Number(width) *
            Number(height)
        );

    },


    rectanglePerimeter(
        width,
        height
    ) {

        return (
            2 *
            (
                Number(width) +
                Number(height)
            )
        );

    },


    circleArea(radius) {

        return (
            Math.PI *
            Number(radius) *
            Number(radius)
        );

    },


    circleCircumference(radius) {

        return (
            2 *
            Math.PI *
            Number(radius)
        );

    },


    triangleArea(base, height) {

        return (
            0.5 *
            Number(base) *
            Number(height)
        );

    }

};


/* =========================================================
   MATH CHALLENGE GAME
========================================================= */

const MathGame = {

    start() {

        const game =
            App.games.math;


        if (game.active) {
            return;
        }


        game.score = 0;
        game.correct = 0;
        game.wrong = 0;
        game.time = 60;
        game.active = true;


        this.render();


        game.timer =
            setInterval(
                () => {

                    game.time--;

                    this.render();


                    if (
                        game.time <= 0
                    ) {

                        this.finish();

                    }

                },
                1000
            );


        this.nextQuestion();

    },


    nextQuestion() {

        const a =
            randomInt(1, 20);

        const b =
            randomInt(1, 20);

        const operations =
            ["+", "-", "×"];

        const operation =
            operations[
                randomInt(
                    0,
                    operations.length - 1
                )
            ];


        let answer;


        if (operation === "+") {
            answer = a + b;
        }

        if (operation === "-") {
            answer = a - b;
        }

        if (operation === "×") {
            answer = a * b;
        }


        this.currentQuestion = {
            a,
            b,
            operation,
            answer
        };


        this.renderQuestion();

    },


    answer(value) {

        if (!this.currentQuestion) {
            return;
        }


        const game =
            App.games.math;


        if (
            Number(value) ===
            this.currentQuestion.answer
        ) {

            game.score += 10;
            game.correct++;

        } else {

            game.score =
                Math.max(
                    0,
                    game.score - 3
                );

            game.wrong++;

        }


        this.nextQuestion();

        this.render();

    },


    finish() {

        const game =
            App.games.math;


        clearInterval(
            game.timer
        );


        game.timer =
            null;

        game.active =
            false;


        if (
            game.score >
            game.highScore
        ) {

            game.highScore =
                game.score;

            saveGameScores();

        }


        this.render();

        this.showGameMessage(
            `Game Over! Score: ${game.score}`
        );

    },


    render() {

        const score =
            $("#mathScore");

        const time =
            $("#mathTime");

        const high =
            $("#mathHighScore");


        if (score) {
            score.textContent =
                App.games.math.score;
        }

        if (time) {
            time.textContent =
                App.games.math.time;
        }

        if (high) {
            high.textContent =
                App.games.math.highScore;
        }

    },


    renderQuestion() {

        const element =
            $("#mathQuestion");


        if (!element) {
            return;
        }


        if (!App.games.math.active) {

            element.textContent =
                "Press Start to play";

            return;

        }


        const q =
            this.currentQuestion;


        element.textContent =
            `${q.a} ${q.operation} ${q.b} = ?`;

    },


    showGameMessage(message) {

        window.setTimeout(
            () => {
                alert(message);
            },
            50
        );

    }

};


/* =========================================================
   QUICK TAP GAME
========================================================= */

const TapGame = {

    start() {

        const game =
            App.games.tap;


        game.active =
            true;

        game.score =
            0;


        const button =
            $("#tapTarget");


        if (!button) {
            return;
        }


        button.disabled =
            false;


        button.textContent =
            "WAIT...";


        const delay =
            randomInt(
                1200,
                3500
            );


        game.targetTime =
            null;


        window.setTimeout(
            () => {

                if (!game.active) {
                    return;
                }


                game.startTime =
                    performance.now();

                game.targetTime =
                    game.startTime;


                button.textContent =
                    "TAP NOW!";

            },
            delay
        );

    },


    tap() {

        const game =
            App.games.tap;


        if (!game.active) {
            return;
        }


        if (!game.startTime) {

            game.active =
                false;

            const button =
                $("#tapTarget");


            if (button) {

                button.textContent =
                    "Too Early!";

            }


            return;

        }


        const reaction =
            performance.now() -
            game.startTime;


        game.score =
            Math.max(
                1,
                Math.round(
                    1000 / reaction * 100
                )
            );


        game.active =
            false;


        if (
            game.score >
            game.highScore
        ) {

            game.highScore =
                game.score;

            saveGameScores();

        }


        const button =
            $("#tapTarget");


        if (button) {

            button.textContent =
                `${Math.round(reaction)} ms`;

        }

    }

};


/* =========================================================
   MEMORY GAME
========================================================= */

const MemoryGame = {

    start() {

        const values = [
            "🍎",
            "🍌",
            "🍇",
            "🍉",
            "🍒",
            "🥝",
            "🍋",
            "🥭"
        ];


        const cards =
            [
                ...values,
                ...values
            ];


        shuffle(cards);


        const game =
            App.games.memory;


        game.cards =
            cards;

        game.selected =
            [];

        game.matched =
            [];

        game.moves =
            0;

        game.score =
            0;

        game.active =
            true;


        this.render();

    },


    choose(index) {

        const game =
            App.games.memory;


        if (
            !game.active ||
            game.matched.includes(index) ||
            game.selected.includes(index) ||
            game.selected.length >= 2
        ) {

            return;

        }


        game.selected.push(index);


        this.render();


        if (
            game.selected.length === 2
        ) {

            game.moves++;


            const first =
                game.selected[0];

            const second =
                game.selected[1];


            if (
                game.cards[first] ===
                game.cards[second]
            ) {

                game.matched.push(
                    first,
                    second
                );


                game.score += 20;

                game.selected = [];


                if (
                    game.matched.length ===
                    game.cards.length
                ) {

                    this.finish();

                }

                this.render();

            } else {

                window.setTimeout(
                    () => {

                        game.selected =
                            [];

                        this.render();

                    },
                    700
                );

            }

        }

    },


    finish() {

        const game =
            App.games.memory;


        game.active =
            false;


        game.score =
            Math.max(
                0,
                game.score -
                game.moves
            );


        if (
            game.score >
            game.highScore
        ) {

            game.highScore =
                game.score;

            saveGameScores();

        }


        window.setTimeout(
            () => {

                alert(
                    `Memory complete! Score: ${game.score}`
                );

            },
            100
        );

    },


    render() {

        const container =
            $("#memoryBoard");


        if (!container) {
            return;
        }


        container.innerHTML =
            "";


        App.games.memory.cards
            .forEach(
                (value, index) => {

                    const card =
                        document.createElement(
                            "button"
                        );


                    card.className =
                        "memory-card";


                    const visible =
                        App.games.memory
                            .selected
                            .includes(index) ||
                        App.games.memory
                            .matched
                            .includes(index);


                    card.textContent =
                        visible
                            ? value
                            : "?";


                    card.addEventListener(
                        "click",
                        () => {

                            this.choose(
                                index
                            );

                        }
                    );


                    container.appendChild(
                        card
                    );

                }
            );

    }

};


/* =========================================================
   RANDOM NUMBER
========================================================= */

function randomInt(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }


    return array;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   GAME BUTTON SETUP
========================================================= */

function setupGames() {

    const mathPlay =
        $('[data-game="math"]');


    if (mathPlay) {

        mathPlay.addEventListener(
            "click",
            () => {

                openMathGame();

            }
        );

    }


    const tapPlay =
        $('[data-game="tap"]');


    if (tapPlay) {

        tapPlay.addEventListener(
            "click",
            () => {

                openTapGame();

            }
        );

    }


    const memoryPlay =
        $('[data-game="memory"]');


    if (memoryPlay) {

        memoryPlay.addEventListener(
            "click",
            () => {

                openMemoryGame();

            }
        );

    }

}


/* =========================================================
   GAME UI
========================================================= */

function openMathGame() {

    switchPage("games");


    const games =
        $("#gamesPage");


    if (!games) {
        return;
    }


    games.innerHTML = `

        <div class="page-title">

            <span>🧠</span>

            <div>

                <h2>Math Challenge</h2>

                <p>
                    Solve as many equations as possible.
                </p>

            </div>

        </div>


        <div class="game-card">

            <div class="game-info">

                <span>
                    Score:
                    <strong id="mathScore">0</strong>
                </span>

                <span>
                    Time:
                    <strong id="mathTime">60</strong>
                </span>

                <span>
                    Best:
                    <strong id="mathHighScore">
                        ${App.games.math.highScore}
                    </strong>
                </span>

            </div>


            <div
                id="mathQuestion"
                style="
                    font-size:42px;
                    text-align:center;
                    padding:40px 10px;
                    font-weight:700;
                "
            >
                Press Start to play
            </div>


            <div
                id="mathAnswers"
                style="
                    display:grid;
                    grid-template-columns:repeat(2,1fr);
                    gap:10px;
                "
            ></div>


            <button
                class="primary-button"
                id="mathStart"
                style="margin-top:15px;"
            >
                Start Game
            </button>

        </div>

    `;


    $("#mathStart")
        .addEventListener(
            "click",
            () => {

                MathGame.start();

                createMathAnswers();

            }
        );

}


function createMathAnswers() {

    const container =
        $("#mathAnswers");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "primary-button";


        button.textContent =
            randomInt(1, 100);


        button.addEventListener(
            "click",
            () => {

                MathGame.answer(
                    Number(
                        button.textContent
                    )
                );


                createMathAnswers();

            }
        );


        container.appendChild(
            button
        );

    }

}


function openTapGame() {

    switchPage("games");


    const games =
        $("#gamesPage");


    games.innerHTML = `

        <div class="page-title">

            <span>⚡</span>

            <div>

                <h2>Quick Tap</h2>

                <p>
                    Test your reaction speed.
                </p>

            </div>

        </div>


        <div class="game-card">

            <div
                style="
                    text-align:center;
                    padding:30px 0;
                "
            >

                <p>
                    High Score:
                    <strong>
                        ${App.games.tap.highScore}
                    </strong>
                </p>


                <button
                    id="tapTarget"
                    class="primary-button"
                    style="
                        margin-top:30px;
                        height:160px;
                        font-size:28px;
                    "
                >
                    START
                </button>

            </div>

        </div>

    `;


    $("#tapTarget")
        .addEventListener(
            "click",
            () => {

                if (
                    !App.games.tap.active
                ) {

                    TapGame.start();

                } else {

                    TapGame.tap();

                }

            }
        );

}


function openMemoryGame() {

    switchPage("games");


    const games =
        $("#gamesPage");


    games.innerHTML = `

        <div class="page-title">

            <span>🃏</span>

            <div>

                <h2>Memory Math</h2>

                <p>
                    Find all matching pairs.
                </p>

            </div>

        </div>


        <div class="game-card">

            <div
                id="memoryBoard"
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(4,1fr);
                    gap:8px;
                    max-width:500px;
                    margin:auto;
                "
            ></div>


            <button
                class="primary-button"
                id="memoryStart"
                style="margin-top:20px;"
            >
                Start Game
            </button>

        </div>

    `;


    $("#memoryStart")
        .addEventListener(
            "click",
            () => {

                MemoryGame.start();

            }
        );

}


/* =========================================================
   TOOLS UI
========================================================= */

function setupTools() {

    $$("[data-tool]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const tool =
                        button.dataset.tool;

                    openTool(tool);

                }
            );

        });

}


function openTool(tool) {

    switchPage("tools");


    const tools =
        $("#toolsPage");


    if (!tools) {
        return;
    }


    if (tool === "bmi") {

        openBMITool();

        return;

    }


    if (tool === "percentage") {

        openPercentageTool();

        return;

    }


    if (tool === "geometry") {

        openGeometryTool();

        return;

    }


    if (tool === "converter") {

        openConverterTool();

        return;

    }


    if (tool === "stopwatch") {

        openStopwatch();

        return;

    }


    if (tool === "scientific") {

        openScientificTool();

        return;

    }

}


/* =========================================================
   BMI TOOL
========================================================= */

function openBMITool() {

    const tools =
        $("#toolsPage");


    tools.innerHTML = `

        <div class="page-title">

            <span>⚖️</span>

            <div>

                <h2>BMI Calculator</h2>

                <p>
                    Calculate BMI using your height and weight.
                </p>

            </div>

        </div>


        <div class="game-card">

            <input
                id="bmiWeight"
                type="number"
                placeholder="Weight (kg)"
                style="
                    width:100%;
                    padding:14px;
                    margin-bottom:10px;
                    border-radius:12px;
                "
            >


            <input
                id="bmiHeight"
                type="number"
                placeholder="Height (cm)"
                style="
                    width:100%;
                    padding:14px;
                    margin-bottom:10px;
                    border-radius:12px;
                "
            >


            <button
                class="primary-button"
                id="bmiCalculate"
            >
                Calculate BMI
            </button>


            <div
                id="bmiResult"
                style="
                    text-align:center;
                    font-size:28px;
                    margin-top:20px;
                "
            ></div>

        </div>

    `;


    $("#bmiCalculate")
        .addEventListener(
            "click",
            () => {

                const bmi =
                    calculateBMI(
                        $("#bmiWeight").value,
                        $("#bmiHeight").value
                    );


                const result =
                    $("#bmiResult");


                if (bmi === null) {

                    result.textContent =
                        "Enter valid values.";

                    return;

                }


                result.textContent =
                    `BMI: ${bmi.toFixed(1)}`;

            }
        );

}


/* =========================================================
   PERCENTAGE TOOL
========================================================= */

function openPercentageTool() {

    const tools =
        $("#toolsPage");


    tools.innerHTML = `

        <div class="page-title">

            <span>💯</span>

            <div>

                <h2>Percentage Calculator</h2>

                <p>
                    Calculate percentages quickly.
                </p>

            </div>

        </div>


        <div class="game-card">

            <input
                id="percentAmount"
                type="number"
                placeholder="Amount"
                style="
                    width:100%;
                    padding:14px;
                    margin-bottom:10px;
                    border-radius:12px;
                "
            >


            <input
                id="percentValue"
                type="number"
                placeholder="Percentage"
                style="
                    width:100%;
                    padding:14px;
                    margin-bottom:10px;
                    border-radius:12px;
                "
            >


            <button
                class="primary-button"
                id="percentageCalculate"
            >
                Calculate
            </button>


            <div
                id="percentageResult"
                style="
                    text-align:center;
                    font-size:28px;
                    margin-top:20px;
                "
            ></div>

        </div>

    `;


    $("#percentageCalculate")
        .addEventListener(
            "click",
            () => {

                const result =
                    percentageOf(
                        $("#percentAmount").value,
                        $("#percentValue").value
                    );


                $("#percentageResult")
                    .textContent =
                    `Result: ${formatNumber(result)}`;

            }
        );

}


/* =========================================================
   GEOMETRY TOOL
========================================================= */

function openGeometryTool() {

    const tools =
        $("#toolsPage");


    tools.innerHTML = `

        <div class="page-title">

            <span>📐</span>

            <div>

                <h2>Geometry</h2>

                <p>
                    Calculate common shapes.
                </p>

            </div>

        </div>


        <div class="game-card">

            <h3>Rectangle</h3>


            <input
                id="rectWidth"
                type="number"
                placeholder="Width"
                style="
                    width:100%;
                    padding:12px;
                    margin:8px 0;
                    border-radius:10px;
                "
            >


            <input
                id="rectHeight"
                type="number"
                placeholder="Height"
                style="
                    width:100%;
                    padding:12px;
                    margin:8px 0;
                    border-radius:10px;
                "
            >


            <button
                class="primary-button"
                id="rectCalculate"
            >
                Calculate
            </button>


            <div
                id="rectResult"
                style="margin-top:15px;"
            ></div>


            <hr style="margin:25px 0;opacity:.15">


            <h3>Circle</h3>


            <input
                id="circleRadius"
                type="number"
                placeholder="Radius"
                style="
                    width:100%;
                    padding:12px;
                    margin:8px 0;
                    border-radius:10px;
                "
            >


            <button
                class="primary-button"
                id="circleCalculate"
            >
                Calculate
            </button>


            <div
                id="circleResult"
                style="margin-top:15px;"
            ></div>

        </div>

    `;


    $("#rectCalculate")
        .addEventListener(
            "click",
            () => {

                const width =
                    $("#rectWidth").value;

                const height =
                    $("#rectHeight").value;


                const area =
                    Geometry.rectangleArea(
                        width,
                        height
                    );


                const perimeter =
                    Geometry.rectanglePerimeter(
                        width,
                        height
                    );


                $("#rectResult")
                    .textContent =
                    `Area: ${formatNumber(area)}
                     | Perimeter: ${formatNumber(perimeter)}`;

            }
        );


    $("#circleCalculate")
        .addEventListener(
            "click",
            () => {

                const radius =
                    $("#circleRadius").value;


                const area =
                    Geometry.circleArea(
                        radius
                    );


                const circumference =
                    Geometry.circleCircumference(
                        radius
                    );


                $("#circleResult")
                    .textContent =
                    `Area: ${formatNumber(area)}
                     | Circumference:
                     ${formatNumber(circumference)}`;

            }
        );

}


/* =========================================================
   UNIT CONVERTER
========================================================= */

function openConverterTool() {

    const tools =
        $("#toolsPage");


    tools.innerHTML = `

        <div class="page-title">

            <span>🔄</span>

            <div>

                <h2>Unit Converter</h2>

                <p>
                    Convert common units.
                </p>

            </div>

        </div>


        <div class="game-card">

            <input
                id="convertValue"
                type="number"
                placeholder="Value"
                style="
                    width:100%;
                    padding:14px;
                    border-radius:12px;
                    margin-bottom:10px;
                "
            >


            <select
                id="convertType"
                style="
                    width:100%;
                    padding:14px;
                    border-radius:12px;
                    margin-bottom:10px;
                "
            >

                <option value="km-miles">
                    Kilometers → Miles
                </option>

                <option value="miles-km">
                    Miles → Kilometers
                </option>

                <option value="kg-lb">
                    Kilograms → Pounds
                </option>

                <option value="lb-kg">
                    Pounds → Kilograms
                </option>

                <option value="c-f">
                    Celsius → Fahrenheit
                </option>

                <option value="f-c">
                    Fahrenheit → Celsius
                </option>

            </select>


            <button
                class="primary-button"
                id="convertButton"
            >
                Convert
            </button>


            <div
                id="convertResult"
                style="
                    text-align:center;
                    font-size:26px;
                    margin-top:20px;
                "
            ></div>

        </div>

    `;


    $("#convertButton")
        .addEventListener(
            "click",
            () => {

                const value =
                    Number(
                        $("#convertValue").value
                    );


                const type =
                    $("#convertType").value;


                let result;


                switch (type) {

                    case "km-miles":
                        result =
                            value *
                            0.621371;
                        break;

                    case "miles-km":
                        result =
                            value /
                            0.621371;
                        break;

                    case "kg-lb":
                        result =
                            value *
                            2.20462;
                        break;

                    case "lb-kg":
                        result =
                            value /
                            2.20462;
                        break;

                    case "c-f":
                        result =
                            value *
                            9 / 5 + 32;
                        break;

                    case "f-c":
                        result =
                            (value - 32) *
                            5 / 9;
                        break;

                    default:
                        result = NaN;

                }


                $("#convertResult")
                    .textContent =
                    Number.isFinite(result)
                        ? formatNumber(result)
                        : "Invalid value.";

            }
        );

}


/* =========================================================
   STOPWATCH
========================================================= */

let stopwatchInterval = null;

let stopwatchSeconds = 0;


function openStopwatch() {

    const tools =
        $("#toolsPage");


    tools.innerHTML = `

        <div class="page-title">

            <span>⏱️</span>

            <div>

                <h2>Stopwatch</h2>

                <p>
                    Track time precisely.
                </p>

            </div>

        </div>


        <div class="game-card"
             style="text-align:center;">

            <div
                id="stopwatchDisplay"
                style="
                    font-size:55px;
                    font-weight:300;
                    margin:25px;
                "
            >
                00:00:00
            </div>


            <button
                class="primary-button"
                id="stopwatchStart"
            >
                Start
            </button>


            <button
                class="primary-button"
                id="stopwatchReset"
                style="margin-top:10px;"
            >
                Reset
            </button>

        </div>

    `;


    stopwatchSeconds =
        0;


    updateStopwatchDisplay();


    $("#stopwatchStart")
        .addEventListener(
            "click",
            toggleStopwatch
        );


    $("#stopwatchReset")
        .addEventListener(
            "click",
            resetStopwatch
        );

}


function toggleStopwatch() {

    const button =
        $("#stopwatchStart");


    if (stopwatchInterval) {

        clearInterval(
            stopwatchInterval
        );

        stopwatchInterval =
            null;

        button.textContent =
            "Start";

        return;

    }


    button.textContent =
        "Pause";


    stopwatchInterval =
        setInterval(
            () => {

                stopwatchSeconds++;

                updateStopwatchDisplay();

            },
            1000
        );

}


function resetStopwatch() {

    clearInterval(
        stopwatchInterval
    );

    stopwatchInterval =
        null;

    stopwatchSeconds =
        0;


    updateStopwatchDisplay();


    const button =
        $("#stopwatchStart");


    if (button) {

        button.textContent =
            "Start";

    }

}


function updateStopwatchDisplay() {

    const element =
        $("#stopwatchDisplay");


    if (!element) {
        return;
    }


    const hours =
        Math.floor(
            stopwatchSeconds / 3600
        );


    const minutes =
        Math.floor(
            (stopwatchSeconds % 3600) /
            60
        );


    const seconds =
        stopwatchSeconds % 60;


    element.textContent =
        [
            hours,
            minutes,
            seconds
        ]
        .map(
            value =>
                String(value)
                    .padStart(2, "0")
        )
        .join(":");

}


/* =========================================================
   SCIENTIFIC TOOL
========================================================= */

function openScientificTool() {

    const tools =
        $("#toolsPage");


    tools.innerHTML = `

        <div class="page-title">

            <span>🔬</span>

            <div>

                <h2>Scientific Calculator</h2>

                <p>
                    Advanced mathematical functions.
                </p>

            </div>

        </div>


        <div class="game-card">

            <div
                id="scientificDisplay"
                style="
                    font-size:38px;
                    text-align:right;
                    margin-bottom:15px;
                "
            >
                0
            </div>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(3,1fr);
                    gap:8px;
                "
            >

                <button
                    class="primary-button"
                    data-scientific="sin"
                >
                    sin
                </button>

                <button
                    class="primary-button"
                    data-scientific="cos"
                >
                    cos
                </button>

                <button
                    class="primary-button"
                    data-scientific="tan"
                >
                    tan
                </button>

                <button
                    class="primary-button"
                    data-scientific="sqrt"
                >
                    √
                </button>

                <button
                    class="primary-button"
                    data-scientific="square"
                >
                    x²
                </button>

                <button
                    class="primary-button"
                    data-scientific="cube"
                >
                    x³
                </button>

                <button
                    class="primary-button"
                    data-scientific="log"
                >
                    log
                </button>

                <button
                    class="primary-button"
                    data-scientific="ln"
                >
                    ln
                </button>

                <button
                    class="primary-button"
                    data-scientific="inverse"
                >
                    1/x
                </button>

            </div>

        </div>

    `;


    $$("#toolsPage [data-scientific]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const type =
                        button.dataset
                            .scientific;


                    const value =
                        $("#scientificDisplay")
                            .textContent;


                    App.calculator.current =
                        value;


                    scientificCalculate(
                        type
                    );


                    $("#scientificDisplay")
                        .textContent =
                        App.calculator.current;

                }
            );

        });

}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeApp() {

    loadAppData();

    setupCalculatorButtons();

    setupKeyboard();

    setupNavigation();

    setupTheme();

    setupSettings();

    setupGames();

    setupTools();

    renderHistory();

    updateDisplay();

}


/* =========================================================
   START APP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);
