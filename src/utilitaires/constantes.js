// =============================================
// CONSTANTES SUDOKU AVEC BROUILLON ET INDICES LIMITÉS - VERSION FRANÇAISE COMPLÈTE
// =============================================

export const DIFFICULTES = {
  FACILE: 'facile',
  MOYEN: 'moyen',
  DIFFICILE: 'difficile'
};

export const STATUTS_JEU = {
  EN_COURS: 'enCours',
  TERMINE: 'termine',
  PAUSE: 'pause',
  EN_ATTENTE: 'enAttente',
  NOUVEAU: 'nouveau'
};

export const TOUCHES_NAVIGATION = {
  FLECHE_HAUT: 'ArrowUp',
  FLECHE_BAS: 'ArrowDown',
  FLECHE_GAUCHE: 'ArrowLeft',
  FLECHE_DROITE: 'ArrowRight',
  RETOUR_ARRIERE: 'Backspace',
  SUPPRIMER: 'Delete',
  ESPACE: ' ',
  ENTREE: 'Enter',
  TAB: 'Tab',
  ECHAP: 'Escape'
};

export const CLASSES_CSS = {
  CELLULE_BASE: 'cellule',
  CELLULE_INITIALE: 'celluleInitiale',
  CELLULE_SELECTIONNEE: 'celluleSelectionnee',
  CELLULE_SURLIGNEE: 'celluleSurlignee',
  CELLULE_INVALIDE: 'celluleInvalide',
  CELLULE_BROUILLON: 'celluleBrouillon',
  CELLULE_INDICE: 'celluleIndice',
  CELLULE_CORRECTE: 'celluleCorrecte',
  CELLULE_AVERTISSEMENT: 'celluleAvertissement',
  CELLULE_SAISIE: 'celluleSaisie',
  GRILLE: 'grilleSudoku',
  LIGNE_GRILLE: 'ligneGrille',
  CONTENEUR_GRILLE: 'conteneurGrille'
};

export const MESSAGES = {
  // Messages de félicitations
  FELICITATIONS: '🎉 Félicitations ! Puzzle résolu avec succès !',
  VICTOIRE_PARFAITE: '🌟 Victoire parfaite ! Aucune erreur commise !',
  VICTOIRE_AVEC_AIDES: '✨ Bravo ! Puzzle terminé avec {nombreIndices} aide(s)',
  
  // Messages d'erreur
  ERREURS_DETECTEES: '⚠️ Erreurs détectées dans la grille',
  ERREUR_CELLULE: '❌ Cette valeur entre en conflit',
  CELLULE_NON_MODIFIABLE: '🔒 Cette cellule ne peut pas être modifiée',
  
  // Messages de statut
  JEU_EN_COURS: '🎮 Partie en cours...',
  JEU_EN_PAUSE: '⏸️ Jeu mis en pause',
  JEU_NOUVEAU: '🆕 Nouvelle partie',
  
  // Messages d'indices
  LIMITE_INDICES_ATTEINTE: '💡 Limite d\'indices atteinte pour cette difficulté',
  AUCUN_INDICE_DISPONIBLE: '❌ Aucun indice disponible pour le moment',
  INDICE_UTILISE: '✨ Indice utilisé avec succès',
  INDICE_CELLULE_SELECTIONNEE: '🎯 Indice appliqué à la cellule sélectionnée',
  
  // Messages de brouillon
  MODE_BROUILLON_ACTIVE: '📝 Mode brouillon activé - Notez vos possibilités',
  MODE_BROUILLON_DESACTIVE: '✏️ Mode brouillon désactivé - Saisie normale',
  BROUILLON_AJOUTE: '➕ Valeur ajoutée au brouillon',
  BROUILLON_RETIRE: '➖ Valeur retirée du brouillon',
  BROUILLON_EFFACE: '🧹 Brouillons effacés',
  BROUILLON_LIMITE: '📋 Maximum 5 valeurs par cellule en brouillon',
  
  // Messages d'actions
  MOUVEMENT_ANNULE: '↶ Dernier mouvement annulé',
  PARTIE_REINITIALISEE: '🔄 Partie réinitialisée',
  PARTIE_RESOLUE: '🎯 Puzzle résolu automatiquement',
  NOUVELLE_PARTIE: '🆕 Nouvelle partie commencée',
  
  // Messages de confirmation
  CONFIRMER_NOUVEAU_JEU: 'Êtes-vous sûr de vouloir commencer une nouvelle partie ?',
  CONFIRMER_REINITIALISER: 'Voulez-vous vraiment réinitialiser la partie actuelle ?',
  CONFIRMER_RESOUDRE: 'Voulez-vous que le jeu résolve automatiquement le puzzle ?',
  CONFIRMER_CHANGER_DIFFICULTE: 'Changer la difficulté va commencer une nouvelle partie. Continuer ?',
  
  // Messages de sauvegarde
  PARTIE_SAUVEGARDEE: '💾 Partie sauvegardée',
  PARTIE_CHARGEE: '📂 Partie chargée',
  ERREUR_SAUVEGARDE: '❌ Erreur lors de la sauvegarde',
  ERREUR_CHARGEMENT: '❌ Erreur lors du chargement'
};

// Configuration des limites par difficulté
export const LIMITES_DIFFICULTE = {
  [DIFFICULTES.FACILE]: {
    casesARetirer: 35,
    maxTentatives: 100,
    maxIndices: 8,
    couleurTheme: '#28a745',
    nomAffichage: 'Facile',
    description: 'Idéal pour débuter'
  },
  [DIFFICULTES.MOYEN]: {
    casesARetirer: 45,
    maxTentatives: 150,
    maxIndices: 5,
    couleurTheme: '#ffc107',
    nomAffichage: 'Moyen',
    description: 'Un bon défi'
  },
  [DIFFICULTES.DIFFICILE]: {
    casesARetirer: 55,
    maxTentatives: 200,
    maxIndices: 3,
    couleurTheme: '#dc3545',
    nomAffichage: 'Difficile',
    description: 'Pour les experts'
  }
};

// Types de saisie
export const TYPES_SAISIE = {
  NORMAL: 'normal',
  BROUILLON: 'brouillon',
  INDICE: 'indice',
  CORRECTION: 'correction'
};

// Modes d'interaction
export const MODES_INTERACTION = {
  CLAVIER: 'clavier',
  TACTILE: 'tactile',
  SOURIS: 'souris',
  MIXTE: 'mixte'
};

// Configuration du brouillon
export const CONFIG_BROUILLON = {
  MAX_VALEURS_PAR_CELLULE: 5,
  TAILLE_POLICE_RELATIVE: 0.6,
  ESPACEMENT_GRILLE: '1fr 1fr 1fr',
  COULEUR_DEFAUT: '#6b7280',
  COULEUR_ACTIF: '#3b82f6',
  ANIMATION_DUREE: 200
};

// Événements personnalisés
export const EVENEMENTS_JEU = {
  CELLULE_SELECTIONNEE: 'celluleSelectionnee',
  CELLULE_MODIFIEE: 'celluleModifiee',
  BROUILLON_MODIFIE: 'brouillonModifie',
  INDICE_UTILISE: 'indiceUtilise',
  ERREUR_DETECTEE: 'erreurDetectee',
  JEU_TERMINE: 'jeuTermine',
  MODE_BROUILLON_CHANGE: 'modeBrouillonChange',
  DIFFICULTE_CHANGEE: 'difficulteChangee'
};

// Configuration du stockage local
export const STOCKAGE_LOCAL = {
  CLE_PARTIE_ACTUELLE: 'sudoku_partie_actuelle',
  CLE_STATISTIQUES: 'sudoku_statistiques',
  CLE_PREFERENCES: 'sudoku_preferences',
  CLE_HISTORIQUE: 'sudoku_historique',
  VERSION_DONNEES: '1.0'
};

// Raccourcis clavier groupés
export const RACCOURCIS_CLAVIER = {
  navigation: {
    haut: 'ArrowUp',
    bas: 'ArrowDown',
    gauche: 'ArrowLeft',
    droite: 'ArrowRight',
    suivant: 'Tab',
    precedent: 'Shift+Tab'
  },
  saisie: {
    chiffres: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    effacer: ['Backspace', 'Delete', '0'],
    brouillonForce: 'Alt+{chiffre}'
  },
  actions: {
    brouillon: ['b', 'B', ' '],
    indice: ['h', 'H'],
    annuler: ['u', 'U', 'Ctrl+z'],
    pause: ['p', 'P'],
    nouveau: ['n', 'N'],
    aide: ['F1', '?']
  }
};

// Configuration des animations
export const ANIMATIONS = {
  dureeRapide: 150,
  dureeNormale: 300,
  dureeLente: 600,
  easingDefaut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easingRebond: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

// Configuration responsive
export const POINTS_RUPTURE = {
  mobile: 480,
  tablette: 768,
  desktop: 1024,
  grandEcran: 1280
};

// Couleurs du thème
export const COULEURS_THEME = {
  primaire: '#3b82f6',
  secondaire: '#6b7280',
  succes: '#10b981',
  avertissement: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  
  // Couleurs de fond
  fondClair: '#ffffff',
  fondSombre: '#1f2937',
  fondOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Couleurs de texte
  texteClairPrimaire: '#111827',
  texteClairSecondaire: '#6b7280',
  texteSombrePrimaire: '#f9fafb',
  texteSombreSecondaire: '#d1d5db'
};

// Configuration des sons (pour usage futur)
export const SONS = {
  selectionCellule: 'click.mp3',
  saisieChiffre: 'key.mp3',
  erreur: 'error.mp3',
  succes: 'success.mp3',
  victoire: 'victory.mp3',
  indice: 'hint.mp3'
};

// Statistiques par défaut
export const STATISTIQUES_DEFAUT = {
  partiesJouees: 0,
  partiesTerminees: 0,
  tempsTotal: 0,
  meilleurTemps: null,
  indicesMoyens: 0,
  erreursMoyennes: 0,
  statistiquesParDifficulte: {
    [DIFFICULTES.FACILE]: { parties: 0, victoires: 0, temps: 0 },
    [DIFFICULTES.MOYEN]: { parties: 0, victoires: 0, temps: 0 },
    [DIFFICULTES.DIFFICILE]: { parties: 0, victoires: 0, temps: 0 }
  }
};

// Validation des constantes
export const VALIDATION = {
  chiffreValide: /^[1-9]$/,
  difficulteValide: Object.values(DIFFICULTES),
  statutValide: Object.values(STATUTS_JEU),
  typeSaisieValide: Object.values(TYPES_SAISIE)
};

// Messages d'aide contextuelle
export const AIDE_CONTEXTUELLE = {
  premiereLancement: 'Bienvenue ! Utilisez les flèches pour naviguer et les chiffres 1-9 pour remplir les cases.',
  modeBrouillon: 'Mode brouillon activé. Vous pouvez maintenant noter plusieurs possibilités par case.',
  premiereErreur: 'Cette valeur entre en conflit. Les cellules en erreur sont surlignées en rouge.',
  premierIndice: 'Un indice a été placé pour vous aider. Utilisez-les avec parcimonie !',
  presqueTermine: 'Plus que quelques cases ! Vous y êtes presque !',
  sansErreur: 'Excellent ! Aucune erreur jusqu\'à présent.'
};

// Configuration de performance
export const PERFORMANCE = {
  intervalleMinuteur: 1000, // 1 seconde
  delaiSauvegarde: 5000, // 5 secondes
  maxHistorique: 100, // Nombre maximum de mouvements en historique
  timeoutValidation: 300 // Délai avant validation automatique
};

// Utilitaires de validation
export const UTILITAIRES_VALIDATION = {
  /**
   * Vérifie si un chiffre est valide (1-9)
   * @param {string|number} chiffre - Le chiffre à vérifier
   * @returns {boolean} True si valide
   */
  estChiffreValide: (chiffre) => {
    return VALIDATION.chiffreValide.test(chiffre.toString());
  },

  /**
   * Vérifie si une difficulté est valide
   * @param {string} difficulte - La difficulté à vérifier
   * @returns {boolean} True si valide
   */
  estDifficulteValide: (difficulte) => {
    return VALIDATION.difficulteValide.includes(difficulte);
  },

  /**
   * Vérifie si un statut de jeu est valide
   * @param {string} statut - Le statut à vérifier
   * @returns {boolean} True si valide
   */
  estStatutValide: (statut) => {
    return VALIDATION.statutValide.includes(statut);
  },

  /**
   * Vérifie si un type de saisie est valide
   * @param {string} type - Le type à vérifier
   * @returns {boolean} True si valide
   */
  estTypeSaisieValide: (type) => {
    return VALIDATION.typeSaisieValide.includes(type);
  }
};

// Configuration des zones de la grille (sections 3x3)
export const ZONES_GRILLE = {
  /**
   * Obtient l'index de la zone 3x3 pour une position donnée
   * @param {number} ligne - Index de ligne (0-8)
   * @param {number} colonne - Index de colonne (0-8)
   * @returns {number} Index de la zone (0-8)
   */
  obtenirIndexZone: (ligne, colonne) => {
    return Math.floor(ligne / 3) * 3 + Math.floor(colonne / 3);
  },

  /**
   * Obtient toutes les positions d'une zone 3x3
   * @param {number} indexZone - Index de la zone (0-8)
   * @returns {Array} Tableau des positions {ligne, colonne}
   */
  obtenirPositionsZone: (indexZone) => {
    const positions = [];
    const ligneDebut = Math.floor(indexZone / 3) * 3;
    const colonneDebut = (indexZone % 3) * 3;
    
    for (let ligne = ligneDebut; ligne < ligneDebut + 3; ligne++) {
      for (let colonne = colonneDebut; colonne < colonneDebut + 3; colonne++) {
        positions.push({ ligne, colonne });
      }
    }
    
    return positions;
  }
};

// Configuration des notifications
export const NOTIFICATIONS = {
  types: {
    INFO: 'info',
    SUCCES: 'succes',
    AVERTISSEMENT: 'avertissement',
    ERREUR: 'erreur'
  },
  dureeAffichage: {
    COURTE: 2000,
    NORMALE: 3000,
    LONGUE: 5000
  },
  positions: {
    HAUT_CENTRE: 'haut-centre',
    HAUT_DROITE: 'haut-droite',
    BAS_CENTRE: 'bas-centre',
    BAS_DROITE: 'bas-droite'
  }
};

// Export par défaut avec toutes les constantes
export default {
  DIFFICULTES,
  STATUTS_JEU,
  TOUCHES_NAVIGATION,
  CLASSES_CSS,
  MESSAGES,
  LIMITES_DIFFICULTE,
  TYPES_SAISIE,
  MODES_INTERACTION,
  CONFIG_BROUILLON,
  EVENEMENTS_JEU,
  STOCKAGE_LOCAL,
  RACCOURCIS_CLAVIER,
  ANIMATIONS,
  POINTS_RUPTURE,
  COULEURS_THEME,
  SONS,
  STATISTIQUES_DEFAUT,
  VALIDATION,
  AIDE_CONTEXTUELLE,
  PERFORMANCE,
  UTILITAIRES_VALIDATION,
  ZONES_GRILLE,
  NOTIFICATIONS
};