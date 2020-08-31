window.onload = () => {
  /* "global" variables & functions
   ********************************/
  // starts the game and sets the initial setup
  function startGame() {
    canvasWidth = 600;
    canvasHeight = 500;
    background = new Background(canvasWidth, canvasHeight);
    player = new Cow(canvasWidth, canvasHeight);
    // todo: start ufos and rays.
    ufo = new FlyingSaucer(canvasWidth, canvasHeight);
    gameArea.start();
  }

  // updates the game frames/animations
  function updateGameArea() {
    gameArea.clear();
    background.draw(gameArea.canvas.width, gameArea.canvas.height);

    player.drawCow();
    drawUfoAndRay();

    if (player.getCaught()) {
      console.log("MOOO!");
    }

    gameArea.frames += 1;
    gameArea.reqAnimation = window.requestAnimationFrame(updateGameArea);
  }

  function drawUfoAndRay() {
    if (!gameArea.rayTrigger) {
      ufo.drawUfo();
      ufo.move();
      if (
        gameArea.frames > 0 &&
        (gameArea.frames - gameArea.rayLastFrame) % gameArea.rayTimer == 0
      ) {
        gameArea.rayTimer = 3 * 60 + Math.floor(Math.random() * (60 * 3));
        gameArea.rayLastFrame = gameArea.frames;
        gameArea.rayTrigger = true;
        gameArea.rayFrames = 60;
      }
      if (gameArea.frames % 60 == 0) {
      }
    } else {
      ufo.drawRay();
      ufo.drawUfo();
      gameArea.rayFrames--;
      if (gameArea.rayFrames <= 0) {
        gameArea.rayTrigger = false;
      }
    }
  }

  /* objects: canvas, cow, ufo, ray, background
   ********************************************/
  // game area object
  const gameArea = {
    canvas: document.createElement("canvas"),
    frames: 0,
    rayFrames: 0,
    rayTrigger: false,
    rayLastFrame: 0,
    rayTimer: 5 * 60 + Math.floor(Math.random() * (60 * 3)),

    // draws canvas for game screen
    drawCanvas: function () {
      this.canvas.width = 600;
      this.canvas.height = 500;
      this.context = this.canvas.getContext("2d");
      document.getElementById("game-screen").append(this.canvas);
    },

    // first loading of game screen and calls game loop
    start: function () {
      this.drawCanvas();
      this.reqAnimation = window.requestAnimationFrame(updateGameArea);
    },

    // clears whole game screen
    clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // completely stops the game
    stop: function () {
      cancelAnimationFrame(this.reqAnimation);
    },

    // calls the game over screen and events
    gameOver: function () {
      this.clear();
      // todo: game over screen + final score
      // todo: restart game
    },

    // restarts the game after 1500 milliseconds
    restartGame: function () {
      setTimeout(function () {
        document.getElementById("game-screen").style.display = "none";
        document.getElementById("start-screen").style.display = "block";
      }, 1500);
    },
  };

  // cow object function
  function Cow(x, y) {
    this.posX = x * 0.2;
    this.posY = y * 0.8;
    this.width = 60;
    this.height = 40;
    this.speed = 20;

    this.drawCow = function () {
      const ctx = gameArea.context;
      ctx.fillStyle = "black";
      ctx.fillRect(this.posX, this.posY, this.width, this.height);
      ctx.clearRect(
        this.posX + 2,
        this.posY + 2,
        this.width - 4,
        this.height - 4
      );
      ctx.fillRect(this.posX + 12, this.posY + 7, 12, 7);
    };

    this.moveUp = function () {
      if (this.posY > y * 0.4) {
        this.posY -= this.speed;
      }
    };
    this.moveDown = function () {
      if (this.posY < y * 0.95 - this.height) {
        this.posY += this.speed;
      }
    };
    this.moveLeft = function () {
      if (this.posX > x * 0.05) {
        this.posX -= this.speed;
      }
    };
    this.moveRight = function () {
      if (this.posX < x * 0.95 - this.width) {
        this.posX += this.speed;
      }
    };

    this.top = () => {
      return this.posY;
    };
    this.bot = () => {
      return this.posY + this.height;
    };
    this.left = () => {
      return this.posX;
    };
    this.right = () => {
      return this.posX + this.width;
    };

    this.getCaught = () => {
      // console.log(player.top(), player.right(), player.bot(), player.left());
      // console.log(ufo.rayTop(), ufo.rayBot(), ufo.rayLeft(), ufo.rayRight());
      return !(
        this.bot() < ufo.rayTop() ||
        this.top() > ufo.rayBot() ||
        this.right() < ufo.rayLeft() ||
        this.left() > ufo.rayRight()
      );
    };
  }

  // ufo object function
  function FlyingSaucer(x, y) {
    this.speed = 0.01;
    this.x = x * 0.7;
    this.y = y * 0.2;
    this.flyingHeight = 250;

    this.drawUfo = function () {
      // upper part (main part)
      this.upperPosX = this.x;
      this.upperPosY = this.y;
      this.upperWidth = 150;
      this.upperHeight = 15;

      // light/middle part
      this.midPosX = this.upperPosX;
      this.midPosY = this.upperPosY + this.upperHeight;
      this.midWidth = 150;
      this.midHeight = 5;

      // bottom part
      this.botPosX = this.upperPosX;
      this.botPosY = this.midPosY + this.midHeight;
      this.botWidth = 150;
      this.botHeight = 13;

      // cockpit
      this.glassWidth = 30;
      this.glassHeight = 10;
      this.glassPosX =
        this.upperPosX + this.upperWidth / 2 - this.glassWidth / 2;
      this.glassPosY = this.upperPosY - this.glassHeight + 3;

      const ctx = gameArea.context;
      ctx.fillStyle = "#bbb";
      ctx.fillRect(
        this.upperPosX,
        this.upperPosY,
        this.upperWidth,
        this.upperHeight
      );
      if (
        (gameArea.frames - gameArea.rayLastFrame + 60) % gameArea.rayTimer <=
          20 ||
        gameArea.rayTrigger
      ) {
        ctx.fillStyle = "#ce3";
      } else {
        ctx.fillStyle = "#9b1";
      }

      ctx.fillRect(this.midPosX, this.midPosY, this.midWidth, this.midHeight);
      ctx.fillStyle = "#999";
      ctx.fillRect(this.botPosX, this.botPosY, this.botWidth, this.botHeight);
      ctx.fillStyle = "#23b";
      ctx.fillRect(
        this.glassPosX,
        this.glassPosY,
        this.glassWidth,
        this.glassHeight
      );
    };

    this.move = function () {
      const targetX = 2 * player.posX + player.width - this.x - this.upperWidth;
      const targetY = player.posY - this.flyingHeight;
      this.x += (targetX - this.x) * this.speed;
      this.y += (targetY - this.y) * this.speed;
    };

    this.drawRay = function () {
      this.rayMidX = this.x + this.upperWidth / 2;
      this.rayMidY = this.botPosY + this.botHeight;
      this.rayWidth = 40;
      this.rayOuterWidth = this.rayWidth + 20;
      this.maxHeight =
        this.flyingHeight + player.height - (this.rayMidY - this.y);

      const ctx = gameArea.context;

      ctx.fillStyle = "rgba(144, 160, 191, 0.7)";
      ctx.fillRect(
        this.rayMidX - this.rayOuterWidth / 2,
        this.rayMidY,
        this.rayOuterWidth,
        this.maxHeight
      );

      ctx.fillStyle = "rgba(223, 239, 255, 0.6)";
      ctx.fillRect(
        this.rayMidX - this.rayWidth / 2,
        this.rayMidY,
        this.rayWidth,
        this.maxHeight
      );
    };

    this.rayTop = () => {
      return this.flyingHeight + player.height + this.rayMidY - 10;
    };
    this.rayBot = () => {
      return this.flyingHeight + player.height + this.rayMidY + 10;
    };
    this.rayLeft = () => {
      return this.x + this.upperWidth / 2 - this.rayWidth / 2;
    };
    this.rayRight = () => {
      return this.x + this.upperWidth / 2 + this.rayWidth / 2;
    };
  }

  // background object function
  function Background(width, height) {
    this.width = width;
    this.height = height;

    this.draw = function () {
      const ctx = gameArea.context;
      ctx.fillStyle = "#2A2A46";
      ctx.fillRect(0, 0, this.width, this.height * 0.35);
      ctx.fillStyle = "#597022";
      ctx.fillRect(0, this.height * 0.35, this.width, this.height);
    };
  }

  /* event listeners
   *****************/
  // start button
  document.getElementById("btn-start").addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    startGame();
  });

  // controls
  document.addEventListener("keydown", (keyPressed) => {
    // key codes: a = 65, w = 87, d = 68, s = 83
    // left = 37, up = 38, right = 39, down = 40
    if (keyPressed.keyCode == 65 || keyPressed.keyCode == 37) {
      player.moveLeft();
    }
    if (keyPressed.keyCode == 87 || keyPressed.keyCode == 38) {
      player.moveUp();
    }
    if (keyPressed.keyCode == 68 || keyPressed.keyCode == 39) {
      player.moveRight();
    }
    if (keyPressed.keyCode == 83 || keyPressed.keyCode == 40) {
      player.moveDown();
    }
  });
};
