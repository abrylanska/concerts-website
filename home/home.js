
// Handling the search functionality
const searchbarInput = document.getElementById("searchbarInput");
const searchbarButton = document.getElementById("searchbarButton");

function performSearch() {
    const searchbarResult = searchbarInput.value;
    window.location.href = "./search/search.html?query=" + encodeURIComponent(searchbarResult);
}

searchbarButton.addEventListener("click", performSearch);

searchbarInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});