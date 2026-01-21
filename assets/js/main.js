/* eslint-disable no-console */

const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, String(v));
  }
  for (const c of children) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return node;
}

function icon(name) {
  const icons = {
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.6 13.4a1 1 0 0 0 1.4 1.4l4.95-4.95a3 3 0 0 0-4.24-4.24l-2.12 2.12a1 1 0 1 0 1.42 1.42l2.12-2.12a1 1 0 0 1 1.4 1.4l-4.95 4.95z"/><path fill="currentColor" d="M13.4 10.6a1 1 0 0 0-1.4-1.4L7.05 14.15a3 3 0 0 0 4.24 4.24l2.12-2.12a1 1 0 1 0-1.42-1.42l-2.12 2.12a1 1 0 0 1-1.4-1.4l4.95-4.95z"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/><path fill="currentColor" d="M5 5h6v2H7v10h10v-4h2v6H5V5z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 14.6A8.5 8.5 0 0 1 9.4 3a7 7 0 1 0 11.6 11.6z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm10-9a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zM5 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm14.07-7.07a1 1 0 0 1 0 1.41l-1.41 1.41a1 1 0 1 1-1.41-1.41l1.41-1.41a1 1 0 0 1 1.41 0zM7.76 17.66a1 1 0 0 1 0 1.41l-1.41 1.41a1 1 0 1 1-1.41-1.41l1.41-1.41a1 1 0 0 1 1.41 0zm11.31 1.41a1 1 0 0 1-1.41 0l-1.41-1.41a1 1 0 1 1 1.41-1.41l1.41 1.41a1 1 0 0 1 0 1.41zM7.76 6.34a1 1 0 0 1-1.41 0L4.94 4.93a1 1 0 1 1 1.41-1.41l1.41 1.41a1 1 0 0 1 0 1.41z"/></svg>'
  };
  return icons[name] || icons.external;
}

function renderLinks(links) {
  const container = qs('#quickLinks');
  if (!container) return;
  container.innerHTML = '';

  for (const l of links || []) {
    const lower = String(l.label || '').toLowerCase();
    const ico = lower.includes('email') ? 'email' : 'link';
    const isHttp = String(l.url || '').startsWith('http');

    const a = el('a', {
      class: 'pill',
      href: l.url,
      target: isHttp ? '_blank' : undefined,
      rel: isHttp ? 'noreferrer' : undefined
    }, [
      el('span', { class: 'pill__ico', html: icon(ico) }),
      el('span', {}, [l.label]),
      el('span', { class: 'pill__ext', html: icon('external') })
    ]);

    container.appendChild(a);
  }
}

function renderTimeline(items, mountId) {
  const mount = qs(mountId);
  if (!mount) return;
  mount.innerHTML = '';

  for (const it of items || []) {
    const title = it.school ? it.school : it.title;
    const sub = it.school ? it.degree : '';
    const right = `${it.dates}${it.location ? ' · ' + it.location : ''}`;

    const bullets = (it.details || it.highlights || []).map(x => el('li', {}, [x]));

    mount.appendChild(
      el('div', { class: 'card timelineItem' }, [
        el('div', { class: 'timelineItem__top' }, [
          el('div', {}, [
            el('div', { class: 'timelineItem__title' }, [title]),
            sub ? el('div', { class: 'timelineItem__sub' }, [sub]) : el('div')
          ]),
          el('div', { class: 'timelineItem__dates' }, [right])
        ]),
        bullets.length ? el('ul', { class: 'timelineItem__bullets' }, bullets) : el('div')
      ])
    );
  }
}

function renderPublications(pubs) {
  const mount = qs('#pubList');
  if (!mount) return;
  mount.innerHTML = '';

  const sorted = [...(pubs || [])].sort((a, b) => {
    const ya = Number(a.year || 0);
    const yb = Number(b.year || 0);
    if (yb !== ya) return yb - ya;
    return String(a.title || '').localeCompare(String(b.title || ''));
  });

  for (const p of sorted) {
    const href = p.pdf ? `assets/papers/${p.pdf}` : null;

    const titleNode = href
      ? el('a', { class: 'pubTitleLink', href, target: '_blank', rel: 'noreferrer' }, [p.title])
      : el('span', { class: 'pubTitleLink is-disabled' }, [p.title]);

    mount.appendChild(
      el('article', { class: 'card' }, [
        el('h3', { class: 'card__title' }, [titleNode]),
        el('div', { class: 'card__meta' }, [`${p.venue} · ${p.year}`]),
        el('div', { class: 'card__meta' }, [p.authors])
      ])
    );
  }
}

function renderExperience(exp) {
  const mount = qs('#expList');
  if (!mount) return;
  mount.innerHTML = '';

  const addSection = (label) => {
    mount.appendChild(el('h3', { class: 'expSectionTitle' }, [label]));
  };

  const renderResearchOrg = (e) => {
    const top = el('div', { class: 'expOrg__top' }, [
      el('div', { class: 'expOrg__title' }, [`${e.role} at ${e.org}`]),
      el('div', { class: 'expOrg__dates' }, [e.dates])
    ]);

    const focus = e.focus
      ? el('div', { class: 'expOrg__focus' }, [el('em', {}, [`Focus: ${e.focus}`])])
      : el('div');

    const projects = el('div', { class: 'expProjects' }, (e.projects || []).map(pr => {
      const header = el('div', { class: 'expProject__header' }, [
        el('div', { class: 'expProject__name' }, [
          el('span', { class: 'expProject__label' }, ['Research: ']),
          el('span', { class: 'expProject__title' }, [pr.name]),
          pr.status ? el('span', { class: 'expProject__status' }, [` ${pr.status}`]) : el('span')
        ])
      ]);

      const bullets = el('ul', { class: 'expBullets' }, (pr.bullets || []).map(b => el('li', {}, [b])));

      return el('div', { class: 'expProject' }, [header, bullets]);
    }));

    return el('div', { class: 'card expOrg' }, [top, focus, projects]);
  };

  const renderInternship = (e) => {
    const top = el('div', { class: 'expOrg__top' }, [
      el('div', { class: 'expOrg__title' }, [`${e.role} at ${e.org}`]),
      el('div', { class: 'expOrg__dates' }, [e.dates])
    ]);

    const bullets = el('ul', { class: 'expBullets' }, (e.bullets || []).map(b => el('li', {}, [b])));

    return el('div', { class: 'card expOrg' }, [top, bullets]);
  };

  if (exp && Array.isArray(exp.research) && exp.research.length) {
    addSection('Research Experience');
    for (const e of exp.research) mount.appendChild(renderResearchOrg(e));
  }

  if (exp && Array.isArray(exp.internship) && exp.internship.length) {
    addSection('Internship Experience');
    for (const e of exp.internship) mount.appendChild(renderInternship(e));
  }
}

function renderSkills(groups) {
  const mount = qs('#skillsGrid');
  if (!mount) return;
  mount.innerHTML = '';

  for (const g of groups || []) {
    mount.appendChild(
      el('div', { class: 'card' }, [
        el('h3', { class: 'skillGroup__title' }, [g.group]),
        el('div', { class: 'skillGroup__items' }, (g.items || []).map(x => el('span', { class: 'tag' }, [x])))
      ])
    );
  }
}

function renderHonors(items) {
  const mount = qs('#honorsList');
  if (!mount) return;
  mount.innerHTML = '';

  for (const h of items || []) {
    mount.appendChild(
      el('div', { class: 'card' }, [
        el('div', { class: 'honorRow' }, [
          el('div', { class: 'honorRow__left' }, [h.title]),
          el('div', { class: 'honorRow__right' }, [`${h.org} · ${h.year}`])
        ])
      ])
    );
  }
}

function setupNav() {
  const btn = qs('#navToggle');
  const menu = qs('#navMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  qsa('a', menu).forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }));
}

function setupThemeToggle() {
  const btn = qs('#themeToggle');
  if (!btn) return;

  const root = document.documentElement;

  const apply = (theme) => {
    const t = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = t;
    localStorage.setItem('theme', t);
    btn.innerHTML = t === 'dark'
      ? `${icon('sun')}<span>Light</span>`
      : `${icon('moon')}<span>Dark</span>`;
    btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };

  const saved = localStorage.getItem('theme');
  apply(saved === 'dark' ? 'dark' : 'light');

  btn.addEventListener('click', () => {
    apply(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}

async function init() {
  setupNav();
  setupThemeToggle();

  try {
    const res = await fetch('assets/data/content.json', { cache: 'no-cache' });
    const data = await res.json();

    // Header / footer name
    qs('#brandName').textContent = data.profile.name_en;
    qs('#footerName').textContent = data.profile.name_en;
    qs('#footerYear').textContent = String(new Date().getFullYear());

    // Hero
    const nameHeading = qs('#nameHeading');
    const nameZh = qs('#nameZh');
    if (nameHeading && nameZh) {
      if (nameHeading.childNodes && nameHeading.childNodes.length) {
        nameHeading.childNodes[0].nodeValue = `${data.profile.name_en} `;
      } else {
        nameHeading.textContent = `${data.profile.name_en} `;
        nameHeading.appendChild(nameZh);
      }
      nameZh.textContent = `(${data.profile.name_zh})`;
    }
    qs('#headline').textContent = data.profile.headline;

    const about = qs('#aboutText');
    about.innerHTML = '';
    for (const p of data.profile.about || []) {
      about.appendChild(el('p', {}, [p]));
    }

    // Photo fallback
    const photo = qs('#profilePhoto');
    if (photo) {
      photo.src = data.profile.photo.src;
      photo.alt = data.profile.photo.alt;
      photo.onerror = () => {
        photo.onerror = null;
        photo.src = data.profile.photo.placeholder;
      };
    }

    renderLinks(data.profile.links);

    // Sections
    renderPublications(data.publications);
    renderTimeline(data.education, '#eduList');
    renderExperience(data.experience);
    renderSkills(data.skills);
    renderHonors(data.honors);

  } catch (e) {
    console.error('Failed to load content.json', e);
  }
}

init();
