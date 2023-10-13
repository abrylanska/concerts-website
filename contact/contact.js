
// Event listener for updating character count
const messageElement = document.getElementById("message");
const counterElement = document.getElementById("counter");

messageElement.addEventListener("input", (e) => {
    const maxLength = e.target.getAttribute("maxlength");
    const currentLength = e.target.value.length;
    counterElement.innerHTML = `${currentLength}/${maxLength}`;
});



// Event listener for formatting phone number input
const phone = document.getElementById("phone");

phone.addEventListener("input", (e) => {
    const inputValue = e.target.value.replace(/\D/g, '');

    if (inputValue.length <= 3) {
        e.target.value = inputValue;
    } else if (inputValue.length <= 6) {
        e.target.value = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
    } else if (inputValue.length <= 9) {
        e.target.value = inputValue.slice(0, 3) + '-' + inputValue.slice(3, 6) + '-' + inputValue.slice(6);
    } else {
        e.target.value = inputValue.slice(0, 3) + '-' + inputValue.slice(3, 6) + '-' + inputValue.slice(6, 9);
    }
});



const mainMessage = document.querySelector(".main__message");
const mainText = document.querySelector(".main__text");
const mainForm = document.querySelector(".main__form");

function hideMainContent() {
    mainText.style.display = "none";
    mainForm.style.display = "none";
}


// Function to send form data to the API
function sendDataToAPI(data) {
    axios.post("YOUR API LINK", data)
        .then(response => {
            console.log("API Response:", response.data);
            mainMessage.style.display = "block";

            hideMainContent();
        })
        .catch(error => {
            console.error("API Error:", error);
        });
}



// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const formData = {
        name: name,
        email: email,
        message: message,
    };

    sendDataToAPI(formData);
}

document.querySelector('.main__form').addEventListener("submit", handleSubmit);
