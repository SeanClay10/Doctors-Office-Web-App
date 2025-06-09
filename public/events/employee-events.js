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
      const employee_fname = this.getAttribute('data-employee-fname');
      const employee_ssn = this.getAttribute('data-employee-ssn');

      if (!patientId) {
        console.error("Patient ID not found");
        return;
      }
      // Pass employee info as query parameters
      window.location.href = `/employee/view-patient-appointments/${patientId}?employee_fname=${encodeURIComponent(employee_fname)}&employee_ssn=${encodeURIComponent(employee_ssn)}`;
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

  // Add appointment
  const addBtn = document.querySelector('.add-appt-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      const patientId = this.getAttribute('data-patient-id');
      window.location.href = `/employee/add-appointment/${patientId}`;
    });
  }

  // Update appointment
  document.querySelectorAll('.update-appt-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const apptId = this.getAttribute('data-appt-id');
      const patientId = this.getAttribute('data-patient-id');
      window.location.href = `/employee/update-appointment/${apptId}/${patientId}`;
    });
  });

  // Delete appointment
  document.querySelectorAll('.cancel-appt-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
      const apptId = this.getAttribute('data-appt-id');
      const patientId = this.getAttribute('data-patient-id');
      if (confirm('Are you sure you want to cancel this appointment?')) {
        try {
          const res = await fetch(`/employee/appointment/${apptId}/${patientId}`, { method: 'DELETE' });
          if (res.ok) {
            window.location.reload();
          } else {
            alert('Failed to cancel appointment.');
          }
        } catch (err) {
          alert('Error cancelling appointment.');
        }
      }
    });
  });
});
