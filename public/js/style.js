// vaidation------------------------------------

(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


  // Wait for the DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", function() {
    // Select all elements with the class "flash-message"
    const flashMessages = document.querySelectorAll('.flash-message');
    
    // Set a timeout to remove each flash message after 3 seconds
    setTimeout(() => {
      flashMessages.forEach(message => {
        message.style.transition = 'opacity 1s ease';
        message.style.opacity = '0';
        setTimeout(() => {
          message.remove();
        }, 1000); // Time to fully hide the element before removing it
      });
    }, 1000); // Time before starting the fade-out process
  });

// slides---------------------------------------------------------------------
var myIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  myIndex++;
  if (myIndex > x.length) {myIndex = 1}    
  x[myIndex-1].style.display = "block";  
  setTimeout(carousel, 2000); // Change image every 2 seconds
}

