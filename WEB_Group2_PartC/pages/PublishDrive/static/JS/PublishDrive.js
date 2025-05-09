function convertStartPointToHebrew(startPoint) {
    const translations = {
        "beer_sheva": "בן גוריון",
        "tel_aviv": "תל אביב",
        "jerusalem": "העברית",
        "haifa": "הטכניון"
    };
    return translations[startPoint] || startPoint; // אם הערך לא נמצא במפה, מחזירים את הערך המקורי
}
document.addEventListener("DOMContentLoaded", () => {

    const meetingPoints = {
        beer_sheva: ["שער רגר", "שער סורוקה", "שער הרכבת", "שער 90"],
        tel_aviv: ["שער אוסטריה", "שער מתיתיה", "שער רמינסיאנו", "שער פרנקל", "שער ספרא"],
        haifa: ["שער ראשי", "שער נשר", "שער קנדה"],
        jerusalem: ["שער אלכס גראס", "שער מדעי החברה", "שער מדעי הרוח", "שער בצלאל", "שער אידלסון", "שער צפוני"]
    };

    const startPoint = document.getElementById("startPoint");
    const meetingPoint = document.getElementById("meetingPoint");
    startPoint.addEventListener("change", () => {
        const selectedStart = startPoint.value;
        meetingPoint.innerHTML = '<option value="" disabled selected>בחר נקודת מפגש</option>';

        if (meetingPoints[selectedStart]) {
            meetingPoints[selectedStart].forEach(point => {
                const option = document.createElement("option");
                option.value = point;
                option.textContent = point;
                meetingPoint.appendChild(option);
            });
        }
    });

    const dateInput = document.getElementById("driveDate");
    const timeInput = document.getElementById("driveHour");

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    dateInput.min = today;

    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function updateTimeConstraints() {
        const selectedDate = dateInput.value;
        const currentTime = getCurrentTime();

        if (selectedDate === today) {
            timeInput.min = currentTime;
        } else {
            timeInput.min = "00:00";
        }
    }

    dateInput.addEventListener("change", updateTimeConstraints);

    timeInput.addEventListener("input", () => {
        const selectedDate = dateInput.value;
        const selectedTime = timeInput.value;
        const currentTime = getCurrentTime();

        if (selectedDate === today && selectedTime < currentTime) {
            alert("לא ניתן לבחור שעה מוקדמת יותר מהשעה הנוכחית.");
            timeInput.value = currentTime;
        }
    });

    const form = document.querySelector(".drive-form");
    const submitButton = document.getElementById("submitButton");

    if (!form || !submitButton) {
        console.error("Form or submit button not found.");
        return;
    }

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("Submit button clicked");

        const startPoint = document.getElementById("startPoint").value;
        const meetingPoint = document.getElementById("meetingPoint").value;
        const destination = document.getElementById("destination").value;
        const driveDate = document.getElementById("driveDate").value;
        const driveHour = document.getElementById("driveHour").value;
        const seatsAvailable = document.getElementById("seatsAvailable").value;

        const requiredFields = { startPoint, meetingPoint, destination, driveDate, driveHour, seatsAvailable };

        let allFieldsFilled = true;

        for (let field in requiredFields) {
            if (!requiredFields[field] || requiredFields[field].trim() === "") {
                allFieldsFilled = false;
                document.getElementById(field).style.borderColor = "red";
            } else {
                document.getElementById(field).style.borderColor = "";
            }
        }

        if (!allFieldsFilled) {
            console.log("Form has empty fields");
            alert("יש למלא את כל שדות החובה.");
            return;
        }

        console.log("All fields are filled.");

        const startPointHebrew = convertStartPointToHebrew(startPoint)
        console.log("Start point (ENG):", startPoint);
        console.log("Start point (HEB):", startPointHebrew);

        const driveData = {
            startPointHebrew,
            meetingPoint,
            destination,
            driveDate,
            driveHour,
            seatsAvailable
        };

        try {
            const response = await fetch("/add_drive", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(driveData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Drive successfully published");
                if (window.innerWidth >= 750) {
                    console.log("Starting animation...");
                    const loadingCar = document.getElementById("loadingCar");
                    loadingCar.style.display = "block";
                    loadingCar.style.animation = "driveCar 3s linear";

                    setTimeout(() => {
                        alert("הנסיעה פורסמה בהצלחה!");
                        window.location.href = "/home";
                    }, 3000);
                } else {
                    alert("הנסיעה פורסמה בהצלחה!");
                    window.location.href = "/home";
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("אירעה שגיאה. נסה שוב מאוחר יותר.");
            console.error(error);
        }
    });
});


// document.addEventListener("DOMContentLoaded", () => {
//
//     const meetingPoints = {
//         beer_sheva: ["שער רגר", "שער סורוקה", "שער הרכבת", "שער 90"],
//         tel_aviv: ["שער אוסטריה", "שער מתיתיה", "שער רמינסיאנו", "שער פרנקל", "שער ספרא"],
//         haifa: ["שער ראשי", "שער נשר", "שער קנדה"],
//         jerusalem: ["שער אלכס גראס", "שער מדעי החברה", "שער מדעי הרוח", "שער בצלאל", "שער אידלסון", "שער צפוני"]
//     };
//
//     const startPoint = document.getElementById("startPoint");
//     const meetingPoint = document.getElementById("meetingPoint");
//
//     startPoint.addEventListener("change", () => {
//         const selectedStart = startPoint.value;
//         meetingPoint.innerHTML = '<option value="" disabled selected>בחר נקודת מפגש</option>';
//
//         if (meetingPoints[selectedStart]) {
//             meetingPoints[selectedStart].forEach(point => {
//                 const option = document.createElement("option");
//                 option.value = point;
//                 option.textContent = point;
//                 meetingPoint.appendChild(option);
//             });
//         }
//     });
//
//     const dateInput = document.getElementById("driveDate");
//     const timeInput = document.getElementById("driveHour");
//
//     const now = new Date();
//     const today = now.toISOString().split("T")[0];
//     dateInput.min = today;
//
//     function getCurrentTime() {
//         const now = new Date();
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');
//         return `${hours}:${minutes}`;
//     }
//
//     function updateTimeConstraints() {
//         const selectedDate = dateInput.value;
//         const currentTime = getCurrentTime();
//
//         if (selectedDate === today) {
//             timeInput.min = currentTime;
//         } else {
//             timeInput.min = "00:00";
//         }
//     }
//
//     dateInput.addEventListener("change", updateTimeConstraints);
//
//     timeInput.addEventListener("input", () => {
//         const selectedDate = dateInput.value;
//         const selectedTime = timeInput.value;
//         const currentTime = getCurrentTime();
//
//         if (selectedDate === today && selectedTime < currentTime) {
//             alert("לא ניתן לבחור שעה מוקדמת יותר מהשעה הנוכחית.");
//             timeInput.value = currentTime;
//         }
//     });
//
//     const form = document.querySelector(".drive-form");
//     const submitButton = document.getElementById("submitButton");
//
//     if (!form || !submitButton) {
//         console.error("Form or submit button not found.");
//         return;
//     }
//
//     submitButton.addEventListener("click", (event) => {
//         console.log("Submit button clicked");
//
//         const requiredFields = form.querySelectorAll("input[required], select[required]");
//         let allFieldsFilled = true;
//
//         requiredFields.forEach(field => {
//             if (!field.value || field.value.trim() === "") {
//                 allFieldsFilled = false;
//                 field.style.borderColor = "red";
//             } else {
//                 field.style.borderColor = "";
//             }
//         });
//
//         if (!allFieldsFilled) {
//             console.log("Form has empty fields");
//             alert("יש למלא את כל שדות החובה.");
//         } else {
//             console.log("All fields are filled.");
//
//             if (window.innerWidth >= 750) {
//                 console.log("Starting animation...");
//                 const loadingCar = document.getElementById("loadingCar");
//                 loadingCar.style.display = "block";
//                 loadingCar.style.animation = "driveCar 3s linear";
//
//                 setTimeout(() => {
//                     alert("בקשתך נשלחה");
//                     window.location.href = "/home";
//                 }, 3000);
//             } else {
//                 alert("בקשתך נשלחה");
//                 window.location.href = "/home";
//             }
//         }
//         event.preventDefault();
//     });
// });
//
//
