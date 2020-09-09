const schoolInput = document.getElementById("schoolInput");
const interestInput = document.getElementById("interestInput");

const urlParams = new URLSearchParams(window.location.search);
const schoolQuery = urlParams.get("school");
const interestQuery = urlParams.get("interests");

schoolInput.value = schoolQuery.replace(/-/g, " ");
interestInput.value = interestQuery.replace(/-/g, " ");

async function load() {
    courses = await getCourses();
}

async function getCourses() {
    // var url = "http://127.0.0.1:5000/getcourses/";
    // var urlExtended = url + "?school=" + school + "&interests=" + interests;
    var url = "/getcourses/" + location.search.substring(0);
    var data = await get(url);
    return data.courses;
    return coursesExample;
}

function get(url) {
    return new Promise(async (resolve, reject) => {
        fetch(await fullUrl(url))
            .then((res) => res.json())
            .then((json) => {
                resolve(json);
            })
            .catch((err) => reject(err));
    });
}

function fullUrl(url) {
    return new Promise((resolve, reject) => {
        //resolve("http://127.0.0.1:5000" + url);
        resolve("https://coursehawk.herokuapp.com" + url);
    });
}
