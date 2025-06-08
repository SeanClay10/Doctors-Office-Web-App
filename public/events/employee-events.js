// File for handling event listeners for Employee dashboard

document.addEventListener("DOMContentLoaded", function () {
  // View offices for a specific doctor event
  document.querySelectorAll(".viewDoctorLocationsBtn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const doctorId = this.getAttribute("doctorId");

      if (!doctorId) {
        console.error("Doctor ID not found.");
        return;
      }
      window.location.href = `/common/view-doctor-workplace/${doctorId}`;
    });
  });

  document.querySelectorAll('.viewPatientBillingStatementsBtn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const patientId = this.getAttribute('patientId');

      if (!patientId) {
        console.error("Patient ID not found");
        return;
      }
      window.location.href = `/employee/view-patient-bill/${patientId}`;
    });
  });
});
