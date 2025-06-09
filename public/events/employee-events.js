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

  // View billing info for a specific patient
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

  // View appointments for a specific patient
  document.querySelectorAll('.viewPatientAppointmentsBtn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const patientId = this.getAttribute('patientId');

      if (!patientId) {
        console.error("Patient ID not found");
        return;
      }
      window.location.href = `/employee/view-patient-appointments/${patientId}`;
    });
  });

  // View appointments for a specific doctor
  document.querySelectorAll('.viewDoctorAppointmentsBtn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const doctorId = this.getAttribute('doctorId');

      if (!doctorId) {
        console.error("Doctor ID not found");
        return;
      }
      window.location.href = `/employee/view-doctor-appointments/${doctorId}`;
    });
  });

  const patientRegisterBtn = document.querySelector('.addPatientBtn');
  if (patientRegisterBtn) {
    patientRegisterBtn.addEventListener('click', function () {
      window.location.href = '/employee/register-patient-form';
    });
  }

  const addEmployeeBtn = document.querySelector('.addEmployeeBtn');
  if (addEmployeeBtn) {
    addEmployeeBtn.addEventListener('click', function () {
      window.location.href = '/employee/register-employee-form';
    });
  }

});
