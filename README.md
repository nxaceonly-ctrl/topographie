# Azimut

Application **non officielle** d'aide au terrain : boussole (degrés / millièmes), coordonnées GPS ↔ MGRS, azimut et distance entre deux points, échelle de carte, compte-pas, et listes de paquetage (terrain, perm, stage).

Sans lien avec le ministère des Armées. Vérifie toujours avec ta carte et ta boussole réglementaires.

## Utiliser l'app

Version web : ouvre le lien GitHub Pages du dépôt dans Safari, puis Partager → « Sur l'écran d'accueil ».

## Structure

- `App.tsx` : en-tête et barre d'onglets
- `src/screens/` : Boussole, Carte, Paquetage, Mémo
- `src/data.ts` : listes de paquetage, alphabet, idées (facile à modifier)
- `src/geo.js` : calculs WGS84 → UTM / MGRS et inverse
- `src/heading.ts` : capteur de boussole (natif et web)
