document.getElementById('submitButton').addEventListener('click', function (event) {
    event.preventDefault();

    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    const email = emailField.value.trim();
    const password = passwordField.value;

    let isValid = true;

    emailField.style.borderColor = "";
    passwordField.style.borderColor = "";

    if (email === "") {
        emailField.style.borderColor = "red";
        isValid = false;
    }
    if (password === "") {
        passwordField.style.borderColor = "red";
        isValid = false;
    }

    if (!isValid) {
        alert("יש למלא את כל השדות.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("כתובת הדואר האלקטרוני אינה חוקית. יש לוודא שהיא כוללת @ ונראית כמו כתובת מייל תקינה.");
        emailField.style.borderColor = "red";
        return;
    }

    const passwordLengthRegex = /^.{8,}$/;
    const passwordUpperCaseRegex = /[A-Z]/;
    const passwordLowerCaseRegex = /[a-z]/;
    const passwordSpecialCharRegex = /[!@#$%^&*()_+=]/;
    const passwordNoHebrewRegex = /^[^\u0590-\u05FF]+$/;

    if (!passwordLengthRegex.test(password)) {
        alert("הסיסמה חייבת להכיל לפחות 8 תווים.");
        passwordField.style.borderColor = "red";
        return;
    }
    if (!passwordUpperCaseRegex.test(password)) {
        alert("הסיסמה חייבת להכיל לפחות אות אנגלית גדולה אחת.");
        passwordField.style.borderColor = "red";
        return;
    }
    if (!passwordLowerCaseRegex.test(password)) {
        alert("הסיסמה חייבת להכיל לפחות אות אנגלית קטנה אחת.");
        passwordField.style.borderColor = "red";
        return;
    }
    if (!passwordSpecialCharRegex.test(password)) {
        alert("הסיסמה חייבת להכיל לפחות תו מיוחד אחד מבין ! @ # $ % ^ & * ) ( _ + =.");
        passwordField.style.borderColor = "red";
        return;
    }
    if (!passwordNoHebrewRegex.test(password)) {
        alert("הסיסמה אינה יכולה להכיל אותיות בעברית.");
        passwordField.style.borderColor = "red";
        return;
    }

    window.location.href = "Home.html";
});
