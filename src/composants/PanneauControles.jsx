// =============================================
// PANNEAU DE CONTRÔLES AVEC BROUILLON ET INDICES LIMITÉS
// =============================================

import React from 'react';
import { LIMITES_DIFFICULTE, MESSAGES } from '../utilitaires/constantes.js';

/**
 * Composant panneau de contrôles pour le jeu Sudoku
 * @param {Object} props - Propriétés du composant
 * @param {string} props.difficulte - Difficulté actuelle
 * @param {boolean} props.modeBrouillon - État du mode brouillon
 * @param {number} props.indicesUtilises - Nombre d'indices utilisés
 * @param {number} props.indicesRestants - Nombre d'indices restants
 * @param {boolean} props.jeuTermine - Si le jeu est terminé
 * @param {Object} props.statistiques - Statistiques du jeu
 * @param {Function} props.surNouveauJeu - Callback pour nouveau jeu
 * @param {Function} props.surReinitialiser - Callback pour réinitialiser
 * @param {Function} props.surResoudre - Callback pour résoudre
 * @param {Function} props.surObtenirIndice - Callback pour obtenir un indice
 * @param {Function} props.surAnnuler - Callback pour annuler
 * @param {Function} props.surBasculerBrouillon - Callback pour basculer le mode brouillon
 * @param {Function} props.surChangerDifficulte - Callback pour changer la difficulté
 * @returns {JSX.Element} Panneau de contrôles
 */
const PanneauControles = ({
  difficulte,
  modeBrouillon,
  indicesUtilises,
  indicesRestants,
  jeuTermine,
  statistiques,
  surNouveauJeu,
  surReinitialiser,
  surResoudre,
  surObtenirIndice,
  surAnnuler,
  surBasculerBrouillon,
  surChangerDifficulte
}) => {
  const configurationDifficulte = LIMITES_DIFFICULTE[difficulte] || LIMITES_DIFFICULTE.moyen;

  // Gestionnaire pour obtenir un indice
  const gererObtenirIndice = () => {
    const resultat = surObtenirIndice();
    if (resultat && !resultat.succes) {
      // Afficher un message d'erreur
      console.warn(resultat.message);
    }
  };

  // Gestionnaire pour changer la difficulté
  const gererChangementDifficulte = (evenement) => {
    const nouvelleDifficulte = evenement.target.value;
    if (statistiques.nombreMouvements > 0) {
      const confirmation = window.confirm(
        'Changer la difficulté va commencer une nouvelle partie. Continuer ?'
      );
      if (confirmation) {
        surChangerDifficulte(nouvelleDifficulte);
      } else {
        // Remettre l'ancienne valeur
        evenement.target.value = difficulte;
      }
    } else {
      surChangerDifficulte(nouvelleDifficulte);
    }
  };

  return (
    <div className="panneau-controles">
      
      {/* Section sélection de difficulté */}
      <div className="section-difficulte">
        <label htmlFor="selecteur-difficulte" className="etiquette-difficulte">
          Niveau de difficulté :
        </label>
        <select
          id="selecteur-difficulte"
          value={difficulte}
          onChange={gererChangementDifficulte}
          className="selecteur-difficulte"
        >
          <option value="facile">Facile ({LIMITES_DIFFICULTE.facile.maxIndices} indices)</option>
          <option value="moyen">Moyen ({LIMITES_DIFFICULTE.moyen.maxIndices} indices)</option>
          <option value="difficile">Difficile ({LIMITES_DIFFICULTE.difficile.maxIndices} indices)</option>
        </select>
      </div>

      {/* Section mode brouillon */}
      <div className="section-brouillon">
        <button
          className={`bouton-mode-brouillon ${modeBrouillon ? 'actif' : ''}`}
          onClick={surBasculerBrouillon}
          title={modeBrouillon ? 'Désactiver le mode brouillon (B)' : 'Activer le mode brouillon (B)'}
          disabled={jeuTermine}
        >
          <span className="icone-brouillon">📝</span>
          <span className="texte-brouillon">
            {modeBrouillon ? 'Mode Brouillon' : 'Mode Normal'}
          </span>
          <kbd className="raccourci-clavier">B</kbd>
        </button>
        
        <div className="informations-brouillon">
          <small>
            {modeBrouillon 
              ? 'Cliquez pour noter les possibilités dans les cases' 
              : 'Activez pour noter plusieurs chiffres par case'
            }
          </small>
        </div>
      </div>

      {/* Section indices */}
      <div className="section-indices">
        <div className="compteur-indices">
          <span className="etiquette-indices">Indices disponibles :</span>
          <div className="affichage-compteur">
            <span className="indices-restants">{indicesRestants}</span>
            <span className="separateur-compteur">/</span>
            <span className="indices-maximum">{configurationDifficulte.maxIndices}</span>
          </div>
        </div>
        
        <button
          className="bouton-indice"
          onClick={gererObtenirIndice}
          disabled={jeuTermine || indicesRestants === 0}
          title={indicesRestants > 0 ? 'Obtenir un indice (H)' : 'Plus d\'indices disponibles'}
        >
          <span className="icone-indice">💡</span>
          <span className="texte-indice">Obtenir un indice</span>
          <kbd className="raccourci-clavier">H</kbd>
        </button>
        
        {indicesRestants === 0 && (
          <div className="avertissement-indices">
            <small>Limite d'indices atteinte pour cette difficulté</small>
          </div>
        )}
      </div>

      {/* Section actions principales */}
      <div className="section-actions">
        <div className="groupe-actions-principales">
          <button
            className="bouton bouton-primaire"
            onClick={() => surNouveauJeu(difficulte)}
            title="Commencer une nouvelle partie"
          >
            <span className="icone-action">🎮</span>
            Nouveau Jeu
          </button>
          
          <button
            className="bouton bouton-secondaire"
            onClick={surReinitialiser}
            disabled={jeuTermine}
            title="Recommencer la partie actuelle"
          >
            <span className="icone-action">🔄</span>
            Réinitialiser
          </button>
        </div>
        
        <div className="groupe-actions-secondaires">
          <button
            className="bouton bouton-info"
            onClick={surAnnuler}
            disabled={jeuTermine || statistiques.nombreMouvements === 0}
            title="Annuler le dernier mouvement (U)"
          >
            <span className="icone-action">↶</span>
            Annuler
            <kbd className="raccourci-clavier">U</kbd>
          </button>
          
          <button
            className="bouton bouton-avertissement"
            onClick={surResoudre}
            disabled={jeuTermine}
            title="Résoudre automatiquement le puzzle"
          >
            <span className="icone-action">🎯</span>
            Résoudre
          </button>
        </div>
      </div>

      {/* Section statistiques */}
      <div className="section-statistiques">
        <h3 className="titre-statistiques">Statistiques de la partie</h3>
        
        <div className="grille-statistiques">
          <div className="statistique">
            <span className="etiquette-statistique">Progression</span>
            <span className="valeur-statistique">{statistiques.pourcentageCompletion}%</span>
          </div>
          
          <div className="statistique">
            <span className="etiquette-statistique">Mouvements</span>
            <span className="valeur-statistique">{statistiques.nombreMouvements}</span>
          </div>
          
          <div className="statistique">
            <span className="etiquette-statistique">Erreurs</span>
            <span className="valeur-statistique">{statistiques.nombreErreurs}</span>
          </div>
          
          <div className="statistique">
            <span className="etiquette-statistique">Indices utilisés</span>
            <span className="valeur-statistique">{indicesUtilises}</span>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="barre-progression">
          <div className="etiquette-progression">Progression du puzzle</div>
          <div className="conteneur-barre-progression">
            <div 
              className="barre-progression-remplie"
              style={{ 
                width: `${statistiques.pourcentageCompletion}%`,
                backgroundColor: configurationDifficulte.couleurTheme 
              }}
            />
          </div>
          <div className="pourcentage-affiche">{statistiques.pourcentageCompletion}%</div>
        </div>
      </div>

      {/* Section aide raccourcis */}
      <div className="section-aide-raccourcis">
        <details className="details-raccourcis">
          <summary className="titre-aide-raccourcis">
            <span className="icone-aide">⌨️</span>
            Raccourcis clavier
          </summary>
          
          <div className="contenu-aide-raccourcis">
            <div className="groupe-raccourcis">
              <h4>Navigation</h4>
              <ul>
                <li><kbd>↑↓←→</kbd> Naviguer entre les cellules</li>
                <li><kbd>Entrée</kbd> Passer à la cellule suivante</li>
                <li><kbd>Tab</kbd> Avancer dans la grille</li>
              </ul>
            </div>
            
            <div className="groupe-raccourcis">
              <h4>Saisie de chiffres</h4>
              <ul>
                <li><kbd>1-9</kbd> {modeBrouillon ? 'Ajouter/retirer du brouillon' : 'Entrer un chiffre définitif'}</li>
                <li><kbd>Alt + 1-9</kbd> Forcer le mode brouillon</li>
                <li><kbd>0/Suppr/⌫</kbd> Effacer la cellule</li>
                <li><kbd>Maj + Suppr</kbd> Effacer uniquement les brouillons</li>
              </ul>
            </div>
            
            <div className="groupe-raccourcis">
              <h4>Actions rapides</h4>
              <ul>
                <li><kbd>B</kbd> ou <kbd>Espace</kbd> Basculer le mode brouillon</li>
                <li><kbd>H</kbd> Obtenir un indice</li>
                <li><kbd>U</kbd> Annuler le dernier mouvement</li>
                <li><kbd>Maj + C</kbd> Effacer tous les brouillons de la cellule</li>
                <li><kbd>Ctrl + Z</kbd> Annuler (raccourci standard)</li>
              </ul>
            </div>
          </div>
        </details>
      </div>

      {/* Messages d'état */}
      {jeuTermine && (
        <div className="message-victoire">
          <div className="icone-victoire">🎉</div>
          <div className="texte-victoire">
            <h3>Félicitations !</h3>
            <p>Puzzle résolu en {statistiques.nombreMouvements} mouvements</p>
            {indicesUtilises > 0 && (
              <p>avec {indicesUtilises} indice{indicesUtilises > 1 ? 's' : ''} utilisé{indicesUtilises > 1 ? 's' : ''}</p>
            )}
          </div>
        </div>
      )}

      {/* Indicateur de mode brouillon global */}
      {modeBrouillon && (
        <div className="indicateur-mode-brouillon-global">
          <span className="icone-mode-global">📝</span>
          <span className="texte-mode-global">Mode brouillon actif</span>
        </div>
      )}
    </div>
  );
};

export default PanneauControles;