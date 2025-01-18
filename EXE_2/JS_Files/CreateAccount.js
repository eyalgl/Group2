document.getElementById('submitButton').addEventListener('click', function (event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value.trim();
    const institution = document.getElementById('institution').value;

    const requiredFields = [
        { field: firstName, name: "שם פרטי" },
        { field: lastName, name: "שם משפחה" },
        { field: email, name: "דואר אלקטרוני" },
        { field: password, name: "סיסמה" },
        { field: phone, name: "מספר טלפון" },
        { field: institution, name: "מוסד אקדמי" },
    ];

    for (let field of requiredFields) {
        if (field.field === "") {
            alert(`יש למלא את השדה: ${field.name}`);
            return;
        }
    }

    const hebrewNameRegex = /^[א-ת]+$/;
    if (!hebrewNameRegex.test(firstName)) {
        alert("שם פרטי חייב להכיל רק אותיות בעברית ללא סימנים או מספרים.");
        return;
    }
    if (!hebrewNameRegex.test(lastName)) {
        alert("שם משפחה חייב להכיל רק אותיות בעברית ללא סימנים או מספרים.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("כתובת הדואר האלקטרוני אינה חוקית. יש לוודא שהיא כוללת @ ונראית כמו כתובת מייל תקינה.");
        return;
    }

    const passwordLengthRegex = /^.{8,}$/;
    const passwordUpperCaseRegex = /[A-Z]/;
    const passwordLowerCaseRegex = /[a-z]/;
    const passwordSpecialCharRegex = /[!@#$%^&*()_+=]/;
    const passwordNoHebrewRegex = /^[^\u0590-\u05FF]+$/;

    if (!passwordLengthRegex.test(password)) {
        alert("הסיסמה חייבת להכיל לפחות 8 תווים.");
        return;
    }
    if (!passwordUpperCaseRegex.test(password)) {
        alert("הסיסמה חייבת להכיל לפחות אות אנגלית גדולה אחת.");
        return;
    }
    if (!passwordLowerCaseRegex.test(password)) {
        alert("הסיסמה חייבת להכיל לפחות אות אנגלית קטנה אחת.");
        return;
    }
    if (!passwordSpecialCharRegex.test(password)) {
        alert("הסיסמה חייבת להכיל לפחות תו מיוחד אחד מבין ! @ # $ % ^ & * ) ( _ + =.");
        return;
    }
    if (!passwordNoHebrewRegex.test(password)) {
        alert("הסיסמה אינה יכולה להכיל אותיות בעברית.");
        return;
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        alert("מספר הטלפון חייב להכיל בדיוק 10 ספרות ולהתחיל בספרה 0.");
        return;
    }

    alert("ההרשמה הצליחה!");
    window.location.href = "login.html";
});
