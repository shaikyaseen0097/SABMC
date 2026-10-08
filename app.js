/* =========================================================
   SCENARIO-AWARE BIOMEDICAL MONITORING CONTROLLER
   Frontend demonstration for VLSI / SystemVerilog project

   IMPORTANT:
   This version does NOT use ESP32 or physical hardware.

   The values are generated as a simulation stream.

   Later, these values can be replaced by actual
   SystemVerilog simulation output.
========================================================= */


const $ = (id) => document.getElementById(id);


/* =========================================================
   STORAGE
========================================================= */

const HISTORY_KEY = "scenario_biomedical_history";

const USER_KEY = "scenario_biomedical_user";

const PHONE_KEY = "scenario_biomedical_phone";


/* =========================================================
   CURRENT USER
========================================================= */

let currentUser = null;

let currentScenario = "Normal";

let simulationTimer = null;


/* =========================================================
   SCENARIO INFORMATION
========================================================= */

const scenarios = {

    Normal: {

        level: 1,

        description:
            "All monitored inputs are within the demonstration range.",

        alert:
            "No active alert."

    },

    "Reduced Activity": {

        level: 2,

        description:
            "The controller detected an early change in the monitored condition.",

        alert:
            "Early warning alert."

    },

    Distress: {

        level: 3,

        description:
            "The scenario engine indicates a distress condition.",

        alert:
            "Priority alert generated."

    },

    Emergency: {

        level: 4,

        description:
            "The controller entered an emergency state.",

        alert:
            "Emergency alert generated."

    }

};


/* =========================================================
   LOGIN
========================================================= */

$("loginForm").addEventListener("submit", function (event) {

    event.preventDefault();

    const email = $("email").value.trim();

    const password = $("password").value.trim();

    if (!email || !password) {

        showToast("Please enter email and password.");

        return;

    }


    currentUser = {

        name:
            email
                .split("@")[0]
                .replace(/[._-]/g, " "),

        email: email

    };


    localStorage.setItem(
        USER_KEY,
        JSON.stringify(currentUser)
    );


    openDashboard();

});


/* =========================================================
   OPEN DASHBOARD
========================================================= */

function openDashboard() {

    $("loginPage").classList.add("hidden");

    $("dashboardPage").classList.remove("hidden");


    $("profileName").textContent =
        currentUser.name;

    $("profileEmail").textContent =
        currentUser.email;

    $("profileLetter").textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();


    startSimulation();

    loadPhone();

    updateHistory();

}


/* =========================================================
   LOGOUT
========================================================= */

$("logoutBtn").addEventListener("click", function () {

    localStorage.removeItem(USER_KEY);

    location.reload();

});


/* =========================================================
   NAVIGATION
========================================================= */

const navigationButtons =
    document.querySelectorAll(".nav-btn");


navigationButtons.forEach(button => {

    button.addEventListener("click", function () {

        const page =
            button.dataset.page;


        navigationButtons.forEach(btn =>
            btn.classList.remove("active")
        );


        button.classList.add("active");


        showPage(page);

    });

});


function showPage(page) {

    const views = {

        dashboard:
            $("dashboardView"),

        live:
            $("liveView"),

        history:
            $("historyView"),

        alerts:
            $("alertsView"),

        architecture:
            $("architectureView")

    };


    Object.values(views).forEach(view => {

        view.classList.add("hidden");

    });


    views[page].classList.remove("hidden");


    const titles = {

        dashboard: "Dashboard",

        live: "Live Monitoring",

        history: "Health History",

        alerts: "Alert Center",

        architecture: "System Architecture"

    };


    $("pageTitle").textContent =
        titles[page];


    if (page === "history") {

        updateHistory();

    }

}


/* =========================================================
   SIMULATION ENGINE
========================================================= */

/*

    This is the important part for your expo.

    The website behaves as though it is receiving
    continuous output from your biomedical monitoring DUT.

    Later you can replace this function with data coming
    from your SystemVerilog simulation.

*/


function generateSimulationData() {

    const cycle =
        Math.floor(Date.now() / 10000) % 16;


    let data;


    /*
       NORMAL
    */

    if (cycle <= 4) {

        data = {

            hr:
                random(72, 84),

            spo2:
                random(97, 99),

            systolic:
                random(115, 125),

            diastolic:
                random(75, 82)

        };

    }


    /*
       REDUCED ACTIVITY
    */

    else if (cycle <= 7) {

        data = {

            hr:
                random(102, 110),

            spo2:
                random(95, 97),

            systolic:
                random(135, 145),

            diastolic:
                random(82, 88)

        };

    }


    /*
       DISTRESS
    */

    else if (cycle <= 10) {

        data = {

            hr:
                random(115, 125),

            spo2:
                random(92, 94),

            systolic:
                random(150, 160),

            diastolic:
                random(88, 95)

        };

    }


    /*
       EMERGENCY
    */

    else if (cycle <= 12) {

        data = {

            hr:
                random(130, 140),

            spo2:
                random(88, 92),

            systolic:
                random(165, 180),

            diastolic:
                random(95, 105)

        };

    }


    /*
       RECOVERY
    */

    else {

        data = {

            hr:
                random(75, 88),

            spo2:
                random(96, 99),

            systolic:
                random(118, 128),

            diastolic:
                random(76, 83)

        };

    }


    return data;

}


/* =========================================================
   RANDOM NUMBER
========================================================= */

function random(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


/* =========================================================
   SCENARIO CLASSIFICATION
========================================================= */

function classifyScenario(data) {

    let scenario =
        "Normal";


    /*
       Demonstration engineering thresholds.

       These are NOT clinical thresholds.
    */


    if (

        data.spo2 < 93 ||

        data.systolic >= 165 ||

        data.hr >= 130

    ) {

        scenario =
            "Emergency";

    }

    else if (

        data.spo2 <= 94 ||

        data.systolic >= 150 ||

        data.hr >= 115

    ) {

        scenario =
            "Distress";

    }

    else if (

        data.systolic >= 135 ||

        data.hr >= 100

    ) {

        scenario =
            "Reduced Activity";

    }


    return scenario;

}


/* =========================================================
   START SIMULATION
========================================================= */

function startSimulation() {

    if (simulationTimer) {

        clearInterval(simulationTimer);

    }


    updateSimulation();


    simulationTimer =
        setInterval(

            updateSimulation,

            2000

        );

}


/* =========================================================
   UPDATE SIMULATION
========================================================= */

function updateSimulation() {

    const data =
        generateSimulationData();


    const scenario =
        classifyScenario(data);


    updateVitals(data);

    updateScenario(scenario);

    saveReading(
        data,
        scenario
    );


}


/* =========================================================
   UPDATE VITAL VALUES
========================================================= */

function updateVitals(data) {

    const bp =
        `${data.systolic}/${data.diastolic}`;


    $("hrValue").textContent =
        data.hr;

    $("spo2Value").textContent =
        data.spo2;

    $("bpValue").textContent =
        bp;


    $("liveHR").textContent =
        data.hr;

    $("liveSpO2").textContent =
        data.spo2;

    $("liveBP").textContent =
        bp;

}


/* =========================================================
   UPDATE SCENARIO
========================================================= */

function updateScenario(scenario) {

    const info =
        scenarios[scenario];


    $("scenarioName").textContent =
        scenario;


    $("scenarioDescription").textContent =
        info.description;


    $("scenarioLevel").textContent =
        `${info.level} / 4`;


    $("progressBar").style.width =
        `${info.level * 25}%`;


    updateScenarioSteps(
        info.level
    );


    /*
       Alert only when scenario changes.
    */

    if (scenario !== currentScenario) {

        if (
            scenario === "Distress" ||
            scenario === "Emergency"
        ) {

            generateAlert(
                scenario
            );

        }

        currentScenario =
            scenario;

    }


    $("alertTitle").textContent =
        info.alert;


    $("alertMessage").textContent =
        info.description;


    updateScenarioColors(
        scenario
    );

}


/* =========================================================
   SCENARIO STEPS
========================================================= */

function updateScenarioSteps(level) {

    const steps =
        document.querySelectorAll(
            ".scenario-step"
        );


    steps.forEach(
        (step, index) => {

            step.classList.toggle(
                "active",

                index === level - 1
            );

        }
    );

}


/* =========================================================
   SCENARIO COLORS
========================================================= */

function updateScenarioColors(scenario) {

    const icon =
        $("scenarioIcon");


    if (scenario === "Normal") {

        icon.textContent =
            "✓";

        icon.style.background =
            "#e8f8f1";

        icon.style.color =
            "#13a879";

    }


    else if (
        scenario === "Reduced Activity"
    ) {

        icon.textContent =
            "!";

        icon.style.background =
            "#fff4dc";

        icon.style.color =
            "#a06c00";

    }


    else if (
        scenario === "Distress"
    ) {

        icon.textContent =
            "!";

        icon.style.background =
            "#fff0e7";

        icon.style.color =
            "#bd5934";

    }


    else {

        icon.textContent =
            "!";

        icon.style.background =
            "#ffe9ed";

        icon.style.color =
            "#d33d55";

    }

}


/* =========================================================
   SAVE READING
========================================================= */

function saveReading(
    data,
    scenario
) {

    const history =
        getHistory();


    const record = {

        time:
            new Date().toISOString(),

        hr:
            data.hr,

        spo2:
            data.spo2,

        bp:
            `${data.systolic}/${data.diastolic}`,

        scenario:
            scenario,

        alert:
            scenarios[scenario].alert

    };


    history.unshift(record);


    /*
       Keep latest 300 records.
    */

    const limited =
        history.slice(0, 300);


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(limited)
    );


    updateHistory();

}


/* =========================================================
   GET HISTORY
========================================================= */

function getHistory() {

    return JSON.parse(

        localStorage.getItem(
            HISTORY_KEY
        ) || "[]"

    );

}


/* =========================================================
   HISTORY TABLE
========================================================= */

function updateHistory() {

    const history =
        getHistory();


    $("totalReadings").textContent =
        history.length;


    $("normalCount").textContent =
        history.filter(
            x => x.scenario === "Normal"
        ).length;


    $("distressCount").textContent =
        history.filter(
            x => x.scenario === "Distress"
        ).length;


    $("emergencyCount").textContent =
        history.filter(
            x => x.scenario === "Emergency"
        ).length;


    const table =
        $("historyTable");


    if (!history.length) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No readings available yet.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        history
            .slice(0, 100)
            .map(record => `

                <tr>

                    <td>
                        ${formatDate(record.time)}
                    </td>

                    <td>
                        ${record.hr}
                    </td>

                    <td>
                        ${record.spo2}%
                    </td>

                    <td>
                        ${record.bp}
                    </td>

                    <td>
                        <b>
                            ${record.scenario}
                        </b>
                    </td>

                    <td>
                        ${record.alert}
                    </td>

                </tr>

            `)
            .join("");

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {

    return new Date(date)
        .toLocaleString();

}


/* =========================================================
   ALERT SYSTEM
========================================================= */

function generateAlert(scenario) {

    const message =
        `Scenario changed to ${scenario}.`;


    showToast(
        `⚠ ${message}`
    );


    /*
       Browser notification.

       User must allow notifications.
    */

    if (
        "Notification" in window
    ) {

        if (
            Notification.permission ===
            "default"
        ) {

            Notification.requestPermission();

        }

        else if (
            Notification.permission ===
            "granted"
        ) {

            new Notification(
                "Scenario-Aware Alert",
                {
                    body:
                        message
                }
            );

        }

    }


    /*
       Add alert to alert history.
    */

    addAlertToFeed(
        scenario
    );

}


/* =========================================================
   ALERT HISTORY
========================================================= */

function addAlertToFeed(scenario) {

    const feed =
        $("alertHistory");


    const current =
        feed.innerHTML;


    const item = `

        <div
            style="
                padding:14px 0;
                border-bottom:1px solid #e3e8f0;
                font-size:11px;
            "
        >

            <b>
                ⚠ ${scenario} Alert
            </b>

            <br>

            <small
                style="
                    color:#8993a5;
                "
            >
                ${new Date().toLocaleString()}
            </small>

        </div>

    `;


    if (
        current.includes(
            "No alerts generated yet."
        )
    ) {

        feed.innerHTML =
            item;

    }

    else {

        feed.innerHTML =
            item + current;

    }

}


/* =========================================================
   PHONE NUMBER
========================================================= */

$("savePhone").addEventListener(
    "click",
    function () {

        const phone =
            $("phoneNumber")
                .value
                .trim();


        if (!phone) {

            showToast(
                "Enter a phone number."
            );

            return;

        }


        localStorage.setItem(
            PHONE_KEY,
            phone
        );


        showToast(
            "Emergency contact saved."
        );

    }
);


/* =========================================================
   LOAD PHONE
========================================================= */

function loadPhone() {

    const phone =
        localStorage.getItem(
            PHONE_KEY
        );


    if (phone) {

        $("phoneNumber").value =
            phone;

    }

}


/* =========================================================
   EXPORT CSV
========================================================= */

$("exportBtn").addEventListener(
    "click",
    function () {

        const history =
            getHistory();


        if (!history.length) {

            showToast(
                "No history available."
            );

            return;

        }


        const rows = [

            [
                "Time",
                "Heart Rate",
                "SpO2",
                "Blood Pressure",
                "Scenario",
                "Alert"
            ],

            ...history.map(
                item => [

                    item.time,

                    item.hr,

                    item.spo2,

                    item.bp,

                    item.scenario,

                    item.alert

                ]
            )

        ];


        const csv =
            rows
                .map(
                    row =>
                        row
                            .map(
                                value =>
                                    `"${value}"`
                            )
                            .join(",")
                )
                .join("\n");


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;

        link.download =
            "biomedical_history.csv";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        $("toast");


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },

        2500
    );

}


/* =========================================================
   AUTO LOGIN
========================================================= */

const savedUser =
    localStorage.getItem(
        USER_KEY
    );


if (savedUser) {

    currentUser =
        JSON.parse(
            savedUser
        );

    openDashboard();

}