/* ============================================================
   UNDANGAN PERNIKAHAN — RIZKY & AULIA
   script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────────────────────────
     1. URL PARAMETER — Nama Tamu
     Contoh: ?tamu=Bapak+Ahmad
  ──────────────────────────────────────────────────────────── */
  const params    = new URLSearchParams(window.location.search);
  const guestEl   = document.getElementById('guestName');
  const tamuName  = params.get('tamu') || params.get('nama');
  if (tamuName && guestEl) {
    guestEl.textContent = decodeURIComponent(tamuName);
  }


  /* ────────────────────────────────────────────────────────────
     2. FALLING PETALS — Amplop
  ──────────────────────────────────────────────────────────── */
  const fallContainer = document.getElementById('fallPetals');
  if (fallContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'fall-petal';
      p.style.left            = Math.random() * 100 + '%';
      p.style.animationDelay  = Math.random() * 8 + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      p.style.opacity          = (0.2 + Math.random() * 0.5).toString();
      p.style.transform        = `scale(${0.5 + Math.random()})`;
      fallContainer.appendChild(p);
    }
  }


  /* ────────────────────────────────────────────────────────────
     3. OPEN ENVELOPE
  ──────────────────────────────────────────────────────────── */
  const openBtn    = document.getElementById('openBtn');
  const envelope   = document.getElementById('envelope');
  const invitation = document.getElementById('invitation');

  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
    openBtn.addEventListener('touchend', e => { e.preventDefault(); openInvitation(); });
  }

  function openInvitation() {
    // Haptic feedback (mobile)
    if (navigator.vibrate) navigator.vibrate(60);

    envelope.classList.add('opened');
    invitation.classList.remove('hidden');
    invitation.classList.add('visible');

    setTimeout(() => {
      envelope.style.display = 'none';
      document.body.style.overflow = 'auto';
      // Trigger hero reveals
      document.querySelectorAll('.hero-sec .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 150);
      });
    }, 800);

    // Attempt music autoplay
    tryPlayMusic();
  }

  // Prevent scroll while envelope is showing
  document.body.style.overflow = 'hidden';


  /* ────────────────────────────────────────────────────────────
     4. SCROLL REVEAL
  ──────────────────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Observe all .reveal elements (hero ones handled separately)
  function initReveal() {
    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.closest('.hero-sec')) {
        revealObserver.observe(el);
      }
    });
  }
  initReveal();


  /* ────────────────────────────────────────────────────────────
     5. COUNTDOWN TIMER
  ──────────────────────────────────────────────────────────── */
  const weddingDate = new Date('2025-06-14T08:00:00');

  function updateCountdown() {
    const now  = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      // Wedding day!
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');
    document.getElementById('cd-days').textContent  = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent  = pad(mins);
    document.getElementById('cd-secs').textContent  = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ────────────────────────────────────────────────────────────
     6. RSVP FORM
  ──────────────────────────────────────────────────────────── */
  const rsvpForm    = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', e => {
      e.preventDefault();
      const name   = document.getElementById('rsvpName').value;
      const guests = document.getElementById('rsvpGuests').value;
      const attend = rsvpForm.querySelector('[name="attend"]:checked')?.value;

      if (!attend) { alert('Mohon pilih konfirmasi kehadiran.'); return; }

      // Simulate submit
      const btn = rsvpForm.querySelector('.btn-rsvp');
      btn.textContent = 'Mengirim... ⏳';
      btn.disabled = true;

      setTimeout(() => {
        rsvpForm.reset();
        btn.textContent = 'Kirim Konfirmasi 💌';
        btn.disabled = false;
        rsvpSuccess.classList.add('show');
        setTimeout(() => rsvpSuccess.classList.remove('show'), 5000);
      }, 1200);
    });
  }


  /* ────────────────────────────────────────────────────────────
     7. WISHES / UCAPAN
  ──────────────────────────────────────────────────────────── */
  const wishForm  = document.getElementById('wishForm');
  const wishesList = document.getElementById('wishesList');

  // Load from localStorage
  let wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');

  // Pre-populate with sample wishes
  if (wishes.length === 0) {
    wishes = [
      { name: 'Keluarga Budi Santoso', msg: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallahu lakuma! 🌸', time: '10 menit yang lalu' },
      { name: 'Ahmad & Siti', msg: 'Selamat menempuh hidup baru, semoga langgeng sampai tua dan penuh berkah. Aamiin.', time: '30 menit yang lalu' },
    ];
  }

  function renderWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = wishes.map(w => `
      <div class="wish-bubble">
        <div class="wish-author">${escHtml(w.name)}</div>
        <div class="wish-text">${escHtml(w.msg)}</div>
        <div class="wish-time">${w.time}</div>
      </div>
    `).join('');
  }

  renderWishes();

  function escHtml(str) {
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  if (wishForm) {
    wishForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('wishName').value.trim();
      const msg  = document.getElementById('wishMsg').value.trim();

      if (!name || !msg) return;

      const newWish = { name, msg, time: 'Baru saja' };
      wishes.unshift(newWish);
      localStorage.setItem('wedding_wishes', JSON.stringify(wishes.slice(0, 50)));
      renderWishes();
      wishForm.reset();

      // Scroll to wishes list
      wishesList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }


  /* ────────────────────────────────────────────────────────────
     8. COPY TO CLIPBOARD (Gift)
  ──────────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      if (!text) return;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => showCopied(btn));
      } else {
        // Fallback
        const el = document.createElement('input');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showCopied(btn);
      }
    });
  });

  function showCopied(btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ Tersalin!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove('copied');
    }, 2000);
  }


  /* ────────────────────────────────────────────────────────────
     9. MUSIC PLAYER
  ──────────────────────────────────────────────────────────── */
  const musicBtn  = document.getElementById('musicBtn');
  const bgMusic   = document.getElementById('bgMusic');
  let   musicOn   = false;

  function tryPlayMusic() {
    if (bgMusic && bgMusic.src && bgMusic.src !== window.location.href) {
      bgMusic.play().then(() => {
        musicOn = true;
        musicBtn.classList.remove('paused');
      }).catch(() => {
        musicOn = false;
        musicBtn.classList.add('paused');
      });
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (!bgMusic) return;
      if (musicOn) {
        bgMusic.pause();
        musicOn = false;
        musicBtn.classList.add('paused');
      } else {
        bgMusic.play().then(() => {
          musicOn = true;
          musicBtn.classList.remove('paused');
        });
      }
    });
  }


  /* ────────────────────────────────────────────────────────────
     10. SMOOTH SCROLL for internal links
  ──────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ────────────────────────────────────────────────────────────
     11. GALLERY — Lightbox sederhana
  ──────────────────────────────────────────────────────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const overlay = document.querySelector('.gi-overlay')?.textContent || '';
      // Simple tap: show overlay text as toast
      const toast = document.createElement('div');
      toast.style.cssText = `
        position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
        background:rgba(60,20,10,.85);color:#e8d5a3;
        padding:10px 24px;border-radius:100px;font-size:13px;
        z-index:999;backdrop-filter:blur(10px);
        animation:fadeIn .3s ease;pointer-events:none;
      `;
      toast.textContent = item.querySelector('.gi-overlay')?.textContent || '✨';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    });
  });


  /* ────────────────────────────────────────────────────────────
     12. STAGGERED REVEAL for gallery & timeline
  ──────────────────────────────────────────────────────────── */
  const staggerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.reveal');
        items.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 100);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.gallery-grid, .timeline, .couple-grid, .gift-cards, .event-cards')
    .forEach(el => staggerObserver.observe(el));

});