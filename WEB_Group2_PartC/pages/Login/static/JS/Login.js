document.getElementById("login_form").addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("HI")
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    const email = emailField.value.trim();
    const password = passwordField.value;

    const response = await fetch("/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    });

    if (response.ok) {
        window.location.href = "/";
    } else {
        const errorData = await response.json();
        alert(errorData.error)
        document.getElementById("errorMessage").innerText = errorData.error;
    }
});

