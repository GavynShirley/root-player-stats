const showButton = document.getElementById("showButton");

const hiddenContent = document.getElementById("hiddenContent");

showButton.addEventListener("click", () => {

    hiddenContent.classList.toggle("d-none"); // Toggle the 'd-none' class

});