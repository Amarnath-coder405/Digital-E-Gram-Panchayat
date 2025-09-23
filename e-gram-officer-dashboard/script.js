// app.js — Modular dashboard logic

// ----- Validator Module -----
const Validator = {
  isNonEmpty: v => v && v.trim().length > 0,
  isNumeric: v => /^[0-9]+$/.test(v),
  isValidStatus: s => ['Pending','Approved','Rejected'].includes(s)
};

// ----- UI Controller -----
class UIController {
  constructor() {
    this.bindNav();
    this.bindForm();
    if (window.AOS) AOS.init({ once:true, duration:600 });
  }

  bindNav() {
    document.querySelectorAll('.nav-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const target = btn.dataset.target;
        this.setActivePanel(target);
      });
    });
  }

  setActivePanel(target) {
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));

    if(target==='services'){
      document.querySelector('#panel-services').classList.add('active');
      document.querySelector('[data-target="services"]').classList.add('active');
    } else if(target==='update'){
      document.querySelector('#panel-update').classList.add('active');
      document.querySelector('[data-target="update"]').classList.add('active');
    } else if(target==='logout'){
      alert("Logging out...");
      window.location.href = "login.html"; // redirect
    }
  }

  bindForm() {
    const form = document.getElementById('statusForm');
    const appIdInput = document.getElementById('appId');
    const statusSelect = document.getElementById('newStatus');
    const msg = document.getElementById('statusMsg');

    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      msg.textContent = '';
      const appId = appIdInput.value.trim();
      const status = statusSelect.value;

      if(!Validator.isNonEmpty(appId) || !Validator.isNonEmpty(status)){
        msg.textContent = "Application ID and Status are required.";
        msg.style.color = "#ef4444";
        return;
      }
      if(!Validator.isNumeric(appId)){
        msg.textContent = "Application ID must be numeric.";
        msg.style.color = "#ef4444";
        return;
      }
      if(!Validator.isValidStatus(status)){
        msg.textContent = "Invalid status selected.";
        msg.style.color = "#ef4444";
        return;
      }

      msg.textContent = `✅ Application ${appId} updated to ${status}`;
      msg.style.color = "#10b981";
      form.reset();
    });
  }
}

// ----- Bootstrap -----
document.addEventListener('DOMContentLoaded',()=> new UIController());

// export for tests
export { Validator, UIController };
