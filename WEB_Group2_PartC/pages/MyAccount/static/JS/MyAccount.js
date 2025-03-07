document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submitButton").addEventListener("click", async function (event) {
        event.preventDefault();

        const oldPassword = document.getElementById("password").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("newPassword2").value.trim();

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("יש למלא את כל השדות.");
            return;
        }

        if (oldPassword.length < 8) {
            alert("סיסמה ישנה לא חוקית. יש לוודא שהיא כוללת לפחות 8 תווים.");
            return;
        }

        const passwordLengthRegex = /^.{8,}$/;
        const passwordUpperCaseRegex = /[A-Z]/;
        const passwordLowerCaseRegex = /[a-z]/;
        const passwordSpecialCharRegex = /[!@#$%^&*()_+=]/;
        const passwordNoHebrewRegex = /^[^\u0590-\u05FF]+$/;

        if (!passwordLengthRegex.test(newPassword)) {
            alert("הסיסמה החדשה חייבת להכיל לפחות 8 תווים.");
            return;
        }
        if (!passwordUpperCaseRegex.test(newPassword)) {
            alert("הסיסמה החדשה חייבת להכיל לפחות אות אנגלית גדולה אחת.");
            return;
        }
        if (!passwordLowerCaseRegex.test(newPassword)) {
            alert("הסיסמה החדשה חייבת להכיל לפחות אות אנגלית קטנה אחת.");
            return;
        }
        if (!passwordSpecialCharRegex.test(newPassword)) {
            alert("הסיסמה החדשה חייבת להכיל לפחות תו מיוחד אחד מבין ! @ # $ % ^ & * ) ( _ + =.");
            return;
        }
        if (!passwordNoHebrewRegex.test(newPassword)) {
            alert("הסיסמה החדשה אינה יכולה להכיל אותיות בעברית.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("אימות הסיסמה אינו תואם את הסיסמה החדשה.");
            return;
        }

        try {
            console.log("📤 שולח בקשת שינוי סיסמה לשרת...");
            console.log("נתונים נשלחים:", { oldPassword, newPassword });

            const response = await fetch("/change_password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });

            console.log("סטטוס התגובה:", response.status);

            const result = await response.json();
            console.log("📥 תגובת שרת:", result);

            if (response.ok) {
                alert(result.success);
                document.getElementById("password").value = "";
                document.getElementById("newPassword").value = "";
                document.getElementById("newPassword2").value = "";
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert("שגיאה בחיבור לשרת. נסה שוב.");
            console.error("Change password error:", error);
        }
    });

    // פונקציה לקבלת הדירוג הממוצע
    async function fetchAverageRating() {
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = await fetch("/get_average_rating");
            const data = await response.json();

            const averageRatingElement = document.getElementById("averageRating");
            if (data.error) {
                averageRatingElement.textContent = "שגיאה בטעינת הדירוג";
                console.error(data.error);
            } else {
                averageRatingElement.textContent = data.average;
            }
        } catch (error) {
            console.error("Error fetching average rating:", error);
            document.getElementById("averageRating").textContent = "שגיאה בטעינת הדירוג";
        }
    }

    // טעינת הדירוג הממוצע בעת טעינת הדף
    fetchAverageRating();
});
