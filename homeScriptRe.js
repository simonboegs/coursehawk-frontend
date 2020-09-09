const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    var school = document.getElementById("schoolInput").value;
    school = school.toLowerCase().replace(/ /g, "-");
    var interests = document.getElementById("interestInput").value;
    interests = interests.toLowerCase().replace(/ /g, "-");
    window.location.href = "resultsRe.html?school=" + school + "&interests=" + interests;
});
