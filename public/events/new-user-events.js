// Authors: Sean Clayton, Ivan Wong, Alex Loomis
// Register user event
document.addEventListener('DOMContentLoaded', function () {
  const registerBtn = document.querySelector('.register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', function () {
      window.location.href = '/new-user/register';
    });
  }

  // View offices for a specific doctor event
  document.querySelectorAll(".viewDoctorLocationsBtn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const doctorId = this.getAttribute("doctorId");
      window.location.href = `/common/view-doctor-workplace/${doctorId}`;
    });
  });
});