/* =========================================================
   Zangrid Studios — enquiry form
   · prefills service/package from ?service=&package=
   · repopulates the package list when the service changes
   · validates inline, accessibly
   · posts to ZANGRID.site.formEndpoint when set,
     otherwise falls back to a pre-filled email
   ========================================================= */
(function () {
  'use strict';

  const form = document.querySelector('[data-enquiry]');
  if (!form) return;

  const DATA = window.ZANGRID || {};
  const SITE = DATA.site || {};
  const PACKS = DATA.packages || {};
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const statusEl = $('[data-form-status]', form);
  const submitBtn = $('[data-submit]', form);
  const packageSelect = $('#package', form);
  const summaryEl = document.querySelector('[data-package-summary]');

  /* ---------- package select ------------------------- */
  function currentService() {
    const checked = $('input[name="service"]:checked', form);
    return checked ? checked.value : '';
  }

  function fillPackages(service, preselect) {
    if (!packageSelect) return;
    const pack = PACKS[service];
    const options = ['<option value="">No preference / not sure yet</option>'];

    if (pack) {
      pack.tiers.forEach((tier) => {
        options.push(
          '<option value="' + tier.id + '">' + tier.name + ' — ' + tier.price + '</option>'
        );
      });
    }
    options.push('<option value="custom">Something custom</option>');
    packageSelect.innerHTML = options.join('');

    if (preselect) {
      packageSelect.value = preselect;
      if (packageSelect.value !== preselect) packageSelect.value = '';
    }
    updateSummary();
  }

  function updateSummary() {
    if (!summaryEl) return;
    const service = currentService();
    const pack = PACKS[service];
    const tier = pack && packageSelect
      ? pack.tiers.filter((t) => t.id === packageSelect.value)[0]
      : null;

    if (!tier) {
      summaryEl.innerHTML = pack
        ? '<p class="eyebrow">' + pack.label + '</p><p class="muted">' + pack.intro + '</p>'
        : '<p class="eyebrow">Your enquiry</p><p class="muted">Pick a service and we will show what that package includes right here.</p>';
      return;
    }

    summaryEl.innerHTML =
      '<p class="eyebrow">' + pack.label + '</p>' +
      '<h3 class="pkg__name">' + tier.name + '</h3>' +
      '<p class="pkg__price">' + tier.price + '<small>' + tier.unit + '</small></p>' +
      '<ul class="pkg__list">' +
      tier.includes.map((i) => '<li><span>' + i + '</span></li>').join('') +
      '</ul>';
  }

  $$('input[name="service"]', form).forEach((input) => {
    input.addEventListener('change', () => fillPackages(input.value, null));
  });
  if (packageSelect) packageSelect.addEventListener('change', updateSummary);

  /* ---------- prefill from the query string ---------- */
  (function prefill() {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const pkg = params.get('package');
    const radio = service && $('input[name="service"][value="' + service.replace(/"/g, '') + '"]', form);

    if (radio) {
      radio.checked = true;
      fillPackages(service, pkg);
    } else {
      fillPackages(currentService(), pkg);
    }
  })();

  /* ---------- validation ----------------------------- */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldOf(control) {
    return control.closest('.field') || control.closest('.fieldset') || control.parentElement;
  }

  function setError(control, message) {
    const field = fieldOf(control);
    if (!field) return;
    const slot = $('.error', field);
    field.classList.toggle('is-invalid', !!message);
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (slot) slot.textContent = message || '';
  }

  function validateControl(control) {
    const value = (control.value || '').trim();
    const name = control.name;

    if (control.type === 'checkbox' && control.required && !control.checked) {
      setError(control, 'Please tick this to continue.');
      return false;
    }
    if (control.required && control.type !== 'checkbox' && !value) {
      setError(control, 'This one is required.');
      return false;
    }
    if (name === 'email' && value && !emailRe.test(value)) {
      setError(control, 'That email address does not look right.');
      return false;
    }
    if (name === 'message' && value && value.length < 20) {
      setError(control, 'A little more detail helps — 20 characters minimum.');
      return false;
    }
    if (name === 'date' && value) {
      const chosen = new Date(value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) {
        setError(control, 'Please choose a date in the future.');
        return false;
      }
    }
    setError(control, '');
    return true;
  }

  function validateService() {
    const group = $('input[name="service"]', form);
    if (!group) return true;
    if (!currentService()) {
      setError(group, 'Choose the kind of work you need.');
      return false;
    }
    setError(group, '');
    return true;
  }

  const controls = $$('input, select, textarea', form).filter(
    (c) => c.name && c.name !== 'service' && c.type !== 'hidden' && !c.classList.contains('hp-input')
  );

  controls.forEach((control) => {
    control.addEventListener('blur', () => validateControl(control));
    control.addEventListener('input', () => {
      const field = fieldOf(control);
      if (field && field.classList.contains('is-invalid')) validateControl(control);
    });
  });
  $$('input[name="service"]', form).forEach((r) => r.addEventListener('change', validateService));

  /* ---------- submit --------------------------------- */
  function say(kind, html) {
    if (!statusEl) return;
    statusEl.className = 'form__status is-visible ' + (kind === 'ok' ? 'is-ok' : kind === 'error' ? 'is-error' : '');
    statusEl.innerHTML = html;
    statusEl.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  }

  function payload() {
    const out = {};
    new FormData(form).forEach((value, key) => {
      if (key === 'company') return; /* honeypot */
      out[key] = typeof value === 'string' ? value.trim() : value;
    });

    const pack = PACKS[out.service];
    const tier = pack && pack.tiers.filter((t) => t.id === out.package)[0];
    out.serviceLabel = pack ? pack.label : out.service || '';
    out.packageLabel = tier ? tier.name + ' (' + tier.price + ')' : out.package === 'custom' ? 'Something custom' : 'No preference';
    out._subject = 'Enquiry — ' + out.serviceLabel + ' — ' + (out.name || 'New enquiry');
    return out;
  }

  function mailtoFallback(body) {
    const lines = [
      'Name: ' + (body.name || ''),
      'Email: ' + (body.email || ''),
      'Phone: ' + (body.phone || '—'),
      'Service: ' + body.serviceLabel,
      'Package: ' + body.packageLabel,
      'Date: ' + (body.date || 'To be confirmed'),
      'Location: ' + (body.location || '—'),
      'Budget: ' + (body.budget || '—'),
      'Heard via: ' + (body.source || '—'),
      '',
      body.message || ''
    ];
    return (
      'mailto:' + (SITE.email || '') +
      '?subject=' + encodeURIComponent(body._subject) +
      '&body=' + encodeURIComponent(lines.join('\n'))
    );
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const honeypot = $('.hp-input', form);
    if (honeypot && honeypot.value) return; /* bot */

    /* both run — no short-circuiting, so every field gets marked */
    const fieldsOk = controls.map(validateControl).every(Boolean);
    const serviceOk = validateService();
    if (!fieldsOk || !serviceOk) {
      say('error', '<p>A couple of fields need attention — they are marked below.</p>');
      const firstBad = $('.is-invalid input, .is-invalid select, .is-invalid textarea', form);
      if (firstBad) firstBad.focus();
      return;
    }

    const body = payload();

    if (!SITE.formEndpoint) {
      say(
        'ok',
        '<p><strong>Almost there.</strong> This site has no form endpoint configured yet, so your enquiry has been prepared as an email instead.</p>' +
          '<p style="margin-top:.75rem"><a class="link-u" href="' + mailtoFallback(body) + '">Open it in your email app</a>' +
          ' — or write to <a class="link-u" href="mailto:' + (SITE.email || '') + '">' + (SITE.email || '') + '</a>.</p>'
      );
      return;
    }

    submitBtn.setAttribute('aria-disabled', 'true');
    submitBtn.textContent = 'Sending…';

    fetch(SITE.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed with ' + response.status);
        form.reset();
        fillPackages(currentService(), null);
        say(
          'ok',
          '<p><strong>Thank you — your enquiry is in.</strong></p>' +
            '<p style="margin-top:.5rem" class="muted">We reply to every enquiry within two working days. ' +
            'If it is urgent, call <a class="link-u" href="tel:' + String(SITE.phone || '').replace(/\s/g, '') + '">' +
            (SITE.phone || '') + '</a>.</p>'
        );
      })
      .catch(function () {
        say(
          'error',
          '<p><strong>That did not send.</strong> Something went wrong on the way — please ' +
            '<a class="link-u" href="' + mailtoFallback(body) + '">send it as an email</a> instead and we will pick it up.</p>'
        );
      })
      .then(function () {
        submitBtn.removeAttribute('aria-disabled');
        submitBtn.textContent = 'Send enquiry';
      });
  });
})();
