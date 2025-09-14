# IEscape 404 Game

## Framework 🕹️

Réalisé avec :

- [Quintus](http://html5quintus.com/) : un framework HTML5 pour faire des jeux 2D. [GitHub](https://github.com/cykod/Quintus).
- [Map Editor](https://www.mapeditor.org/) : éditeur de niveaux, téléchargeable sur GitHub <https://github.com/mapeditor/tiled/releases> pour Linux/macOS/Windows : produit des fichiers TMX avec des Tilesets issus des images PNG.

## But du jeu 🏆

C'est un jeu de plateforme 2D. Il faut atteindre la fin des niveaux, en évitant les obstacles et les monstres. Plusieurs niveaux se succèdent. On peut attraper des pièces ou sauter sur les monstres pour augmenter son score.

### Contrôles ⌨️

- Flèche gauche : déplacer à gauche
- Flèche droite : déplacer à droite
- Flèche haut / Espace : sauter

## Créer un niveau 🛠️

Pour produire un niveau `X` :

- ajouter un `backgroundX.png` (répété automatiquement en mosaïque)
- créer un fichier `levelX.tmx` à l'aide de l'éditeur de niveaux Map Editor
- mettre à jour `tiles.png` si nécessaire pour ajouter de nouveaux graphismes
- mettre à jour `sprites.png` si nécessaire pour ajouter de nouveaux éléments

Pour qu'un layer (calque) du fichier TMX soit décoratif et ne provoque pas de bug avec les collisions, ajouter une propriété `type:0` dans l'éditeur.

Taille recommandée pour la map : largeur `90`, hauteur `30`.

## Pixel art

On peut éditer les png avec <https://www.pixilart.com/>.
