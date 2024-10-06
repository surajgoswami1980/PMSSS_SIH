document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send sign-up request
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      // Show OTP verification form
      document.getElementById('otp-form').style.display = 'block';
      document.getElementById('otp-email').value = email;
      document.getElementById('signup-form').reset();
    } else {
      alert(result.message);
    }
  });