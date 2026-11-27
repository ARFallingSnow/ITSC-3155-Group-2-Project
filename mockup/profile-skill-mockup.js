const hardSkills = ["Java", "CSS"];
const skillChoices = ["Docker", "Python", "Figma", "SQL", "JavaScript", "Java", "CSS"];
const backdrop = document.querySelector("[data-modal-backdrop]");
const skillSelect = document.querySelector("#skill-choice");
const skillCopy = document.querySelector("[data-selected-skill-copy]");
const selectionHint = document.querySelector("[data-selection-hint]");
const hardSkillsDisplay = document.querySelector("[data-hard-skills]");
const toast = document.querySelector(".toast");
const submitButton = document.querySelector('[data-action="submit-skill"]');
let toastTimer;

function renderSkills() {
  hardSkillsDisplay.textContent = hardSkills.join(" + ");
  Array.from(skillSelect.options).forEach((option) => {
    const alreadyAdded = hardSkills.includes(option.value);
    option.disabled = alreadyAdded;
    option.hidden = alreadyAdded;
  });
  const nextAvailable = Array.from(skillSelect.options).find((option) => !option.disabled);
  if (skillSelect.selectedOptions[0]?.disabled && nextAvailable) skillSelect.value = nextAvailable.value;
  submitButton.disabled = !nextAvailable;
  updateSelection();
}

function updateSelection() {
  const selectedSkill = skillSelect.value;
  skillCopy.textContent = selectedSkill;
  selectionHint.textContent = hardSkills.includes(selectedSkill)
    ? "This skill is already in your hard skills."
    : "This skill will be added to your hard skills section and visible to employers.";
}

function showDialog() {
  backdrop.hidden = false;
  skillSelect.focus();
}

function hideDialog() {
  backdrop.hidden = true;
  document.querySelector('[data-action="open-skills"]').focus();
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3200);
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "open-skills") {
    renderSkills();
    showDialog();
  } else if (action === "close-skills") {
    hideDialog();
  } else if (action === "submit-skill") {
    const selectedSkill = skillSelect.value;
    if (hardSkills.includes(selectedSkill)) {
      showToast(`${selectedSkill} is already in your hard skills.`);
      return;
    }
    hardSkills.push(selectedSkill);
    renderSkills();
    hideDialog();
    showToast(`${selectedSkill} was added to your hard skills.`);
  } else if (action === "notifications") {
    showToast("You’re all caught up on notifications.");
  }
});

skillSelect.addEventListener("change", updateSelection);

backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) hideDialog();
});

document.addEventListener("keydown", (event) => {
  if (backdrop.hidden) return;
  if (event.key === "Escape") {
    hideDialog();
    return;
  }
  if (event.key !== "Tab") return;

  const focusable = Array.from(backdrop.querySelectorAll("button:not(:disabled), select:not(:disabled)"))
    .filter((element) => element.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

renderSkills();
skillSelect.focus();
