document.getElementById('submitButton').addEventListener('click', function (event) {
    event.preventDefault();

    const oldPassword = document.getElementById('password').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('newPassword2').value.trim();

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

    alert("הסיסמה שונתה בהצלחה!");

    document.getElementById('password').value = "";
    document.getElementById('newPassword').value = "";
    document.getElementById('newPassword2').value = "";
});
