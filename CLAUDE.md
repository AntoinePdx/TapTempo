# Tap Tempo

Web app de tap tempo pour iPhone : fichiers statiques sur GitHub Pages, installée sur l'écran d'accueil via Safari (PWA, utilisable hors ligne).

## Fichiers

- `index.html` : toute l'app (HTML + CSS + JS vanilla dans une IIFE). Aucun framework, aucun build.
- `sw.js` : service worker, cache-first. Cache nommé par la constante `VERSION` (actuellement `tap-tempo-v4`).
- `manifest.webmanifest` : manifeste PWA (standalone, portrait, fond `#0d0e12`).
- `icons/` : `icon-180.png` (apple-touch-icon), `icon-192.png`, `icon-512.png` (sert aussi d'icône maskable).
- `fonts/` : polices auto-hébergées en woff2, sous-ensemble latin (Big Shoulders Display variable, IBM Plex Mono 400 et 600) + licences OFL. Pas de Google Fonts.
- `README.md` : mise en ligne et utilisation (en français).

## Fonctionnement

- Pavé TAP : détection au `pointerdown` (pas de délai de 300 ms) ; taps espacés de moins de 120 ms ignorés (`MIN_GAP`).
- BPM = régression linéaire (moindres carrés) du temps de tap en fonction de son index, sur les 12 derniers taps (`WINDOW`). Pente = intervalle entre temps.
- « Locked » dès 6 taps si la gigue (écart-type des résidus) est < max(18 ms, 3,5 % de l'intervalle).
- Nouvelle mesure après 2 s de silence (`RESET_AFTER`, ou 2,2 × l'intervalle si plus long), ou si un écart sort de [0,6 ; 1,6] × l'intervalle (à partir de 4 taps). Après une pause, l'ancien tempo reste affiché (×2/÷2 intégré) jusqu'au 2e tap.
- `÷2` / `×2` : multiplicateur `factor` appliqué à l'estimation (bornes 20–400 BPM).
- Copy BPM (presse-papiers), Reset.
- Click : métronome Web Audio (ordonnanceur à anticipation : `setInterval` de 25 ms, fenêtre de 120 ms), grille ancrée sur le dernier tap, le 1er tap de la mesure étant un temps fort (accent tous les 4 clics, y compris en ×2/÷2) ; flash visuel synchronisé sur le pavé. Reprise après interruption iOS (état `interrupted`) et pas de rafale après un passage en arrière-plan.
- Wake lock d'écran demandé à chaque tap, au démarrage du Click et au retour dans l'app ; dernier BPM gardé dans `localStorage` (`tt.bpm`).
- Clavier : Espace / Entrée / T pour taper, Échap / R pour remettre à zéro (ignorés avec Cmd/Ctrl/Alt).
- Service worker : cache-first, pré-cache avec `cache: 'reload'`. La page cherche une mise à jour à chaque retour dans l'app et recharge quand elle est inactive ou masquée.
- Paysage (iOS ignore l'orientation du manifest) : lecture à gauche, pavé à droite.
- Mode silencieux : le Click est muet si le bouton silence est activé. `navigator.audioSession.type = 'playback'` le rendrait audible, mais risque de couper la musique d'une autre app : non retenu pour l'instant.

## Design (à respecter)

Thème sombre unique, bleu pervenche en accent :

| Token | Valeur |
|---|---|
| `--bg` | `#0d0e12` |
| `--panel` | `#16171d` |
| `--pad` | `#1b1d24` |
| `--pad-hit` | `#262936` |
| `--line` | `#2f3240` |
| `--fg` | `#eceef6` |
| `--dim` | `#868a9c` |
| `--accent` | `#8b9dff` |
| `--accent-soft` | `rgba(139, 157, 255, .16)` |

- Polices : **Big Shoulders Display** (chiffre BPM, mot TAP) et **IBM Plex Mono** (toute l'interface).
- Logo : 4 barres arrondies figurant une mesure à 4 temps. La première est haute et bleue (temps fort), les trois autres courtes et claires.
- Interface en anglais, très simple et efficace. Pas d'orange, pas de fonctionnalités superflues.

## Contraintes

- Pas de npm, pas de framework, pas de build, pas de dépendances lourdes (le Mac a peu d'espace disque ; dev dans VS Code, sans Xcode). Le projet reste en fichiers statiques déployables tels quels sur GitHub Pages.
- Cible principale : Safari iOS en mode standalone (écran d'accueil). Respecter les safe areas ; pas de zoom ni de scroll parasite ; penser au bouton silence de l'iPhone pour le son du Click.
- **À chaque modification d'un fichier mis en cache (`index.html`, `manifest.webmanifest`, `icons/*`, `sw.js`), incrémenter `VERSION` dans `sw.js`** (`tap-tempo-v3` → `tap-tempo-v4`…), sinon les iPhones gardent l'ancienne version.
- Ne rien modifier sans l'avoir proposé d'abord à l'utilisateur.

## Tester

- En local : `python3 -m http.server 8000` dans ce dossier, puis http://localhost:8000. Le service worker ne s'enregistre qu'en HTTPS, donc pas de cache hors ligne en local.
- Sur iPhone : la version en ligne sur GitHub Pages, ouverte dans Safari puis installée sur l'écran d'accueil.
