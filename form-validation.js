function validateFormFields() {
  const required = ['pickup', 'drop', 'date', 'time', 'phone', 'name'];
  const allFilled = required.every(id => document.getElementById(id)?.value.trim() !== '');
  const button = document.getElementById('submitBtn');
  if (button) button.disabled = !allFilled;
}

window.addEventListener("load", function () {
  ['pickup', 'drop', 'date', 'time', 'phone', 'name'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', validateFormFields);
  });
  validateFormFields();
});
