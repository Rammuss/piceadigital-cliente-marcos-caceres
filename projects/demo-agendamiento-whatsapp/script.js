const form = document.querySelector('#booking-form');
const steps = [...document.querySelectorAll('.booking-step')];
const stepNumber = document.querySelector('#step-number');
const date = document.querySelector('#date');
const time = document.querySelector('#time');
let currentStep = 1;

date.min = new Date().toISOString().split('T')[0];

function showStep(step) {
  currentStep = step;
  steps.forEach((item) => item.classList.toggle('is-active', Number(item.dataset.step) === step));
  stepNumber.textContent = step;
  document.querySelector('#booking-title').textContent = step === 1 ? 'Eleg\u00ed una fecha' : step === 2 ? 'Eleg\u00ed un horario' : 'Complet\u00e1 tus datos';
}

document.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', () => {
  if (currentStep === 1 && !date.reportValidity()) return;
  if (currentStep === 2 && !time.value) { alert('Eleg\u00ed un horario preferido.'); return; }
  showStep(currentStep + 1);
}));

document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showStep(currentStep - 1)));

document.querySelectorAll('.time').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.time').forEach((item) => item.classList.remove('is-selected'));
  button.classList.add('is-selected');
  time.value = button.dataset.time;
}));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = `Hola, quiero solicitar un turno.\n\n*Nombre:* ${data.get('name')}\n*Tel\u00e9fono:* ${data.get('phone')}\n*Fecha preferida:* ${data.get('date')}\n*Horario preferido:* ${data.get('time')}\n*Motivo:* ${data.get('reason') || 'No especificado'}\n\nQuedo atento/a a la confirmaci\u00f3n.`;
  window.open(`https://wa.me/595971292400?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
