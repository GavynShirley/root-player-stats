const addPlayerButton = document.getElementById("addPlayerButton");
const newPlayerField = document.getElementById("newPlayerField");
const newPlayerInput = document.getElementById("newPlayerInput");
const savePlayerButton = document.getElementById("savePlayerButton");
const removePlayerButton = document.getElementById("removePlayerButton");
const playersSelect = document.getElementById("players-select");
const showButton = document.getElementById("showButton");
const hiddenContent = document.getElementById("hiddenContent");

showButton.addEventListener("click", () => {
    hiddenContent.classList.toggle("d-none"); // Toggle visibility of the hidden content
});

const playersData = {}; // Object to store all player data

const maps = ["autumn", "winter", "lake", "mountain"];
const factions = [
    "marquise", "eyrie", "alliance", "vagabond", "company", "cult", "duchy", 
    "conspiracy", "keepers", "hundreds"
];
const hirelings = [
    "pro-patrol", "pro-dynasty", "pro-uprising", "pro-exile", "pro-flotilla", 
    "pro-prophets", "pro-bandits", "pro-expedition", "pro-spies", "pro-protector", 
    "pro-keepers", "pro-bearers", "pro-band", "dem-patrol", "dem-dynasty", 
    "dem-uprising", "dem-exile", "dem-flotilla", "dem-prophets", "dem-bandits", 
    "dem-expedition", "dem-spies", "dem-protector", "dem-keepers", "dem-bearers", 
    "dem-band"
];
const landmarks = ["ferry", "tower", "market", "treetop", "forge", "city"];

// Show or hide the input field when "Add New Player +" is clicked
addPlayerButton.addEventListener("click", () => {
    newPlayerField.classList.toggle("d-none"); // Toggle visibility
    newPlayerInput.focus(); // Focus the input field
    newPlayerInput.value = ""; // Clear any previous input
});

// Save the new player and add it to the dropdown
savePlayerButton.addEventListener("click", () => {
    const newPlayerName = newPlayerInput.value.trim();
    if (newPlayerName) {
        const newOption = document.createElement("option");
        newOption.value = newPlayerName.toLowerCase().replace(/\s+/g, "-"); // Create a value-friendly option
        newOption.textContent = newPlayerName; // Set the display name
        playersSelect.appendChild(newOption); // Add the new option to the dropdown
        
        // Create a new player object with default values
        playersData[newPlayerName] = {
            name: newPlayerName,
            winrateTotal: "0%",
            VPTotal: 0,
            avgVP: 0,
            timesWonOnMap: {
                autumn: 0,
                winter: 0,
                lake: 0,
                mountain: 0
            },
            timesPlayedWithFaction: Object.fromEntries(factions.map(f => [f, 0])),
            timesWonWithFaction: Object.fromEntries(factions.map(f => [f, 0])),
            timesPlayedWithHireling: Object.fromEntries(hirelings.map(h => [h, 0])),
            timesWonWithHireling: Object.fromEntries(hirelings.map(h => [h, 0])),
            timesPlayedWithLandmark: Object.fromEntries(landmarks.map(l => [l, 0])),
            timesWonWithLandmark: Object.fromEntries(landmarks.map(l => [l, 0]))
        };

        console.log(`Player "${newPlayerName}" created:`, playersData[newPlayerName]); // Debugging log

        newPlayerField.classList.add("d-none"); // Hide the input field
    } else {
        alert("Please enter a valid name."); // Optional: Basic validation
    }
});

// Remove the selected player
removePlayerButton.addEventListener("click", () => {
    const selectedOption = playersSelect.options[playersSelect.selectedIndex];
    if (selectedOption) {
        if (confirm(`Are you sure you want to remove "${selectedOption.textContent}"?`)) {
            delete playersData[selectedOption.textContent]; // Remove the player data
            playersSelect.removeChild(selectedOption); // Remove the selected option
            console.log(`Player "${selectedOption.textContent}" removed.`);
        }
    } else {
        alert("Please select a player to remove.");
    }
});
