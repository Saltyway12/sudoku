import React, { useState, useEffect } from 'react';
import GrilleSudoku from './composants/GrilleSudoku';
import ClavierMobile from './composants/ClavierMobile';
import useSudoku from './hooks/useSudoku';
import { useDetectionMobile } from './hooks/useDetectionMobile';
import { DIFFICULTES, STATUTS_JEU, MESSAGES, TOUCHES_NAVIGATION } from './utilitaires/constantes';
import './styles/globals.css';

const App = () => {
  const [difficulte, setDifficulte] = useState(DIFFICULTES.MOYEN);
  const [minuteur, setMinuteur] = useState(0);
  const [clavierMobileVisible, setClavierMobileVisible] = useState(false);
  
  const sudoku = useSudoku(difficulte);
  const { estMobile, estTactile, estDesktop, classeAppareil } = useDetectionMobile();

  // Minuteur
  useEffect(() => {
    let intervalle;
    if (sudoku.statutJeu === STATUTS_JEU.EN_COURS) {
      intervalle = setInterval(() => {
        setMinuteur(Math.floor((Date.now() - sudoku.heureDebut) / 1000));
      }, 1000);
    }
    return () => clearInterval(intervalle);
  }, [sudoku.statutJeu, sudoku.heureDebut]);

  // Navigation clavier (desktop uniquement)
  useEffect(() => {
    // Désactiver la navigation clavier sur mobile
    if (estMobile || estTactile) return;

    const gererToucheAppuyee = (e) => {
      if (!sudoku.celluleSelectionnee || sudoku.statutJeu !== STATUTS_JEU.EN_COURS) return;
      
      const { ligne, colonne } = sudoku.celluleSelectionnee;
      
      if (e.key >= '1' && e.key <= '9') {
        sudoku.mettreAJourCellule(ligne, colonne, parseInt(e.key));
      }
      
      if (e.key === TOUCHES_NAVIGATION.RETOUR_ARRIERE || e.key === TOUCHES_NAVIGATION.SUPPRIMER) {
        sudoku.mettreAJourCellule(ligne, colonne, 0);
      }
      
      if ([TOUCHES_NAVIGATION.FLECHE_HAUT, TOUCHES_NAVIGATION.FLECHE_BAS, TOUCHES_NAVIGATION.FLECHE_GAUCHE, TOUCHES_NAVIGATION.FLECHE_DROITE].includes(e.key)) {
        e.preventDefault();
        let nouvelleLigne = ligne;
        let nouvelleColonne = colonne;
        
        switch (e.key) {
          case TOUCHES_NAVIGATION.FLECHE_HAUT: nouvelleLigne = Math.max(0, ligne - 1); break;
          case TOUCHES_NAVIGATION.FLECHE_BAS: nouvelleLigne = Math.min(8, ligne + 1); break;
          case TOUCHES_NAVIGATION.FLECHE_GAUCHE: nouvelleColonne = Math.max(0, colonne - 1); break;
          case TOUCHES_NAVIGATION.FLECHE_DROITE: nouvelleColonne = Math.min(8, colonne + 1); break;
          default: break;
        }
        
        sudoku.selectionnerCellule(nouvelleLigne, nouvelleColonne);
      }
    };

    window.addEventListener('keydown', gererToucheAppuyee);
    return () => window.removeEventListener('keydown', gererToucheAppuyee);
  }, [sudoku, estMobile, estTactile]);

  // Gestion de la sélection de cellule (mobile vs desktop)
  const gererSelectionCellule = (ligne, colonne) => {
    sudoku.selectionnerCellule(ligne, colonne);
    
    // Afficher le clavier mobile sur les appareils tactiles
    if (estMobile && estTactile && sudoku.statutJeu === STATUTS_JEU.EN_COURS) {
      setClavierMobileVisible(true);
    }
  };

  // Gestion de la saisie depuis le clavier mobile
  const gererSaisieClavier = (valeur) => {
    if (!sudoku.celluleSelectionnee) return;
    
    const { ligne, colonne } = sudoku.celluleSelectionnee;
    const nouvelleValeur = valeur === null ? 0 : valeur;
    
    sudoku.mettreAJourCellule(ligne, colonne, nouvelleValeur);
    
    // Fermer le clavier après la saisie sur mobile
    if (estMobile) {
      setClavierMobileVisible(false);
    }
  };

  // Fermer le clavier mobile
  const fermerClavierMobile = () => {
    setClavierMobileVisible(false);
  };

  const formaterTemps = (secondes) => {
    const minutes = Math.floor(secondes / 60);
    const secs = secondes % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const gererNouveauJeu = () => {
    sudoku.nouveauJeu(difficulte);
    setMinuteur(0);
    setClavierMobileVisible(false);
  };

  const obtenirMessageStatut = () => {
    if (sudoku.statutJeu === STATUTS_JEU.TERMINE) {
      return MESSAGES.FELICITATIONS;
    }
    if (sudoku.cellulesInvalides.length > 0) {
      return MESSAGES.ERREURS_DETECTEES;
    }
    return MESSAGES.JEU_EN_COURS;
  };

  // Classes CSS conditionnelles pour l'appareil
  const classesApp = `app ${classeAppareil} ${estTactile ? 'tactile' : 'souris'}`;

  return (
    <div className={classesApp}>
      <header className="app-header">
        <h1>Sudoku ! </h1>
        
        <div className="info-jeu">
          <div className="minuteur">
            Temps: {formaterTemps(minuteur)}
          </div>
          
          <div className="statut">
            {obtenirMessageStatut()}
          </div>
        </div>
      </header>

      <main className="conteneur-jeu">
        <div className="controles">
          <div className="selecteur-difficulte">
            <label htmlFor="difficulte">Difficulté:</label>
            <select
              id="difficulte"
              value={difficulte}
              onChange={(e) => setDifficulte(e.target.value)}
            >
              <option value={DIFFICULTES.FACILE}>Facile</option>
              <option value={DIFFICULTES.MOYEN}>Moyen</option>
              <option value={DIFFICULTES.DIFFICILE}>Difficile</option>
            </select>
          </div>

          <div className="boutons">
            <button onClick={gererNouveauJeu} className="btn btn-primaire">
              Nouveau Jeu
            </button>
            <button onClick={sudoku.reinitialiserJeu} className="btn btn-secondaire">
              Recommencer
            </button>
            <button
              onClick={sudoku.obtenirIndice}
              className="btn btn-info"
              disabled={sudoku.statutJeu !== STATUTS_JEU.EN_COURS}
            >
              Indice
            </button>
            <button
              onClick={sudoku.annulerMouvement}
              className="btn btn-avertissement"
              disabled={sudoku.mouvements.length === 0 || sudoku.statutJeu !== STATUTS_JEU.EN_COURS}
            >
              Annuler
            </button>
            <button onClick={sudoku.resoudreJeu} className="btn btn-succes">
              Résoudre
            </button>
          </div>
        </div>

        {/* Conteneur de la grille avec détection d'appareil */}
        <div className="conteneur-grille">
          <GrilleSudoku
            grille={sudoku.grilleActuelle}
            grilleInitiale={sudoku.grilleInitiale}
            celluleSelectionnee={sudoku.celluleSelectionnee}
            onChangementCellule={sudoku.mettreAJourCellule}
            onSelectionCellule={gererSelectionCellule}
            cellulesInvalides={sudoku.cellulesInvalides}
            estMobile={estMobile}
            estTactile={estTactile}
          />
        </div>

        <div className="statistiques">
          <div className="stat">
            <span className="label-stat">Mouvements:</span>
            <span className="valeur-stat">{sudoku.mouvements.length}</span>
          </div>
          <div className="stat">
            <span className="label-stat">Erreurs:</span>
            <span className="valeur-stat">{sudoku.cellulesInvalides.length}</span>
          </div>
          <div className="stat">
            <span className="label-stat">Progression:</span>
            <span className="valeur-stat">{sudoku.pourcentageCompletion}%</span>
          </div>
        </div>

        {/* Instructions conditionnelles */}
        {estDesktop && (
          <div className="instructions-desktop">
            <p>Utilisez les flèches du clavier pour naviguer et les chiffres 1-9 pour remplir</p>
          </div>
        )}
        
        {estMobile && (
          <div className="instructions-mobile">
            <p>Appuyez sur une cellule pour faire apparaître le clavier numérique</p>
          </div>
        )}
      </main>

      {/* Clavier mobile conditionnel */}
      <ClavierMobile
        estVisible={clavierMobileVisible}
        surSelectionNombre={gererSaisieClavier}
        surFermeture={fermerClavierMobile}
        celluleSelectionnee={sudoku.celluleSelectionnee}
      />
    </div>
  );
};

export default App;