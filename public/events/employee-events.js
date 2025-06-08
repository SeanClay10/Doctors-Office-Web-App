// File for handling event listeners for Employee dashboard

document.addEventListener("DOMContentLoaded", function () {
  // View offices for a specific doctor event
  document.querySelectorAll(".viewDoctorLocationsBtn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const doctorId = this.getAttribute("doctorId");
      window.location.href = `/common/view-doctor-workplace/${doctorId}`;
    });
  });
});
