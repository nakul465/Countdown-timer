document.addEventListener("DOMContentLoaded", function () {
    const minutesInput = document.getElementById("minutes");
    const setButton = document.getElementById("set-button");
    const startButton = document.getElementById("start-button");
    const resetButton = document.getElementById("reset-button");
    const timeLeftDisplay = document.getElementById("time-left");
    const repeatCheckbox = document.getElementById("repeat-checkbox");
    const notificationSound = document.getElementById("notificationSound");
    const countdownList = document.getElementById("countdown-list");
    let timer;
    let countdowns = [];

    // Load saved countdowns from local storage (called when the page loads)
    function loadCountdowns() {
        const savedCountdowns = localStorage.getItem("countdowns");
        if (savedCountdowns) {
            countdowns = JSON.parse(savedCountdowns);
            displayCountdowns();
        }
    }

    // Save the countdowns to local storage
    function saveCountdowns() {
        localStorage.setItem("countdowns", JSON.stringify(countdowns));
    }

    // Function to add a new countdown
    function addCountdown(label, seconds) {
        countdowns.push({ label, seconds });
        saveCountdowns();
        displayCountdowns();
    }

    // Function to display saved countdowns in the UI
    function displayCountdowns() {
        countdownList.innerHTML = "";
        countdowns.forEach((countdown, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${countdown.label}</span>
                <button class="start-button" data-index="${index}">Start</button>
                <button class="delete-button" data-index="${index}">Delete</button>
            `;
            countdownList.appendChild(listItem);

            // Add event listeners to start and delete buttons
            listItem.querySelector(".start-button").addEventListener("click", () => {
                startSavedCountdown(countdown.seconds);
            });

            listItem.querySelector(".delete-button").addEventListener("click", () => {
                deleteCountdown(index);
            });
        });
    }

    // Load saved countdowns when the page loads
    loadCountdowns();

    // Function to delete a countdown
    function deleteCountdown(index) {
        countdowns.splice(index, 1);
        saveCountdowns();
        displayCountdowns();
    }

    // Function to start a saved countdown
    function startSavedCountdown(seconds) {
        if (timer) return;
        startTimer(seconds);
    }

    // Function to play the notification sound
    function playNotificationSound() {
        notificationSound.play();
    }

    // Function to start the countdown timer
    function startTimer(seconds) {
        let startTime = Date.now();
        const endTime = startTime + seconds * 1000;

        timer = setInterval(function () {
            const timeRemaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
            displayTimeLeft(timeRemaining);

            // Update the progress bar
            const progressBar = document.getElementById("progress-bar");
            const progressPercentage = ((seconds - timeRemaining) / seconds) * 100;
            progressBar.style.width = progressPercentage + "%";

            if (timeRemaining === 0) {
                clearInterval(timer);
                timer = undefined;
                playNotificationSound();

                if (repeatCheckbox.checked) {
                    startTimer(seconds);
                }
            }
        }, 1000);
    }

    // Function to display time left
    function displayTimeLeft(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const display = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        timeLeftDisplay.textContent = display;
    }

    // Event listener for setting a new countdown
    setButton.addEventListener("click", function () {
        const minutes = parseInt(minutesInput.value, 10);
        if (!isNaN(minutes) && minutes > 0) {
            const seconds = minutes * 60;
            displayTimeLeft(seconds);
        }
    });

    // Event listener for starting a new countdown
    startButton.addEventListener("click", function () {
        if (timer) return; // Timer is already running
        const minutes = parseInt(minutesInput.value, 10);
        if (!isNaN(minutes) && minutes > 0) {
            const seconds = minutes * 60;
            startTimer(seconds);
        }
    });

    // Event listener for resetting the countdown
    resetButton.addEventListener("click", function () {
        clearInterval(timer);
        timer = undefined;
        minutesInput.value = "5"; // Reset the input field
        timeLeftDisplay.textContent = "00:00:00";
    });
});
