// Contenu facile à modifier : listes de paquetage, alphabet, idées.
export type PackKey = 'terrain' | 'perm' | 'stage';

export const PACKS: Record<PackKey, Record<string, string[]>> = {
  terrain: {
    Tenue: ['Treillis (x2)', 'Tee-shirts (x3)', 'Sous-vêtements (x4)', 'Chaussettes (x5)', 'Rangers + lacets de rechange', 'Polaire', 'Veste de pluie / poncho', 'Bonnet et gants'],
    Couchage: ['Sac de couchage', 'Tapis de sol', 'Sac à viande', 'Tente / tarp + cordelette'],
    Orientation: ['Carte 1/25 000 + porte-carte', 'Boussole', 'Crayon gras / feutres', 'Lampe frontale (filtre rouge) + piles'],
    'Vivres et eau': ['Gourde / poche à eau', 'Gamelle et couverts', 'Rations / encas', 'Pastilles de purification'],
    'Hygiène et soin': ['Trousse de toilette', 'Pansements / ampoules', 'Crème solaire', 'Médicaments perso'],
    Divers: ['Couteau multifonction', 'Sacs étanches', 'Batterie externe + câble', "Carte militaire / pièce d'identité"],
  },
  perm: {
    Papiers: ['Carte militaire', "Pièce d'identité", 'Billet de train', 'Carte bancaire'],
    Affaires: ['Tenue civile', 'Trousse de toilette', 'Chargeur', 'Linge sale à laver', 'Clés'],
  },
  stage: {
    Papiers: ['Convocation / ordre de mission', 'Carte militaire', 'Carnet de notes + stylos'],
    Tenues: ['Tenue de travail', 'Tenue de sortie', 'Tenue de sport + baskets', 'Serviette'],
    Chambre: ['Cadenas', 'Cintres', 'Trousse de toilette', 'Médicaments perso'],
  },
};

export const NATO =
  'Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu'.split(' ');

export const TIPS = [
  '360° = 6 400 millièmes · 1° ≈ 17,8 millièmes',
  'Règle du millième : à 1 km, 1 millième ≈ 1 m de largeur',
  'Azimut inverse : ajoute ou retire 180° (3 200 millièmes)',
  'Courbes de niveau au 1/25 000 : en général tous les 5 m (vérifie la marge)',
  'Lire une coordonnée : d’abord vers la droite, puis vers le haut',
];

export const IDEAS: [string, string][] = [
  ['Points enregistrés', 'Sauvegarder des points (RDV, objectif) et les retrouver en MGRS.'],
  ['Itinéraire par azimuts', 'Préparer une marche en plusieurs segments : azimut + distance + doubles pas.'],
  ['Chrono de marche', "Temps, vitesse moyenne et heure d'arrivée estimée."],
  ['Mode nuit rouge', 'Écran tout en rouge pour garder la vision de nuit.'],
  ['Messages radio', "Modèles de comptes rendus à remplir, et l'alphabet en audio."],
  ['Secourisme', 'Fiches réflexes : saignement, hypothermie, coup de chaleur.'],
];
