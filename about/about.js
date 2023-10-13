
// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");

        }
    });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));



// Arrow Element Opacity
const arrowElement = document.querySelector(".intro__arrow");

function round(value, precision) {
    const multiplier = 10 ** (precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function leftPad(value, padding) {
    const zeroes = "0".repeat(padding);
    return (zeroes + value).slice(-padding);
}

window.addEventListener("scroll", () => {
    const opacity = round(arrowElement.offsetTop - window.scrollY, 1);
    if (opacity > 0 && opacity < 1000) {
        arrowElement.style.opacity = `0.${leftPad(opacity, 3)}`;
    }
});