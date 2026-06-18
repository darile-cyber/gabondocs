/* ===== GabonDocs — Générateur PDF (jsPDF) ===== */

function generatePDF(docType) {
  const generators = {
    casier: genCasier,
    residence: genResidence,
    perte: genPerte,
    motivation: genMotivation,
    autorisation: genAutorisation,
    reclamation: genReclamation
  };
  if (generators[docType]) {
    generators[docType]();
  }
}

// ===== HELPERS PDF =====

function createDoc() {
  const { jsPDF } = window.jspdf;
  return new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
}

const M = { left: 25, right: 25, top: 20 };
const PW = 210; // A4 width mm
const CW = PW - M.left - M.right; // content width

function addHeader(doc, title, subtitle) {
  // Bandeau couleurs nationales
  doc.setFillColor(0, 98, 51); // vert
  doc.rect(0, 0, 70, 8, 'F');
  doc.setFillColor(252, 209, 22); // jaune
  doc.rect(70, 0, 70, 8, 'F');
  doc.setFillColor(0, 48, 130); // bleu
  doc.rect(140, 0, 70, 8, 'F');

  // En-tête République
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('REPUBLIQUE GABONAISE', PW / 2, 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Union - Travail - Justice', PW / 2, 23, { align: 'center' });

  // Séparateur
  doc.setDrawColor(0, 98, 51);
  doc.setLineWidth(0.8);
  doc.line(M.left, 27, PW - M.right, 27);

  // Titre du document
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 98, 51);
  doc.text(title.toUpperCase(), PW / 2, 37, { align: 'center' });

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, PW / 2, 44, { align: 'center' });
  }

  // Séparateur fin
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(M.left, 48, PW - M.right, 48);

  return 55; // y position après le header
}

function addField(doc, label, value, x, y, w) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(label.toUpperCase(), x, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(value || '—', x, y + 5);

  // Ligne de champ
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(x, y + 7, x + (w || CW), y + 7);

  return y + 14;
}

function addSectionTitle(doc, text, y) {
  doc.setFillColor(232, 245, 238);
  doc.rect(M.left, y - 4, CW, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 98, 51);
  doc.text(text.toUpperCase(), M.left + 3, y + 1);
  return y + 10;
}

function addParagraph(doc, text, y, maxW) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const lines = doc.splitTextToSize(text, maxW || CW);
  doc.text(lines, M.left, y);
  return y + lines.length * 5.5;
}

function addFooter(doc, ref) {
  const pageH = 297;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(M.left, pageH - 18, PW - M.right, pageH - 18);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('Document généré par GabonDocs — gabondocs.ga', M.left, pageH - 13);
  doc.text('Réf: ' + ref + ' | ' + today(), PW - M.right, pageH - 13, { align: 'right' });

  // Bandeau bas
  doc.setFillColor(0, 98, 51);
  doc.rect(0, pageH - 7, 70, 7, 'F');
  doc.setFillColor(252, 209, 22);
  doc.rect(70, pageH - 7, 70, 7, 'F');
  doc.setFillColor(0, 48, 130);
  doc.rect(140, pageH - 7, 70, 7, 'F');
}

function genRef(prefix) {
  return prefix + '-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
}

// ===== 1. CASIER JUDICIAIRE =====
function genCasier() {
  const doc = createDoc();
  const ref = genRef('CJ');
  let y = addHeader(doc, 'Demande de Casier Judiciaire', 'Bulletin n°3 — Usage externe');

  y = addSectionTitle(doc, 'Informations du demandeur', y);
  y = addField(doc, 'Nom de famille', val('c-nom').toUpperCase(), M.left, y, CW / 2 - 5);
  const lastY = y - 14;
  addField(doc, 'Prénom(s)', val('c-prenom'), M.left + CW / 2 + 5, lastY, CW / 2 - 5);

  y = addField(doc, 'Date de naissance', formatDate(val('c-ddn')), M.left, y, CW / 2 - 5);
  const y2 = y - 14;
  addField(doc, 'Lieu de naissance', val('c-naissance'), M.left + CW / 2 + 5, y2, CW / 2 - 5);

  y = addField(doc, 'Nationalité', val('c-nationalite'), M.left, y, CW / 2 - 5);
  const y3 = y - 14;
  addField(doc, 'N° CNI / Passeport', val('c-cni'), M.left + CW / 2 + 5, y3, CW / 2 - 5);

  y = addField(doc, 'Adresse de résidence', val('c-adresse'), M.left, y);
  y = addField(doc, 'Téléphone', val('c-tel'), M.left, y, CW / 2 - 5);

  y += 5;
  y = addSectionTitle(doc, 'Objet de la demande', y);
  const motifs = { emploi: 'Recherche d\'emploi', contrat: 'Signature de contrat', visa: 'Demande de visa', marche: 'Appel d\'offres / Marché public', autre: 'Autre' };
  y = addField(doc, 'Motif', motifs[val('c-motif')] || val('c-motif'), M.left, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const intro = `Je soussigné(e) ${val('c-prenom')} ${val('c-nom').toUpperCase()}, né(e) le ${formatDate(val('c-ddn'))} à ${val('c-naissance')}, de nationalité ${val('c-nationalite')}, titulaire de la pièce d'identité n° ${val('c-cni')}, demeurant à ${val('c-adresse')},`;
  const lines = doc.splitTextToSize(intro, CW);
  doc.text(lines, M.left, y);
  y += lines.length * 5.5 + 4;

  doc.text(`sollicite par la présente la délivrance d'un extrait de casier judiciaire (Bulletin n°3) pour motif de : ${motifs[val('c-motif')] || val('c-motif')}.`, M.left, y, { maxWidth: CW });
  y += 16;

  doc.text('Je certifie sur l\'honneur l\'exactitude des informations fournies dans ce formulaire.', M.left, y, { maxWidth: CW });
  y += 20;

  // Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Fait à Libreville, le ' + today(), M.left, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Signature du demandeur :', M.left, y);
  y += 18;
  doc.setDrawColor(180, 180, 180);
  doc.line(M.left, y, M.left + 60, y);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(val('c-prenom') + ' ' + val('c-nom').toUpperCase(), M.left, y + 4);

  // Cadre administration
  y += 20;
  doc.setDrawColor(0, 98, 51);
  doc.setLineWidth(0.5);
  doc.rect(M.left, y, CW, 35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 98, 51);
  doc.text('RÉSERVÉ À L\'ADMINISTRATION', M.left + 3, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text('Reçu le : ________________', M.left + 3, y + 14);
  doc.text('N° d\'enregistrement : ________________', M.left + 3, y + 21);
  doc.text('Agent : ________________', M.left + 3, y + 28);

  addFooter(doc, ref);
  doc.save('casier-judiciaire-' + val('c-nom').toLowerCase() + '.pdf');
}

// ===== 2. ATTESTATION DE RÉSIDENCE =====
function genResidence() {
  const doc = createDoc();
  const ref = genRef('RES');
  let y = addHeader(doc, 'Attestation de Résidence', 'Document de certification de domicile');

  y = addSectionTitle(doc, 'Informations personnelles', y);
  y = addField(doc, 'Nom de famille', val('r-nom').toUpperCase(), M.left, y, CW / 2 - 5);
  const y0 = y - 14;
  addField(doc, 'Prénom(s)', val('r-prenom'), M.left + CW / 2 + 5, y0, CW / 2 - 5);

  y = addField(doc, 'Date de naissance', formatDate(val('r-ddn')), M.left, y, CW / 2 - 5);
  const y1 = y - 14;
  addField(doc, 'Profession', val('r-profession') || 'Non précisée', M.left + CW / 2 + 5, y1, CW / 2 - 5);

  y = addField(doc, 'N° CNI', val('r-cni'), M.left, y, CW / 2 - 5);
  const y2 = y - 14;
  addField(doc, 'Téléphone', val('r-tel'), M.left + CW / 2 + 5, y2, CW / 2 - 5);

  y += 5;
  y = addSectionTitle(doc, 'Adresse de résidence', y);
  y = addField(doc, 'Adresse complète', val('r-adresse'), M.left, y);
  y = addField(doc, 'Ville', val('r-ville'), M.left, y, CW / 2 - 5);
  const y3 = y - 14;
  addField(doc, 'Résidant depuis', val('r-depuis') || '—', M.left + CW / 2 + 5, y3, CW / 2 - 5);

  y += 8;
  const texte = `Je soussigné(e) ${val('r-prenom')} ${val('r-nom').toUpperCase()}, né(e) le ${formatDate(val('r-ddn'))}, titulaire de la CNI n° ${val('r-cni')}, exerçant la profession de ${val('r-profession') || 'sans profession indiquée'},\n\natteste sur l'honneur résider de façon habituelle et permanente à l'adresse suivante :\n\n${val('r-adresse')}, ${val('r-ville')}, République Gabonaise,\n\net ce depuis ${val('r-depuis') ? 'l\'année ' + val('r-depuis') : 'plusieurs années'}.\n\nCette attestation est établie pour servir et valoir ce que de droit.`;

  const lines = doc.splitTextToSize(texte, CW);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(lines, M.left, y);
  y += lines.length * 5.5 + 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Fait à ' + (val('r-ville') || 'Libreville') + ', le ' + today(), M.left, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Signature :', M.left, y);
  y += 20;
  doc.setDrawColor(180, 180, 180);
  doc.line(M.left, y, M.left + 70, y);

  addFooter(doc, ref);
  doc.save('attestation-residence-' + val('r-nom').toLowerCase() + '.pdf');
}

// ===== 3. DÉCLARATION DE PERTE =====
function genPerte() {
  const doc = createDoc();
  const ref = genRef('PERTE');
  let y = addHeader(doc, 'Déclaration de Perte', 'Déclaration sur l\'honneur de perte de document');

  y = addSectionTitle(doc, 'Identité du déclarant', y);
  y = addField(doc, 'Nom de famille', val('p-nom').toUpperCase(), M.left, y, CW / 2 - 5);
  const y0 = y - 14;
  addField(doc, 'Prénom(s)', val('p-prenom'), M.left + CW / 2 + 5, y0, CW / 2 - 5);
  y = addField(doc, 'Date de naissance', formatDate(val('p-ddn')), M.left, y, CW / 2 - 5);
  const y1 = y - 14;
  addField(doc, 'Lieu de naissance', val('p-lieu') || '—', M.left + CW / 2 + 5, y1, CW / 2 - 5);
  y = addField(doc, 'Téléphone', val('p-tel'), M.left, y, CW / 2 - 5);

  y += 5;
  y = addSectionTitle(doc, 'Document perdu', y);
  y = addField(doc, 'Nature du document', val('p-document'), M.left, y, CW / 2 - 5);
  const y2 = y - 14;
  addField(doc, 'N° du document', val('p-numperdu') || 'Non connu', M.left + CW / 2 + 5, y2, CW / 2 - 5);
  y = addField(doc, 'Date de la perte', formatDate(val('p-dateerte')) || 'Non précisée', M.left, y, CW / 2 - 5);
  const y3 = y - 14;
  addField(doc, 'Lieu de la perte', val('p-lieuperte') || 'Non précisé', M.left + CW / 2 + 5, y3, CW / 2 - 5);

  y += 8;
  const texte = `Je soussigné(e) ${val('p-prenom')} ${val('p-nom').toUpperCase()}, né(e) le ${formatDate(val('p-ddn'))}${val('p-lieu') ? ' à ' + val('p-lieu') : ''}, déclare sur l'honneur avoir perdu mon / ma ${val('p-document')}${val('p-numperdu') ? ' portant le numéro ' + val('p-numperdu') : ''}${val('p-dateerte') ? ', le ' + formatDate(val('p-dateerte')) : ''}${val('p-lieuperte') ? ', à ' + val('p-lieuperte') : ''}.\n\nJe déclare que ce document n'a pas été volé à ma connaissance et que je n'en ai pas fait usage frauduleux. Je m'engage à le restituer à toute autorité compétente dans l'éventualité où il serait retrouvé.\n\nLa présente déclaration est faite pour servir et valoir ce que de droit, notamment pour l'établissement d'un duplicata.`;

  const lines = doc.splitTextToSize(texte, CW);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(lines, M.left, y);
  y += lines.length * 5.5 + 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Fait à Libreville, le ' + today(), M.left, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Signature du déclarant :', M.left, y);
  y += 20;
  doc.setDrawColor(180, 180, 180);
  doc.line(M.left, y, M.left + 70, y);

  addFooter(doc, ref);
  doc.save('declaration-perte-' + val('p-nom').toLowerCase() + '.pdf');
}

// ===== 4. LETTRE DE MOTIVATION =====
function genMotivation() {
  const doc = createDoc();
  const ref = genRef('MOT');
  let y = addHeader(doc, 'Lettre de Motivation', 'Candidature à un poste dans la fonction publique');

  // Expéditeur (gauche)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(val('m-prenom') + ' ' + val('m-nom').toUpperCase(), M.left, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(val('m-adresse'), M.left, y + 5);
  doc.text('Tél : ' + val('m-tel'), M.left, y + 10);
  if (val('m-email')) doc.text('Email : ' + val('m-email'), M.left, y + 15);

  // Destinataire (droite)
  const destX = M.left + CW / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text('À', destX, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const destLines = doc.splitTextToSize(val('m-ministere'), CW / 2 - 10);
  doc.text(destLines, destX, y + 5);
  doc.text('Libreville, Gabon', destX, y + 5 + destLines.length * 5);

  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Libreville, le ' + today(), PW - M.right, y, { align: 'right' });
  y += 10;

  // Objet
  doc.setFillColor(232, 245, 238);
  doc.rect(M.left, y - 3, CW, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 98, 51);
  doc.text('OBJET : Candidature au poste de ' + val('m-poste'), M.left + 2, y + 2);
  y += 14;

  // Corps de la lettre
  const exp = val('m-experience');
  const corps = [
    `Monsieur / Madame le Directeur,`,
    ``,
    `J'ai l'honneur de me présenter à vous afin de postuler au poste de ${val('m-poste')} au sein de ${val('m-ministere')}.`,
    ``,
    `Titulaire d'un ${val('m-diplome')}, je souhaite mettre mes compétences et ma formation au service de l'administration gabonaise et contribuer activement aux missions de votre département.`,
    ``,
    exp ? `Au cours de ma carrière, ${exp}` : `Je suis convaincu(e) que mes qualifications académiques ainsi que ma motivation à servir l'intérêt général font de moi un(e) candidat(e) sérieux(se) et engagé(e).`,
    ``,
    `Je reste disponible pour tout entretien que vous jugeriez utile et vous prie de trouver ci-joint mon dossier de candidature.`,
    ``,
    `Dans l'attente d'une réponse favorable, veuillez agréer, Monsieur / Madame le Directeur, l'expression de ma haute considération.`
  ];

  corps.forEach(line => {
    const ls = doc.splitTextToSize(line, CW);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(ls, M.left, y);
    y += ls.length * 5.5 + (line === '' ? 2 : 0);
  });

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(val('m-prenom') + ' ' + val('m-nom').toUpperCase(), PW - M.right, y, { align: 'right' });
  y += 18;
  doc.setDrawColor(180, 180, 180);
  doc.line(PW - M.right - 70, y, PW - M.right, y);

  addFooter(doc, ref);
  doc.save('lettre-motivation-' + val('m-nom').toLowerCase() + '.pdf');
}

// ===== 5. DEMANDE D'AUTORISATION =====
function genAutorisation() {
  const doc = createDoc();
  const ref = genRef('AUT');
  let y = addHeader(doc, "Demande d'Autorisation", 'Requête administrative officielle');

  // Entête expéditeur
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(val('a-prenom') + ' ' + val('a-nom').toUpperCase(), M.left, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  if (val('a-qualite')) doc.text(val('a-qualite'), M.left, y + 5);
  doc.text(val('a-adresse'), M.left, y + (val('a-qualite') ? 10 : 5));
  doc.text('Tél : ' + val('a-tel'), M.left, y + (val('a-qualite') ? 15 : 10));

  // Destinataire
  const destX = M.left + CW / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const destLines = doc.splitTextToSize(val('a-destinataire'), CW / 2 - 10);
  doc.text(destLines, destX, y);

  y += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Libreville, le ' + today(), PW - M.right, y, { align: 'right' });
  y += 10;

  doc.setFillColor(232, 245, 238);
  doc.rect(M.left, y - 3, CW, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 98, 51);
  doc.text('OBJET : Demande d\'autorisation — ' + val('a-objet'), M.left + 2, y + 2);
  y += 14;

  const corps = `Monsieur / Madame,\n\nJ'ai l'honneur de me présenter respectueusement auprès de votre haute autorité afin de solliciter votre autorisation concernant : ${val('a-objet')}.\n\n${val('a-details')}\n\nConscient(e) des réglementations en vigueur et soucieux(se) de respecter scrupuleusement les dispositions légales applicables, je m'engage à me conformer à toutes les conditions que vous jugerez nécessaire d'imposer.\n\nDans l'espoir d'une suite favorable à cette requête, je vous prie d'agréer, Monsieur / Madame, l'assurance de ma très haute considération.`;

  const lines = doc.splitTextToSize(corps, CW);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(lines, M.left, y);
  y += lines.length * 5.5 + 12;

  doc.text(val('a-prenom') + ' ' + val('a-nom').toUpperCase(), PW - M.right, y, { align: 'right' });
  y += 18;
  doc.setDrawColor(180, 180, 180);
  doc.line(PW - M.right - 70, y, PW - M.right, y);

  addFooter(doc, ref);
  doc.save('demande-autorisation-' + val('a-nom').toLowerCase() + '.pdf');
}

// ===== 6. LETTRE DE RÉCLAMATION =====
function genReclamation() {
  const doc = createDoc();
  const ref = genRef('REC');
  let y = addHeader(doc, 'Lettre de Réclamation', 'Réclamation officielle auprès d\'une administration');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(val('rec-prenom') + ' ' + val('rec-nom').toUpperCase(), M.left, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(val('rec-adresse'), M.left, y + 5);
  doc.text('Tél : ' + val('rec-tel'), M.left, y + 10);
  if (val('rec-email')) doc.text('Email : ' + val('rec-email'), M.left, y + 15);

  const destX = M.left + CW / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text('À', destX, y);
  const adminLines = doc.splitTextToSize(val('rec-admin'), CW / 2 - 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(adminLines, destX, y + 5);

  y += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Libreville, le ' + today(), PW - M.right, y, { align: 'right' });
  y += 10;

  if (val('rec-ref')) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Réf. dossier : ' + val('rec-ref'), M.left, y);
    y += 8;
  }

  doc.setFillColor(252, 235, 235);
  doc.rect(M.left, y - 3, CW, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 0, 0);
  doc.text('OBJET : Réclamation — ' + val('rec-objet'), M.left + 2, y + 2);
  y += 14;

  const corps = `Monsieur / Madame la Directrice,\n\nJ'ai l'honneur de me permettre de porter à votre connaissance les faits suivants :\n\n${val('rec-faits')}\n\nMalgré mes démarches antérieures, cette situation n'a pas encore reçu de réponse satisfaisante, ce qui me contraint à vous adresser la présente réclamation officielle.\n\nJe sollicite respectueusement votre intervention afin qu'une solution appropriée soit apportée dans les meilleurs délais.\n\nJe reste disponible pour fournir tout document complémentaire que vous jugerez nécessaire et vous prie de croire, Monsieur / Madame, en l'expression de mes salutations distinguées.`;

  const lines = doc.splitTextToSize(corps, CW);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(lines, M.left, y);
  y += lines.length * 5.5 + 12;

  doc.text(val('rec-prenom') + ' ' + val('rec-nom').toUpperCase(), PW - M.right, y, { align: 'right' });
  y += 18;
  doc.setDrawColor(180, 180, 180);
  doc.line(PW - M.right - 70, y, PW - M.right, y);

  addFooter(doc, ref);
  doc.save('reclamation-' + val('rec-nom').toLowerCase() + '.pdf');
}
