document.querySelector('#log-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  const formData = { email, password };

  try {
    // production
    const response = await fetch('/login', {
      // developement
      // const response = await fetch('http://127.0.0.1:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      // Save the JWT token to localStorage or sessionStorage
      localStorage.setItem('token', result.token);
      alert('Login successful! Redirecting to admin page...');

      // Redirect to the protected page
      window.location.href = './admin/admin.html';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
});
