/* Logo upload in Settings — save to settings.logo */
(function () {
  var logoData = '';
  function $(id) { return document.getElementById(id); }
  function resizeImage(file, maxW, cb) {
    var r = new FileReader();
    r.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, maxW / img.width);
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/png', 0.92));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  }
  function loadLogoPreview() {
    if (typeof ClynData === 'undefined') return;
    var st = ClynData.getSettings();
    logoData = st.logo || '';
    var prev = $('logoPreview');
    if (prev) {
      if (logoData) {
        prev.src = logoData;
        prev.style.display = 'block';
        prev.classList.add('show');
      } else {
        prev.removeAttribute('src');
        prev.style.display = 'none';
      }
    }
  }
  function init() {
    loadLogoPreview();
    var input = $('logoImageInput');
    if (input) {
      input.onchange = function (e) {
        var f = e.target.files[0];
        if (!f) return;
        resizeImage(f, 400, function (d) {
          logoData = d;
          var p = $('logoPreview');
          if (p) {
            p.src = d;
            p.style.display = 'block';
            p.classList.add('show');
          }
        });
      };
    }
    var clearBtn = $('clearLogoBtn');
    if (clearBtn) {
      clearBtn.onclick = function () {
        logoData = '';
        var p = $('logoPreview');
        if (p) {
          p.removeAttribute('src');
          p.style.display = 'none';
        }
      };
    }
    /* Hook into Save settings — merge logo into save */
    var saveBtn = $('saveSettingsBtn');
    if (saveBtn) {
      var prevHandler = saveBtn.onclick;
      saveBtn.onclick = function (ev) {
        if (typeof ClynData === 'undefined') return;
        var st = ClynData.getSettings();
        st.logo = logoData || '';
        /* also keep contact fields from form */
        if ($('sPhone')) st.phone = $('sPhone').value.trim();
        if ($('sWhatsapp')) st.whatsapp = $('sWhatsapp').value.trim().replace(/\D/g, '');
        if ($('sEmail')) st.email = $('sEmail').value.trim();
        if ($('sAddress')) st.address = $('sAddress').value.trim();
        if ($('sLocation')) st.location = $('sLocation').value.trim();
        if ($('sHours')) st.hours = $('sHours').value.trim();
        if ($('sAbout')) st.about = $('sAbout').value.trim();
        if ($('sTagline')) st.tagline = $('sTagline').value.trim();
        /* hero may already be set by admin-app — keep it */
        var heroPrev = $('heroPreview');
        if (heroPrev && heroPrev.src && heroPrev.src.indexOf('data:') === 0) {
          st.heroImage = heroPrev.src;
        }
        ClynData.saveSettings(st);
        if (ClynData.addLog) ClynData.addLog({ user: 'Admin', action: 'save_settings', detail: st.logo ? 'with logo' : 'settings' });
        var msg = $('settingsMsg');
        if (msg) {
          msg.textContent = 'Saved. Refresh the website to see the logo.';
          setTimeout(function () { msg.textContent = ''; }, 4000);
        }
      };
    }
    /* Reload preview when opening Settings tab */
    document.querySelectorAll('.tab').forEach(function (t) {
      t.addEventListener('click', function () {
        if (t.dataset.tab === 'settings') setTimeout(loadLogoPreview, 50);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 200); });
  else setTimeout(init, 200);
})();
