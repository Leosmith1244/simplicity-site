const form = document.getElementById('multiStepForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const stepTabs = Array.from(document.querySelectorAll('.step-tab'));
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const currentStepLabel = document.getElementById('current-step-label');
const currentStepTitle = document.getElementById('current-step-title');

let currentStep = 0;

function normalizeBookingLink() {
  const field = document.getElementById('booking-link');
  if (field && field.value.trim() && !/^https?:\/\//i.test(field.value.trim())) {
    field.value = 'https://' + field.value.trim();
  }
}

function showStep(index) {
  currentStep = index;

  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });

  stepTabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });

  const percent = Math.round(((index + 1) / steps.length) * 100);
  progressFill.style.width = percent + '%';
  progressPercent.textContent = percent + '%';

  currentStepLabel.textContent = index + 1;
  currentStepTitle.textContent = steps[index].dataset.title;

  prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
  nextBtn.style.display = index === steps.length - 1 ? 'none' : 'inline-flex';
  submitBtn.classList.toggle('submit-hidden', index !== steps.length - 1);

  const firstField = steps[index].querySelector('input, textarea, select');
  if (firstField) firstField.focus();
}

function validateStep(index) {
  const fields = Array.from(steps[index].querySelectorAll('input, textarea, select'));

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }
  return true;
}

nextBtn.addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  showStep(Math.min(currentStep + 1, steps.length - 1));
});

prevBtn.addEventListener('click', () => {
  showStep(Math.max(currentStep - 1, 0));
});

stepTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    if (index <= currentStep) {
      showStep(index);
      return;
    }
    if (validateStep(currentStep)) {
      showStep(index);
    }
  });
});

form.addEventListener('submit', (event) => {
  normalizeBookingLink();
  if (!validateStep(currentStep)) {
    event.preventDefault();
  }
});

showStep(0);
