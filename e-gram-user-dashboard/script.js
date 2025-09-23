/**
 * user.js — lightweight, production-friendly user dashboard script
 * - demo persistence via localStorage (replace with API calls)
 * - debounced search, minimal DOM changes
 * - apply slide-in form with extended fields
 * - responsive rendering and accessibility hooks
 */

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = v => String(v || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- Storage keys & demo data ---------- */
const LS_SERVICES = 'eg_services_v3';
const LS_APPS = 'eg_apps_v3';
const LS_PROFILE = 'eg_profile_v3';

const demoServices = [
  { id: 1, name: 'Birth Certificate', category: 'Certificates', duration: '7 days', fee: 'Free', desc: 'Issue of official birth certificate for newborns and retrospective registrations.' },
  { id: 2, name: 'Water Connection', category: 'Utilities', duration: '14 days', fee: 'Varies', desc: 'Application for a new domestic water connection; site inspection may be required.' },
  { id: 3, name: 'Marriage Certificate', category: 'Certificates', duration: '10 days', fee: '₹100', desc: 'Registration of marriage and issuance of certificate for legal use.' }
];

const demoApps = [
  { id: 'APP-1001', serviceId: 2, serviceName: 'Water Connection', submitted: '2025-09-10', status: 'pending' },
  { id: 'APP-1002', serviceId: 1, serviceName: 'Birth Certificate', submitted: '2025-08-21', status: 'approved' }
];

function load(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw){ localStorage.setItem(key, JSON.stringify(fallback)); return fallback.slice(); }
    return JSON.parse(raw);
  }catch(e){ console.error(e); return fallback.slice(); }
}
function save(key,data){ try{ localStorage.setItem(key, JSON.stringify(data)); }catch(e){ console.error(e); } }

/* ---------- State ---------- */
let services = load(LS_SERVICES, demoServices);
let apps = load(LS_APPS, demoApps);
let profile = (localStorage.getItem(LS_PROFILE) ? JSON.parse(localStorage.getItem(LS_PROFILE)) : { name:'', email:'', mobile:'', dob:'', gender:'', address:'', idNo:'' });
let nextAppNum = apps.length ? Math.max(...apps.map(a => parseInt(a.id.split('-')[1] || 0))) + 1 : 1100;

/* ---------- DOM refs ---------- */
const servicesList = $('#servicesList');
const searchInput = $('#searchInput');
const clearSearch = $('#clearSearch');
const sideLinks = $$('.side-link');
const applyPanel = $('#applyPanel');
const applyForm = $('#applyForm');
const applyMsg = $('#applyMsg');
const appsTableBody = $('#appsTable tbody');
const profileForm = $('#profileForm');
const profileMsg = $('#profileMsg');
const profileReset = $('#profileReset');

/* ---------- Render Services ---------- */
function renderServices(list = services) {
  servicesList.innerHTML = '';
  if(!list.length){ servicesList.innerHTML = '<p class="muted">No services found.</p>'; return; }
  const frag = document.createDocumentFragment();
  list.forEach(svc => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = svc.id;
    card.innerHTML = `
      <div>
        <h3>${esc(svc.name)}</h3>
        <p class="muted">${esc(svc.category)} • ${esc(svc.duration)} • Fee: ${esc(svc.fee)}</p>
        <p class="details">${esc(svc.desc)}</p>
        <div class="meta">
          <small class="muted">Service ID: ${svc.id}</small>
          <div>
            <button class="btn outline btn-details" data-id="${svc.id}" aria-label="Details ${esc(svc.name)}"><i class="fa fa-info-circle"></i> Details</button>
            <button class="btn primary btn-apply" data-id="${svc.id}" aria-label="Apply ${esc(svc.name)}"><i class="fa fa-paper-plane"></i> Apply</button>
          </div>
        </div>
      </div>
    `;
    frag.appendChild(card);
  });
  servicesList.appendChild(frag);
}

/* ---------- Debounced Search ---------- */
let searchTimer = 0;
searchInput?.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = searchInput.value.trim().toLowerCase();
  searchTimer = setTimeout(() => {
    if(!q) return renderServices(services);
    const filtered = services.filter(s => (s.name + ' ' + s.desc + ' ' + s.category).toLowerCase().includes(q));
    renderServices(filtered);
  }, 180);
});
clearSearch?.addEventListener('click', () => { searchInput.value = ''; renderServices(services); });

/* ---------- Sidebar navigation ---------- */
sideLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    sideLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    const target = link.dataset.target;
    showPanel(target);
    if(window.innerWidth < 720) document.querySelector('.sidebar').classList.add('collapsed');
  });
});
function showPanel(panelId) {
  ['panel-services','panel-apps','panel-profile'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.classList.toggle('active', id === panelId);
  });
  if(panelId === 'panel-apps') renderApps();
  if(panelId === 'panel-services') renderServices();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Apply Flow ---------- */
function openApply(serviceId) {
  const svc = services.find(s => s.id === Number(serviceId));
  if(!svc) return alert('Service not found');
  applyPanel.setAttribute('aria-hidden','false');
  $('#applyTitle').textContent = `Apply: ${svc.name}`;
  $('#applyServiceId').value = svc.id;
  // prefill from profile
  $('#appFullName').value = profile.name || '';
  $('#appEmail').value = profile.email || '';
  $('#appMobile').value = profile.mobile || '';
  $('#appDob').value = profile.dob || '';
  $('#appGender').value = profile.gender || '';
  $('#appAddress').value = profile.address || '';
  $('#appIdNo').value = profile.idNo || '';
  $('#appNote').value = '';
  $('#appDocument').value = '';
  applyMsg.textContent = '';
  setTimeout(()=>$('#appFullName').focus(),120);
}
function closeApply() { applyPanel.setAttribute('aria-hidden','true'); }
$('#closeApply')?.addEventListener('click', closeApply);
$('#cancelApply')?.addEventListener('click', closeApply);

/* delegate details / apply clicks */
servicesList?.addEventListener('click', e => {
  const detailsBtn = e.target.closest('.btn-details');
  if(detailsBtn){
    const card = detailsBtn.closest('.card');
    const details = card.querySelector('.details');
    details.style.display = (details.style.display === 'block') ? 'none' : 'block';
    return;
  }
  const applyBtn = e.target.closest('.btn-apply');
  if(applyBtn) openApply(applyBtn.dataset.id);
});

/* ---------- Submit Application ---------- */
applyForm?.addEventListener('submit', e => {
  e.preventDefault();
  const serviceId = Number($('#applyServiceId').value);
  const svc = services.find(s => s.id === serviceId);
  if(!svc){ applyMsg.textContent = 'Service not found'; return; }

  const fullName = $('#appFullName').value.trim();
  const email = $('#appEmail').value.trim();
  const mobile = $('#appMobile').value.trim();
  if(!fullName || !email || !mobile){ applyMsg.textContent = 'Please provide name, email, and mobile.'; applyMsg.style.color = '#e53e3e'; return; }

  const dob = $('#appDob').value;
  const gender = $('#appGender').value;
  const address = $('#appAddress').value.trim();
  const idNo = $('#appIdNo').value.trim();
  const note = $('#appNote').value.trim();
  const docName = ($('#appDocument').files && $('#appDocument').files[0]) ? $('#appDocument').files[0].name : '';

  const appId = `APP-${++nextAppNum}`;
  const submitted = new Date().toISOString().slice(0,10);
  const newApp = {
    id: appId, serviceId, serviceName: svc.name, submitted, status: 'pending',
    applicant: fullName, email, mobile, dob, gender, address, idNo, note, documentName: docName
  };
  apps.unshift(newApp);
  save(LS_APPS, apps);

  // update profile from application fields (optional convenience)
  profile = { ...profile, name: fullName, email, mobile, dob, gender, address, idNo };
  save(LS_PROFILE, profile);

  applyMsg.textContent = 'Application submitted successfully. Redirecting to My Applications...';
  applyMsg.style.color = '#10b981';

  setTimeout(()=> {
    closeApply();
    document.querySelector('.side-link[data-target="panel-apps"]').click();
    renderApps();
  }, 900);
});

/* ---------- Render Applications ---------- */
function renderApps(){
  appsTableBody.innerHTML = '';
  if(!apps.length){ appsTableBody.innerHTML = '<tr><td colspan="5" class="muted">No applications found.</td></tr>'; return; }
  const frag = document.createDocumentFragment();
  apps.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="App ID">${esc(a.id)}</td>
      <td data-label="Service">${esc(a.serviceName)}</td>
      <td data-label="Submitted">${esc(a.submitted)}</td>
      <td data-label="Status">${statusBadge(a.status)}</td>
      <td data-label="Action">${a.status === 'pending' ? `<button class="action-btn action-cancel" data-id="${a.id}">Cancel</button>` : '--'}</td>
    `;
    frag.appendChild(tr);
  });
  appsTableBody.appendChild(frag);

  $$('.action-cancel').forEach(btn => btn.addEventListener('click', e => {
    const id = e.currentTarget.dataset.id;
    if(!confirm('Cancel this pending application?')) return;
    apps = apps.map(x => x.id === id ? ({ ...x, status: 'rejected' }) : x);
    save(LS_APPS, apps);
    renderApps();
  }));
}
function statusBadge(s){ if(s==='pending') return `<span class="badge pending">Pending</span>`; if(s==='approved') return `<span class="badge approved">Approved</span>`; return `<span class="badge rejected">Rejected</span>`; }

/* ---------- Profile functions ---------- */
function loadProfileToForm(){
  $('#profileName').value = profile.name || '';
  $('#profileEmail').value = profile.email || '';
  $('#profileMobile').value = profile.mobile || '';
  $('#profileDob').value = profile.dob || '';
  $('#profileGender').value = profile.gender || '';
  $('#profileAddress').value = profile.address || '';
  $('#profileIdNo').value = profile.idNo || '';
}
profileForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#profileName').value.trim();
  const email = $('#profileEmail').value.trim();
  const mobile = $('#profileMobile').value.trim();
  if(!name || !email || !mobile){ profileMsg.textContent = 'Please fill name, email and mobile.'; profileMsg.style.color = '#e53e3e'; return; }
  const dob = $('#profileDob').value;
  const gender = $('#profileGender').value;
  const address = $('#profileAddress').value.trim();
  const idNo = $('#profileIdNo').value.trim();
  profile = { name, email, mobile, dob, gender, address, idNo };
  save(LS_PROFILE, profile);
  profileMsg.textContent = 'Profile saved.';
  profileMsg.style.color = '#10b981';
});
profileReset?.addEventListener('click', ()=> { loadProfileToForm(); profileMsg.textContent = ''; });

/* ---------- Mobile menu toggle & keyboard ---------- */
$('#mobileMenuBtn')?.addEventListener('click', ()=> document.querySelector('.sidebar').classList.toggle('collapsed'));
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') if(applyPanel.getAttribute('aria-hidden') === 'false') closeApply(); });

/* ---------- Boot ---------- */
function boot(){
  services = load(LS_SERVICES, demoServices);
  apps = load(LS_APPS, demoApps);
  profile = (localStorage.getItem(LS_PROFILE) ? JSON.parse(localStorage.getItem(LS_PROFILE)) : profile);
  nextAppNum = apps.length ? Math.max(...apps.map(a => parseInt(a.id.split('-')[1] || 0))) + 1 : 1200;
  renderServices();
  renderApps();
  loadProfileToForm();
  setTimeout(()=> { if(window.AOS) window.AOS.refresh(); }, 600);
}
document.addEventListener('DOMContentLoaded', boot);
