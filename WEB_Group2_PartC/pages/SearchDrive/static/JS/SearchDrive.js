document.getElementById("searchForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const origin = document.getElementById("origin").value;
    const destination = document.querySelector("input[name='destination']:checked").value;

    const requestData = { startDate, endDate, origin, destination };

    try {
        const response = await fetch("/search_drives", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        const tableBody = document.querySelector("#searchResultsTable tbody");
        tableBody.innerHTML = ""; // ניקוי טבלה לפני הצגת תוצאות חדשות

        if (data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='8'>לא נמצאו נסיעות מתאימות</td></tr>";
            return;
        }

        data.forEach(drive => {
            const row = document.createElement("tr");
            let seatsDropdown = `<select class="seat-select">`;
            seatsDropdown += `<option value="" disabled selected>כמה אנשים?</option>`;
            for (let i = 1; i <= drive.seats_available; i++) {
                seatsDropdown += `<option value="${i}">${i}</option>`;
            }
            seatsDropdown += `</select>`;

            row.innerHTML = `
                <td>${drive.driver_name}</td>
                <td>${drive.start_point}</td>
                <td>${drive.meeting_point}</td>
                <td>${drive.destination}</td>
                <td>${drive.drive_date}</td>
                <td>${drive.drive_hour}</td>
                <td>${drive.seats_available}</td>
                <td>
                    ${seatsDropdown}
                    <button class="request-join-btn" data-drive-id="${drive._id}">בקש להצטרף</button>
                </td>
            `;

            // הוספת אירוע ללחיצה על כפתור "בקש להצטרף"
            row.querySelector(".request-join-btn").addEventListener("click", async function () {
                const driveId = this.getAttribute("data-drive-id");
                const seatsRequested = row.querySelector(".seat-select").value;

                if (!seatsRequested) {
                    alert("יש לבחור מספר נוסעים להצטרפות.");
                    return;
                }

                try {
                    const requestResponse = await fetch("/request_join", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ driveId, seatsRequested })
                    });

                    const result = await requestResponse.json();

                    if (requestResponse.ok) {
                        alert("בקשתך להצטרפות נשלחה בהצלחה!");
                    } else {
                        alert(result.error || "אירעה שגיאה בבקשה.");
                    }
                } catch (error) {
                    console.error("Error sending join request:", error);
                    alert("שגיאה בשליחת הבקשה.");
                }
            });

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching search results:", error);
        alert("שגיאה בחיפוש נסיעות.");
    }
});