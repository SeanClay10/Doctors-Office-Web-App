// File for handing event listeners for Patient dashboard

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("test");

  // Handles case for no appointments
  if (!button) return;

  const ssn = document.body.dataset.ssn;

  // Listen for cancel appointment button
  button.addEventListener("click", () => {
    fetch(`/patient/delete-appointment/${ssn}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(typeof(data));
        console.log(data);
      });
  });
});
