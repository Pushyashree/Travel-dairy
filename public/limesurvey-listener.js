/* ============================================================
   LimeSurvey listener — runs ON THE LIMESURVEY PAGE (not the iframe).
   It receives the finished diary from the embedded tool (postMessage)
   and writes it as JSON into the hidden Long-free-text field, so
   LimeSurvey saves it with the response.

   In the LimeSurvey question you place:
     <span id="diarycfg" data-sgq="{SGQ}" style="display:none"></span>
     <iframe src="https://YOUR-APP.onrender.com" ...></iframe>
     <script src="https://YOUR-APP.onrender.com/limesurvey-listener.js"></script>
   ============================================================ */
(function () {
  function field() {
    var c = document.getElementById('diarycfg');
    if (!c) return null;
    var sgq = c.getAttribute('data-sgq');
    if (!sgq) return null;
    return document.getElementById('answer' + sgq);
  }

  function hideBox() {
    var f = field();
    if (!f) return;
    f.style.display = 'none';                 // hide the plain text box…
    var wrap = f.closest('.answer-container'); // …and its row, if present
    if (wrap) wrap.style.display = 'none';
  }

  if (document.readyState !== 'loading') hideBox();
  else document.addEventListener('DOMContentLoaded', hideBox);
  if (window.jQuery) window.jQuery(document).on('pjax:scriptcomplete', hideBox);

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'travel-diary') return;
    // Optional hardening: also check e.origin === 'https://YOUR-APP.onrender.com'
    var f = field();
    if (!f) return;
    f.value = JSON.stringify(d.payload);
    f.dispatchEvent(new Event('change', { bubbles: true }));
    if (window.jQuery) { try { window.jQuery(f).trigger('change'); } catch (err) {} }
  });
})();
