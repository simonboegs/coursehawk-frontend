var container = document.querySelector(".container");
container.classList.add("slideInFromLeft");
container.addEventListener("animationend", () => {
    container.classList.remove("slideInFromLeft");
    container.removeEventListener("animationend", function () {});
});

function goBack() {
    container.classList.add("slideOutToLeft");
    container.addEventListener("animationend", () => {
        container.classList.add("invisible");
        container.classList.remove("slideOutToLeft");
        window.location.href = "index.html";
    });
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
        resolve("http://127.0.0.1:5000" + url);
    });
}

var schoolQuery = location.search.substring(1);
displaySchool(schoolQuery);

function displaySchool(school) {
    var s = school.replace(/-/g, " ").toUpperCase();
    document.getElementById("search-school").innerHTML += " " + s;
}

const form = document.getElementById("interestForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    var errorDiv = document.querySelector(".search-error");
    if (errorDiv.style.display == "block") errorDiv.style.display = "none";
    var interests = document.getElementById("interestInput").value;
    interests = interests.toLowerCase().replace(" ", "-");
    var arrowButton = document.querySelector(".arrowButton");
    var spinner = document.querySelector(".spinner");
    arrowButton.style.display = "none";
    spinner.style.display = "block";
    var courses = await getCourses(schoolQuery, interests);
    arrowButton.style.display = "block";
    spinner.style.display = "none";
    replaceTable();
    if (courses.length === 0) {
        errorDiv.style.display = "block";
        return;
    }
    createTable(courses);

    //TABLE DROPDOWNS
    const courseDivs = Array.from(document.getElementsByClassName("courseHeader"));
    courseDivs.forEach((button) => {
        button.addEventListener("click", (e) => {
            var courseBody = e.target.parentElement.parentElement.getElementsByClassName(
                "courseBody"
            )[0];
            var courseHeader = e.target.parentElement.parentElement.getElementsByClassName(
                "courseHeader"
            )[0];
            if (courseBody.className === "courseBody") {
                courseBody.className = "courseBody active";
                courseHeader.querySelector(".dropdownArrowDown").style.display = "none";
                courseHeader.querySelector(".dropdownArrowUp").style.display = "block";
            } else if (courseBody.className === "courseBody active") {
                courseBody.className = "courseBody";
                courseHeader.querySelector(".dropdownArrowUp").style.display = "none";
                courseHeader.querySelector(".dropdownArrowDown").style.display = "block";
            }
        });
    });
});

async function getCourses(school, interests) {
    // var url = "http://127.0.0.1:5000/getcourses/";
    // var urlExtended = url + "?school=" + school + "&interests=" + interests;
    var url = "/getcourses/" + "?school=" + school + "&interests=" + interests;
    var data = await get(url);
    return data.courses;
    return coursesExample;
}

function replaceTable() {
    var table = document.getElementById("courseTable");
    var tableParent = table.parentNode;
    tableParent.removeChild(table);
    var newTable = document.createElement("table");
    newTable.id = "courseTable";
    tableParent.appendChild(newTable);
}

function createTable(courses) {
    console.log("createTable()", courses);
    var table = document.getElementById("courseTable");

    for (var i = 0; i < courses.length; i++) {
        let row = table.insertRow();
        // let cell = row.insertCell();
        let cell = document.createElement("td");
        if (i % 2 == 0) cell.className = " odd";
        else cell.className = " even";
        row.appendChild(cell);
        //courseHeader
        let courseHeaderDiv = document.createElement("div");
        courseHeaderDiv.className = "courseHeader";
        cell.appendChild(courseHeaderDiv);
        //course code (subject and number)
        let courseCodeSpan = document.createElement("span");
        courseCodeSpan.className = "courseCode";
        courseCodeSpan.innerHTML = courses[i].subjectCode + " " + courses[i].number;
        courseHeaderDiv.appendChild(courseCodeSpan);
        //title
        let titleTextSpan = document.createElement("span");
        titleTextSpan.innerHTML = courses[i].title;
        courseHeaderDiv.appendChild(titleTextSpan);
        //arrow
        let arrowDownImg = document.createElement("img");
        arrowDownImg.className = "dropdownArrowDown";
        arrowDownImg.src = "images/downarrow.png";
        arrowDownImg.width = "29";
        arrowDownImg.height = "15";
        courseHeaderDiv.appendChild(arrowDownImg);
        let arrowUpImg = document.createElement("img");
        arrowUpImg.className = "dropdownArrowUp";
        arrowUpImg.src = "images/uparrow.png";
        arrowUpImg.width = "29";
        arrowUpImg.height = "15";
        courseHeaderDiv.appendChild(arrowUpImg);
        //courseBody
        let courseBodyDiv = document.createElement("div");
        courseBodyDiv.className = "courseBody";
        cell.appendChild(courseBodyDiv);
        //description
        let courseDescP = document.createElement("p");
        courseDescP.className = "courseDesc";
        courseDescP.innerHTML = courses[i].desc;
        courseBodyDiv.appendChild(courseDescP);
        //info
        let courseInfoP = document.createElement("p");
        courseInfoP.className = "courseInfo";
        courseBodyDiv.appendChild(courseInfoP);
        //info subjectFull
        let subjectStrong = document.createElement("strong");
        subjectStrong.innerHTML = "Subject: ";
        courseInfoP.appendChild(subjectStrong);
        let subjectSpan = document.createElement("span");
        subjectSpan.innerHTML = courses[i].subjectFull + " ";
        courseInfoP.appendChild(subjectSpan);
        //info units
        if (courses[i].units != undefined) {
            let unitsStrong = document.createElement("strong");
            unitsStrong.innerHTML = "Units: ";
            courseInfoP.appendChild(unitsStrong);
            let unitsSpan = document.createElement("span");
            unitsSpan.innerHTML = courses[i].units + " ";
            courseInfoP.appendChild(unitsSpan);
        } else {
            let creditsStrong = document.createElement("strong");
            creditsStrong.innerHTML = "Credits: ";
            courseInfoP.appendChild(creditsStrong);
            let creditsSpan = document.createElement("span");
            creditsSpan.innerHTML = courses[i].credits + " ";
            courseInfoP.appendChild(creditsSpan);
        }
        //info prereq
        if (courses[i].prereqs != "") {
            let prereqStrong = document.createElement("strong");
            prereqStrong.innerHTML = "Prerequisite(s): ";
            courseInfoP.appendChild(prereqStrong);
            let prereqSpan = document.createElement("span");
            prereqSpan.innerHTML = courses[i].prereqs + " ";
            courseInfoP.appendChild(prereqSpan);
        }
        //
        if (row.getBoundingClientRect().top <= window.innerHeight) {
            row.className = "visible";
            row.classList.add("animate__animated", "animate__flipInX", "animate__faster");
        } else {
            row.className = "invisible";
        }
    }
    //cell.className = "animate__animated animate__slideInLeft animate__delay-" + i + "s";
}

document.addEventListener("scroll", () => {
    var rows = Array.from(document.querySelectorAll("tr"));
    var animation = "animate__flipInX";
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].className == "invisible") {
            if (rows[i].getBoundingClientRect().top <= window.innerHeight) {
                rows[i].className = "visible";
                rows[i].classList.add("animate__animated", animation, "animate__faster");
            }
            // } else if (rows[i].classList.contains("visible")) {
            //     if (rows[i].getBoundingClientRect().bottom < 0) {
            //         rows[i].className = "invisible";
            //     }
        }
    }
});

var coursesExample = [
    {
        subjectFull: "Engineering Computer Science",
        subjectCode: "ECS",
        number: "220",
        title: "Theory of Computation",
        credits: "4",
        prereqs: "ECS 120;  ECS 122A.",
        desc:
            "Time and space complexity classes. Reductions, completeness, and the role of randomness. Logic and undecidability.",
        relevancy: 9.959455561119473,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "189K",
        title: "Special Topics in Philosophy: Logic",
        credits: "4",
        prereqs: "One course in the area of the special topic recommended.",
        desc: "Special topics in Logic.",
        relevancy: 9.627747837864971,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "113",
        title: "Metalogic",
        credits: "4",
        prereqs: "PHI 112;  MAT 108;  Or the equivalent.",
        desc:
            "The metalogic of classical propositional and first-order predicate logic.  Consistency, soundness and completeness of both propositional and predicate logic.  The Löwenheim-Skolem theorem for predicate logic. Undecidablity of predicate logic.",
        relevancy: 9.564673447436135,
    },
    {
        subjectFull: "Engineering Electrical & Computer",
        subjectCode: "EEC",
        number: "170",
        title: "Introduction to Computer Architecture",
        credits: "4",
        prereqs: "(ECS 036B or ECS 030 or ECS 034 or EEC 007);  (EEC 018 or EEC 180A).",
        desc:
            "Introduces basic aspects of computer architecture, including computer performance measurement, instruction set design, computer arithmetic, pipelined/non-pipelined implementation, and memory hierarchies (cache and virtual memory). Presents a simplified Reduced Instruction Set Computer using logic design methods from the prerequisite course. ",
        relevancy: 9.506957515610793,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "012",
        title: "Introduction to Symbolic Logic",
        credits: "4",
        prereqs: "",
        desc:
            "Syntax and semantics of the symbolic language sentence logic. Symbols of sentence logic. Translation between sentence logic and English. Truth table interpretation of sentence logic. Proof techniques.  Application of truth tables and proof techniques to arguments in English.",
        relevancy: 9.480217920724673,
    },
    {
        subjectFull: "Engineering Electrical & Computer",
        subjectCode: "EEC",
        number: "018",
        title: "Digital Systems I",
        credits: "5",
        prereqs: "ENG 017.",
        desc:
            "Introduction to digital system design including combinational logic design, sequential and asynchronous circuits, computer arithmetic, memory systems and algorithmic state machine design; computer aided design (CAD) methodologies and tools.",
        relevancy: 9.213651635807878,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "112",
        title: "Intermediate Symbolic Logic",
        credits: "4",
        prereqs: "PHI 012 C- or better;  or Consent of Instructor.",
        desc:
            "Predicate logic syntax and semantics. Transcription between predicate logic and English. Models, truth-trees, and derivations. Identity, functions, and definite descriptions. Introduction to concepts of metatheory.",
        relevancy: 8.942470970671739,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "135",
        title: "Alternative Logics",
        credits: "4",
        prereqs: "PHI 012 or MAT 108;  Or the equivalent.",
        desc:
            "Alternatives to standard truth-functional logic, including many-valued logics, intuitionist logics, relevance logics, and non-monotonic logics.",
        relevancy: 8.736777043194344,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "213",
        title: "Advanced Logic for Graduate Students",
        credits: "4",
        prereqs: "Graduate standing in Philosophy.",
        desc:
            "Intensive study of advanced logic, including set theory, metatheory of predicate logic, and modal logic.",
        relevancy: 8.443751504612083,
    },
    {
        subjectFull: "Engineering Computer Science",
        subjectCode: "ECS",
        number: "020",
        title: "Discrete Mathematics For Computer Science",
        credits: "4",
        prereqs: "MAT 016A C- or better or MAT 017A C- or better or MAT 021A C- or better.",
        desc:
            "Discrete mathematics of particular utility to computer science. Proofs by induction. Propositional and first-order logic. Sets, functions, and relations. Big-O and related notations. Recursion and solutions of recurrence relations. Combinatorics. Probability on finite probability spaces. Graph theory.",
        relevancy: 8.22000183069462,
    },
    {
        subjectFull: "Engineering Computer Science",
        subjectCode: "ECS",
        number: "220",
        title: "Theory of Computation",
        credits: "4",
        prereqs: "ECS 120;  ECS 122A.",
        desc:
            "Time and space complexity classes. Reductions, completeness, and the role of randomness. Logic and undecidability.",
        relevancy: 9.959455561119473,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "189K",
        title: "Special Topics in Philosophy: Logic",
        credits: "4",
        prereqs: "One course in the area of the special topic recommended.",
        desc: "Special topics in Logic.",
        relevancy: 9.627747837864971,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "113",
        title: "Metalogic",
        credits: "4",
        prereqs: "PHI 112;  MAT 108;  Or the equivalent.",
        desc:
            "The metalogic of classical propositional and first-order predicate logic.  Consistency, soundness and completeness of both propositional and predicate logic.  The Löwenheim-Skolem theorem for predicate logic. Undecidablity of predicate logic.",
        relevancy: 9.564673447436135,
    },
    {
        subjectFull: "Engineering Electrical & Computer",
        subjectCode: "EEC",
        number: "170",
        title: "Introduction to Computer Architecture",
        credits: "4",
        prereqs: "(ECS 036B or ECS 030 or ECS 034 or EEC 007);  (EEC 018 or EEC 180A).",
        desc:
            "Introduces basic aspects of computer architecture, including computer performance measurement, instruction set design, computer arithmetic, pipelined/non-pipelined implementation, and memory hierarchies (cache and virtual memory). Presents a simplified Reduced Instruction Set Computer using logic design methods from the prerequisite course. ",
        relevancy: 9.506957515610793,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "012",
        title: "Introduction to Symbolic Logic",
        credits: "4",
        prereqs: "",
        desc:
            "Syntax and semantics of the symbolic language sentence logic. Symbols of sentence logic. Translation between sentence logic and English. Truth table interpretation of sentence logic. Proof techniques.  Application of truth tables and proof techniques to arguments in English.",
        relevancy: 9.480217920724673,
    },
    {
        subjectFull: "Engineering Electrical & Computer",
        subjectCode: "EEC",
        number: "018",
        title: "Digital Systems I",
        credits: "5",
        prereqs: "ENG 017.",
        desc:
            "Introduction to digital system design including combinational logic design, sequential and asynchronous circuits, computer arithmetic, memory systems and algorithmic state machine design; computer aided design (CAD) methodologies and tools.",
        relevancy: 9.213651635807878,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "112",
        title: "Intermediate Symbolic Logic",
        credits: "4",
        prereqs: "PHI 012 C- or better;  or Consent of Instructor.",
        desc:
            "Predicate logic syntax and semantics. Transcription between predicate logic and English. Models, truth-trees, and derivations. Identity, functions, and definite descriptions. Introduction to concepts of metatheory.",
        relevancy: 8.942470970671739,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "135",
        title: "Alternative Logics",
        credits: "4",
        prereqs: "PHI 012 or MAT 108;  Or the equivalent.",
        desc:
            "Alternatives to standard truth-functional logic, including many-valued logics, intuitionist logics, relevance logics, and non-monotonic logics.",
        relevancy: 8.736777043194344,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "213",
        title: "Advanced Logic for Graduate Students",
        credits: "4",
        prereqs: "Graduate standing in Philosophy.",
        desc:
            "Intensive study of advanced logic, including set theory, metatheory of predicate logic, and modal logic.",
        relevancy: 8.443751504612083,
    },
    {
        subjectFull: "Engineering Computer Science",
        subjectCode: "ECS",
        number: "020",
        title: "Discrete Mathematics For Computer Science",
        credits: "4",
        prereqs: "MAT 016A C- or better or MAT 017A C- or better or MAT 021A C- or better.",
        desc:
            "Discrete mathematics of particular utility to computer science. Proofs by induction. Propositional and first-order logic. Sets, functions, and relations. Big-O and related notations. Recursion and solutions of recurrence relations. Combinatorics. Probability on finite probability spaces. Graph theory.",
        relevancy: 8.22000183069462,
    },
    {
        subjectFull: "Engineering Computer Science",
        subjectCode: "ECS",
        number: "220",
        title: "Theory of Computation",
        credits: "4",
        prereqs: "ECS 120;  ECS 122A.",
        desc:
            "Time and space complexity classes. Reductions, completeness, and the role of randomness. Logic and undecidability.",
        relevancy: 9.959455561119473,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "189K",
        title: "Special Topics in Philosophy: Logic",
        credits: "4",
        prereqs: "One course in the area of the special topic recommended.",
        desc: "Special topics in Logic.",
        relevancy: 9.627747837864971,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "113",
        title: "Metalogic",
        credits: "4",
        prereqs: "PHI 112;  MAT 108;  Or the equivalent.",
        desc:
            "The metalogic of classical propositional and first-order predicate logic.  Consistency, soundness and completeness of both propositional and predicate logic.  The Löwenheim-Skolem theorem for predicate logic. Undecidablity of predicate logic.",
        relevancy: 9.564673447436135,
    },
    {
        subjectFull: "Engineering Electrical & Computer",
        subjectCode: "EEC",
        number: "170",
        title: "Introduction to Computer Architecture",
        credits: "4",
        prereqs: "(ECS 036B or ECS 030 or ECS 034 or EEC 007);  (EEC 018 or EEC 180A).",
        desc:
            "Introduces basic aspects of computer architecture, including computer performance measurement, instruction set design, computer arithmetic, pipelined/non-pipelined implementation, and memory hierarchies (cache and virtual memory). Presents a simplified Reduced Instruction Set Computer using logic design methods from the prerequisite course. ",
        relevancy: 9.506957515610793,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "012",
        title: "Introduction to Symbolic Logic",
        credits: "4",
        prereqs: "",
        desc:
            "Syntax and semantics of the symbolic language sentence logic. Symbols of sentence logic. Translation between sentence logic and English. Truth table interpretation of sentence logic. Proof techniques.  Application of truth tables and proof techniques to arguments in English.",
        relevancy: 9.480217920724673,
    },
    {
        subjectFull: "Engineering Electrical & Computer",
        subjectCode: "EEC",
        number: "018",
        title: "Digital Systems I",
        credits: "5",
        prereqs: "ENG 017.",
        desc:
            "Introduction to digital system design including combinational logic design, sequential and asynchronous circuits, computer arithmetic, memory systems and algorithmic state machine design; computer aided design (CAD) methodologies and tools.",
        relevancy: 9.213651635807878,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "112",
        title: "Intermediate Symbolic Logic",
        credits: "4",
        prereqs: "PHI 012 C- or better;  or Consent of Instructor.",
        desc:
            "Predicate logic syntax and semantics. Transcription between predicate logic and English. Models, truth-trees, and derivations. Identity, functions, and definite descriptions. Introduction to concepts of metatheory.",
        relevancy: 8.942470970671739,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "135",
        title: "Alternative Logics",
        credits: "4",
        prereqs: "PHI 012 or MAT 108;  Or the equivalent.",
        desc:
            "Alternatives to standard truth-functional logic, including many-valued logics, intuitionist logics, relevance logics, and non-monotonic logics.",
        relevancy: 8.736777043194344,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "213",
        title: "Advanced Logic for Graduate Students",
        credits: "4",
        prereqs: "Graduate standing in Philosophy.",
        desc:
            "Intensive study of advanced logic, including set theory, metatheory of predicate logic, and modal logic.",
        relevancy: 8.443751504612083,
    },
    {
        subjectFull: "Engineering Computer Science",
        subjectCode: "ECS",
        number: "020",
        title: "Discrete Mathematics For Computer Science",
        credits: "4",
        prereqs: "MAT 016A C- or better or MAT 017A C- or better or MAT 021A C- or better.",
        desc:
            "Discrete mathematics of particular utility to computer science. Proofs by induction. Propositional and first-order logic. Sets, functions, and relations. Big-O and related notations. Recursion and solutions of recurrence relations. Combinatorics. Probability on finite probability spaces. Graph theory.",
        relevancy: 8.22000183069462,
    },
    {
        subjectFull: "Engineering Computer Science",
        subjectCode: "ECS",
        number: "220",
        title: "Theory of Computation",
        credits: "4",
        prereqs: "ECS 120;  ECS 122A.",
        desc:
            "Time and space complexity classes. Reductions, completeness, and the role of randomness. Logic and undecidability.",
        relevancy: 9.959455561119473,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "189K",
        title: "Special Topics in Philosophy: Logic",
        credits: "4",
        prereqs: "One course in the area of the special topic recommended.",
        desc: "Special topics in Logic.",
        relevancy: 9.627747837864971,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "113",
        title: "Metalogic",
        credits: "4",
        prereqs: "PHI 112;  MAT 108;  Or the equivalent.",
        desc:
            "The metalogic of classical propositional and first-order predicate logic.  Consistency, soundness and completeness of both propositional and predicate logic.  The Löwenheim-Skolem theorem for predicate logic. Undecidablity of predicate logic.",
        relevancy: 9.564673447436135,
    },
    {
        subjectFull: "Engineering Electrical & Computer",
        subjectCode: "EEC",
        number: "170",
        title: "Introduction to Computer Architecture",
        credits: "4",
        prereqs: "(ECS 036B or ECS 030 or ECS 034 or EEC 007);  (EEC 018 or EEC 180A).",
        desc:
            "Introduces basic aspects of computer architecture, including computer performance measurement, instruction set design, computer arithmetic, pipelined/non-pipelined implementation, and memory hierarchies (cache and virtual memory). Presents a simplified Reduced Instruction Set Computer using logic design methods from the prerequisite course. ",
        relevancy: 9.506957515610793,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "012",
        title: "Introduction to Symbolic Logic",
        credits: "4",
        prereqs: "",
        desc:
            "Syntax and semantics of the symbolic language sentence logic. Symbols of sentence logic. Translation between sentence logic and English. Truth table interpretation of sentence logic. Proof techniques.  Application of truth tables and proof techniques to arguments in English.",
        relevancy: 9.480217920724673,
    },
    {
        subjectFull: "Engineering Electrical & Computer",
        subjectCode: "EEC",
        number: "018",
        title: "Digital Systems I",
        credits: "5",
        prereqs: "ENG 017.",
        desc:
            "Introduction to digital system design including combinational logic design, sequential and asynchronous circuits, computer arithmetic, memory systems and algorithmic state machine design; computer aided design (CAD) methodologies and tools.",
        relevancy: 9.213651635807878,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "112",
        title: "Intermediate Symbolic Logic",
        credits: "4",
        prereqs: "PHI 012 C- or better;  or Consent of Instructor.",
        desc:
            "Predicate logic syntax and semantics. Transcription between predicate logic and English. Models, truth-trees, and derivations. Identity, functions, and definite descriptions. Introduction to concepts of metatheory.",
        relevancy: 8.942470970671739,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "135",
        title: "Alternative Logics",
        credits: "4",
        prereqs: "PHI 012 or MAT 108;  Or the equivalent.",
        desc:
            "Alternatives to standard truth-functional logic, including many-valued logics, intuitionist logics, relevance logics, and non-monotonic logics.",
        relevancy: 8.736777043194344,
    },
    {
        subjectFull: "Philosophy",
        subjectCode: "PHI",
        number: "213",
        title: "Advanced Logic for Graduate Students",
        credits: "4",
        prereqs: "Graduate standing in Philosophy.",
        desc:
            "Intensive study of advanced logic, including set theory, metatheory of predicate logic, and modal logic.",
        relevancy: 8.443751504612083,
    },
    {
        subjectFull: "Engineering Computer Science",
        subjectCode: "ECS",
        number: "020",
        title: "Discrete Mathematics For Computer Science",
        credits: "4",
        prereqs: "MAT 016A C- or better or MAT 017A C- or better or MAT 021A C- or better.",
        desc:
            "Discrete mathematics of particular utility to computer science. Proofs by induction. Propositional and first-order logic. Sets, functions, and relations. Big-O and related notations. Recursion and solutions of recurrence relations. Combinatorics. Probability on finite probability spaces. Graph theory.",
        relevancy: 8.22000183069462,
    },
];
