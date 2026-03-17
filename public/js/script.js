// Example starter JavaScript for disabling form submissions if there are invalid fields
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

// booking date
document.addEventListener("DOMContentLoaded", () => {

  const checkInInput = document.getElementById("checkInDate");
  const checkOutInput = document.getElementById("checkOutDate");

  // Today
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  // Tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

  // Set default values
  checkInInput.min = todayFormatted;
  checkInInput.value = todayFormatted;

  checkOutInput.min = tomorrowFormatted;
  checkOutInput.value = tomorrowFormatted;

  // Update checkout when checkin changes
  checkInInput.addEventListener("change", () => {
    const checkInDate = new Date(checkInInput.value);
    if (isNaN(checkInDate)) return;

    checkInDate.setDate(checkInDate.getDate() + 1);
    const minCheckOut = checkInDate.toISOString().split("T")[0];
    console.log(1);
    checkOutInput.min = minCheckOut;

    if (!checkOutInput.value || checkOutInput.value < minCheckOut) {
      checkOutInput.value = minCheckOut;
    }
  });

});
