// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };
  
  // Here you would typically send the form data to a server
  console.log('Form submitted:', formData);
  
  // Show success message
  alert('Takk for meldingen! Jeg vil ta kontakt så snart som mulig.');
  
  // Reset form
  contactForm.reset();
});

// Simple email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}