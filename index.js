const showButton = document.getElementById("showButton");
const addPlayerButton = document.getElementById("addPlayerButton");
const newPlayerField = document.getElementById("newPlayerField");
const newPlayerInput = document.getElementById("newPlayerInput");
const savePlayerButton = document.getElementById("savePlayerButton");
const playersSelect = document.getElementById("players-select");
const hiddenContent = document.getElementById("hiddenContent");

showButton.addEventListener("click", () => {

    hiddenContent.classList.toggle("d-none"); // Toggle the 'd-none' class

});

addPlayerButton.addEventListener("click", () => {
    newPlayerField.classList.toggle("d-none"); // Toggle the visibility of the input field
    newPlayerInput.value = ""; // Clear the input field
});

savePlayerButton.addEventListener("click", () => {
    const newPlayerName = newPlayerInput.value.trim();
    if (newPlayerName) {
        const newOption = document.createElement("option");
        newOption.value = newPlayerName.toLowerCase().replace(/\s+/g, "-");
        newOption.textContent = newPlayerName;
        playersSelect.appendChild(newOption); // Add the new player to the dropdown
        newPlayerField.classList.add("d-none"); // Hide the input field
    }
});