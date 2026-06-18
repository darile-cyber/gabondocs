/* ===== GabonDocs — Paiement WhatsApp ===== */

// ══════════════════════════════════════════════
// 🔧 CONFIGURATION — À MODIFIER
// ══════════════════════════════════════════════
const CONFIG = {
  // Votre numéro WhatsApp avec indicatif pays (sans + ni espace)
  // Gabon = 241 — Ex : 24177123456
  WHATSAPP_NUMBER: '',

  // Votre numéro Mobile Money (affiché à l'utilisateur)
  MOBILE_MONEY_NUMBER: '',

  // Prix du document
  PRIX: '500 FCFA',
};
// ══════════════════════════════════════════════

let currentDoc      = null;
let currentFormData = {};
let currentRef      = '';

// ── Modals ──────────────────────────────────────────────────────────────────

function openModal(docType) {
  currentDoc = docType;
  document.getElementById('modal-' + docType).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(docType) {
  document.getElementById('modal-' + docType).classList.remove('open');
  document.body.style.overflow = '';
}

function closePayModal() {
  document.getElementById('modal-paiement').classList.remove('open');
  if (currentDoc) openModal(currentDoc);
}

function closeSuccessModal() {
  document.getElementById('modal-success').classList.remove('open');
  document.body.style.overflow = '';
  currentDoc = null;
}

// ── Validation ───────────────────────────────────────────────────────────────

function validateForm(docType) {
  const form     = document.getElementById('form-' + docType);
  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.style.borderColor = '';
    field.style.boxShadow   = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#e53e3e';
      field.style.boxShadow   = '0 0 0 3px rgba(229,62,62,0.15)';
      valid = false;
    }
  });

  if (!valid) alert('⚠️ Veuillez remplir tous les champs obligatoires (*)');
  return valid;
}

// ── Collecte des données formulaire ──────────────────────────────────────────

function collectFormData(docType) {
  const FIELDS = {
    casier:       ['c-nom','c-prenom','c-ddn','c-naissance','c-nationalite','c-cni','c-adresse','c-motif','c-tel'],
    residence:    ['r-nom','r-prenom','r-ddn','r-profession','r-adresse','r-ville','r-depuis','r-cni','r-tel'],
    perte:        ['p-nom','p-prenom','p-ddn','p-lieu','p-document','p-numperdu','p-dateerte','p-lieuperte','p-tel'],
    motivation:   ['m-nom','m-prenom','m-adresse','m-tel','m-email','m-poste','m-ministere','m-diplome','m-experience'],
    autorisation: ['a-nom','a-prenom','a-qualite','a-adresse','a-objet','a-destinataire','a-details','a-tel'],
    reclamation:  ['rec-nom','rec-prenom','rec-adresse','rec-tel','rec-email','rec-admin','rec-objet','rec-ref','rec-faits'],
  };
  const data = {};
  (FIELDS[docType] || []).forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id] = el.value.trim();
  });
  return data;
}

// ── Ouverture modal paiement ──────────────────────────────────────────────────

function handlePay(docType) {
  if (!validateForm(docType)) return;

  // Sauvegarder les données du formulaire pour le message WhatsApp
  currentFormData = collectFormData(docType);

  // Générer une référence unique
  currentRef = 'GAB-' + Math.floor(100000 + Math.random() * 900000);

  // Mettre à jour l'affichage du modal paiement
  document.getElementById('pay-ref').textContent  = currentRef;
  document.getElementById('pay-ref2').textContent = currentRef;
  document.getElementById('pay-numero-display').textContent = CONFIG.MOBILE_MONEY_NUMBER;

  // Fermer le formulaire, ouvrir le modal paiement
  document.getElementById('modal-' + docType).classList.remove('open');
  document.getElementById('modal-paiement').classList.add('open');
}

// ── Copier le numéro ──────────────────────────────────────────────────────────

function copyNumber() {
  const num = CONFIG.MOBILE_MONEY_NUMBER.replace(/\s/g, '');
  navigator.clipboard.writeText(num).then(() => {
    const btn = document.querySelector('.copy-num-btn');
    btn.textContent = '✓ Copié';
    btn.style.background = '#25D366';
    setTimeout(() => {
      btn.textContent = 'Copier';
      btn.style.background = '';
    }, 2000);
  });
}

// ── Construire et ouvrir le message WhatsApp ──────────────────────────────────

const DOC_LABELS = {
  casier:       'Demande de casier judiciaire',
  residence:    'Attestation de résidence',
  perte:        'Déclaration de perte',
  motivation:   'Lettre de motivation',
  autorisation: "Demande d'autorisation",
  reclamation:  'Lettre de réclamation',
};

function ouvrirWhatsApp() {
  // Construire le résumé du client depuis les données formulaire
  const d = currentFormData;

  // Nom / prénom selon le type de doc
  const nom    = (d['c-nom']   || d['r-nom']   || d['p-nom']   ||
                  d['m-nom']   || d['a-nom']   || d['rec-nom']  || '').toUpperCase();
  const prenom = (d['c-prenom']|| d['r-prenom']|| d['p-prenom']||
                  d['m-prenom']|| d['a-prenom']|| d['rec-prenom']|| '');
  const tel    = (d['c-tel']   || d['r-tel']   || d['p-tel']   ||
                  d['m-tel']   || d['a-tel']   || d['rec-tel']  || '');

  const docLabel = DOC_LABELS[currentDoc] || currentDoc;

  const message =
`🇬🇦 *GabonDocs — Confirmation de paiement*

📄 *Document :* ${docLabel}
👤 *Nom :* ${prenom} ${nom}
📞 *Téléphone :* ${tel}
🔖 *Référence :* ${currentRef}
💰 *Montant :* ${CONFIG.PRIX}

✅ J'ai effectué le virement Mobile Money.
Voici mon code de transaction : [ENTREZ VOTRE CODE ICI]

Merci de m'envoyer mon document.`;

  const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');

  // Fermer le modal paiement, afficher le succès
  document.getElementById('modal-paiement').classList.remove('open');
  document.getElementById('modal-success').classList.add('open');
}

// ── Utils ─────────────────────────────────────────────────────────────────────

function today() {
  return new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
