//position jumbo in center
var jumbo = document.getElementById("jumbo");
var jumboHeight = jumbo.getBoundingClientRect().height;
jumbo.style.marginTop = ((window.innerHeight - jumboHeight) / 2).toString() + "px";

var schools = ["UC BERKELEY", "UC DAVIS", "UC IRVINE", "UC LA", "UC SANTA CRUZ", "UC MERCED"];
var errorDiv = document.querySelector(".school-error");

const form = document.getElementById("schoolForm");

var container = document.querySelector(".container");
container.classList.add("slideInFromRight");
container.addEventListener("animationend", () => {
    container.classList.remove("slideInFromRight");
    container.removeEventListener("animationend", function () {});
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    var school = document.getElementById("schoolInput").value;
    if (!schools.includes(school)) {
        errorDiv.style.display = "block";
        return;
    }
    exitPage(school);
});

function exitPage(school) {
    school = school.toLowerCase().replace(/ /g, "-");
    container.classList.add("slideOutToRight");
    container.addEventListener(
        "animationend",
        () => {
            window.location.href = "search.html?" + school;
            container.classList.add("invisible");
            container.classList.remove("slideOutToRight");
        },
        false
    );
}

const schoolInput = document.getElementById("schoolInput");

schoolInput.addEventListener("input", async (e) => {
    if (errorDiv.style.display == "block") errorDiv.style.display = "none";
    let input = schoolInput.value;
    schoolInput.value = input.toUpperCase();
    clearSuggestions();
    if (input.length === 0) return;
    let suggestions = getSuggestions(input);
    // console.log("suggestions: " + suggestions);
    for (var i = 0; i < suggestions.length; i++) {
        let newDiv = document.createElement("div");
        newDiv.innerHTML = suggestions[i];
        newDiv.className = "autocomplete-option";
        form.appendChild(newDiv);
        newDiv.addEventListener("click", (e) => {
            schoolInput.value = newDiv.innerHTML;
            exitPage(schoolInput.value);
            clearSuggestions();
        });
    }
});

function clearSuggestions() {
    let suggestionDivs = Array.from(document.getElementsByClassName("autocomplete-option"));
    console.log("suggestionDivs: " + suggestionDivs.length);
    //console.log("clearSuggestions()", "length: " + suggestionDivs.length);
    for (var i = 0; i < suggestionDivs.length; i++) {
        form.removeChild(suggestionDivs[i]);
    }
}

function getSuggestions(input) {
    var suggestions = [];
    for (var i = 0; i < schools.length; i++) {
        var arr = schools[i].split(" ");
        if (schools[i].substring(0, input.length).toUpperCase() == input.toUpperCase()) {
            suggestions.push(schools[i]);
        }
    }
    return suggestions;
}
