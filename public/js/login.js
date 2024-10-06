const signupForm = document.getElementsById('signupForm');
const passwordInput = document.getElementsById('password');
const passwordHelp = document.getElementsById('passwordHelp');

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

passwordInput.addEventListener('input', function () {
    if (validatePassword(passwordInput.value)) {
        passwordHelp.classList.remove('invalid');
        passwordHelp.classList.add('valid');
        passwordHelp.textContent = 'Password meets the requirements!';
    } else {
        passwordHelp.classList.remove('valid');
        passwordHelp.classList.add('invalid');
        passwordHelp.textContent = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
    passwordHelp.style.display = 'block';
});

signupForm.addEventListener('submit', function (event) {
    if (!validatePassword(passwordInput.value)) {
        event.preventDefault();
        passwordInput.classList.add('is-invalid');
        passwordHelp.classList.add('invalid');
        passwordHelp.textContent = 'Please enter a valid password!';
        passwordHelp.style.display = 'block';
    } else {
        passwordInput.classList.remove('is-invalid');
    }
});


// login
const loginForm = document.getElementById('loginForm');
const passwordInput1 = document.getElementById('password1');
const passwordHelp1 = document.getElementById('passwordHelp1');

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

passwordInput.addEventListener('input', function () {
    if (validatePassword(passwordInput1.value)) {
        passwordHelp1.classList.remove('invalid');
        passwordHelp1.classList.add('valid');
        passwordHelp1.textContent = 'Password meets the requirements!';
    } else {
        passwordHelp1.classList.remove('valid');
        passwordHelp1.classList.add('invalid');
        passwordHelp1.textContent = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
    passwordHelp1.style.display = 'block';
});

loginForm.addEventListener('submit', function (event) {
    if (!validatePassword(passwordInput1.value)) {
        event.preventDefault();
        passwordInput1.classList.add('is-invalid');
        passwordHelp1.classList.add('invalid');
        passwordHelp1.textContent = 'Please enter a valid password!';
        passwordHelp1.style.display = 'block';
    } else {
        passwordInput1.classList.remove('is-invalid');
    }
});