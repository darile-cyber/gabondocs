# 🇬🇦 GabonDocs — Générateur de documents administratifs gabonais

## Description
Application web 100% client-side (HTML/CSS/JS) permettant de générer des documents administratifs gabonais officiels en PDF, prêts à imprimer.

## Documents disponibles
1. **Demande de casier judiciaire** (Bulletin n°3)
2. **Attestation de résidence**
3. **Déclaration de perte** (CNI, passeport, permis...)
4. **Lettre de motivation** (fonction publique)
5. **Demande d'autorisation** (administrative / commerciale)
6. **Lettre de réclamation** (CNSS, SEEG, mairie...)

## Modèle économique
- **500 FCFA par document** payés par Mobile Money (Airtel Money / Moov Money)
- 100 docs/mois = 50 000 FCFA
- 1 000 docs/mois = 500 000 FCFA
- **Zéro coût variable** — application 100% statique

## Installation
1. Décompresser le fichier ZIP
2. Ouvrir `index.html` dans un navigateur
3. **Fonctionne hors ligne** après premier chargement (jsPDF chargé en CDN)

## Stack technique
- HTML5 / CSS3 / JavaScript vanille
- [jsPDF 2.5.1](https://github.com/parallax/jsPDF) — génération PDF côté client
- Google Fonts (Playfair Display + DM Sans)
- Aucun framework, aucun backend, aucune dépendance npm

## Intégration paiement Mobile Money (production)
Actuellement en mode simulation. Pour la production, intégrer :

### Airtel Money Gabon
- API : https://developer.airtel.africa/
- Endpoint : POST /merchant/v1/payments/
- USSD fallback : *555#

### Moov Money Gabon
- Contact : partenaires@moov-africa.ga
- USSD : *150#

Dans `js/app.js`, modifier la fonction `confirmPayment()` pour appeler l'API réelle.

## Structure des fichiers
```
gabondocs/
├── index.html          # App principale
├── css/
│   └── style.css       # Styles complets
├── js/
│   ├── app.js          # Logique modals & paiement
│   └── pdf-generator.js # Génération PDF (6 documents)
└── README.md
```

## Personnalisation
- **Couleurs** : modifier les variables CSS dans `css/style.css` (`:root`)
- **Ajouter un document** : ajouter une `doc-card` dans `index.html`, un modal correspondant, et une fonction `genXXX()` dans `pdf-generator.js`
- **Logo** : remplacer l'emoji 🇬🇦 par une vraie image dans `.logo`

## Déploiement
L'app peut être hébergée sur :
- **Netlify** (glisser-déposer le dossier) — gratuit
- **GitHub Pages** — gratuit
- **Serveur local** chez un cybercafé
- **USB** partagé (fonctionne sans internet après premier chargement)

## Licence
© 2026 GabonDocs — Tous droits réservés
