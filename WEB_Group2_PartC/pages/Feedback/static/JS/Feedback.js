// document.getElementById('submitButton').addEventListener('click', function (event) {
//     console.log("Submit button clicked");
//
//     event.preventDefault();
//
//     const driverNameField = document.getElementById('driverName');
//     const driveDateField = document.getElementById('driveDate');
//     const driveHourField = document.getElementById('driveHour');
//     const feedbackField = document.getElementById('feedback');
//     const stars = document.querySelectorAll('.star');
//
//     const driverName = driverNameField.value.trim();
//     const driveDate = driveDateField.value;
//     const driveHour = driveHourField.value;
//     const feedback = feedbackField.value.trim();
//
//     let selectedStars = 0;
//     stars.forEach(star => {
//         if (star.classList.contains('checked')) {
//             selectedStars++;
//         }
//     });
//
//     console.log({ driverName, driveDate, driveHour, feedback, selectedStars });
//
//     let isValid = true;
//
//     driverNameField.style.borderColor = "";
//     driveDateField.style.borderColor = "";
//     driveHourField.style.borderColor = "";
//     feedbackField.style.borderColor = "";
//     document.querySelector('.star-rating').style.borderColor = "";
//
//     if (driverName === "") {
//         console.log("Driver name is empty");
//         driverNameField.style.borderColor = "red";
//         isValid = false;
//     }
//     if (driveDate === "") {
//         console.log("Drive date is empty");
//         driveDateField.style.borderColor = "red";
//         isValid = false;
//     }
//     if (driveHour === "") {
//         console.log("Drive hour is empty");
//         driveHourField.style.borderColor = "red";
//         isValid = false;
//     }
//     if (feedback === "") {
//         console.log("Feedback is empty");
//         feedbackField.style.borderColor = "red";
//         isValid = false;
//     }
//     if (selectedStars === 0) {
//         console.log("No stars selected");
//         document.querySelector('.star-rating').style.borderColor = "red";
//         isValid = false;
//     }
//
//     if (!isValid) {
//         alert("יש למלא את כל השדות.");
//         return;
//     }
//
//     const hebrewNameRegex = /^[א-ת\s]+$/;
//     if (!hebrewNameRegex.test(driverName)) {
//         alert("שם הנהג חייב להכיל רק אותיות בעברית.");
//         driverNameField.style.borderColor = "red";
//         return;
//     }
//
//     alert("משוב נשלח בהצלחה!");
//     window.location.href = "/home";
// });

document.getElementById('submitButton').addEventListener('click', async function (event) {
    event.preventDefault();

    const driverNameField = document.getElementById('driverName');
    const driveDateField = document.getElementById('driveDate');
    const driveHourField = document.getElementById('driveHour');
    const feedbackField = document.getElementById('feedback');
    const stars = document.querySelectorAll('.star');

    const driverName = driverNameField.value.trim();
    const driveDate = driveDateField.value;
    const driveHour = driveHourField.value;
    const feedback = feedbackField.value.trim();

    let selectedStars = 0;
    stars.forEach(star => {
        if (star.classList.contains('checked')) {
            selectedStars++;
        }
    });

    // בדיקות תקינות הקלט
    let isValid = true;

    // איפוס צבעי הגבול
    driverNameField.style.borderColor = "";
    driveDateField.style.borderColor = "";
    driveHourField.style.borderColor = "";
    feedbackField.style.borderColor = "";
    document.querySelector('.star-rating').style.borderColor = "";

    if (driverName === "") {
        driverNameField.style.borderColor = "red";
        isValid = false;
    }
    if (driveDate === "") {
        driveDateField.style.borderColor = "red";
        isValid = false;
    }
    if (driveHour === "") {
        driveHourField.style.borderColor = "red";
        isValid = false;
    }
    if (feedback === "") {
        feedbackField.style.borderColor = "red";
        isValid = false;
    }
    if (selectedStars === 0) {
        document.querySelector('.star-rating').style.borderColor = "red";
        isValid = false;
    }

    if (!isValid) {
        alert("יש למלא את כל השדות.");
        return;
    }

    const hebrewNameRegex = /^[א-ת\s]+$/;
    if (!hebrewNameRegex.test(driverName)) {
        alert("שם הנהג חייב להכיל רק אותיות בעברית.");
        driverNameField.style.borderColor = "red";
        return;
    }

    try {
        const response = await fetch('/submit_feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                driverName,
                driveDate,
                driveHour,
                feedback,
                rating: selectedStars
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            window.location.href = "/";
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('אירעה שגיאה בשליחת המשוב. אנא נסה שוב.');
    }
});
