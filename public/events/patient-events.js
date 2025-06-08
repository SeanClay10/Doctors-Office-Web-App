// File for handing event listeners for Patient dashboard

document.addEventListener('DOMContentLoaded', function () {

  // Add appointment event
  const addBtn = document.querySelector('.add-appt-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      const ssn = document.body.getAttribute('data-ssn');
      const fname = document.querySelector('h1').textContent.replace('Welcome, ', '').replace('!', '');
      window.location.href = `/patient/add-appointment/${fname}/${ssn}`;
    });
  }

  // Cancel appointment event
  document.querySelectorAll('.cancel-appt-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
      const apptId = this.getAttribute('data-appt-id');
      const ssn = document.body.getAttribute('data-ssn');
      if (confirm('Are you sure you want to cancel this appointment?')) {
        try {
          const res = await fetch(`/patient/appointment/${apptId}/${ssn}`, { method: 'DELETE' });
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

  // Update appointment event
  document.querySelectorAll('.update-appt-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const apptId = this.getAttribute('data-appt-id');
      const ssn = document.body.getAttribute('data-ssn');
      const fname = document.querySelector('h1').textContent.replace('Welcome, ', '').replace('!', '');
      window.location.href = `/patient/update-appointment/${apptId}/${fname}/${ssn}`;
    });
  });

  document.querySelectorAll('.viewDoctorLocationsBtn').forEach(btn => {
    btn.addEventListener('click', function () {
      const doctorId = this.getAttribute('doctorId');
      window.location.href = `/patient/view-doctor-workplace/${doctorId}`;
    });
  });
});


