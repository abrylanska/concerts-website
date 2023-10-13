
// Function for rendering favorite concerts
function renderFavoriteConcerts() {
    const favoritesList = document.querySelector(".main__favorites");
    const storedFavoriteConcerts = localStorage.getItem("favoriteConcerts");

    if (storedFavoriteConcerts) {
        const favoriteConcerts = JSON.parse(storedFavoriteConcerts);

        if (favoriteConcerts.length > 0) {
            favoritesList.innerHTML = '';

            favoriteConcerts.forEach((favConcert) => {
                const listItem = document.createElement("li");
                listItem.className = "main__favorites--item";

                const concertImage = document.createElement("img");
                concertImage.className = "main__favorites--item__photo";
                concertImage.src = favConcert.concertImage;

                const titleInfoContainer = document.createElement("div");
                titleInfoContainer.className = "main__favorites--item__info";

                const concertTitle = document.createElement("h2");
                concertTitle.className= "eventTitle";
                concertTitle.textContent = favConcert.concertName;

                const infoDiv = document.createElement("div");
                infoDiv.className = "main__favorites--item__info-detailed";

                const concertDate = document.createElement("p");
                concertDate.className = "eventDate";
                concertDate.textContent = `${favConcert.concertDate}`;

                const concertTime = document.createElement("p");
                concertTime.className = "eventTime";
                concertTime.textContent = `${favConcert.concertTime}`;

                const concertCity = document.createElement("p");
                concertCity.className = "eventCity";
                concertCity.textContent = `${favConcert.concertCity}`;

                const divider1 = document.createElement("span");
                divider1.className = "divider";
                divider1.textContent = "•";

                const divider2 = document.createElement("span");
                divider2.className = "divider";
                divider2.textContent = "•";

                infoDiv.appendChild(concertDate);
                infoDiv.appendChild(divider1);
                infoDiv.appendChild(concertTime);
                infoDiv.appendChild(divider2);
                infoDiv.appendChild(concertCity);

                titleInfoContainer.appendChild(concertTitle);
                titleInfoContainer.appendChild(infoDiv);

                const addToFavorites = document.createElement("div");
                addToFavorites.className = "main__favorites--item__favorite";
                addToFavorites.innerHTML = `
                    <p>Add to favorites</p>
                        <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" stroke="#000000" fill="none" stroke-width="2">
                            <path d="M12 21.35l-1.45-1.32C5.4 16.44 2 13.36 2 9.5 2 6.42 4.42 4 7.5 4c1.74 0 3.41.81 4.5 2.09C13.09 4.81 14.76 4 16.5 4 19.58 4 22 6.42 22 9.5c0 3.86-3.4 7.94-8.55 10.54L12 21.35z"></path>
                        </svg>
                `;

                const isFavorite = favoriteConcerts.some((concert) => concert.eventId === favConcert.eventId);
                if (isFavorite) {
                    addToFavorites.classList.add("active");
                }

                addToFavorites.addEventListener("click", function () {
                    const confirmation = confirm("Are you sure you want to remove this concert from your favorites?");
                    if (confirmation) {
                        favoriteConcerts.splice(favoriteConcerts.indexOf(favConcert), 1);

                        localStorage.setItem("favoriteConcerts", JSON.stringify(favoriteConcerts));

                        favoritesList.removeChild(listItem);
                    }
                });

                listItem.appendChild(concertImage);
                listItem.appendChild(titleInfoContainer);
                listItem.appendChild(addToFavorites);

                favoritesList.appendChild(listItem);
            });
        } else {
            const notFoundMessage = document.querySelector(".main__favorites--notfound");
            notFoundMessage.style.display = "block";
            document.querySelector(".main__favorites").style.backgroundColor = "transparent";
        }
    }
}

window.addEventListener("load", renderFavoriteConcerts);
