function formatDate(dateString) {
    if (!dateString) return "לא נמצא";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // חודשים ב-JS מתחילים מ-0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/get_my_drives");
        const data = await response.json();

        console.log("📌 נתונים מהשרת:", data);

        if (!response.ok) {
            alert("שגיאה: " + data.error);
            return;
        }

        if (!data.driverDrives || !data.passengerDrives || !data.receivedRequests) {
            alert("שגיאה: נתונים חסרים");
            return;
        }

        const driverDrivesTable = document.querySelector("#driverDrivesTable tbody");
        const passengerDrivesTable = document.querySelector("#passengerDrivesTable tbody");
        const requestsTable = document.querySelector("#requestsTable tbody");

        // **בדיקה אם האלמנטים באמת קיימים**
        if (!driverDrivesTable || !passengerDrivesTable || !requestsTable) {
            console.error("❌ שגיאה: אחד מהטבלאות לא נמצא ב-HTML. בדוק את ה-ID-ים של ה-<table>");
            return;
        }

        driverDrivesTable.innerHTML = "";
        passengerDrivesTable.innerHTML = "";
        requestsTable.innerHTML = "";


        // נסיעות בהן המשתמש הוא נהג
        if (data.driverDrives.length > 0) {
            // יצירת מפה של מספרי נסיעות
            const driveNumberMap = new Map();
            data.driverDrives.forEach((drive, index) => {
                driveNumberMap.set(drive._id, index + 1);
            });

            data.driverDrives.forEach((drive, index) => {
                const row = document.createElement("tr");
                row.setAttribute('data-drive-id', drive._id);

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${drive.start_point || "לא נמצא"}</td>
                    <td>${drive.meeting_point || "לא נמצא"}</td>
                    <td>${drive.destination || "לא נמצא"}</td>
                    <td>${formatDate(drive.drive_date)}</td>
                    <td>${drive.drive_hour || "לא נמצא"}</td>
                    <td class="seats-available">${drive.seats_available || "לא נמצא"}</td>
                    <td class="delete-column">
                        <img src="/static/Pictures/trashBin.png" alt="מחק נסיעה" class="delete-icon" data-id="${drive._id}">
                    </td>
                `;

                // הוספת אירוע למחיקת נסיעה
                row.querySelector(".delete-icon").addEventListener("click", async (event) => {
                    const driveId = event.target.getAttribute("data-id");

                    if (!driveId || driveId === "null") {
                        alert("שגיאה: לא נמצא מזהה נסיעה למחיקה.");
                        console.error("Error: Missing drive ID", driveId);
                        return;
                    }

                    const confirmDelete = confirm("האם אתה בטוח שאתה רוצה לבטל נסיעה זו?");
                    if (!confirmDelete) return;

                    try {
                        const deleteResponse = await fetch(`/delete_drive/${driveId}`, {
                            method: "DELETE"
                        });

                        const result = await deleteResponse.json();

                        if (deleteResponse.ok) {
                            alert("הנסיעה נמחקה בהצלחה!");
                            row.remove(); // מחיקת השורה מהטבלה
                        } else {
                            alert(result.error || "אירעה שגיאה בעת המחיקה.");
                        }
                    } catch (error) {
                        alert("שגיאה במחיקת הנסיעה. נסה שוב.");
                        console.error("Delete error:", error);
                    }
                });

                driverDrivesTable.appendChild(row);
            });

            // בקשות הצטרפות שהנהג קיבל
            if (data.receivedRequests.length > 0) {
                data.receivedRequests.forEach(request => {
                    const driveNumber = driveNumberMap.get(request.drive_id) || "לא נמצא";
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${driveNumber}</td>
                        <td>${request.passenger_name || "לא נמצא"}</td>
                        <td>${request.seats_requested || "לא נמצא"}</td>
                        <td>
                            <button class="approve-btn" data-request-id="${request._id}">✔ אשר</button>
                        </td>
                        <td>
                            <button class="reject-btn" data-request-id="${request._id}">❌ דחה</button>
                        </td>
                    `;

                    // הוספת אירועים לכפתורי אישור/דחייה
                    row.querySelector(".approve-btn").addEventListener("click", () => handleRequest(request._id, "approved", row));
                    row.querySelector(".reject-btn").addEventListener("click", () => handleRequest(request._id, "rejected", row));

                    requestsTable.appendChild(row);
                });
            } else {
                requestsTable.innerHTML = "<tr><td colspan='5'>אין בקשות הצטרפות</td></tr>";
            }
        } else {
            driverDrivesTable.innerHTML = "<tr><td colspan='8'>אין נסיעות שפרסמת</td></tr>";
        }

        // נסיעות בהן המשתמש הוא נוסע
        if (data.passengerDrives.length > 0) {
            data.passengerDrives.forEach(request => {
                const row = document.createElement("tr");

                // המרת הסטטוס לעברית וקביעת הקלאס המתאים
                let statusText, statusClass;
                switch(request.status) {
                    case "pending":
                        statusText = "ממתין";
                        statusClass = "status-pending";
                        break;
                    case "approved":
                        statusText = "אושר";
                        statusClass = "status-approved";
                        break;
                    case "rejected":
                        statusText = "נדחה";
                        statusClass = "status-rejected";
                        break;
                    default:
                        statusText = "לא ידוע";
                        statusClass = "";
                }

                row.innerHTML = `
                    <td>${request.driver_name || "לא נמצא"}</td>
                    <td>${request.destination || "לא נמצא"}</td>
                    <td>${formatDate(request.drive_date)}</td>
                    <td>${request.drive_hour || "לא נמצא"}</td>
                    <td><span class="status-cell ${statusClass}">${statusText}</span></td>
                `;
                passengerDrivesTable.appendChild(row);
            });
        } else {
            passengerDrivesTable.innerHTML = "<tr><td colspan='5'>אין נסיעות עליהן ביקשת להצטרף</td></tr>";
        }

    } catch (error) {
        console.error("❌ שגיאה בטעינת הנתונים:", error);
        alert("שגיאה בטעינת הנתונים.");
    }
});

// פונקציה לשליחת אישור/דחייה של בקשות הצטרפות
async function handleRequest(requestId, status, row) {
    try {
        const response = await fetch(`/update_join_request/${requestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        if (response.ok) {
            alert("הבקשה עודכנה בהצלחה!");
            row.remove();

            if (status === "approved") {
                updateDriveSeats(result.drive_id, result.new_seats_available);
            }
        } else {
            // הצגת הודעת השגיאה מהשרת
            alert(result.error || "אירעה שגיאה בעדכון הבקשה.");
        }
    } catch (error) {
        alert("שגיאה בעדכון הבקשה.");
        console.error("Error updating request:", error);
    }
}

// פונקציה שמעדכנת את מספר המקומות הפנויים ישירות בטבלה בלי רענון עמוד
function updateDriveSeats(driveId, newSeats) {
    if (!driveId) return;

    const driveRow = document.querySelector(`tr[data-drive-id='${driveId}']`);
    if (driveRow) {
        const seatsCell = driveRow.querySelector(".seats-available");
        if (seatsCell) {
            seatsCell.textContent = newSeats;
        }
    }
}

