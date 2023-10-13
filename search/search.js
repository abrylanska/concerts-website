
const apiKey = "YOUR KEY";
const apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?";

let userInputValue;
const searchbarInput = document.getElementById("searchbarInput");
const searchbarButton = document.getElementById("searchbarButton");


document.addEventListener("DOMContentLoaded", async function () {

    const searchParams = new URLSearchParams(window.location.search);
    const userInput = searchParams.get("query");

    if (userInput) {
        userInputValue = decodeURIComponent(userInput);
        searchbarInput.value = userInputValue;
        await getDetails(userInputValue);
    } else {
        await getDetails("");
    }

    function performSearch() {
        const searchbarResult = searchbarInput.value;
        window.location.href = "search.html?query=" + encodeURIComponent(searchbarResult);
    }

    searchbarInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });
    searchbarButton.addEventListener("click", performSearch);


    let previousFilterContainer = null;

    function toggleFilterDropdown(filterContainer, e) {
        const filterDropdown = filterContainer.querySelector(".filter-dropdown");
        const filterArrow = filterContainer.querySelector(".filter-arrow");

        if (!filterDropdown) {
            return;
        }

        const isDropdownVisible = filterDropdown.style.display === "block";

        document.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
            dropdown.style.display = "none";
        });

        if (previousFilterContainer) {
            previousFilterContainer.classList.remove("rounded");
            previousFilterContainer.querySelector(".filter-arrow").classList.remove("up");
        }

        if (!isDropdownVisible) {
            filterDropdown.style.display = "block";
            filterContainer.classList.add("rounded");
            filterArrow.classList.add("up");

            previousFilterContainer = filterContainer;
        } else {
            filterDropdown.style.display = "none";
            filterContainer.classList.remove("rounded");
            filterArrow.classList.remove("up");

            previousFilterContainer = null;
        }

        e.stopPropagation();
    }




    const filterContainers = document.querySelectorAll(".main__filters--filter");

    function closeFilterDropdowns() {
        filterContainers.forEach((filterContainer) => {
            const filterDropdown = filterContainer.querySelector(".filter-dropdown");
            const filterArrow = filterContainer.querySelector(".filter-arrow");
            filterDropdown.style.display = "none";
            filterArrow.classList.remove("up");
            filterContainer.classList.remove("rounded");
        });
    }

    filterContainers.forEach((filterContainer) => {
        const filterHeader = filterContainer.querySelector(".filter-header");

        if (filterHeader) {
            filterHeader.addEventListener("click", (e) => {
                toggleFilterDropdown(filterContainer, e);
            });
        }
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".main__filters--filter")) {
            closeFilterDropdowns();
        }
    });
});


const cityMapping = {
    "Warsaw": "Warszawa",
    "Krakow": "Kraków",
    "Gdansk": "Gdańsk",
    "Gdynia": "Gdynia",
    "Gliwice": "Gliwice",
    "Katowice": "Katowice",
    "Lublin": "Lublin",
    "Poznan": "Poznań",
    "Sopot": "Sopot",
    "Szczecin": "Szczecin",
    "Wroclaw": "Wrocław",
    "Lodz": "Łódź",
};

function replaceEnglishCityNames(cityName) {
    return cityMapping[cityName] || cityName;
}


async function getDetails(userInputValue) {
    const concertResults = document.getElementById("concertResults");
    concertResults.innerHTML = "";

    try {
        const response = await axios.get(apiUrl, {
            params: {
                keyword: userInputValue,
                countryCode: "PL",
                apikey: apiKey,
                size: userInputValue ? undefined : 25

            }
        });
        const data = response.data;
        const concerts = data._embedded?.events;

        if (concerts && concerts.length > 0) {

            let favoriteConcerts = [];

            const storedFavoriteConcerts = localStorage.getItem("favoriteConcerts");
            if (storedFavoriteConcerts) {
                favoriteConcerts = JSON.parse(storedFavoriteConcerts);
            }

            function addToFavoritesHandler(eventId, formattedDate, formattedTime, addToFavorites) {
                return function () {
                    const concert = concerts.find((concert) => concert.id === eventId);

                    if (!concert) {
                        return;
                    }

                    const isAlreadyFavorite = favoriteConcerts.some((favConcert) => favConcert.eventId === eventId);

                    if (!isAlreadyFavorite) {
                        favoriteConcerts.push({
                            eventId,
                            concertImage: concert.images && concert.images.length > 0 ? concert.images[0].url : "placeholder-image.png",
                            concertName: concert.name,
                            concertDate: formattedDate,
                            concertTime: formattedTime,
                            concertCity: replaceEnglishCityNames(concert._embedded.venues[0].city.name),
                        });

                        localStorage.setItem("favoriteConcerts", JSON.stringify(favoriteConcerts));
                        addToFavorites.classList.add("active");
                    } else {
                        const confirmation = confirm("Are you sure you want to remove this concert from your favorites?");

                        if (confirmation) {
                            favoriteConcerts = favoriteConcerts.filter((favConcert) => favConcert.eventId !== eventId);
                            localStorage.setItem("favoriteConcerts", JSON.stringify(favoriteConcerts));
                            addToFavorites.classList.remove("active");
                        }
                    }
                };
            }
            for (const concert of concerts) {
                const listItem = document.createElement("li");
                listItem.className = "main__results--result";

                const eventId = concert.id;

                const genreResponse = await axios.get(`http://app.ticketmaster.com/discovery/v2/events/${eventId}.json`, {
                    params: {
                        apikey: apiKey
                    }
                });

                const genreData = genreResponse.data;
                const eventGenres = genreData._embedded?.attractions?.[0]?.classifications?.[0]?.genre?.name;

                listItem.setAttribute("data-genres", eventGenres);

                const eventImage = document.createElement("img");
                eventImage.className = "main__results--result__photo";
                eventImage.src = concert.images.url;
                if (concert.images && concert.images.length > 0) {
                    eventImage.src = concert.images[0].url;
                } else {
                    eventImage.src = "placeholder-image.png";
                }

                const titleInfoContainer = document.createElement("div");
                titleInfoContainer.className = "main__results--result__info";

                const eventTitle = document.createElement("h2");
                eventTitle.className= "eventTitle";
                eventTitle.textContent = concert.name;

                const infoDiv = document.createElement("div");
                infoDiv.className = "main__results--result__info-detailed";

                const eventDate = document.createElement("p");
                eventDate.className = "eventDate";
                const dateStr = concert.dates.start.localDate;
                const formattedDate = dateStr.split("-").reverse().join(".");
                eventDate.textContent = formattedDate;

                const eventTime = document.createElement("p");
                eventTime.className = "eventTime";
                const timeStr = concert.dates.start.localTime;
                const formattedTime = timeStr ? timeStr.substring(0, 5) : "No event time";
                eventTime.textContent = formattedTime;

                const eventCity = document.createElement("p");
                eventCity.className = "eventCity";
                eventCity.textContent = replaceEnglishCityNames(concert._embedded.venues[0].city.name);

                const divider1 = document.createElement("span");
                divider1.className = "divider";
                divider1.textContent = "•";

                const divider2 = document.createElement("span");
                divider2.className = "divider";
                divider2.textContent = "•";

                infoDiv.appendChild(eventDate);
                infoDiv.appendChild(divider1);
                infoDiv.appendChild(eventTime);
                infoDiv.appendChild(divider2);
                infoDiv.appendChild(eventCity);

                titleInfoContainer.appendChild(eventTitle);
                titleInfoContainer.appendChild(infoDiv);

                const addToFavorites = document.createElement("div");
                addToFavorites.className = "main__results--result__favorite";
                addToFavorites.innerHTML = `
    <p>Add to favorites</p>
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" stroke="#000000" fill="none" stroke-width="2">
        <path d="M12 21.35l-1.45-1.32C5.4 16.44 2 13.36 2 9.5 2 6.42 4.42 4 7.5 4c1.74 0 3.41.81 4.5 2.09C13.09 4.81 14.76 4 16.5 4 19.58 4 22 6.42 22 9.5c0 3.86-3.4 7.94-8.55 10.54L12 21.35z"></path>
    </svg>
`;
                addToFavorites.addEventListener("click", addToFavoritesHandler(eventId, formattedDate, formattedTime, addToFavorites));

                if (favoriteConcerts.some((favConcert) => favConcert.eventId === eventId)) {
                    addToFavorites.classList.add("active");
                }

                listItem.appendChild(eventImage);
                listItem.appendChild(titleInfoContainer);
                listItem.appendChild(addToFavorites);

                concertResults.appendChild(listItem);
            }
        } else {
            const notFoundMessage = document.querySelector(".main__results--notfound");
            notFoundMessage.style.display = "block";
            document.querySelector(".main__results").style.backgroundColor = "transparent";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        console.log("API Response:", error.response.data);
    }

}

function initializeAndApplyFilters() {
    initializeGenreFilter();
    initializeCityFilter();
    initializeDateFilter();
    applyFilters();
}

function applyFilters() {
    applyGenreFilter();
    applyCityFilter();
    applyDateFilter();
}

function initializeGenreFilter() {
    const genreCheckboxes = document.querySelectorAll('#genre-filter input[type="checkbox"]');

    genreCheckboxes.forEach((checkbox) => {
        if (checkbox) {
            checkbox.addEventListener("change", applyGenreFilter);
        }
    });

    const showAllCheckbox = document.getElementById("showAllCheckbox");
    showAllCheckbox.addEventListener("change", applyGenreFilter);
}

function applyGenreFilter() {
    const genreCheckboxes = document.querySelectorAll('#genre-filter input[type="checkbox"]');
    const selectedGenres = [];

    genreCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedGenres.push(checkbox.nextSibling.textContent.trim());
        }
    });

    const eventItems = document.querySelectorAll(".main__results--result");

    let anyMatches = false;

    eventItems.forEach((eventItem) => {
        const eventGenres = eventItem.getAttribute("data-genres");

        if (eventGenres) {
            const eventGenresArray = eventGenres.split(",").map((genre) => genre.trim());
            const isMatch = selectedGenres.some((selectedGenre) => eventGenresArray.includes(selectedGenre));

            if (isMatch) {
                eventItem.style.display = "flex";
                anyMatches = true;
            } else {
                eventItem.style.display = "none";
            }
        }
    });

    const noResultsMessage = document.querySelector(".main__results--notfound-filter");
    const showAllCheckbox = document.getElementById("showAllCheckbox");

    if (selectedGenres.length === 0) {
        eventItems.forEach((eventItem) => {
            eventItem.style.display = "flex";
        });
        noResultsMessage.style.display = "none";
    } else if (anyMatches) {
        noResultsMessage.style.display = "none";
    } else {
        noResultsMessage.style.display = "block";
    }

    if (showAllCheckbox.checked) {
        eventItems.forEach((eventItem) => {
            eventItem.style.display = "flex";
        });
        noResultsMessage.style.display = "none";
    }
}

function initializeCityFilter() {
    const cityCheckboxes = document.querySelectorAll('#city-filter input[type="checkbox"]');

    cityCheckboxes.forEach((checkbox) => {
        if (checkbox) {
            checkbox.addEventListener("change", applyCityFilter);
        }
    });

    const showAllCityCheckbox = document.getElementById("showAllCityCheckbox");
    showAllCityCheckbox.addEventListener("change", applyCityFilter);
}


function applyCityFilter() {
    const cityCheckboxes = document.querySelectorAll('#city-filter input[type="checkbox"]');
    const selectedCities = Array.from(cityCheckboxes).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value.toLowerCase());

    const eventItems = document.querySelectorAll(".main__results--result");

    eventItems.forEach((eventItem) => {
        const eventCitiesElement = eventItem.querySelector(".eventCity");

        if (eventCitiesElement) {
            const eventCities = eventCitiesElement.textContent.trim().toLowerCase();
            const isMatch = selectedCities.some((selectedCity) => eventCities.includes(selectedCity));

            if (isMatch) {
                eventItem.style.display = "flex";
            } else {
                eventItem.style.display = "none";
            }
        } else {
            console.error(".eventCity element not found in an event item:", eventItem);
        }
    });

    const noResultsMessage = document.querySelector(".main__results--notfound-filter");
    const showAllCityCheckbox = document.getElementById("showAllCityCheckbox");

    if (selectedCities.length === 0) {
        eventItems.forEach((eventItem) => {
            eventItem.style.display = "flex";
        });
        noResultsMessage.style.display = "none";
    } else {
        const anyMatches = Array.from(eventItems).some((eventItem) => eventItem.style.display === "flex");

        if (anyMatches) {
            noResultsMessage.style.display = "none";
        } else {
            noResultsMessage.style.display = "block";
        }
    }

    if (showAllCityCheckbox.checked) {
        eventItems.forEach((eventItem) => {
            eventItem.style.display = "flex";
        });
        noResultsMessage.style.display = "none";
    }
}

moment.locale("pl");

const weekStart = moment().startOf("isoWeek");
const weekEnd = moment().endOf("isoWeek");

function initializeDateFilter() {
    const dateCheckboxes = document.querySelectorAll('#date-filter input[type="checkbox"]');
    dateCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", applyDateFilter);
    });

    const showAllDateCheckbox = document.getElementById("showAllDateCheckbox");
    showAllDateCheckbox.addEventListener("change", applyDateFilter);

    const startDateInput = document.getElementById("start");
    startDateInput.addEventListener("change", applyDateFilter);
    startDateInput.addEventListener("input", applyDateFilter);

    const endDateInput = document.getElementById("end");
    endDateInput.addEventListener("change", applyDateFilter);
    endDateInput.addEventListener("input", applyDateFilter);

    const today = new Date().toISOString().split("T")[0];

    startDateInput.value = today;
    endDateInput.value = today;
}


function applyDateFilter() {
    const eventItems = document.querySelectorAll(".main__results--result");
    const selectedDateCheckboxes = document.querySelectorAll('#date-filter input[type="checkbox"]:checked');
    const showAllDateCheckbox = document.getElementById("showAllDateCheckbox");
    const startDateInput = document.getElementById("start");
    const endDateInput = document.getElementById("end");
    const fromToCheckbox = document.getElementById("fromToCheckbox");

    eventItems.forEach((eventItem) => {
        const eventDatesElement = eventItem.querySelector(".eventDate");

        if (eventDatesElement) {
            const eventDateText = eventDatesElement.textContent.trim();
            const eventDate = moment(eventDateText, "DD.MM.YYYY");
            const today = moment();
            let isMatch = false;

            if (showAllDateCheckbox.checked) {
                isMatch = true;
            } else if (selectedDateCheckboxes.length === 0) {
                isMatch = true;
            } else {
                selectedDateCheckboxes.forEach((checkbox) => {
                    const checkboxValue = checkbox.value;
                    switch (checkboxValue) {
                        case "tonight":
                            isMatch = eventDate.isSame(today, "day");
                            break;
                        case "this-week":
                            isMatch = eventDate.isBetween(weekStart, weekEnd, null, "[]");
                            break;
                        case "this-month":
                            isMatch = eventDate.isSame (today, "year") && eventDate.isSame(today, "month");
                            break;
                    }
                });
                if (!isMatch && fromToCheckbox.checked) {
                    const start = moment(startDateInput.value, "YYYY-MM-DD");
                    const end = moment(endDateInput.value, "YYYY-MM-DD");

                    isMatch = eventDate.isBetween(start, end, null, "[]");
                }
            }

            if (isMatch) {
                eventItem.style.display = "flex";
            } else {
                eventItem.style.display = "none";
            }
        } else {
            console.error(".eventDate element not found in an event item:", eventItem);
        }
    });
}


const startDateInput = document.getElementById("start");
startDateInput.addEventListener("change", applyDateFilter);

const endDateInput = document.getElementById("end");
endDateInput.addEventListener("change", applyDateFilter);

initializeAndApplyFilters();
