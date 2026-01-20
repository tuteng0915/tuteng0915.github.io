/* eslint-disable no-console */

const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, String(v));
  }
  for (const c of children) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return node;
}

function icon(name) {
  // Minimal inline icons to avoid external deps.
  const icons = {
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.6 13.4a1 1 0 0 0 1.4 1.4l4.95-4.95a3 3 0 0 0-4.24-4.24l-2.12 2.12a1 1 0 1 0 1.42 1.42l2.12-2.12a1 1 0 0 1 1.4 1.4l-4.95 4.95z"/><path fill="currentColor" d="M13.4 10.6a1 1 0 0 0-1.4-1.4L7.05 14.15a3 3 0 0 0 4.24 4.24l2.12-2.12a1 1 0 1 0-1.42-1.42l-2.12 2.12a1 1 0 0 1-1.4-1.4l4.95-4.95z"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/><path fill="currentColor" d="M5 5h6v2H7v10h10v-4h2v6H5V5z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.8 21 3 12.2 3 1c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2z"/></svg>'
    ,
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 14.6A8.5 8.5 0 0 1 9.4 3a7 7 0 1 0 11.6 11.6z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm10-9a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zM5 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm14.07-7.07a1 1 0 0 1 0 1.41l-1.41 1.41a1 1 0 1 1-1.41-1.41l1.41-1.41a1 1 0 0 1 1.41 0zM7.76 17.66a1 1 0 0 1 0 1.41l-1.41 1.41a1 1 0 1 1-1.41-1.41l1.41-1.41a1 1 0 0 1 1.41 0zm11.31 1.41a1 1 0 0 1-1.41 0l-1.41-1.41a1 1 0 1 1 1.41-1.41l1.41 1.41a1 1 0 0 1 0 1.41zM7.76 6.34a1 1 0 0 1-1.41 0L4.94 4.93a1 1 0 1 1 1.41-1.41l1.41 1.41a1 1 0 0 1 0 1.41z"/></svg>'
  };
  return icons[name] || icons.external;
}

function renderLinks(links) {
  const container = qs('#quickLinks');
  container.innerHTML = '';

  for (const l of links) {
    const lower = l.label.toLowerCase();
    const ico = lower.includes('email') ? 'email' : (lower.includes('phone') ? 'phone' : 'link');
    const a = el('a', {
      class: 'pill',
      href: l.url,
      target: l.url.startsWith('http') ? '_blank' : undefined,
      rel: l.url.startsWith('http') ? 'noreferrer' : undefined
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
  mount.innerHTML = '';

  for (const it of items) {
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
  mount.innerHTML = '';

  for (const p of pubs) {
    const links = (p.links || []).map(l => {
      const isHttp = l.url.startsWith('http');
      return el('a', {
        class: 'chip',
        href: l.url,
        target: isHttp ? '_blank' : undefined,
        rel: isHttp ? 'noreferrer' : undefined
      }, [
        el('span', { html: icon(isHttp ? 'external' : 'link') }),
        l.label
      ]);
    });

    mount.appendChild(
      el('article', { class: 'card' }, [
        el('h3', { class: 'card__title' }, [p.title]),
        el('div', { class: 'card__meta' }, [`${p.venue} · ${p.year}`]),
        el('div', { class: 'card__meta' }, [p.authors]),
        links.length ? el('div', { class: 'card__links' }, links) : el('div')
      ])
    );
  }
}

function renderSkills(groups) {
  const mount = qs('#skillsGrid');
  mount.innerHTML = '';

  for (const g of groups) {
    mount.appendChild(
      el('div', { class: 'card' }, [
        el('h3', { class: 'skillGroup__title' }, [g.group]),
        el('div', { class: 'skillGroup__items' }, g.items.map(x => el('span', { class: 'tag' }, [x])))
      ])
    );
  }
}

function renderHonors(items) {
  const mount = qs('#honorsList');
  mount.innerHTML = '';

  for (const h of items) {
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

function setupPubTabs(all) {
  const peerBtn = qs('#pubTabPeer');
  const underBtn = qs('#pubTabUnder');

  const setActive = (which) => {
    const isPeer = which === 'peer';
    peerBtn.classList.toggle('is-active', isPeer);
    underBtn.classList.toggle('is-active', !isPeer);
    peerBtn.setAttribute('aria-selected', isPeer ? 'true' : 'false');
    underBtn.setAttribute('aria-selected', !isPeer ? 'true' : 'false');
    renderPublications(isPeer ? all.peer_reviewed : all.under_review);
  };

  peerBtn.addEventListener('click', () => setActive('peer'));
  underBtn.addEventListener('click', () => setActive('under'));

  setActive('peer');
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
    for (const p of data.profile.about) {
      about.appendChild(el('p', {}, [p]));
    }

    // Photo fallback
    const photo = qs('#profilePhoto');
    photo.src = data.profile.photo.src;
    photo.alt = data.profile.photo.alt;
    photo.onerror = () => {
      photo.onerror = null;
      photo.src = data.profile.photo.placeholder;
    };

    renderLinks(data.profile.links);

    // Sections
    setupPubTabs(data.publications);
    renderTimeline(data.education, '#eduList');
    renderTimeline(data.experience, '#expList');
    renderSkills(data.skills);
    renderHonors(data.honors);

  } catch (e) {
    console.error('Failed to load content.json', e);
  }
}

init();
