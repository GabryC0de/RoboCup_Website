
async function loadPage() {
    const token = localStorage.getItem('token'); // Get the stored token

    if (!token) {

        alert('You are not logged in!');
        window.location.href = '../login.html'; // Redirect to login page if no token
        return;
    }

    try {
        // production
        const response = await fetch('/admin', {
        // developement
        // const response = await fetch('http://127.0.0.1:3000/admin', {
            method: 'GET',
            headers: {
                'Authorization': token // Send the token in the Authorization header
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Display user data or dashboard content
            document.getElementById('dashboardContent').innerText = `Welcome, ${data.user.email}!`;
        } else {
            alert('Unauthorized. Please log yourself in.');
            window.location.href = '../login.html'; // Redirect if unauthorized
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('body').style.opacity = '0';
    document.querySelector('body').style.visibility = 'hidden';
    // Call this function when the dashboard page loads
    loadPage();
    document.querySelector('body').style.opacity = '1';
    document.querySelector('body').style.visibility = 'visible';
});
