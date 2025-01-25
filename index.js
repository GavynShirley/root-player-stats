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
const submitButton = document.getElementById("submitButton");
const playerFactionAssignments = document.getElementById("playerFactionAssignments");
const winnerSelect = document.getElementById("winnerSelect");


showButton.addEventListener("click", () => {
    hiddenContent.classList.toggle("d-none"); // Toggle visibility of the hidden content
});


// Update faction assignments and winner dropdown when players are selected
const updateFactionAssignments = () => {
    // Clear previous assignments
    playerFactionAssignments.innerHTML = "";
    winnerSelect.innerHTML = "<option value=''>Select Winner</option>"; // Reset winner dropdown

    // Get selected players
    const selectedPlayers = Array.from(
        document.querySelectorAll("#players-select .form-check-input:checked")
    ).map(checkbox => checkbox.value);

    // Dynamically create faction assignments for each player
    selectedPlayers.forEach(playerName => {
        // Add to winner dropdown
        const winnerOption = document.createElement("option");
        winnerOption.value = playerName;
        winnerOption.textContent = playerName;
        winnerSelect.appendChild(winnerOption);

        // Create a dropdown for assigning factions
        const factionAssignmentRow = document.createElement("div");
        factionAssignmentRow.className = "row my-2";

        factionAssignmentRow.innerHTML = `
            <div class="col-6">
                <span>${playerName}</span>
            </div>
            <div class="col-6">
                <select class="form-select form-select-sm player-faction-select" data-player="${playerName}">
                    ${factions
                        .map(faction => `<option value="${faction}">${faction}</option>`)
                        .join("")}
                </select>
            </div>
        `;

        playerFactionAssignments.appendChild(factionAssignmentRow);
    });
};


// Handle submit button click
submitButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default behavior

    // Get selected players and their assigned factions
    const playerFactions = Array.from(
        document.querySelectorAll(".player-faction-select")
    ).reduce((acc, select) => {
        const playerName = select.dataset.player;
        const selectedFaction = select.value;
        acc[playerName] = selectedFaction;
        return acc;
    }, {});

    // Get the winner
    const winner = winnerSelect.value;
    if (!winner) {
        alert("Please select a winner.");
        return;
    }

    // Update stats
    Object.entries(playerFactions).forEach(([playerName, faction]) => {
        if (!playersData[playerName]) {
            console.warn(`Player "${playerName}" does not exist in playersData.`);
            return;
        }

        const player = playersData[playerName];

        // Update timesPlayedWithFaction for all players
        player.timesPlayedWithFaction[faction] += 1;

        // Update timesWonWithFaction for the winner only
        if (playerName === winner) {
            player.timesWonWithFaction[faction] += 1;
            player.VPTotal += 1; // Increment total VP as an example
            player.winrateTotal = calculateWinRate(player); // Recalculate win rate
        }
    });

    console.log("Updated playersData:", playersData);
    alert(`Game data submitted. Winner: ${winner}`);
    updatePlayerDisplay(); // Update the UI
});

// Helper function to calculate win rate
const calculateWinRate = (player) => {
    const totalGames = Object.values(player.timesPlayedWithFaction).reduce((a, b) => a + b, 0);
    const totalWins = Object.values(player.timesWonWithFaction).reduce((a, b) => a + b, 0);
    return totalGames ? ((totalWins / totalGames) * 100).toFixed(2) + "%" : "0%";
};

// Update faction assignments when players are selected
savePlayerButton.addEventListener("click", updateFactionAssignments);

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

savePlayerButton.addEventListener("click", () => {
    const newPlayerName = newPlayerInput.value.trim();
    if (newPlayerName) {
        // Create a new checkbox
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "form-check";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input";
        checkbox.id = `player-${newPlayerName.toLowerCase().replace(/\s+/g, "-")}`;
        checkbox.value = newPlayerName;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = checkbox.id;
        label.textContent = newPlayerName;

        // Append the checkbox and label to the container
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        // Add the container to the players-select div
        playersSelect.appendChild(checkboxContainer);

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

        // Hide the input field
        newPlayerField.classList.add("d-none");
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
