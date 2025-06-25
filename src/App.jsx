import React, { useState, useEffect, useCallback } from 'react';
// ✅ Imports des composants selon votre structure
import GrilleSudoku from './composants/GrilleSudoku/GrilleSudoku.jsx';
import ClavierMobile from './composants/ClavierMobile.jsx';
import PanneauControles from './composants/PanneauControles.jsx';

// ✅ Imports des hooks
import useSudoku from './hooks/useSudoku.js';
import useMinuteur from './hooks/useMinuteur.js';
import useClavier from './hooks/useClavier.js';
import { useDetectionMobile } from './hooks/useDetectionMobile.js';

// ✅ Imports des utilitaires
import { 
  DIFFICULTES, 
  STATUTS_JEU, 
  MESSAGES, 
  TOUCHES_NAVIGATION,
  CLASSES_CSS,
  DATA_ATTRIBUTES 
} from './utilitaires/constantes.js';

// ✅ Imports CSS selon votre structure
import './styles/globals.css';
import './styles/PanneauControles.css';

const App = () => {
  const [difficulte, setDifficulte] = useState(DIFFICULTES.MOYEN);
  const [clavierMobileVisible, setClavierMobileVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const { estMobile, estTactile, estDesktop, classeAppareil } = useDetectionMobile();

  // Hook Sudoku amélioré avec brouillon et indices limités
  const sudoku = useSudoku(difficulte);

  // Hook minuteur avec auto-réinitialisation
  const minuteur = useMinuteur(sudoku.statutJeu, sudoku.heureDebut);

  // Fonction pour afficher une notification
  const afficherNotification = useCallback((message, type = 'info', duree = 3000) => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), duree);
  }, []);

  // Gestionnaires pour le panneau de contrôles
  const gererChangementDifficulte = useCallback((nouvelleDifficulte) => {
    if (sudoku.mouvements.length > 0) {
      const confirmation = window.confirm('Changer la difficulté va commencer une nouvelle partie. Continuer ?');
      if (confirmation) {
        setDifficulte(nouvelleDifficulte);
        sudoku.nouveauJeu(nouvelleDifficulte);
        afficherNotification(`Nouvelle partie en difficulté ${nouvelleDifficulte}`, 'succes');
      }
    } else {
      setDifficulte(nouvelleDifficulte);
      sudoku.nouveauJeu(nouvelleDifficulte);
      afficherNotification(`Difficulté changée: ${nouvelleDifficulte}`, 'info');
    }
  }, [sudoku, afficherNotification]);

  const gererObtenirIndice = useCallback(() => {
    const resultat = sudoku.obtenirIndice();
    
    if (resultat && resultat.succes) {
      afficherNotification(resultat.message || 'Indice utilisé', 'succes');
    } else if (resultat && !resultat.succes) {
      afficherNotification(resultat.message || 'Aucun indice disponible', 'avertissement');
    }
    
    return resultat;
  }, [sudoku, afficherNotification]);

  const gererNouveauJeu = useCallback((nouvelleDifficulte = difficulte) => {
    if (sudoku.mouvements.length > 0) {
      const confirmation = window.confirm('Êtes-vous sûr de vouloir commencer une nouvelle partie ?');
      if (confirmation) {
        sudoku.nouveauJeu(nouvelleDifficulte);
        setClavierMobileVisible(false);
        afficherNotification('Nouvelle partie commencée', 'succes');
      }
    } else {
      sudoku.nouveauJeu(nouvelleDifficulte);
      setClavierMobileVisible(false);
      afficherNotification('Nouvelle partie commencée', 'succes');
    }
  }, [sudoku, difficulte, afficherNotification]);

  const gererReinitialiser = useCallback(() => {
    const confirmation = window.confirm('Voulez-vous vraiment réinitialiser la partie actuelle ?');
    if (confirmation) {
      sudoku.reinitialiserJeu();
      setClavierMobileVisible(false);
      afficherNotification('Partie réinitialisée', 'info');
    }
  }, [sudoku, afficherNotification]);

  const gererResoudre = useCallback(() => {
    const confirmation = window.confirm('Voulez-vous que le jeu résolve automatiquement le puzzle ?');
    if (confirmation) {
      sudoku.resoudreJeu();
      afficherNotification('Puzzle résolu automatiquement', 'info');
    }
  }, [sudoku, afficherNotification]);

  const gererAnnuler = useCallback(() => {
    const succes = sudoku.annulerMouvement();
    if (succes) {
      afficherNotification('Dernier mouvement annulé', 'info');
    }
  }, [sudoku, afficherNotification]);

  const gererBasculerBrouillon = useCallback(() => {
    const nouveauMode = sudoku.basculerModeBrouillon();
    const message = nouveauMode ? 
      'Mode brouillon activé - Notez vos possibilités' : 
      'Mode brouillon désactivé - Saisie normale';
    afficherNotification(message, 'info');
  }, [sudoku, afficherNotification]);

  // Hook clavier avec support brouillon
  useClavier({
    celluleSelectionnee: sudoku.celluleSelectionnee,
    statutJeu: sudoku.statutJeu,
    modeBrouillon: sudoku.modeBrouillon,
    mettreAJourCellule: sudoku.mettreAJourCellule,
    naviguerCellule: sudoku.naviguerCellule,
    obtenirIndice: gererObtenirIndice,
    annulerMouvement: gererAnnuler,
    basculerModeBrouillon: gererBasculerBrouillon,
    effacerBrouillonsCellule: sudoku.effacerBrouillonsCellule
  });

  // Gestion de la sélection de cellule
  const gererSelectionCellule = useCallback((ligne, colonne) => {
    sudoku.selectionnerCellule(ligne, colonne);
    
    // Afficher le clavier mobile sur les appareils tactiles
    if (estMobile && estTactile && sudoku.statutJeu === STATUTS_JEU.EN_COURS) {
      setClavierMobileVisible(true);
    }
  }, [sudoku, estMobile, estTactile]);

  // Gestion de la saisie depuis le clavier mobile
  const gererSaisieClavier = useCallback((valeur) => {
    if (!sudoku.celluleSelectionnee) return;
    
    const { ligne, colonne } = sudoku.celluleSelectionnee;
    const nouvelleValeur = valeur === null ? 0 : valeur;
    const typeSaisie = sudoku.modeBrouillon ? 'brouillon' : 'normal';
    
    sudoku.mettreAJourCellule(ligne, colonne, nouvelleValeur, typeSaisie);
    
    // Fermer le clavier après la saisie sur mobile seulement si ce n'est pas en mode brouillon
    if (estMobile && !sudoku.modeBrouillon) {
      setClavierMobileVisible(false);
    }
  }, [sudoku, estMobile]);

  // Fermer le clavier mobile
  const fermerClavierMobile = useCallback(() => {
    setClavierMobileVisible(false);
  }, []);

  const obtenirMessageStatut = useCallback(() => {
    if (sudoku.statutJeu === STATUTS_JEU.TERMINE) {
      return MESSAGES.FELICITATIONS;
    }
    if (sudoku.cellulesInvalides.length > 0) {
      return MESSAGES.ERREURS_DETECTEES;
    }
    return MESSAGES.JEU_EN_COURS;
  }, [sudoku.statutJeu, sudoku.cellulesInvalides.length]);

  // Obtenir les statistiques pour le panneau
  const statistiques = sudoku.obtenirStatistiques();

  // Classes CSS conditionnelles pour l'appareil - Utilisation des nouvelles classes
  const classesApp = `app ${classeAppareil} ${estTactile ? 'tactile' : 'souris'} ${sudoku.modeBrouillon ? 'mode-brouillon-global' : ''}`;

  // Effet pour la notification de fin de partie
  useEffect(() => {
    if (sudoku.statutJeu === STATUTS_JEU.TERMINE) {
      const message = sudoku.indicesUtilises === 0 ? 
        '🌟 Victoire parfaite ! Aucune aide utilisée !' : 
        `🎉 Bravo ! Puzzle terminé avec ${sudoku.indicesUtilises} aide(s)`;
      
      afficherNotification(message, 'succes', 5000);
    }
  }, [sudoku.statutJeu, sudoku.indicesUtilises, afficherNotification]);

  return (
    <div className={classesApp}>
      <header className="en-tete-principal">
        <div className="conteneur-titre-principal">
          <h1 className="titre-principal">Sudoku Interactif</h1>
          
          {/* Badge de difficulté */}
          <div 
            className="badge-difficulte-actuelle" 
            style={{ backgroundColor: sudoku.configurationDifficulte?.couleurTheme || '#6c757d' }}
          >
            {sudoku.difficulteActuelle}
          </div>
          
          {/* Indicateur mode brouillon global */}
          {sudoku.modeBrouillon && (
            <div className="badge-mode-brouillon-global">
              📝 Mode Brouillon
            </div>
          )}
        </div>
        
        <div className="informations-jeu">
          <div className="carte-info minuteur">
            <span className="icone-minuteur">⏱️</span>
            <span>Temps: {minuteur.formaterTemps()}</span>
            {minuteur.estEnPause && <span className="indicateur-pause">⏸️</span>}
          </div>
          
          <div className="carte-info statut-jeu">
            <span className="indicateur-statut"></span>
            {obtenirMessageStatut()}
          </div>
          
          <div className="carte-info progression-rapide">
            <span>{sudoku.pourcentageCompletion}%</span>
            <div className="barre-progression-mini">
              <div 
                className="barre-remplie-mini"
                style={{ 
                  width: `${sudoku.pourcentageCompletion}%`,
                  backgroundColor: sudoku.configurationDifficulte?.couleurTheme || '#007bff'
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="zone-jeu-principale">
        
        {/* Contrôles compacts pour mobile */}
        {estMobile && (
          <div className="controles-compacts-mobile">
            <div className="selecteur-difficulte">
              <label htmlFor="difficulte-mobile">Difficulté:</label>
              <select
                id="difficulte-mobile"
                value={difficulte}
                onChange={(e) => gererChangementDifficulte(e.target.value)}
                className="select-difficulte"
              >
                <option value={DIFFICULTES.FACILE}>Facile</option>
                <option value={DIFFICULTES.MOYEN}>Moyen</option>
                <option value={DIFFICULTES.DIFFICILE}>Difficile</option>
              </select>
            </div>

            <div className="boutons-rapides-mobile">
              <button 
                onClick={gererBasculerBrouillon} 
                className={`btn btn-brouillon ${sudoku.modeBrouillon ? 'actif' : ''}`}
              >
                📝 {sudoku.modeBrouillon ? 'Brouillon' : 'Normal'}
              </button>
              <button
                onClick={gererObtenirIndice}
                className="btn btn-indice"
                disabled={sudoku.indicesRestants === 0 || sudoku.statutJeu !== STATUTS_JEU.EN_COURS}
              >
                💡 Indice ({sudoku.indicesRestants})
              </button>
            </div>
          </div>
        )}

        {/* Conteneur de la grille */}
        <div className="conteneur-grille">
          <GrilleSudoku
            grille={sudoku.grilleActuelle}
            grilleInitiale={sudoku.grilleInitiale}
            grilleBrouillon={sudoku.grilleBrouillon}
            celluleSelectionnee={sudoku.celluleSelectionnee}
            onChangementCellule={sudoku.mettreAJourCellule}
            onSelectionCellule={gererSelectionCellule}
            cellulesInvalides={sudoku.cellulesInvalides}
            modeBrouillon={sudoku.modeBrouillon}
            obtenirBrouillonCellule={sudoku.obtenirBrouillonCellule}
            estCelluleEnBrouillon={sudoku.estCelluleEnBrouillon}
            estMobile={estMobile}
            estTactile={estTactile}
          />
        </div>

        {/* Statistiques rapides pour mobile */}
        {estMobile && (
          <div className="statistiques-rapides-mobile">
            <div className="stat-rapide">
              <span className="label-stat">Mouvements:</span>
              <span className="valeur-stat">{statistiques.nombreMouvements}</span>
            </div>
            <div className="stat-rapide">
              <span className="label-stat">Erreurs:</span>
              <span className="valeur-stat">{statistiques.nombreErreurs}</span>
            </div>
            <div className="stat-rapide">
              <span className="label-stat">Indices:</span>
              <span className="valeur-stat">{sudoku.indicesUtilises}/{sudoku.configurationDifficulte?.maxIndices}</span>
            </div>
          </div>
        )}

        {/* Instructions conditionnelles */}
        {estDesktop && (
          <div className="instructions-desktop">
            <p>
              <kbd>1-9</kbd> Saisir • <kbd>B</kbd> Brouillon • <kbd>H</kbd> Indice • 
              <kbd>U</kbd> Annuler • <kbd>Alt+1-9</kbd> Brouillon forcé
            </p>
          </div>
        )}
        
        {estMobile && (
          <div className="instructions-mobile">
            <p>Appuyez sur une cellule pour saisir. Mode brouillon: notez plusieurs possibilités par case.</p>
          </div>
        )}

        {/* Panneau de contrôles complet pour desktop */}
        {estDesktop && (
          <aside className="panneau-controles-principal">
            <PanneauControles
              difficulte={sudoku.difficulteActuelle}
              modeBrouillon={sudoku.modeBrouillon}
              indicesUtilises={sudoku.indicesUtilises}
              indicesRestants={sudoku.indicesRestants}
              jeuTermine={sudoku.statutJeu === STATUTS_JEU.TERMINE}
              statistiques={statistiques}
              surNouveauJeu={gererNouveauJeu}
              surReinitialiser={gererReinitialiser}
              surResoudre={gererResoudre}
              surObtenirIndice={gererObtenirIndice}
              surAnnuler={gererAnnuler}
              surBasculerBrouillon={gererBasculerBrouillon}
              surChangerDifficulte={gererChangementDifficulte}
            />
          </aside>
        )}

        {/* Panneau de contrôles compact pour tablette */}
        {!estDesktop && !estMobile && (
          <div className="panneau-controles-tablette">
            <PanneauControles
              difficulte={sudoku.difficulteActuelle}
              modeBrouillon={sudoku.modeBrouillon}
              indicesUtilises={sudoku.indicesUtilises}
              indicesRestants={sudoku.indicesRestants}
              jeuTermine={sudoku.statutJeu === STATUTS_JEU.TERMINE}
              statistiques={statistiques}
              surNouveauJeu={gererNouveauJeu}
              surReinitialiser={gererReinitialiser}
              surResoudre={gererResoudre}
              surObtenirIndice={gererObtenirIndice}
              surAnnuler={gererAnnuler}
              surBasculerBrouillon={gererBasculerBrouillon}
              surChangerDifficulte={gererChangementDifficulte}
            />
          </div>
        )}
      </main>

      {/* Clavier mobile amélioré */}
      <ClavierMobile
        estVisible={clavierMobileVisible}
        surSelectionNombre={gererSaisieClavier}
        surFermeture={fermerClavierMobile}
        celluleSelectionnee={sudoku.celluleSelectionnee}
        modeBrouillon={sudoku.modeBrouillon}
        surBasculerBrouillon={gererBasculerBrouillon}
        surObtenirIndice={gererObtenirIndice}
        indicesRestants={sudoku.indicesRestants}
      />

      {/* Système de notifications */}
      {notification && (
        <div className={`notification-app notification-${notification.type}`}>
          <div className="contenu-notification-app">
            <span className="message-notification-app">{notification.message}</span>
            <button 
              className="bouton-fermer-notification-app"
              onClick={() => setNotification(null)}
              aria-label="Fermer la notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal de victoire */}
      {sudoku.statutJeu === STATUTS_JEU.TERMINE && (
        <div className="overlay-victoire-app">
          <div className="modal-victoire-app">
            <div className="en-tete-victoire-app">
              <h2>🎉 Félicitations !</h2>
              <div className="confettis-app">🎊</div>
            </div>
            
            <div className="statistiques-victoire-app">
              <div className="stat-victoire-app">
                <span className="label-stat-victoire">Temps</span>
                <span className="valeur-stat-victoire">{minuteur.formaterTemps()}</span>
              </div>
              <div className="stat-victoire-app">
                <span className="label-stat-victoire">Mouvements</span>
                <span className="valeur-stat-victoire">{statistiques.nombreMouvements}</span>
              </div>
              <div className="stat-victoire-app">
                <span className="label-stat-victoire">Erreurs</span>
                <span className="valeur-stat-victoire">{statistiques.nombreErreurs}</span>
              </div>
              {sudoku.indicesUtilises > 0 && (
                <div className="stat-victoire-app">
                  <span className="label-stat-victoire">Indices</span>
                  <span className="valeur-stat-victoire">{sudoku.indicesUtilises}</span>
                </div>
              )}
            </div>
            
            <div className="actions-victoire-app">
              <button 
                className="btn btn-primaire"
                onClick={() => gererNouveauJeu(difficulte)}
              >
                🎮 Nouvelle Partie
              </button>
              <button 
                className="btn btn-secondaire"
                onClick={() => gererNouveauJeu(DIFFICULTES.DIFFICILE)}
              >
                🚀 Niveau Supérieur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;