/*

Ce fichier est un script destiné à Adobe Photoshop (écrit en JavaScript pour l’environnement ExtendScript).

Il sert à automatiser l’exportation du document Photoshop actif (`.psd`) en image PNG, dans le même dossier que le fichier source.

Voici ce que fait le script :
- Il vérifie que le document ouvert est bien un fichier PSD.
- Il construit le chemin du fichier PNG à partir du nom du document.
- S’il existe déjà un PNG du même nom, il le supprime.
- Il enregistre le document actif au format PNG grâce à la fonction `SavePNG`.

Ce script est donc utile pour automatiser la conversion de fichiers PSD en PNG, pour générer des tuiles graphiques pour un jeu.
*/

main();
function main(){
    var Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
    var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./,'');
    if(Ext.toLowerCase() != 'psd') return;
    var Path = app.activeDocument.path;
    var saveFile = File(Path + "/" + Name +".png");
    if(saveFile.exists) saveFile.remove();
    SavePNG(saveFile);
}

function SavePNG(saveFile){
    pngSaveOptions = new PNGSaveOptions();
    activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
}