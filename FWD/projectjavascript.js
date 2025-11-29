
(function(){
  const REDIRECT = 'https://www.in.emb-japan.go.jp/education/japanese_government_scholarships.html';
  const KEY = 'edufund_user';


  function addStyles(){
    const css = `
      .ef-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);align-items:center;justify-content:center}
      .ef-modal.show{display:flex}
      .ef-box{background:#fff;padding:16px;border-radius:8px;width:320px}
      .ef-box input{width:100%;padding:8px;margin-top:6px;box-sizing:border-box}
      #ef-user{display:none;margin:12px;padding:10px;background:#f7f7f7;border-radius:6px}
    `;
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  }


  function makeModal(){
    const modal = document.createElement('div'); modal.className = 'ef-modal'; modal.id = 'ef-modal';
    modal.innerHTML = `
      <div class="ef-box">
        <h3>Login / Sign Up</h3>
        <form id="ef-form">
          <input id="ef-name" placeholder="Full name" required />
          <input id="ef-email" type="email" placeholder="Email" required />
          <input id="ef-mobile" placeholder="Mobile number" required />
          <div style="text-align:right;margin-top:10px">
            <button type="button" id="ef-cancel">Cancel</button>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    // close on cancel or outside click
    modal.addEventListener('click', e => { if (e.target === modal) hideModal(); });
    modal.querySelector('#ef-cancel').addEventListener('click', hideModal);
    modal.querySelector('#ef-form').addEventListener('submit', onSubmit);
  }

  function showModal(){ document.getElementById('ef-modal').classList.add('show'); }
  function hideModal(){ document.getElementById('ef-modal').classList.remove('show'); }

  function getUser(){ try { return JSON.parse(localStorage.getItem(KEY)); } catch(e){ return null } }
  function saveUser(u){ localStorage.setItem(KEY, JSON.stringify(u)); }

  function showUser(){
    let box = document.getElementById('ef-user');
    if (!box){ box = document.createElement('div'); box.id = 'ef-user';
      const header = document.querySelector('header');
      if (header) header.parentNode.insertBefore(box, header.nextSibling); else document.body.insertBefore(box, document.body.firstChild);
    }
    const u = getUser();
    if (u && u.name){
      box.style.display = 'block';
      box.textContent = `Signed in: ${u.name} — ${u.email} — ${u.mobile}`;
      const btn = document.getElementById('loginBtn'); if (btn) btn.textContent = 'Continue to site';
    } else { box.style.display = 'none'; const btn = document.getElementById('loginBtn'); if (btn) btn.textContent = 'Login / Sign Up'; }
  }

  function onSubmit(e){
    e.preventDefault();
    const name = document.getElementById('ef-name').value.trim();
    const email = document.getElementById('ef-email').value.trim();
    const mobile = document.getElementById('ef-mobile').value.trim();
    if (!name || !email || !mobile){ alert('Please fill all fields'); return; }

    const previous = getUser();
    saveUser({ name, email, mobile });
    hideModal(); showUser();
    if (previous && previous.email) window.location.href = REDIRECT; else alert('Details saved. Click Login again to go to the scholarship site.');
  }

  function attach(){
    const btn = document.getElementById('loginBtn'); if (!btn) return;
    btn.addEventListener('click', e => { e.preventDefault(); const u = getUser(); if (u && u.email) window.location.href = REDIRECT; else showModal(); });
  }

  // init
  document.addEventListener('DOMContentLoaded', () => { addStyles(); makeModal(); showUser(); attach(); });

})();
