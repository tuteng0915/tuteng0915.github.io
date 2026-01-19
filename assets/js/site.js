(function(){
  const $ = (sel) => document.querySelector(sel);
  const year = new Date().getFullYear();
  $('#year').textContent = year;

  // Theme
  const THEME_KEY = 'tt_theme';
  function applyTheme(t){
    if(t === 'light') document.documentElement.setAttribute('data-theme','light');
    else document.documentElement.removeAttribute('data-theme');
  }
  const saved = localStorage.getItem(THEME_KEY);
  if(saved) applyTheme(saved);
  $('#themeToggle').addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  // Helpers
  function esc(s){
    return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function linkBtn(label, href){
    return `<a class="btn" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`;
  }
  function badge(label){
    return `<span class="badge">${esc(label)}</span>`;
  }

  // Publications toggles
  let pubMode = 'selected';
  const btnSel = $('#pubToggleSelected');
  const btnAll = $('#pubToggleAll');
  function setPubMode(mode){
    pubMode = mode;
    btnSel.setAttribute('aria-pressed', mode==='selected' ? 'true' : 'false');
    btnAll.setAttribute('aria-pressed', mode==='all' ? 'true' : 'false');
    renderPubs(window.__SITE_DATA__);
  }
  btnSel.addEventListener('click', ()=>setPubMode('selected'));
  btnAll.addEventListener('click', ()=>setPubMode('all'));

  function render(data){
    window.__SITE_DATA__ = data;
    $('#headerSubtitle').textContent = data.header_subtitle;
    $('#heroLead').textContent = data.hero_lead;

    // chips
    $('#chipRow').innerHTML = data.keywords.map(k => `<span class="chip">${esc(k)}</span>`).join('');

    // CTA
    $('#ctaRow').innerHTML = data.cta.map(x => linkBtn(x.label, x.href)).join(' ');

    // quick facts
    $('#quickFacts').innerHTML = `
      <div class="small"><span class="muted">Affiliation</span><br>${esc(data.affiliation)}</div>
      <div style="height:10px"></div>
      <div class="small"><span class="muted">Research</span><br>${esc(data.research_area)}</div>
      <div style="height:10px"></div>
      <div class="small"><span class="muted">Location</span><br>${esc(data.location)}</div>
    `;

    // about
    $('#aboutText').innerHTML = data.about_html;
    $('#focusList').innerHTML = data.focus.map(x => `<li>${esc(x)}</li>`).join('');

    // research cards
    $('#researchCards').innerHTML = data.research_cards.map(card => {
      const tags = (card.tags||[]).map(badge).join(' ');
      const links = (card.links||[]).map(l => `<a class="badge" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`).join(' ');
      return `
        <div class="pub">
          <p class="pub__title">${esc(card.title)}</p>
          <p class="pub__meta">${esc(card.desc)}</p>
          <div class="pub__links">${tags} ${links}</div>
        </div>
      `;
    }).join('');

    // experience
    $('#expTimeline').innerHTML = data.experience.map(item => {
      const bullets = (item.bullets||[]).map(b => `<li>${esc(b)}</li>`).join('');
      return `
        <div class="tl">
          <div class="tl__date">${esc(item.dates)}</div>
          <div class="card tl__card">
            <div class="card__body">
              <p class="tl__title">${esc(item.role)} · ${esc(item.org)}</p>
              <p class="tl__sub">${esc(item.focus)}</p>
              ${bullets ? `<ul class="tl__bullets">${bullets}</ul>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // education
    $('#eduList').innerHTML = data.education.map(e => {
      const extra = (e.extra||[]).map(x => `<div class="muted small">${esc(x)}</div>`).join('');
      return `
        <div class="pub" style="margin-bottom:10px">
          <p class="pub__title">${esc(e.school)}</p>
          <p class="pub__meta">${esc(e.degree)} · ${esc(e.dates)} ${e.gpa ? `· GPA ${esc(e.gpa)}` : ''}</p>
          ${extra}
        </div>
      `;
    }).join('');

    // activities
    const act = $('#actTimeline');
    if(act){
      act.innerHTML = (data.activities||[]).map(item => {
        const bullets = (item.bullets||[]).map(b => `<li>${esc(b)}</li>`).join('');
        return `
          <div class="tl">
            <div class="tl__date">${esc(item.dates||'')}</div>
            <div class="card tl__card">
              <div class="card__body">
                <p class="tl__title">${esc(item.role)} · ${esc(item.org)}</p>
                ${item.focus ? `<p class="tl__sub">${esc(item.focus)}</p>` : ''}
                ${bullets ? `<ul class="tl__bullets">${bullets}</ul>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('') || '<div class="muted">(No activities listed yet)</div>';
    }

    // honors
    const honors = $('#honorList');
    if(honors){
      honors.innerHTML = (data.honors||[]).map(h => {
        return `
          <div class="pub" style="margin-bottom:10px">
            <p class="pub__title">${esc(h.title)}</p>
            <p class="pub__meta">${esc(h.org)}${h.year ? ` · ${esc(h.year)}` : ''}</p>
          </div>
        `;
      }).join('') || '<div class="muted">(No honors listed yet)</div>';
    }

    // skills
    const sg = $('#skillGrid');
    if(sg){
      const skills = data.skills || {};
      const keys = Object.keys(skills);
      sg.innerHTML = keys.length ? `
        <div class="skillgrid">
          ${keys.map(k => {
            const chips = (skills[k]||[]).map(x => `<span class="chip">${esc(x)}</span>`).join('');
            return `
              <div class="skillbox">
                <p class="skillbox__title">${esc(k)}</p>
                <div class="skillchips">${chips}</div>
              </div>
            `;
          }).join('')}
        </div>
      ` : '<div class="muted">(No skills listed yet)</div>';
    }

    // contacts


    // contacts
    $('#contactLinks').innerHTML = data.contacts.map(c => {
      return `<a href="${esc(c.href)}" target="${c.href.startsWith('http') ? '_blank' : '_self'}" rel="noopener noreferrer"><span class="k">${esc(c.label)}</span><span>${esc(c.value)}</span></a>`;
    }).join('');

    // pubs
    renderPubs(data);
  }

  function renderPubs(data){
    const list = $('#pubList');
    if(!data) return;

    const pubs = (pubMode === 'selected' ? data.publications.filter(p => p.selected) : data.publications)
      .slice()
      .sort((a,b)=> (b.year||0)-(a.year||0));

    list.innerHTML = pubs.map(p => {
      const links = (p.links||[]).map(l => `<a class="badge" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`).join(' ');
      const venue = [p.venue, p.year].filter(Boolean).join(' ');
      const note = p.note ? ` · ${esc(p.note)}` : '';
      return `
        <div class="pub">
          <p class="pub__title">${esc(p.title)}</p>
          <p class="pub__meta">${esc(p.authors)}</p>
          <p class="pub__meta">${esc(venue)}${note}</p>
          ${links ? `<div class="pub__links">${links}</div>` : ''}
        </div>
      `;
    }).join('');

    const preprints = data.preprints || [];
    $('#preprintNote').textContent = preprints.length ? ('Preprints / Under Review: ' + preprints.map(x => `${x.title} (${x.note})`).join(' · ')) : '';
  }

  fetch('data/site.json', {cache: 'no-store'})
    .then(r => r.json())
    .then(render)
    .catch(err => {
      console.error(err);
      $('#heroLead').textContent = 'Failed to load site data.';
    });
})();
