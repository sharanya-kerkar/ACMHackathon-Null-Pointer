
// ======================================
// SUBJECT DATA (DEMO)
// ======================================

const subjects = {
    CS301: {
        name: "Data Structures",
        faculty: "Dr. Faculty One"
    },
    CS302: {
        name: "Object Oriented Programming",
        faculty: "Prof. Faculty Two"
    },
    CS303: {
        name: "Computer Organization",
        faculty: "Prof. Faculty Three"
    },
    MA301: {
        name: "Engineering Mathematics",
        faculty: "Dr. Faculty Four"
    },
    CS304: {
        name: "Database Management Systems",
        faculty: "Prof. Faculty Five"
    },
    EL301: {
        name: "Open Elective",
        faculty: "Prof. Faculty Six"
    }
};


// ======================================
// LOGIN FUNCTIONALITY
// ======================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const role = document.getElementById("role").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        if (!role || !email || !password) {
            message.textContent = "Please fill in all fields.";
            return;
        }

        if (role === "student") {

    window.location.href = "student-dashboard.html";

} else if (role === "faculty") {

    // Demo faculty login
    localStorage.setItem(
        "loggedInFaculty",
        "Prof. Faculty Two"
    );

    window.location.href = "faculty-dashboard.html";

} else if (role === "hod") {

    message.textContent =
        "HoD dashboard is coming soon.";

} else if (role === "admin") {

    message.textContent =
        "Admin dashboard is coming soon.";

}
    });

}


// ======================================
// FEEDBACK PAGE NAVIGATION
// ======================================

function startFeedback(subjectCode) {

    const url = "feedback.html?subject=" +
        encodeURIComponent(subjectCode);

    window.location.href = url;

}


// ======================================
// LOGOUT
// ======================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function() {
        window.location.href = "index.html";
    });

}


// ======================================
// FEEDBACK FORM
// ======================================

const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {

    const parameters = [
        "P1", "P2", "P3", "P4",
        "P5", "P6", "P7", "P8"
    ];

    const subjectCode =
        new URLSearchParams(window.location.search)
        .get("subject") || "CS302";

    const subject = subjects[subjectCode];

    const semester = "2026-27-S3";

    const storageKey = "facultyFeedbackDemo";

    const getResponses = () => {
        try {
            const saved = JSON.parse(
                localStorage.getItem(storageKey) || "{}"
            );

            return saved && typeof saved === "object"
                ? saved : {};
        } catch {
            return {};
        }
    };

    const responses = getResponses();

    const feedbackKey = semester + "_" + subjectCode;

    const questionLabels = {
        P1: "Create interest in the subject",
        P2: "Providing sufficient information",
        P3: "Accomplishment of course objectives",
        P4: "Practical aspects and applications",
        P5: "Communication skills",
        P6: "Encourage questioning",
        P7: "Punctuality",
        P8: "Organization of assignments and tests"
    };


    // Check subject validity

    if (!subject) {

        feedbackForm.hidden = true;

        document.getElementById("feedbackMessage").textContent =
            "Invalid subject. Please return to your dashboard.";

    } else {

        document.getElementById("subjectName").textContent =
            subject.name;

        document.getElementById("subjectCode").textContent =
            subjectCode;

        document.getElementById("facultyName").textContent =
            subject.faculty;


        // Prevent duplicate demo submissions

        if (responses[feedbackKey]) {

            feedbackForm.hidden = true;

            document.getElementById("successSection").hidden = false;

            document.querySelector("#successSection h2")
                .textContent = "Already Submitted!";

            document.querySelector("#successSection p")
                .textContent =
                "Feedback for this subject has already been submitted in this demo.";

        } else {


            // Generate rating buttons 0 to 8

            document.querySelectorAll(".rating-options")
                .forEach(container => {

                    const parameter =
                        container.dataset.parameter;

                    for (let score = 0; score <= 8; score++) {

                        const label = document.createElement("label");

                        label.className = "rating-option";

                        label.innerHTML = `
                            <input
                                type="radio"
                                name="${parameter}"
                                value="${score}"
                                required
                            >
                            <span>${score}</span>
                        `;

                        container.appendChild(label);

                    }

                });


            // Review feedback

            feedbackForm.addEventListener("submit", function(event) {

                event.preventDefault();

                const ratings = {};
                let total = 0;

                for (const parameter of parameters) {

                    const selected =
                        feedbackForm.querySelector(
                            `input[name="${parameter}"]:checked`
                        );

                    if (!selected) {

                        document.getElementById("feedbackMessage")
                            .textContent =
                            "Please rate all eight parameters.";

                        return;
                    }

                    const score = Number(selected.value);

                    ratings[parameter] = score;
                    total += score;

                }


                const average = (total / 8).toFixed(2);

                // Build review screen

                const reviewDetails =
                    document.getElementById("reviewDetails");

                reviewDetails.innerHTML = "";

                parameters.forEach(parameter => {

                    const row = document.createElement("div");

                    row.className = "review-row";

                    const label = document.createElement("span");
                    label.textContent = questionLabels[parameter];

                    const score = document.createElement("span");
                    score.className = "review-score";
                    score.textContent = ratings[parameter] + " / 8";

                    row.append(label, score);
                    reviewDetails.appendChild(row);

                });


                const averageRow = document.createElement("div");
                averageRow.className = "review-row";

                const averageLabel = document.createElement("strong");
                averageLabel.textContent = "Overall Average";

                const averageValue = document.createElement("strong");
                averageValue.className = "review-score";
                averageValue.textContent = average + " / 8";

                averageRow.append(averageLabel, averageValue);
                reviewDetails.appendChild(averageRow);


                document.getElementById("reviewSection").hidden = false;

                feedbackForm.hidden = true;

                document.getElementById("reviewSection")
                    .scrollIntoView({ behavior: "smooth" });


                // Confirm submission

                const confirmButton =
                    document.getElementById("confirmFeedback");

                confirmButton.onclick = function() {

                    // Recheck before saving

                    const latestResponses = getResponses();

                    if (latestResponses[feedbackKey]) {
                        alert("Feedback has already been submitted.");
                        return;
                    }

                    const comment =
                        document.getElementById("feedbackComment").value;

                    // Demo storage only. No student identity is stored.

                    latestResponses[feedbackKey] = {
                        subjectCode: subjectCode,
                        semester: semester,
                        ratings: ratings,
                        average: Number(average),
                        comment: comment,
                        submittedAt: new Date().toISOString()
                    };

                    try {

                        localStorage.setItem(
                            storageKey,
                            JSON.stringify(latestResponses)
                        );

                    } catch (error) {

                        alert("Unable to save feedback in this browser.");
                        return;

                    }

                    document.getElementById("reviewSection").hidden = true;

                    document.getElementById("successSection").hidden = false;

                    document.getElementById("successSection")
                        .scrollIntoView({ behavior: "smooth" });

                };


                // Edit answers

                document.getElementById("editFeedback").onclick =
                    function() {

                        document.getElementById("reviewSection").hidden = true;

                        feedbackForm.hidden = false;

                        feedbackForm.scrollIntoView({
                            behavior: "smooth"
                        });

                    };

            });

        }

    }

}


// ======================================
// DYNAMIC STUDENT DASHBOARD
// ======================================

const dashboard = document.querySelector(".dashboard-main");

if (dashboard) {

    const totalSubjects = 6;
    const semester = "2026-27-S3";

    // Load saved feedback

    let savedFeedback = {};

    try {
        savedFeedback = JSON.parse(
            localStorage.getItem("facultyFeedbackDemo") || "{}"
        ) || {};
    } catch (error) {
        console.error("Error loading feedback:", error);
    }

    let completedCount = 0;

    // Update all subject cards

    document.querySelectorAll(".subject-card")
        .forEach(card => {

            const code = card.dataset.subjectCode;
            const key = semester + "_" + code;

            const status = card.querySelector(".status");
            const button = card.querySelector(".subject-btn");

            // Preserve the three sample completed subjects
            const sampleCompleted =
                status.classList.contains("completed");

            const isSubmitted =
                Boolean(savedFeedback[key]) || sampleCompleted;

            if (isSubmitted) {

                completedCount++;

                status.textContent = "Submitted";
                status.className = "status completed";

                button.textContent = "Feedback Submitted";
                button.classList.add("done");
                button.disabled = true;
                button.onclick = null;

            } else {

                status.textContent = "Pending";
                status.className = "status pending";

                button.textContent = "Give Feedback →";
                button.classList.remove("done");
                button.disabled = false;

                button.onclick = function() {
                    startFeedback(code);
                };

            }

        });


    // Calculate statistics
    
    completedCount = document.querySelectorAll(
        ".subject-card .status.completed"
    ).length;

    const pendingCount = totalSubjects - completedCount;

    const percentage =
        (completedCount / totalSubjects) * 100;


    // Update statistics cards

    document.getElementById("totalSubjects").textContent =
        totalSubjects;

    document.getElementById("completedSubjects").textContent =
        completedCount;

    document.getElementById("pendingSubjects").textContent =
        pendingCount;

    document.getElementById("completionPercentage").textContent =
        percentage.toFixed(2).replace(/\.00$/, "") + "%";


    // Update progress bar

    document.getElementById("progressFill").style.width =
        percentage + "%";

    document.getElementById("progressCount").textContent =
        completedCount + " / " + totalSubjects;

    document.getElementById("progressText").textContent =
        percentage.toFixed(2).replace(/\.00$/, "") +
        "% of your feedback has been completed.";

}


/* =========================================
   FACULTY DASHBOARD FUNCTIONALITY
========================================= */

(function () {

    const subjectList = document.getElementById("facultySubjectList");

    // Run only on faculty dashboard
    if (!subjectList) return;

    // Get logged-in faculty
    const facultyName =
        localStorage.getItem("loggedInFaculty") ||
        "Prof. Faculty Two";

    document.getElementById("facultyDisplayName").textContent =
        facultyName;

    // Read saved feedback
    let savedFeedback = {};

    try {
        savedFeedback = JSON.parse(
            localStorage.getItem("facultyFeedbackDemo") || "{}"
        );
    } catch (error) {
        console.error("Unable to read feedback:", error);
    }

    // Find subjects assigned to this faculty
    const assignedSubjects = Object.entries(subjects).filter(
        ([code, subject]) => subject.faculty === facultyName
    );

    const assignedCodes = assignedSubjects.map(([code]) => code);

    // Get responses belonging to assigned subjects
    const responses = Object.values(savedFeedback).filter(
        response =>
            response &&
            assignedCodes.includes(response.subjectCode)
    );

    // Calculate statistics
    const totalFeedback = responses.length;

    const averageRating = totalFeedback
        ? responses.reduce(
            (sum, response) => sum + Number(response.average || 0),
            0
        ) / totalFeedback
        : 0;

    const comments = responses.filter(
        response =>
            response.comment &&
            response.comment.trim().length > 0
    );

    document.getElementById("totalFeedback").textContent =
        totalFeedback;

    document.getElementById("averageRating").textContent =
        averageRating.toFixed(2);

    document.getElementById("facultySubjects").textContent =
        assignedSubjects.length;

    document.getElementById("totalComments").textContent =
        comments.length;


    // DISPLAY ASSIGNED SUBJECTS

    subjectList.innerHTML = "";

    if (assignedSubjects.length === 0) {
        subjectList.innerHTML =
            '<div class="empty-message">No subjects assigned.</div>';
    }

    assignedSubjects.forEach(([code, subject]) => {

        const subjectResponses = responses.filter(
            response => response.subjectCode === code
        );

        const card = document.createElement("div");
        card.className = "faculty-subject-card";

        const codeLabel = document.createElement("span");
        codeLabel.className = "subject-code";
        codeLabel.textContent = code;

        const heading = document.createElement("h3");
        heading.textContent = subject.name;

        const faculty = document.createElement("p");
        faculty.textContent = "Faculty: " + subject.faculty;

        const count = document.createElement("p");
        count.textContent =
            "Feedback received: " + subjectResponses.length;

        card.append(codeLabel, heading, faculty, count);

        subjectList.appendChild(card);

    });


    // CALCULATE EIGHT PARAMETER AVERAGES

    const parameterNames = {
        P1: "Create interest in the subject",
        P2: "Providing sufficient information",
        P3: "Accomplishment of course objectives",
        P4: "Practical aspects and applications",
        P5: "Communication skills",
        P6: "Encourage questioning",
        P7: "Punctuality",
        P8: "Organization of assignments and tests"
    };

    const parameterChart =
        document.getElementById("parameterChart");
        if (!parameterChart) return;

    parameterChart.innerHTML = "";

    if (totalFeedback === 0) {

        parameterChart.innerHTML =
            '<div class="empty-message">No feedback received yet.</div>';

    } else {

        Object.entries(parameterNames).forEach(
            ([parameter, name]) => {

                let totalScore = 0;
                let scoreCount = 0;

                responses.forEach(response => {

                    const score = Number(
                        response.ratings?.[parameter]
                    );

                    if (
                        response.ratings?.[parameter] !== undefined &&
                        Number.isFinite(score)
                    ) {
                        totalScore += score;
                        scoreCount++;
                    }

                });

                const average = scoreCount
                    ? totalScore / scoreCount
                    : 0;

                const row = document.createElement("div");
                row.className = "parameter-row";

                const label = document.createElement("span");
                label.textContent = name;

                const track = document.createElement("div");
                track.className = "parameter-track";

                const fill = document.createElement("div");
                fill.className = "parameter-fill";

                fill.style.width = (average / 8 * 100) + "%";

                track.appendChild(fill);

                const scoreLabel = document.createElement("strong");
                scoreLabel.textContent = average.toFixed(2) + " / 8";

                row.append(label, track, scoreLabel);

                parameterChart.appendChild(row);

            }
        );

    }


    // DISPLAY ANONYMOUS COMMENTS

    const commentsContainer =
        document.getElementById("facultyComments");

    commentsContainer.innerHTML = "";

    if (comments.length === 0) {

        commentsContainer.innerHTML =
            '<div class="empty-message">No anonymous comments received yet.</div>';

    } else {

        comments.forEach(response => {

            const item = document.createElement("div");
            item.className = "faculty-comment-item";

            // Never display student identity
            item.textContent = response.comment;

            commentsContainer.appendChild(item);

        });

    }


    // FACULTY LOGOUT

    const logoutButton =
        document.getElementById("facultyLogout");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            localStorage.removeItem("loggedInFaculty");

            window.location.href = "index.html";

        });

    }

})();
