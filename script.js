<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="description"
        content="Calculator Pro - Modern calculator with games and useful tools."
    >

    <meta
        name="theme-color"
        content="#0b0d12"
    >

    <title>Calculator Pro</title>

    <link
        rel="stylesheet"
        href="style.css"
    >

</head>


<body>

<div class="app">


    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <aside class="sidebar">

        <div class="logo">

            <div class="logo-icon">
                🧮
            </div>

            <div class="logo-text">
                Calculator <span>Pro</span>
            </div>

        </div>


        <nav class="nav">

            <button
                class="nav-item active"
                data-page="calculator"
            >

                <span class="nav-icon">🧮</span>
                <span>Calculator</span>

            </button>


            <button
                class="nav-item"
                data-page="games"
            >

                <span class="nav-icon">🎮</span>
                <span>Games</span>

            </button>


            <button
                class="nav-item"
                data-page="tools"
            >

                <span class="nav-icon">🛠️</span>
                <span>Tools</span>

            </button>


            <button
                class="nav-item"
                data-page="history"
            >

                <span class="nav-icon">🕘</span>
                <span>History</span>

            </button>


            <button
                class="nav-item"
                data-page="settings"
            >

                <span class="nav-icon">⚙️</span>
                <span>Settings</span>

            </button>

        </nav>

    </aside>



    <!-- =====================================================
         MAIN
    ====================================================== -->

    <main class="main">


        <!-- =================================================
             TOP BAR
        ================================================== -->

        <header class="topbar">

            <div>

                <h1>Calculator Pro</h1>

                <p>
                    Smart tools. Fast calculations.
                </p>

            </div>


            <div class="topbar-actions">

                <button
                    class="icon-button"
                    id="themeButton"
                    aria-label="Toggle theme"
                >
                    ☀️
                </button>

            </div>

        </header>



        <!-- =================================================
             CALCULATOR PAGE
        ================================================== -->

        <section
            class="page active"
            id="calculatorPage"
        >


            <div class="calculator-wrapper">


                <div class="calculator">


                    <!-- DISPLAY -->

                    <div class="display">

                        <div
                            class="previous-operation"
                            id="previousOperation"
                        ></div>


                        <div
                            class="display-value"
                            id="display"
                        >
                            0
                        </div>

                    </div>



                    <!-- BUTTONS -->

                    <div class="calculator-buttons">


                        <!-- ROW 1 -->

                        <button
                            class="calc-button clear"
                            data-action="clear"
                        >
                            AC
                        </button>


                        <button
                            class="calc-button"
                            data-action="sign"
                        >
                            ±
                        </button>


                        <button
                            class="calc-button"
                            data-action="percent"
                        >
                            %
                        </button>


                        <button
                            class="calc-button operator"
                            data-operation="divide"
                        >
                            ÷
                        </button>



                        <!-- ROW 2 -->

                        <button
                            class="calc-button"
                            data-number="7"
                        >
                            7
                        </button>


                        <button
                            class="calc-button"
                            data-number="8"
                        >
                            8
                        </button>


                        <button
                            class="calc-button"
                            data-number="9"
                        >
                            9
                        </button>


                        <button
                            class="calc-button operator"
                            data-operation="multiply"
                        >
                            ×
                        </button>



                        <!-- ROW 3 -->

                        <button
                            class="calc-button"
                            data-number="4"
                        >
                            4
                        </button>


                        <button
                            class="calc-button"
                            data-number="5"
                        >
                            5
                        </button>


                        <button
                            class="calc-button"
                            data-number="6"
                        >
                            6
                        </button>


                        <button
                            class="calc-button operator"
                            data-operation="subtract"
                        >
                            −
                        </button>



                        <!-- ROW 4 -->

                        <button
                            class="calc-button"
                            data-number="1"
                        >
                            1
                        </button>


                        <button
                            class="calc-button"
                            data-number="2"
                        >
                            2
                        </button>


                        <button
                            class="calc-button"
                            data-number="3"
                        >
                            3
                        </button>


                        <button
                            class="calc-button operator"
                            data-operation="add"
                        >
                            +
                        </button>



                        <!-- ROW 5 -->

                        <button
                            class="calc-button"
                            data-number="0"
                        >
                            0
                        </button>


                        <button
                            class="calc-button"
                            data-action="decimal"
                        >
                            .
                        </button>


                        <button
                            class="calc-button"
                            data-action="delete"
                        >
                            ⌫
                        </button>


                        <button
                            class="calc-button equals"
                            data-action="equals"
                        >
                            =
                        </button>

                    </div>

                </div>


            </div>

        </section>



        <!-- =================================================
             GAMES PAGE
        ================================================== -->

        <section
            class="page"
            id="gamesPage"
        >


            <div class="page-title">

                <span>🎮</span>

                <div>

                    <h2>Mini Games</h2>

                    <p>
                        Play games and beat your high score.
                    </p>

                </div>

            </div>


            <div class="games-grid">


                <!-- MATH -->

                <div
                    class="game-card-small"
                    data-game="math"
                >

                    <div class="game-icon">
                        🧠
                    </div>

                    <h3>
                        Math Challenge
                    </h3>

                    <p>
                        Solve as many math problems
                        as possible before time runs out.
                    </p>

                </div>



                <!-- TAP -->

                <div
                    class="game-card-small"
                    data-game="tap"
                >

                    <div class="game-icon">
                        ⚡
                    </div>

                    <h3>
                        Quick Tap
                    </h3>

                    <p>
                        Test your reaction speed
                        and try to beat your record.
                    </p>

                </div>



                <!-- MEMORY -->

                <div
                    class="game-card-small"
                    data-game="memory"
                >

                    <div class="game-icon">
                        🃏
                    </div>

                    <h3>
                        Memory Math
                    </h3>

                    <p>
                        Match the hidden cards
                        and complete the board.
                    </p>

                </div>

            </div>

        </section>



        <!-- =================================================
             TOOLS PAGE
        ================================================== -->

        <section
            class="page"
            id="toolsPage"
        >


            <div class="page-title">

                <span>🛠️</span>

                <div>

                    <h2>Useful Tools</h2>

                    <p>
                        More than just a calculator.
                    </p>

                </div>

            </div>


            <div class="tools-grid">


                <div
                    class="tool-card"
                    data-tool="scientific"
                >

                    <div class="tool-card-icon">
                        🔬
                    </div>

                    <h3>
                        Scientific
                    </h3>

                    <p>
                        Advanced mathematical functions.
                    </p>

                </div>



                <div
                    class="tool-card"
                    data-tool="percentage"
                >

                    <div class="tool-card-icon">
                        💯
                    </div>

                    <h3>
                        Percentage
                    </h3>

                    <p>
                        Calculate percentages quickly.
                    </p>

                </div>



                <div
                    class="tool-card"
                    data-tool="bmi"
                >

                    <div class="tool-card-icon">
                        ⚖️
                    </div>

                    <h3>
                        BMI
                    </h3>

                    <p>
                        Calculate BMI from height
                        and weight.
                    </p>

                </div>



                <div
                    class="tool-card"
                    data-tool="geometry"
                >

                    <div class="tool-card-icon">
                        📐
                    </div>

                    <h3>
                        Geometry
                    </h3>

                    <p>
                        Calculate areas and
                        circumferences.
                    </p>

                </div>



                <div
                    class="tool-card"
                    data-tool="converter"
                >

                    <div class="tool-card-icon">
                        🔄
                    </div>

                    <h3>
                        Converter
                    </h3>

                    <p>
                        Convert common units.
                    </p>

                </div>



                <div
                    class="tool-card"
                    data-tool="stopwatch"
                >

                    <div class="tool-card-icon">
                        ⏱️
                    </div>

                    <h3>
                        Stopwatch
                    </h3>

                    <p>
                        Track time precisely.
                    </p>

                </div>

            </div>

        </section>



        <!-- =================================================
             HISTORY PAGE
        ================================================== -->

        <section
            class="page"
            id="historyPage"
        >


            <div class="page-title">

                <span>🕘</span>

                <div>

                    <h2>History</h2>

                    <p>
                        Your previous calculations.
                    </p>

                </div>

            </div>


            <div
                style="
                    display:flex;
                    justify-content:flex-end;
                    margin-bottom:15px;
                "
            >

                <button
                    class="primary-button"
                    id="clearHistory"
                >
                    Clear History
                </button>

            </div>


            <div
                class="history-list"
                id="historyContainer"
            >

                <div class="empty-state">

                    <div>🧮</div>

                    <h3>
                        No calculations yet
                    </h3>

                    <p>
                        Your calculations will appear here.
                    </p>

                </div>

            </div>

        </section>



        <!-- =================================================
             SETTINGS PAGE
        ================================================== -->

        <section
            class="page"
            id="settingsPage"
        >


            <div class="page-title">

                <span>⚙️</span>

                <div>

                    <h2>Settings</h2>

                    <p>
                        Customize Calculator Pro.
                    </p>

                </div>

            </div>


            <div class="settings-list">


                <!-- DARK MODE -->

                <div class="setting-item">

                    <div>

                        <h3>
                            Dark Mode
                        </h3>

                        <p>
                            Use the dark interface.
                        </p>

                    </div>


                    <label class="switch">

                        <input
                            type="checkbox"
                            id="darkModeToggle"
                            checked
                        >

                        <span class="slider"></span>

                    </label>

                </div>



                <!-- SOUND -->

                <div class="setting-item">

                    <div>

                        <h3>
                            Button Sounds
                        </h3>

                        <p>
                            Play a small sound
                            when pressing buttons.
                        </p>

                    </div>


                    <label class="switch">

                        <input
                            type="checkbox"
                            id="soundToggle"
                        >

                        <span class="slider"></span>

                    </label>

                </div>



                <!-- VIBRATION -->

                <div class="setting-item">

                    <div>

                        <h3>
                            Vibration
                        </h3>

                        <p>
                            Enable vibration on
                            supported devices.
                        </p>

                    </div>


                    <label class="switch">

                        <input
                            type="checkbox"
                            id="vibrationToggle"
                            checked
                        >

                        <span class="slider"></span>

                    </label>

                </div>



                <!-- ANIMATIONS -->

                <div class="setting-item">

                    <div>

                        <h3>
                            Animations
                        </h3>

                        <p>
                            Enable interface animations.
                        </p>

                    </div>


                    <label class="switch">

                        <input
                            type="checkbox"
                            id="animationToggle"
                            checked
                        >

                        <span class="slider"></span>

                    </label>

                </div>

            </div>

        </section>


    </main>

</div>


<!-- =========================================================
     JAVASCRIPT
========================================================= -->

<script src="script.js"></script>

</body>

</html>
