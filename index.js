const addPlayerButton = document.getElementById("addPlayerButton");
const newPlayerField = document.getElementById("newPlayerField");
const newPlayerInput = document.getElementById("newPlayerInput");
const savePlayerButton = document.getElementById("savePlayerButton");
const removePlayerButton = document.getElementById("removePlayerButton");
const playersSelect = document.getElementById("players-select");
const showButton = document.getElementById("showButton");
const hiddenContent = document.getElementById("hiddenContent");
const topPlayersContainer = document.getElementById("topPlayers");
const otherPlayersContainer = document.getElementById("otherPlayers");

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

// Function to calculate the most played faction for a player
const getMostPlayedFaction = (playerData) => {
    const factionCounts = playerData.timesPlayedWithFaction;
    return Object.keys(factionCounts).reduce((a, b) =>
        factionCounts[a] > factionCounts[b] ? a : b
    );
};

// Function to render players in the specified container
const renderPlayers = (container, players) => {
    container.innerHTML = ""; // Clear existing players
    players.forEach(player => {
        const playerCard = document.createElement("div");
        playerCard.classList.add("text-center", "m-2");
        playerCard.innerHTML = `
            <h3>${player.name}</h3>
            <img class="img-fluid" src="images/${getMostPlayedFaction(player)}.png" alt="${getMostPlayedFaction(player)}">
            <div class="row">
                <p class="col-6">Winrate: ${player.winrateTotal}</p>
                <p class="col-6">Avg VP: ${player.avgVP}</p>
            </div>
        `;
        container.appendChild(playerCard);
    });
};

// Function to update and render players in both sections
const updatePlayerDisplay = () => {
    // Convert playersData into an array for sorting
    const playersArray = Object.values(playersData);

    // Calculate winrate as a numeric value for sorting
    playersArray.forEach(player => {
        const winrate = parseFloat(player.winrateTotal.replace("%", "")) || 0;
        player.winrate = winrate;
    });

    // Sort players by the specified criteria
    playersArray.sort((a, b) => 
        b.winrate - a.winrate ||
        b.avgVP - a.avgVP ||
        b.VPTotal - a.VPTotal ||
        Object.values(b.timesPlayedWithFaction).reduce((x, y) => x + y, 0) -
        Object.values(a.timesPlayedWithFaction).reduce((x, y) => x + y, 0) ||
        a.name.localeCompare(b.name)
    );

    // Separate top 3 players and others
    const topPlayers = playersArray.slice(0, 3);
    const otherPlayers = playersArray.slice(3);

    // Render players
    renderPlayers(topPlayersContainer, topPlayers);
    renderPlayers(otherPlayersContainer, otherPlayers);
};

// Call updatePlayerDisplay whenever playersData is updated
savePlayerButton.addEventListener("click", updatePlayerDisplay);
removePlayerButton.addEventListener("click", updatePlayerDisplay);
