document.querySelector('#reg-form').addEventListener('submit', async function (event) {
    // event.preventDefault(); // Prevent the form from reloading the page

    // Collect form data
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // Prepare the data object
    const formData = { name, email, password };

    try {
        // Send the form data to the Node.js backend using fetch API
        // production
        const response = await fetch('/register', {
        // developement
        // const response = await fetch('http://127.0.0.1:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData), // Convert the data to a JSON string
        });

        const result = await response.json();
        console.log(result); // Handle the response from the server
        if (result.message) alert(result.message);

    } catch (error) {
        console.error('Error:', error);
        alert('Error occurred while submitting the form.');
    }
});
