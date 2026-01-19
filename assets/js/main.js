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
    const header = it.school
      ? `${it.school} · ${it.degree}`
      : it.title;
    const meta = it.school
      ? `${it.dates}${it.location ? ' · ' + it.location : ''}`
      : `${it.dates}${it.location ? ' · ' + it.location : ''}`;

    const details = (it.details || it.highlights || []).map(x => el('li', {}, [x]));

    mount.appendChild(
      el('div', { class: 'card timeline__item' }, [
        el('div', { class: 'timeline__top' }, [
          el('div', { class: 'timeline__title' }, [header]),
          el('div', { class: 'timeline__meta' }, [meta])
        ]),
        details.length
          ? el('ul', { class: 'list' }, details)
          : el('div')
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
        class: 'pub__link',
        href: l.url,
        target: isHttp ? '_blank' : undefined,
        rel: isHttp ? 'noreferrer' : undefined
      }, [
        el('span', { class: 'pub__linkIco', html: icon(isHttp ? 'external' : 'link') }),
        el('span', {}, [l.label])
      ]);
    });

    mount.appendChild(
      el('article', { class: 'card pub' }, [
        el('div', { class: 'pub__top' }, [
          el('h3', { class: 'pub__title' }, [p.title]),
          el('div', { class: 'pub__meta' }, [`${p.venue} · ${p.year}`])
        ]),
        el('div', { class: 'pub__authors' }, [p.authors]),
        links.length ? el('div', { class: 'pub__links' }, links) : el('div')
      ])
    );
  }
}

function renderSkills(groups) {
  const mount = qs('#skillsGrid');
  mount.innerHTML = '';

  for (const g of groups) {
    mount.appendChild(
      el('div', { class: 'card skill' }, [
        el('div', { class: 'skill__title' }, [g.group]),
        el('div', { class: 'skill__items' }, g.items.map(x => el('span', { class: 'chip' }, [x])))
      ])
    );
  }
}

function renderHonors(items) {
  const mount = qs('#honorsList');
  mount.innerHTML = '';

  for (const h of items) {
    mount.appendChild(
      el('div', { class: 'card honor' }, [
        el('div', { class: 'honor__title' }, [h.title]),
        el('div', { class: 'honor__meta' }, [`${h.org} · ${h.year}`])
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

  try {
    const res = await fetch('assets/data/content.json', { cache: 'no-cache' });
    const data = await res.json();

    // Header / footer name
    qs('#brandName').textContent = data.profile.name_en;
    qs('#footerName').textContent = data.profile.name_en;
    qs('#footerYear').textContent = String(new Date().getFullYear());

    // Hero
    qs('#heroName').textContent = `${data.profile.name_en} (${data.profile.name_zh})`;
    qs('#heroHeadline').textContent = data.profile.headline;

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
