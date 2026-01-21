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
    copy: '<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm4 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h12v14z\"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 14.6A8.5 8.5 0 0 1 9.4 3a7 7 0 1 0 11.6 11.6z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm10-9a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zM5 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm14.07-7.07a1 1 0 0 1 0 1.41l-1.41 1.41a1 1 0 1 1-1.41-1.41l1.41-1.41a1 1 0 0 1 1.41 0zM7.76 17.66a1 1 0 0 1 0 1.41l-1.41 1.41a1 1 0 1 1-1.41-1.41l1.41-1.41a1 1 0 0 1 1.41 0zm11.31 1.41a1 1 0 0 1-1.41 0l-1.41-1.41a1 1 0 1 1 1.41-1.41l1.41 1.41a1 1 0 0 1 0 1.41zM7.76 6.34a1 1 0 0 1-1.41 0L4.94 4.93a1 1 0 1 1 1.41-1.41l1.41 1.41a1 1 0 0 1 0 1.41z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.26 3.38.96.1-.75.41-1.26.74-1.55-2.56-.29-5.26-1.28-5.26-5.72 0-1.26.45-2.3 1.2-3.11-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.19a11 11 0 0 1 5.82 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.65.23 2.87.12 3.17.75.81 1.2 1.85 1.2 3.11 0 4.45-2.71 5.42-5.29 5.71.42.37.8 1.1.8 2.22 0 1.6-.01 2.9-.01 3.29 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.25c0-1.25-.02-2.85-1.74-2.85-1.74 0-2 1.36-2 2.76v5.34H9.61V9h3.41v1.56h.05c.47-.9 1.62-1.85 3.33-1.85 3.56 0 4.22 2.34 4.22 5.38v6.36zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/></svg>',
    scholar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 2 7l10 5 8-4.07V13a5 5 0 1 1-10 0V9.83L4 7.2v4.65a8 8 0 1 0 16 0V7L12 2zm0 0"/></svg>',
    xhs: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h4l4 18H8l-4-18zm12 0h4l-4 18h-4l4-18z"/></svg>'
  };
  return icons[name] || icons.external;
}

function renderLinks(profile) {
  const container = qs('#quickLinks');
  if (!container) return;
  container.innerHTML = '';

  const openLinks = profile?.links_open || [];
  const copyLinks = profile?.links_copy || [];

  const getLinkIcon = (l) => {
    const lower = (l.label || '').toLowerCase();
    const url = String(l.url || '').toLowerCase();
    if (lower.includes('github') || url.includes('github')) return 'github';
    if (lower.includes('linkedin') || url.includes('linkedin')) return 'linkedin';
    if (lower.includes('scholar') || url.includes('scholar.google')) return 'scholar';
    if (lower.includes('xiaohongshu') || lower.includes('xhs')) return 'xhs';
    if (lower.includes('email') || url.startsWith('mailto:')) return 'email';
    return 'link';
  };

  const rowOpen = el('div', { class: 'linksRow linksRow--icons' });
  for (const l of openLinks) {
    const ico = getLinkIcon(l);
    const a = el('a', {
      class: 'linkIcon',
      href: l.url,
      target: '_blank',
      rel: 'noreferrer',
      'aria-label': l.label
    }, [el('span', { class: 'linkIcon__ico', html: icon(ico) })]);
    rowOpen.appendChild(a);
  }

  const rowCopy = el('div', { class: 'linksRow linksRow--icons' });
  for (const l of copyLinks) {
    const btn = el('button', {
      class: 'pill pill--copy',
      type: 'button',
      'data-copy': l.copy || '',
      'data-toast': l.toast || 'Copied'
    }, [
      el('span', { class: 'pill__ico', html: icon('copy') }),
      el('span', {}, [l.label]),
      el('span', { class: 'pill__ext', html: icon('copy') })
    ]);
    rowCopy.appendChild(btn);
  }

  container.appendChild(rowOpen);
  container.appendChild(el('div', { class: 'linksBreak', 'aria-hidden': 'true' }));
  container.appendChild(rowCopy);

  // Wire copy behavior
  qsa('[data-copy]', container).forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      const msg = btn.getAttribute('data-toast') || 'Copied';
      if (!text) {
        toast('Nothing to copy');
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        toast(msg);
      } catch (e) {
        // Fallback
        const ta = el('textarea', { style: 'position:fixed;left:-9999px;top:-9999px;' }, [text]);
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          document.execCommand('copy');
          toast(msg);
        } catch (e2) {
          toast('Copy failed');
        } finally {
          ta.remove();
        }
      }
    });
  });
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

function renderEducation(schools) {
  const mount = qs('#eduList');
  if (!mount) return;
  mount.innerHTML = '';

  for (const s of schools || []) {
    const logo = s.logo || '';
    const logoNode = logo
      ? el('img', { class: 'eduLogo__img', src: logo, alt: `${s.school} logo`, loading: 'lazy' })
      : el('div', { class: 'eduLogo__placeholder' }, ['Logo']);

    const programs = (s.programs || []).map(p => {
      const details = (p.details || []).filter(Boolean).map(d => el('li', {}, [d]));
      return el('div', { class: 'eduProg' }, [
        el('div', { class: 'eduProg__top' }, [
          el('div', { class: 'eduProg__degree' }, [p.degree]),
          el('div', { class: 'eduProg__dates' }, [p.dates])
        ]),
        details.length ? el('ul', { class: 'eduProg__details' }, details) : el('div')
      ]);
    });

    mount.appendChild(
      el('article', { class: 'card eduCard' }, [
        el('div', { class: 'eduCard__head' }, [
          el('div', { class: 'eduLogo' }, [logoNode]),
          el('div', { class: 'eduCard__school' }, [s.school])
        ]),
        el('div', { class: 'eduCard__body' }, programs)
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
    const logo = e.logo
      ? el('img', { class: 'expLogo', src: e.logo, alt: `${e.org} logo`, loading: 'lazy' })
      : null;

    const top = el('div', { class: 'expOrg__top' }, [
      el('div', { class: 'expOrg__title' }, [`${e.role} at ${e.org}`]),
      el('div', { class: 'expOrg__right' }, [
        logo || el('div'),
        el('div', { class: 'expOrg__dates' }, [e.dates])
      ])
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
    const logo = e.logo
      ? el('img', { class: 'expLogo', src: e.logo, alt: `${e.org} logo`, loading: 'lazy' })
      : null;

    const top = el('div', { class: 'expOrg__top' }, [
      el('div', { class: 'expOrg__title' }, [`${e.role} at ${e.org}`]),
      el('div', { class: 'expOrg__right' }, [
        logo || el('div'),
        el('div', { class: 'expOrg__dates' }, [e.dates])
      ])
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

  const honors = items || [];
  for (const h of honors) {
    const title = h.title || h.name || 'Honor';
    const rightParts = [];
    if (h.org) rightParts.push(h.org);
    if (h.year) rightParts.push(h.year);
    const right = rightParts.join(' · ');

    mount.appendChild(
      el('div', { class: 'card' }, [
        el('div', { class: 'honorRow' }, [
          el('div', { class: 'honorRow__left' }, [title]),
          right ? el('div', { class: 'honorRow__right' }, [right]) : el('div')
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

function toast(message) {
  const t = qs('#toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('is-visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => t.classList.remove('is-visible'), 1400);
}


async function init() {
  setupNav();
  setupThemeToggle();

  try {
    let data;
    try {
      const res = await fetch('data.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to load data.json: ${res.status}`);
      data = await res.json();
    } catch (e) {
      const res = await fetch('assets/data/content.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to load content.json: ${res.status}`);
      data = await res.json();
    }

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

    const headlineNode = qs('#headline');
    if (headlineNode) {
      headlineNode.textContent = '';
      headlineNode.classList.add('is-hidden');
    }

    const about = qs('#aboutText');
    about.innerHTML = '';
    for (const p of data.profile.about || []) {
      about.appendChild(el('p', {}, [p]));
    }
    if (data.profile.headline) {
      about.appendChild(el('h3', { class: 'hero__sectionTitle' }, ['Research Interests']));
      about.appendChild(el('p', { class: 'hero__headline' }, [data.profile.headline]));
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

    renderLinks(data.profile);

    // Sections
    renderPublications(data.publications);
    renderEducation(data.education);
    renderExperience(data.experience);
    renderSkills(data.skills);
    renderHonors(data.honors);

  } catch (e) {
    console.error('Failed to load content.json', e);
  }
}

init();
