// Register user event
document.addEventListener('DOMContentLoaded', function () {
  const registerBtn = document.querySelector('.register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', function () {
      window.location.href = '/new-user/register';
    });
  }
});