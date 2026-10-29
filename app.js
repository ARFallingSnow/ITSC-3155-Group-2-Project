// Internship app — clickable prototype (vanilla JS, no build step)

const JOBS = [
  { id: 'gm', company: 'Great Match Inc.', initials: 'GM', tint: '#D6F2E2', title: 'Junior Backend Intern', location: 'Remote', industry: 'Software', skills: ['Java', 'CSS', 'Docker'],
    summary: 'Help build and ship internal services alongside the platform team.',
    desc: 'Work with the platform team on internal services: writing Java endpoints, polishing admin screens with CSS, and packaging services with Docker for deployment. You will have a mentor and weekly code reviews for the full term.' },
  { id: 'bl', company: 'Brightline Studio', initials: 'BS', tint: '#FBE7D3', title: 'Front-end Design Intern', location: 'Hybrid', industry: 'Design', skills: ['CSS', 'Figma'],
    summary: 'Turn design files into responsive pages for client sites.',
    desc: 'Pair with designers to turn Figma files into responsive, accessible pages. You will own small client updates end to end and present your work at the studio review each Friday.' },
  { id: 'nh', company: 'Northfield Health', initials: 'NH', tint: '#DCE7F7', title: 'Data Analyst Intern', location: 'On-site', industry: 'Healthcare', skills: ['Python', 'SQL'],
    summary: 'Clean and chart clinic data for the operations team.',
    desc: 'Help the operations team clean scheduling data with Python and SQL, then build simple reports that show where clinics can cut wait times.' }
];

const BASE_EVENTS = {
  23: [{ t: 'Interview — Great Match Inc.', time: '10:00 AM' }],
  27: [{ t: 'Skills course check-in', time: '4:00 PM' }],
  30: [{ t: 'Application deadline — Brightline Studio', time: '11:59 PM' }]
};
const TODAY = 20;          // October 20, 2026
const FIRST_WEEKDAY = 4;   // Oct 1, 2026 is a Thursday (Sun = 0)
const DAYS_IN_MONTH = 31;

const state = {
  screen: 'home',
  hard: ['Java', 'CSS'],
  soft: ['Team player', 'Rapid development'],
  query: '', location: 'Any', industry: 'Any',
  jobId: 'gm', course: 'Docker',
  modal: false, toast: '', day: 23, applied: [],
  notes: ['Career fair sign-ups close Friday.', 'Remind students to update their profiles before applying.']
};

// ---------- helpers ----------
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const has = (skill) => state.hard.includes(skill);
const matchText = (j) => `${j.skills.filter(has).length} of ${j.skills.length} required skills match`;
const currentJob = () => JOBS.find((j) => j.id === state.jobId) || JOBS[0];

function eventsOn(d) {
  const list = (BASE_EVENTS[d] || []).slice();
  if (d === 28) state.applied.forEach((id) => {
    const j = JOBS.find((x) => x.id === id);
    list.push({ t: `Follow up — ${j.company}`, time: '9:00 AM' });
  });
  return list;
}

function filteredJobs() {
  const q = state.query.trim().toLowerCase();
  return JOBS.filter((j) =>
    (!q || `${j.title} ${j.company} ${j.industry} ${j.skills.join(' ')}`.toLowerCase().includes(q)) &&
    (state.location === 'Any' || j.location === state.location) &&
    (state.industry === 'Any' || j.industry === state.industry));
}

function set(patch) { Object.assign(state, patch); render(); }

// ---------- icons ----------
const icon = (paths, size = 20, stroke = 'currentColor', w = 2) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  logo: icon('<path d="M7 21V5a3 3 0 0 1 3-3h4a5 5 0 0 1 0 10H7"/><path d="M11 7h3"/>', 28, '#17784F'),
  search: icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  filter: icon('<path d="M4 6h16M7 12h10M10 18h4"/>'),
  cal: icon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  user: icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  company: icon('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4"/>'),
  school: icon('<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>'),
  person: (s) => icon('<circle cx="12" cy="9" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>', s, '#1E5A84', 1.8),
  course: icon('<path d="M2 7l10-4 10 4-10 4z"/><path d="M6 9v6c3 2 9 2 12 0V9"/>', 48, '#8A3A08', 1.8)
};

// ---------- screens ----------
const CRUMBS = {
  home: 'Student · Search', adv: 'Student · Advanced search', results: 'Student · Search results',
  offer: 'Student · Internship offer', course: 'Student · Skill course', profile: 'Student · My profile',
  cal: 'Student · Calendar', company: 'Company · Profile', school: 'School · Home'
};

const jobLogo = (j, w, h, fs = 16) =>
  `<span class="logo" style="width:${w}px;height:${h}px;background:${j.tint};font-size:${fs}px">${j.initials}</span>`;

const screens = {
  home() {
    return `
    <section class="stack">
      <div class="card lg stack-sm">
        <h1 style="font-size:36px;line-height:1.15">Search for your future internship</h1>
        <p class="muted" style="font-size:17px">Search by role, company or skill.</p>
        <form class="row" data-submit="search">
          <label for="q" class="sr-only">Search internships</label>
          <input id="q" class="field" type="search" data-bind="query" value="${esc(state.query)}" placeholder="e.g. Java, design, Great Match" style="flex:1 1 280px;width:auto;font-size:16px">
          <button class="btn btn-primary" type="submit">Search</button>
        </form>
        <div><button class="link" data-go="adv">Advanced search</button></div>
      </div>
      <div class="stack-sm">
        <h2 style="font-size:20px">Recommended for you</h2>
        <div class="grid">
          ${JOBS.map((j) => `
            <button class="row-btn col" data-open="${j.id}">
              ${jobLogo(j, 44, 44)}
              <strong style="font-size:17px">${j.title}</strong>
              <span class="muted">${j.company} · ${j.location}</span>
              <span class="match">${matchText(j)}</span>
            </button>`).join('')}
        </div>
      </div>
    </section>`;
  },

  adv() {
    const opt = (vals, cur) => vals.map((v) => `<option value="${v}"${v === cur ? ' selected' : ''}>${v}</option>`).join('');
    return `
    <section class="card lg stack" style="max-width:720px">
      <h1 style="font-size:28px">Advanced search</h1>
      <form class="stack" data-submit="search">
        <div class="stack-sm" style="gap:6px">
          <label for="kw" class="label">Keywords</label>
          <input id="kw" class="field" type="text" data-bind="query" value="${esc(state.query)}" placeholder="Role, company or skill">
        </div>
        <div class="grid" style="gap:16px">
          <div class="stack-sm" style="gap:6px">
            <label for="loc" class="label">Location</label>
            <select id="loc" class="field" data-bind="location">${opt(['Any', 'Remote', 'Hybrid', 'On-site'], state.location)}</select>
          </div>
          <div class="stack-sm" style="gap:6px">
            <label for="ind" class="label">Industry</label>
            <select id="ind" class="field" data-bind="industry">${opt(['Any', 'Software', 'Design', 'Healthcare'], state.industry)}</select>
          </div>
        </div>
        <div class="row">
          <button class="btn btn-primary" type="submit">Show results</button>
          <button class="btn" type="button" data-action="resetFilters">Reset filters</button>
        </div>
      </form>
    </section>`;
  },

  results() {
    const list = filteredJobs();
    const bits = [];
    if (state.query.trim()) bits.push(`“${esc(state.query.trim())}”`);
    if (state.location !== 'Any') bits.push(state.location);
    if (state.industry !== 'Any') bits.push(state.industry);
    const summary = `${list.length} internship${list.length === 1 ? '' : 's'}${bits.length ? ' for ' + bits.join(' · ') : ''}`;
    return `
    <section class="stack-sm" style="gap:16px">
      <div class="row between" style="align-items:flex-end">
        <div><h1 style="font-size:28px">Search results</h1><p class="muted" style="margin-top:4px">${summary}</p></div>
        <button class="btn" data-go="adv">Refine search</button>
      </div>
      ${list.map((j) => `
        <button class="row-btn" data-open="${j.id}">
          ${jobLogo(j, 56, 56)}
          <span class="stack-sm" style="gap:6px;min-width:0">
            <span class="eyebrow">Internship offering</span>
            <strong style="font-size:18px">${j.title} — ${j.company}</strong>
            <span class="muted">${j.location} · ${j.industry}</span>
            <span>${j.summary}</span>
            <span class="match">${matchText(j)}</span>
          </span>
        </button>`).join('')}
      ${list.length ? '' : `
        <div class="card lg stack-sm" style="align-items:flex-start">
          <strong style="font-size:18px">No internships match that search.</strong>
          <button class="btn" data-action="resetFilters">Clear search and filters</button>
        </div>`}
    </section>`;
  },

  offer() {
    const j = currentJob();
    const applied = state.applied.includes(j.id);
    return `
    <section class="stack">
      <div><button class="link" data-go="results">← Back to results</button></div>
      <div class="card lg row" style="gap:24px">
        ${jobLogo(j, 120, 80, 24)}
        <div class="stack-sm" style="flex:1 1 260px;gap:4px">
          <button class="link tight" data-go="company" style="align-self:flex-start;font-size:17px">${j.company}</button>
          <h1 style="font-size:28px">${j.title}</h1>
          <span class="muted">${j.location} · ${j.industry}</span>
        </div>
        ${applied ? '<span class="chip ok big">Application sent</span>' : '<button class="btn btn-primary" data-action="apply">Apply</button>'}
      </div>
      <div class="grid-wide">
        <div class="card"><h2 style="font-size:20px;margin-bottom:12px">Internship description</h2><p class="body">${j.desc}</p></div>
        <div class="card stack-sm">
          <h2 style="font-size:20px">Skills required</h2>
          <p class="muted">${matchText(j)}</p>
          ${j.skills.map((k) => `
            <div class="skill-row">
              <span class="label">${k}</span>
              ${has(k)
                ? '<span class="chip ok">✓ You have this</span>'
                : `<span class="row" style="gap:12px"><span class="chip warn">Missing</span><button class="link tight" data-course="${k}">Take course</button></span>`}
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  course() {
    const c = esc(state.course);
    const done = has(state.course);
    return `
    <section class="stack" style="max-width:860px">
      <div><button class="link" data-go="offer">← Back to internship</button></div>
      <div class="card lg row" style="gap:28px">
        <div class="logo" style="width:200px;height:120px;background:#FCE3C4">${I.course}</div>
        <div class="stack-sm" style="flex:1 1 280px;gap:10px">
          <h1 style="font-size:30px">${c} Skills Course</h1>
          <p class="body">Complete this course to become certified in ${c}, and add it to your skills page.</p>
          <div>${done
            ? '<span class="chip ok big">✓ Certified — added to your profile</span>'
            : '<button class="btn btn-primary" data-action="takeCourse">Take course</button>'}</div>
        </div>
      </div>
      <div class="card">
        <h2 style="font-size:20px;margin-bottom:8px">What's in the course</h2>
        <ol style="margin:0;padding-left:20px;line-height:2">
          <li>${c} fundamentals</li><li>Hands-on project</li><li>Final assessment and certificate</li>
        </ol>
      </div>
      ${done ? `<div class="row">
        <button class="btn btn-primary" data-go="offer">Back to the internship</button>
        <button class="btn" data-go="profile">View my profile</button></div>` : ''}
    </section>`;
  },

  profile() {
    const applied = JOBS.filter((j) => state.applied.includes(j.id));
    return `
    <section class="stack">
      <div class="card lg row" style="gap:24px">
        <span class="avatar" style="width:96px;height:96px">${I.person(56)}</span>
        <div style="flex:1 1 240px"><h1 style="font-size:30px">James Parsons</h1><p class="muted" style="margin-top:4px">Student · [School name]</p></div>
        <button class="btn" data-action="openModal">Edit hard skills</button>
      </div>
      <div class="grid">
        <div class="card stack-sm"><h2 style="font-size:18px">Hard skills</h2>
          <div class="chips">${state.hard.map((h) => `<span class="chip">${esc(h)}</span>`).join('') || '<span class="muted">None yet</span>'}</div></div>
        <div class="card stack-sm"><h2 style="font-size:18px">Soft skills</h2>
          <div class="chips">${state.soft.map((h) => `<span class="chip">${esc(h)}</span>`).join('')}</div></div>
      </div>
      <div class="card"><h2 style="font-size:18px;margin-bottom:8px">Biography</h2>
        <p class="body">[Description of the student, education and work background.]</p></div>
      <div class="card stack-sm" style="gap:8px"><h2 style="font-size:18px">Applications</h2>
        ${applied.length
          ? applied.map((j) => `<button class="link" data-open="${j.id}" style="align-self:flex-start">${j.title} — ${j.company}</button>`).join('')
          : '<p class="muted">No applications yet. <button class="link" data-go="home" style="min-height:0">Find an internship</button></p>'}
      </div>
    </section>`;
  },

  cal() {
    const cells = [];
    for (let i = 0; i < FIRST_WEEKDAY; i++) cells.push('<span></span>');
    for (let d = 1; d <= DAYS_IN_MONTH; d++) {
      const ev = eventsOn(d).length > 0;
      const cls = ['day', d === state.day && 'selected', d === TODAY && 'today'].filter(Boolean).join(' ');
      cells.push(`<button class="${cls}" data-day="${d}" aria-label="October ${d}${ev ? ', has events' : ''}"><span>${d}</span>${ev ? '<span class="dot"></span>' : ''}</button>`);
    }
    const events = eventsOn(state.day);
    return `
    <section class="row" style="gap:20px;align-items:flex-start">
      <div class="card stack-sm" style="flex:3 1 460px;gap:16px">
        <h1 style="font-size:26px">October 2026</h1>
        <div class="cal-head"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
        <div class="cal-grid">${cells.join('')}</div>
      </div>
      <div class="card stack-sm" style="flex:1 1 260px">
        <h2 style="font-size:20px">October ${state.day}</h2>
        ${events.length
          ? events.map((e) => `<div class="event"><div class="label">${e.t}</div><div style="font-size:14px;color:var(--ink-2)">${e.time}</div></div>`).join('')
          : '<p class="muted">Nothing scheduled.</p>'}
      </div>
    </section>`;
  },

  company() {
    return `
    <section class="stack">
      <div class="card lg row" style="gap:24px">
        <span class="avatar" style="width:96px;height:96px;background:#D6F2E2;color:var(--ink);font-size:28px">GM</span>
        <div style="flex:1 1 240px"><h1 style="font-size:30px">Great Match Inc.</h1><p class="muted" style="margin-top:4px">Company profile · Software</p></div>
      </div>
      <div class="grid">
        <div class="card stack-sm"><h2 style="font-size:18px">Hard skills we look for</h2>
          <div class="chips"><span class="chip">Java</span><span class="chip">CSS</span><span class="chip">Docker</span></div></div>
        <div class="card stack-sm"><h2 style="font-size:18px">Soft skills we look for</h2>
          <div class="chips"><span class="chip">Team player</span><span class="chip">Clear communication</span></div></div>
      </div>
      <div class="card"><h2 style="font-size:18px;margin-bottom:8px">Biography</h2>
        <p class="body">[Description of the company, what it does and who it hires.]</p></div>
      <div class="card stack-sm" style="gap:8px"><h2 style="font-size:18px">Open internships</h2>
        <button class="link" data-open="gm" style="align-self:flex-start">Junior Backend Intern</button></div>
    </section>`;
  },

  school() {
    const mini = [];
    for (let i = 0; i < FIRST_WEEKDAY; i++) mini.push('<span></span>');
    for (let d = 1; d <= DAYS_IN_MONTH; d++) {
      const cls = [eventsOn(d).length && 'has', d === TODAY && 'today'].filter(Boolean).join(' ');
      mini.push(`<span class="${cls}">${d}</span>`);
    }
    return `
    <section class="stack">
      <h1 style="font-size:30px">[School name] — home</h1>
      <div class="row" style="gap:20px;align-items:flex-start">
        <div class="card stack-sm" style="flex:2 1 380px;gap:8px">
          <h2 style="font-size:20px;margin-bottom:4px">Students</h2>
          <button class="row-btn" data-go="profile" style="padding:14px;align-items:center">
            <span class="avatar" style="width:40px;height:40px">JP</span>
            <span class="stack-sm" style="gap:0"><strong>James Parsons</strong><span class="muted" style="font-size:14px">${esc(state.hard.join(', ') || 'No hard skills yet')}</span></span>
          </button>
          <p class="muted" style="margin-top:8px;font-size:14px">[More students appear here as they join.]</p>
        </div>
        <div class="stack" style="flex:1 1 280px">
          <div class="card stack-sm" style="gap:10px">
            <h2 style="font-size:20px">Notes</h2>
            ${state.notes.map((n) => `<div class="note">${esc(n)}</div>`).join('')}
            <form class="row" data-submit="addNote" style="gap:8px;flex-wrap:nowrap">
              <label for="note" class="sr-only">New note</label>
              <input id="note" name="note" class="field" type="text" placeholder="Add a note">
              <button class="btn" type="submit">Add</button>
            </form>
          </div>
          <div class="card stack-sm" style="gap:10px">
            <div class="row between"><h2 style="font-size:20px">October</h2><button class="link tight" data-go="cal">Open calendar</button></div>
            <div class="mini">${mini.join('')}</div>
          </div>
        </div>
      </div>
    </section>`;
  }
};

function modal() {
  if (!state.modal) return '';
  return `
  <div class="overlay" data-action="closeModal">
    <div class="card modal stack-sm" role="dialog" aria-modal="true" aria-labelledby="mt" style="gap:16px">
      <h2 id="mt" style="font-size:22px">Update hard skills</h2>
      <div class="chips">
        ${state.hard.map((h) => `<span class="chip" style="background:#FCE3C4;padding-right:4px">${esc(h)}<button class="chip-x" data-remove="${esc(h)}" aria-label="Remove ${esc(h)}">×</button></span>`).join('') || '<span class="muted">No hard skills yet</span>'}
      </div>
      <form class="row" data-submit="addSkill" style="gap:8px;flex-wrap:nowrap">
        <label for="ns" class="sr-only">New hard skill</label>
        <input id="ns" name="skill" class="field" type="text" placeholder="Add a skill, e.g. SQL" autofocus>
        <button class="btn" type="submit">Add</button>
      </form>
      <div class="row" style="justify-content:flex-end"><button class="btn btn-primary" data-action="closeModal">Save changes</button></div>
    </div>
  </div>`;
}

// ---------- render ----------
function render() {
  const s = state.screen;
  const studentFlow = ['home', 'results', 'offer', 'course'].includes(s);
  const navBtn = (go, label, ic, active) =>
    `<button class="nav${active ? ' active' : ''}" data-go="${go}"${active ? ' aria-current="page"' : ''}>${ic}${label}</button>`;

  document.getElementById('app').innerHTML = `
  <div class="shell">
    <nav class="sidebar" aria-label="Main">
      <div class="brand">${I.logo}<span>Internships</span></div>
      <div class="nav-label">Student</div>
      ${navBtn('home', 'Search', I.search, studentFlow)}
      ${navBtn('adv', 'Advanced search', I.filter, s === 'adv')}
      ${navBtn('cal', 'Calendar', I.cal, s === 'cal')}
      ${navBtn('profile', 'My profile', I.user, s === 'profile')}
      <div class="nav-label spaced">Other views</div>
      ${navBtn('company', 'Company profile', I.company, s === 'company')}
      ${navBtn('school', 'School home', I.school, s === 'school')}
    </nav>
    <div class="content">
      <header class="topbar">
        <div class="crumb">${CRUMBS[s]}</div>
        <button class="btn" data-go="profile" aria-label="Open James Parsons's profile" style="padding:0 12px 0 6px;border-radius:999px">
          <span class="avatar" style="width:32px;height:32px">${I.person(20)}</span>James P.
        </button>
      </header>
      ${state.toast ? `<div class="toast" role="status"><span>${esc(state.toast)}</span><button class="link" data-action="dismissToast">Dismiss</button></div>` : ''}
      <main>${screens[s]()}</main>
    </div>
    ${modal()}
  </div>`;

  if (state.modal) document.getElementById('ns')?.focus();
}

// ---------- actions ----------
const actions = {
  resetFilters: () => set({ query: '', location: 'Any', industry: 'Any' }),
  apply: () => {
    const j = currentJob();
    set({ applied: state.applied.concat(j.id), toast: `Application sent to ${j.company}. A follow-up was added to your calendar on Oct 28.` });
  },
  takeCourse: () => set({ hard: state.hard.concat(state.course), toast: `${state.course} added to your hard skills.` }),
  openModal: () => set({ modal: true }),
  closeModal: () => set({ modal: false }),
  dismissToast: () => set({ toast: '' })
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-go],[data-open],[data-course],[data-day],[data-remove],[data-action]');
  if (!el) return;
  // clicking inside the modal card shouldn't close it via the overlay
  if (el.classList.contains('overlay') && e.target !== el) return;
  const d = el.dataset;
  if (d.go) { set({ screen: d.go, modal: false, toast: '' }); window.scrollTo(0, 0); }
  else if (d.open) { set({ screen: 'offer', jobId: d.open, toast: '' }); window.scrollTo(0, 0); }
  else if (d.course) set({ screen: 'course', course: d.course, toast: '' });
  else if (d.day) set({ day: Number(d.day) });
  else if (d.remove) set({ hard: state.hard.filter((h) => h !== d.remove) });
  else if (d.action) actions[d.action]();
});

// Keep typed values in state without re-rendering (so inputs keep focus)
document.addEventListener('input', (e) => {
  const key = e.target.dataset.bind;
  if (key) state[key] = e.target.value;
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest('[data-submit]');
  if (!form) return;
  e.preventDefault();
  const kind = form.dataset.submit;
  if (kind === 'search') set({ screen: 'results', toast: '' });
  if (kind === 'addSkill') {
    const v = form.skill.value.trim();
    if (v && !state.hard.includes(v)) set({ hard: state.hard.concat(v) }); else render();
  }
  if (kind === 'addNote') {
    const v = form.note.value.trim();
    if (v) set({ notes: state.notes.concat(v) });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.modal) set({ modal: false });
});

render();
