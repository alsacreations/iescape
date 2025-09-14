var currentLevel = 1; // Niveau actuel (on démarre à 1)
var maxLevel = 4; // Niveau maximal
var fail = false; // Passe à true pour la fin de la partie
var score = 0; // Score

function updateScore(offset) {
  score += offset;
  document.getElementById('score').innerHTML = score;
}

// Initialisation du jeu avec le moteur Quintus
var Q = Quintus({ imagePath: "/game/images/", dataPath: "/game/levels/", audioPath: "/game/sounds/" })
  .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
  // .setup("game")
  .setup({ maximize: true })
  .controls().touch();

// Ajoute aussi la touche espace pour sauter
Q.input.keyboardControls({
  UP: 'up',        // déjà présent par défaut
  SPACE: 'up'      // espace déclenche aussi "up"
});

// Joueur
Q.Sprite.extend("Player", {
  init: function (p) {
    this._super(p, { sheet: "player", x: 400, y: 100 });
    this.add('2d, platformerControls, tween');

    // Gagne si on touche le goal de fin
    this.on("hit.sprite", function (collision) {
      if (collision.obj.isA("Tower")) {
        Q.stageScene("endGame", 1, { label: "Gagné!" });
        this.destroy();
      }
    });
  },

  // Chute !
  step: function (dt) {
    if (this.p.y > 900) {
      this.stage.unfollow();
    }
    if (this.p.y > 1100) {
      Q.audio.play("wilhelmscream");
      this.resetLevel();
    }
  },
  resetLevel: function () {
    Q.stageScene("level" + currentLevel);
    this.animate({ opacity: 1 });
  }

});

// Tour (cible)
Q.Sprite.extend("Tower", {
  init: function (p) {
    this._super(p, { sheet: 'tower' });
  }
});

// Trampoline
Q.Sprite.extend("Jump", {
  init: function (p) {
    this._super(p, { sheet: 'jump' });
    this.add('2d, aiBounce');
    this.on("bump.top", function (collision) {
      if (collision.obj.isA("Player")) {
        collision.obj.p.vy = -450;
        Q.audio.play("bounce");
      }
    });
  }
});

// Pièce
Q.Sprite.extend("Coin", {
  init: function (p) {
    this._super(p, { sheet: 'coin', sensor: true }); // sensor: true
    // this.add('2d'); // gravité
    this.add('tween'); // animation
    this.on("hit.sprite", function (collision) {
      if (collision.obj.isA("Player")) {
        // this.animate({ y: this.p.y-30 },200,Q.Easing.Quadratic.Out);

        // Empêche toute collision ultérieure, calcule le score et lance le son
        this.p.collisionMask = 0;
        if(!this.p.taken) {
          updateScore(1);
          this.p.taken = true;
          Q.audio.play("coin");
        }

        // Retire la pièce avec une animation
        this.animate(
          { y: this.p.y - 50 }, // déplacement vers le haut de 50px
          0.5,                  // durée en secondes
          Q.Easing.Quadratic.Out,
          { callback: function () {
            this.destroy();
          }.bind(this) }
        );
      }
    });
  }
});

// Ennemi
Q.Sprite.extend("Enemy", {
  init: function (p) {
    this._super(p, { sheet: 'enemy', vx: 100 });
    this.add('2d, aiBounce');

    // Si on le touche sur le côté ou par en-dessous, c'est perdu
    this.on("bump.left,bump.right,bump.bottom", function (collision) {
      if (collision.obj.isA("Player")) {
        fail = true;
        Q.audio.play("dead");
        // Q.stageScene("endGame", 1, { label: ":(" }); // Mort
        collision.obj.destroy();
        updateScore(-5);
        Q.clearStages();
        Q.loadlevel(currentLevel);
      }
    });

    // Si on le touche par le dessus, il est détruit et le joueur rebondit
    this.on("bump.top", function (collision) {
      if (collision.obj.isA("Player")) {
        this.destroy();
        collision.obj.p.vy = -300; // Rebond
        updateScore(2);
      }
    });
  }
});

// Niveau 1 (land)
Q.scene("level1", function (stage) {

  stage.insert(new Q.Repeater({ asset: "background1.png", speedX: 0.5, speedY: 0.5 }));
  Q.stageTMX("level1.tmx", stage);

  var player = stage.insert(new Q.Player({ x: 22.5 * 32, y: 7 * 32 })); // Position de départ
  stage.add("viewport").follow(player);

  // Insertion enemis, cible et pièces sur ce niveau
  stage.insert(new Q.Coin({ x: 31.5 * 32, y: 11.5 * 32 })); // Première pièce à attraper
  stage.insert(new Q.Coin({ x: 19.5 * 32, y: 7.5 * 32 }));
  stage.insert(new Q.Coin({ x: 28.5 * 32, y: 4.5 * 32 }));
  stage.insert(new Q.Coin({ x: 47.5 * 32, y: 6.5 * 32 }));
  stage.insert(new Q.Coin({ x: 56.5 * 32, y: 3.5 * 32 }));
  stage.insert(new Q.Coin({ x: 59.5 * 32, y: 12.5 * 32 }));

  stage.insert(new Q.Enemy({ x: 25 * 32, y: 11 * 32 }));
  stage.insert(new Q.Enemy({ x: 50 * 32, y: 13 * 32 }));
  stage.insert(new Q.Enemy({ x: 51 * 32, y: 5 * 32 }));

  stage.insert(new Q.Tower({ x: 63.5 * 32, y: 9.5 * 32 }));

});

// Niveau 2 (snow)
Q.scene("level2", function (stage) {

  stage.insert(new Q.Repeater({ asset: "background2.png", speedX: 0.5, speedY: 0.5 }));
  Q.stageTMX("level2.tmx", stage);

  var player = stage.insert(new Q.Player({ x: 32 * 32, y: 16 * 32 })); // Position de départ
  stage.add("viewport").follow(player);

  // Insertion enemis, cible et pièces sur ce niveau
  stage.insert(new Q.Jump({ x: 40.5 * 32, y: 14.5 * 32 }));
  stage.insert(new Q.Jump({ x: 54.5 * 32, y: 18.5 * 32 }));
  stage.insert(new Q.Jump({ x: 95.5 * 32, y: 9.5 * 32 }));
  stage.insert(new Q.Jump({ x: 99.5 * 32, y: 8.5 * 32 }));
  stage.insert(new Q.Jump({ x: 53.5 * 32, y: 9.5 * 32 }));

  stage.insert(new Q.Coin({ x: 18.5 * 32, y: 16.5 * 32 }));
  stage.insert(new Q.Coin({ x: 58.5 * 32, y: 15.5 * 32 }));
  stage.insert(new Q.Coin({ x: 62.5 * 32, y: 17.5 * 32 }));
  stage.insert(new Q.Coin({ x: 83.5 * 32, y: 11.5 * 32 }));
  stage.insert(new Q.Coin({ x: 97.5 * 32, y: 7.5 * 32 }));

  stage.insert(new Q.Enemy({ x: 51 * 32, y: 19 * 32 }));
  stage.insert(new Q.Enemy({ x: 61 * 32, y: 10 * 32 }));
  stage.insert(new Q.Enemy({ x: 97 * 32, y: 15 * 32 }));

  stage.insert(new Q.Tower({ x: 105.5 * 32, y: 7.5 * 32 }));

});

// Niveau 3 (tech)
Q.scene("level3", function (stage) {

  stage.insert(new Q.Repeater({ asset: "background3.png", speedX: 0.5, speedY: 0.5 }));
  Q.stageTMX("level3.tmx", stage);

  var player = stage.insert(new Q.Player({ x: 1360, y: 200 })); // Position de départ
  stage.add("viewport").follow(player);

  // Insertion enemis, cible et pièces sur ce niveau
  stage.insert(new Q.Coin({ x: 36.5 * 32, y: 7.5 * 32 }));
  stage.insert(new Q.Coin({ x: 65.5 * 32, y: 7.5 * 32 }));
  stage.insert(new Q.Coin({ x: 51.5 * 32, y: 1.5 * 32 }));
  stage.insert(new Q.Coin({ x: 87.5 * 32, y: 1.5 * 32 }));
  stage.insert(new Q.Coin({ x: 77.5 * 32, y: 3.5 * 32 }));

  stage.insert(new Q.Jump({ x: 90.5 * 32, y: 6.5 * 32 }));
  stage.insert(new Q.Jump({ x: 91.5 * 32, y: 9.5 * 32 }));

  stage.insert(new Q.Enemy({ x: 1660, y: 55 }));
  stage.insert(new Q.Enemy({ x: 1760, y: 55 }));
  stage.insert(new Q.Enemy({ x: 1460, y: 55 }));

  stage.insert(new Q.Tower({ x: 1137, y: 112 }));

});

// Niveau 4 (sky)
Q.scene("level4", function (stage) {

  stage.insert(new Q.Repeater({ asset: "background4.png", speedX: 0.5, speedY: 0.5 }));
  Q.stageTMX("level4.tmx", stage);

  var player = stage.insert(new Q.Player({ x: 1812, y: 648 })); // Position de départ
  stage.add("viewport").follow(player);

  // Insertion enemis, cible et pièces sur ce niveau
  stage.insert(new Q.Coin({ x: 36.5 * 32, y: 18.5 * 32 }));
  stage.insert(new Q.Coin({ x: 42.5 * 32, y: 8.5 * 32 }));
  stage.insert(new Q.Coin({ x: 31.5 * 32, y: 3.5 * 32 }));
  stage.insert(new Q.Coin({ x: 82.5 * 32, y: 5.5 * 32 }));
  stage.insert(new Q.Coin({ x: 71.5 * 32, y: 12.5 * 32 }));

  stage.insert(new Q.Enemy({ x: 21 * 32, y: 1 * 32 }));
  stage.insert(new Q.Enemy({ x: 81 * 32, y: 21 * 32 }));
  stage.insert(new Q.Enemy({ x: 73 * 32, y: 3 * 32 }));

  stage.insert(new Q.Tower({ x: 2032, y: 689 }));

});

// Fin de jeu
Q.scene('endGame', function (stage) {

  // Boîte de dialogue
  var box = stage.insert(new Q.UI.Container({
    x: Q.width / 2, y: Q.height / 2, fill: "rgba(0,0,0,0.5)"
  }));

  if (currentLevel == maxLevel && !fail) { // Dernier niveau accompli, fin de la partie avec succès
    var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#abc737", label: "Bien joué ! Nouvelle partie ?" }));
    currentLevel = 0;
    Q.audio.play("end");
  } else if (fail) { // Perdu
    var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#abc737", label: "Nouvel essai ?" }));
  } else { // Niveau suivant
    var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#abc737", label: "Niveau suivant" }));
  }

  // Incrémentation du level
  if (!fail) currentLevel++;
  fail = false;

  var label = box.insert(new Q.UI.Text({ color: "white", x: 10, y: -10 - button.p.h, label: stage.options.label }));

  // Au clic sur le bouton, on charge le niveau sélectionné
  button.on("click", function () {
    Q.clearStages();
    Q.loadlevel(currentLevel);
    Q.audio.play("winlevel");
  });
  box.fit(20);
});

// Custom load
Q.loadlevel = function (levelIndex) {
  currentLevel = levelIndex;

  Q.loadTMX("level" + levelIndex + ".tmx, sprites.json, sprites.png, background" + levelIndex + ".png", function () {
    Q.compileSheets("sprites.png", "sprites.json");
    Q.stageScene("level" + levelIndex);
  });

}

// Démarrage du jeu avec le niveau défini
Q.loadlevel(currentLevel);

// Précharge les sons
Q.audio.enableWebAudioSound();
Q.load([
  { wilhelmscream: "wilhelmscream.mp3" },
  { coin: "coin.mp3" },
  { winlevel: "winlevel.mp3" },
  { bounce: "bounce.mp3" },
  { dead: "dead.mp3" },
  { end: "end.mp3" }
]);

// Cheat! Pour passer au niveau suivant avec shift+1, 2, 3, 4...
document.querySelector('body').addEventListener('keyup', function (e) {
  if (e.shiftKey == true) {
    var n = parseInt(e.key);
    if (!isNaN(n) && n > 0 && n <= maxLevel) Q.loadlevel(n);
  }
  if (e.keyCode == 27) { // ESC
    if (Q.loop) Q.pauseGame();
    else Q.unpauseGame();
  }
});