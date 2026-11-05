const profileState = {
  name: "James Parsons",
  school: "",
  bio: "",
  interests: "",
  goals: "",
  experience: [],
  education: [],
  resume: ""
};

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[character]));

const dialog = document.querySelector(".edit-dialog");
const formFields = document.querySelector("[data-form-fields]");
const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3200);
}

function renderProfile() {
  document.querySelectorAll("[data-name]").forEach((element) => {
    element.textContent = profileState.name || "Your name";
  });
  document.querySelector("[data-school]").textContent = profileState.school || "Student profile";
  document.querySelector("[data-bio]").textContent = profileState.bio ||
    "Add a short introduction about your interests, background, and career goals.";
  const preferences = document.querySelector("[data-preferences]");
  const preferenceRows = [
    ["Career interests", profileState.interests],
    ["Career goals", profileState.goals]
  ].filter(([, value]) => value.trim());
  preferences.innerHTML = preferenceRows.map(([label, value]) =>
    `<p><strong>${label}</strong><span>${escapeHTML(value)}</span></p>`
  ).join("");
  preferences.hidden = preferenceRows.length === 0;
  document.querySelectorAll(".avatar, .button-avatar").forEach((element) => {
    const initials = profileState.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
    element.textContent = initials || "JP";
  });
  renderEntries("[data-experience-list]", profileState.experience, "experience");
  renderEntries("[data-education-list]", profileState.education, "education");
  document.querySelector("[data-resume-copy]").textContent = profileState.resume
    ? `Current resume: ${profileState.resume}`
    : "Upload a PDF or file to your latest resume to make it easy for recruiters to review your experience.";
}

function renderEntries(selector, entries, kind) {
  const container = document.querySelector(selector);
  if (!entries.length) return;

  container.innerHTML = entries.map((entry) => `
    <article class="${kind}-entry">
      <p class="entry-title">${escapeHTML(entry.title)}</p>
      <p class="entry-subtitle">${escapeHTML([entry.organization, entry.date].filter(Boolean).join(" · "))}</p>
      ${entry.description ? `<p class="detail-copy">${escapeHTML(entry.description)}</p>` : ""}
    </article>
  `).join("");
}

function field(label, name, value, options = {}) {
  const control = options.multiline
    ? `<textarea name="${name}" id="${name}" ${options.required ? "required" : ""}>${escapeHTML(value)}</textarea>`
    : `<input name="${name}" id="${name}" value="${escapeHTML(value)}" ${options.required ? "required" : ""}>`;
  return `<label class="form-field" for="${name}"><span>${label}</span>${control}${options.hint ? `<span class="field-hint">${options.hint}</span>` : ""}</label>`;
}

function openDialog(kind) {
  const configs = {
    profile: {
      title: "Edit profile",
      fields: [
        field("Full name", "name", profileState.name, { required: true }),
        field("School or institution", "school", profileState.school, { hint: "For example, UNC Charlotte" }),
        field("Biography", "bio", profileState.bio, { multiline: true, hint: "Share your interests, background, and career goals." }),
        field("Career interests", "interests", profileState.interests, { hint: "Separate interests with commas." }),
        field("Career goals", "goals", profileState.goals, { hint: "What are you working toward?" })
      ]
    },
    experience: {
      title: "Add experience",
      fields: [
        field("Role or project", "title", "", { required: true }),
        field("Organization", "organization", ""),
        field("Dates", "date", "", { hint: "For example, May 2025 – Aug 2025" }),
        field("Description", "description", "", { multiline: true })
      ]
    },
    education: {
      title: "Add education",
      fields: [
        field("School or institution", "title", "", { required: true }),
        field("Degree or program", "organization", ""),
        field("Dates", "date", "", { hint: "For example, 2024 – 2028" }),
        field("Academic highlights", "description", "", { multiline: true })
      ]
    }
  };
  const config = configs[kind];
  if (!config) return;
  document.querySelector("#dialog-title").textContent = config.title;
  formFields.innerHTML = config.fields.join("");
  dialog.dataset.formKind = kind;
  dialog.showModal();
  formFields.querySelector("input, textarea")?.focus();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  switch (button.dataset.action) {
    case "edit-profile":
      openDialog("profile");
      break;
    case "add-experience":
      openDialog("experience");
      break;
    case "add-education":
      openDialog("education");
      break;
    case "close-dialog":
      dialog.close();
      break;
    case "notifications":
      showToast("You’re all caught up on notifications.");
      break;
    case "career-guide":
      showToast("Career guide: explore resume tips, interview prep, and application best practices.");
      break;
  }
});

document.querySelector("#profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const kind = dialog.dataset.formKind;

  if (kind === "profile") {
    Object.assign(profileState, data);
    renderProfile();
    showToast("Your profile changes have been saved.");
  } else if (kind === "experience" || kind === "education") {
    profileState[kind].push(data);
    renderProfile();
    showToast(`${kind === "experience" ? "Experience" : "Education"} added to your profile.`);
  }
  dialog.close();
});

document.querySelector("#resume-upload").addEventListener("change", (event) => {
  const file = event.currentTarget.files[0];
  if (!file) return;
  profileState.resume = file.name;
  renderProfile();
  showToast(`${file.name} is ready to be added to your profile.`);
});

renderProfile();
