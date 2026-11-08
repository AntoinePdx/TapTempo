# Tap Tempo

Web app de tap tempo pour iPhone, installable sur l'écran d'accueil et utilisable hors ligne.

## Mise en ligne (GitHub Pages)

1. Crée un dépôt (ex. `tap-tempo`) et dépose tout le contenu de ce dossier à la racine.
2. Settings → Pages → Source : **Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Ouvre `https://<ton-pseudo>.github.io/tap-tempo/` dans **Safari** sur l'iPhone.
4. Bouton Partager → **Sur l'écran d'accueil**.

## Utilisation

- Tape sur le grand pavé au rythme du morceau. Le tempo s'affiche dès 2 taps, se stabilise vers 6 (« Locked »).
- Une pause de 2 s, ou un changement net de tempo, relance une nouvelle mesure.
- `÷2` / `×2` corrigent un tempo compté en demi ou double temps.
- **Click** lance un métronome calé sur la phase de tes derniers taps.
- **Copy BPM** copie la valeur.
- Sur ordi : Espace / Entrée / T pour taper, Échap / R pour remettre à zéro.

## Notes

- Le métronome est muet si le bouton silence de l'iPhone est activé.
- Après une mise à jour, change `VERSION` dans `sw.js` pour que l'iPhone récupère la nouvelle version. L'app se recharge d'elle-même dès qu'elle est inactive ou passe en arrière-plan.
- Les polices (Big Shoulders Display, IBM Plex Mono) sont hébergées dans `fonts/` sous licence SIL OFL, pour fonctionner hors ligne.
