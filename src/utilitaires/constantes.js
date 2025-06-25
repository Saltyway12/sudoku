// =============================================
// CONSTANTES SUDOKU SYNCHRONISÉES AVEC LE NOUVEAU CSS
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

// ✅ CLASSES CSS POUR COMPOSANTS (non-modules)
export const CLASSES_CSS = {
  // Classes globales (non CSS modules)
  CONTENEUR_APP: 'app',
  ZONE_JEU_PRINCIPALE: 'zone-jeu-principale',
  CONTENEUR_JEU: 'conteneur-jeu',
  PANNEAU_CONTROLES: 'panneau-controles-principal',
  
  // Classes de boutons globaux
  BTN_ACTION: 'btn-action',
  BTN_PRIMAIRE: 'btn-primaire',
  BTN_SECONDAIRE: 'btn-secondaire',
  BTN_NOUVEAU: 'btn-nouveau',
  BTN_PAUSE: 'btn-pause',
  BTN_INDICE: 'btn-indice',
  BTN_VERIFIER: 'btn-verifier',
  BTN_RESET: 'btn-reset',
  BTN_RESOUDRE: 'btn-resoudre',
  
  // Classes d'animation globales
  VALIDATION_REUSSIE: 'validation-reussie',
  NOUVELLE_VALEUR: 'nouvelle-valeur',
  ERREUR_ANIMATION: 'erreur-animation'
};

// ✅ CLASSES CSS MODULES (pour référence dans les composants)
export const CSS_MODULES_CLASSES = {
  // Cellule.module.css
  CELLULE: {
    CELLULE: 'cellule',
    CELLULE_INITIALE: 'celluleInitiale',
    CELLULE_SELECTIONNEE: 'celluleSelectionnee',
    CELLULE_SURLIGNEE: 'celluleSurlignee',
    CELLULE_INVALIDE: 'celluleInvalide',
    CELLULE_BROUILLON: 'celluleBrouillon',
    CONTENEUR_BROUILLON: 'conteneurBrouillon',
    CONTENU_BROUILLON: 'contenuBrouillon',
    VALEUR_BROUILLON: 'valeurBrouillon'
  },
  
  // GrilleSudoku.module.css
  GRILLE: {
    GRILLE_SUDOKU: 'grilleSudoku',
    GRILLE_MOBILE: 'grilleMobile',
    GRILLE_TACTILE: 'grilleTactile',
    GRILLE_MODE_BROUILLON: 'grilleModeBrouillon'
  }
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

// ✅ CONFIGURATION DES LIMITES SYNCHRONISÉE AVEC LE CSS
export const LIMITES_DIFFICULTE = {
  [DIFFICULTES.FACILE]: {
    casesARetirer: 35,
    maxTentatives: 100,
    maxIndices: 8,
    couleurTheme: '#10b981', // ✅ Synchronisé avec CSS
    couleurBordure: '#10b981',
    nomAffichage: 'Facile',
    description: 'Idéal pour débuter',
    dataAttribute: 'facile'
  },
  [DIFFICULTES.MOYEN]: {
    casesARetirer: 45,
    maxTentatives: 150,
    maxIndices: 5,
    couleurTheme: '#f59e0b', // ✅ Synchronisé avec CSS
    couleurBordure: '#f59e0b',
    nomAffichage: 'Moyen',
    description: 'Un bon défi',
    dataAttribute: 'moyen'
  },
  [DIFFICULTES.DIFFICILE]: {
    casesARetirer: 55,
    maxTentatives: 200,
    maxIndices: 3,
    couleurTheme: '#ef4444', // ✅ Synchronisé avec CSS
    couleurBordure: '#ef4444',
    nomAffichage: 'Difficile',
    description: 'Pour les experts',
    dataAttribute: 'difficile'
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

// ✅ CONFIGURATION DU BROUILLON SYNCHRONISÉE
export const CONFIG_BROUILLON = {
  MAX_VALEURS_PAR_CELLULE: 5,
  GRILLE_TEMPLATE: 'repeat(3, 1fr)',
  CLASSES: {
    CONTENEUR: 'contenu-brouillon',
    VALEUR: 'valeur-brouillon',
    INDICATEUR: 'indicateur-mode-brouillon'
  },
  TAILLES_POLICE: {
    DESKTOP: 'calc(var(--taille-cellule-desktop) * 0.18)',
    TABLETTE: 'calc(var(--taille-cellule-tablette) * 0.2)',
    MOBILE: 'calc(var(--taille-cellule-mobile) * 0.22)'
  }
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
  VERSION_DONNEES: '2.0' // ✅ Mise à jour pour la nouvelle version
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

// ✅ CONFIGURATION DES ANIMATIONS SYNCHRONISÉE AVEC CSS
export const ANIMATIONS = {
  durees: {
    rapide: 150,
    normale: 250, // ✅ Correspond à --transition-normale
    lente: 400   // ✅ Correspond à --transition-lente
  },
  easings: {
    defaut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    rebond: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    entree: 'ease-out',
    sortie: 'ease-in'
  },
  classes: {
    APPARITION_GRILLE: 'apparitionGrille',
    APPARITION_CELLULE: 'apparitionCellule',
    SECOUSSE_ERREUR: 'secousseErreur',
    PULSATION_INDICE: 'pulsationIndice',
    CELEBRATION: 'celebration',
    FADE_IN: 'fade-in',
    SLIDE_IN_RIGHT: 'slide-in-right',
    BOUNCE_IN: 'bounce-in'
  }
};

// ✅ POINTS DE RUPTURE SYNCHRONISÉS AVEC CSS
export const POINTS_RUPTURE = {
  mobile: 480,
  tablette: 768,
  desktop: 1024,
  grandEcran: 1280,
  
  // Media queries correspondantes
  mediaQueries: {
    mobile: '@media (max-width: 480px)',
    tablette: '@media (max-width: 768px)',
    desktop: '@media (min-width: 769px)',
    grandEcran: '@media (min-width: 1280px)',
    mobilePortrait: '@media (max-width: 480px) and (orientation: portrait)',
    mobilePaysage: '@media (max-width: 768px) and (orientation: landscape) and (max-height: 500px)'
  }
};

// ✅ COULEURS DU THÈME SYNCHRONISÉES AVEC LES VARIABLES CSS
export const COULEURS_THEME = {
  // Couleurs principales (correspondent aux variables CSS)
  primaire: '#3b82f6',      // --couleur-primaire
  secondaire: '#6b7280',
  succes: '#10b981',        // --couleur-succes
  avertissement: '#f59e0b', // --couleur-avertissement
  danger: '#ef4444',        // --couleur-danger
  info: '#06b6d4',         // --couleur-info
  
  // Couleurs de fond
  fondClair: '#ffffff',           // --couleur-cellule
  fondSombre: '#1f2937',          // --sombre-fond-principal
  fondGrille: '#2c3e50',          // --couleur-fond-grille
  fondOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Couleurs de texte
  texteClairPrimaire: '#1e293b',  // --couleur-texte
  texteClairSecondaire: '#6b7280',
  texteSombrePrimaire: '#f9fafb', // --sombre-texte-principal
  texteSombreSecondaire: '#9ca3af', // --sombre-texte-secondaire
  
  // Couleurs de bordure
  bordureClaire: '#e2e8f0',       // --couleur-bordure
  bordureFocus: '#3b82f6',        // --couleur-bordure-focus
  bordureSombre: '#4b5563',       // --sombre-bordure-claire
  
  // Couleurs d'état des cellules
  cellules: {
    normale: '#ffffff',           // --couleur-cellule
    initiale: '#f1f5f9',         // --couleur-cellule-initiale
    selectionnee: '#dbeafe',      // --couleur-cellule-selectionnee
    erreur: '#fee2e2',           // --couleur-cellule-erreur
    succes: '#dcfce7',           // --couleur-cellule-succes
    surlignee: '#fef3c7',
    avertissement: '#fffbeb'
  }
};

// ✅ TAILLES DE CELLULES SYNCHRONISÉES AVEC CSS
export const TAILLES_CELLULES = {
  desktop: 55,    // --taille-cellule-desktop
  tablette: 45,   // --taille-cellule-tablette
  mobile: 'min(calc((100vw - 80px) / 9), 38px)', // --taille-cellule-mobile
  
  // Formules CSS correspondantes
  variablesCSS: {
    desktop: 'var(--taille-cellule-desktop)',
    tablette: 'var(--taille-cellule-tablette)',
    mobile: 'var(--taille-cellule-mobile)'
  },
  
  // Calculs de police
  fontes: {
    desktop: 'calc(var(--taille-cellule-desktop) * 0.5)',
    tablette: 'calc(var(--taille-cellule-tablette) * 0.5)',
    mobile: 'calc(var(--taille-cellule-mobile) * 0.55)'
  }
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

// ✅ CONFIGURATION DES ZONES DE LA GRILLE AMÉLIORÉE
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
  },

  /**
   * Obtient les sélecteurs CSS pour les bordures de section
   * @returns {Object} Sélecteurs CSS pour les bordures épaisses
   */
  obtenirSelecteursBordures: () => {
    return {
      borduresVerticales: [
        '.grilleSudoku > .cellule:nth-child(3n):not(:nth-child(9n))',
        '.grilleSudoku > .cellule:nth-child(6n):not(:nth-child(9n))'
      ],
      borduresHorizontales: [
        '.grilleSudoku > .cellule:nth-child(n+19):nth-child(-n+27)',
        '.grilleSudoku > .cellule:nth-child(n+46):nth-child(-n+54)'
      ],
      coinsSpeciaux: [
        '.grilleSudoku > .cellule:nth-child(21)',
        '.grilleSudoku > .cellule:nth-child(24)',
        '.grilleSudoku > .cellule:nth-child(48)',
        '.grilleSudoku > .cellule:nth-child(51)'
      ]
    };
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

// ✅ DATA ATTRIBUTES POUR LE CSS
export const DATA_ATTRIBUTES = {
  DIFFICULTE: 'data-difficulty',
  SOLVING: 'data-solving',
  COMPLETED: 'data-completed',
  ERRORS: 'data-errors',
  PAUSED: 'data-paused',
  HINT: 'data-hint',
  INPUT_MODE: 'data-input-mode',
  MODE_BROUILLON: 'data-mode-brouillon'
};

// ✅ HELPERS POUR L'INTÉGRATION CSS
export const CSS_HELPERS = {
  /**
   * Applique une classe CSS temporairement
   * @param {HTMLElement} element - L'élément
   * @param {string} classe - La classe à appliquer
   * @param {number} duree - Durée en ms
   */
  appliquerClasseTemporaire: (element, classe, duree = ANIMATIONS.durees.normale) => {
    element.classList.add(classe);
    setTimeout(() => {
      element.classList.remove(classe);
    }, duree);
  },

  /**
   * Définit un data attribute
   * @param {HTMLElement} element - L'élément
   * @param {string} attribut - Le nom de l'attribut
   * @param {string} valeur - La valeur
   */
  definirDataAttribute: (element, attribut, valeur) => {
    element.setAttribute(attribut, valeur);
  },

  /**
   * Obtient les variables CSS comme objet
   * @returns {Object} Variables CSS
   */
  obtenirVariablesCSS: () => {
    return {
      '--couleur-primaire': COULEURS_THEME.primaire,
      '--couleur-succes': COULEURS_THEME.succes,
      '--couleur-avertissement': COULEURS_THEME.avertissement,
      '--couleur-danger': COULEURS_THEME.danger,
      '--couleur-info': COULEURS_THEME.info
    };
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
  TAILLES_CELLULES,
  SONS,
  STATISTIQUES_DEFAUT,
  VALIDATION,
  AIDE_CONTEXTUELLE,
  PERFORMANCE,
  UTILITAIRES_VALIDATION,
  ZONES_GRILLE,
  NOTIFICATIONS,
  DATA_ATTRIBUTES,
  CSS_HELPERS
};