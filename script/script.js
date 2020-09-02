window.onload = () => {
  /* "global" variables & functions
   ********************************/
  // starts the game and sets the initial setup
  function startGame() {
    canvasWidth = 600;
    canvasHeight = 500;
    background = new Background(canvasWidth, canvasHeight);
    player = new Cow(canvasWidth, canvasHeight);
    ufo = new FlyingSaucer(canvasWidth, canvasHeight);
    soundboard = new SoundBoard();
    gameArea.start();
  }

  // updates the game frames/animations
  function updateGameArea() {
    gameArea.clear();
    background.draw();

    player.drawCow();
    player.move();
    drawUfoAndRay();

    gameArea.frames += 1;
    gameArea.reqGameAnimation = window.requestAnimationFrame(updateGameArea);
    if (player.isCaught(ufo) && gameArea.rayFrames < 2) {
      gameArea.stop();
    }
    if (gameArea.rayFrames == 60) {
      ufo.speed += 0.005;
      soundboard.playBeam();
      gameArea.score++;
    }
  }

  function drawUfoAndRay() {
    if (!gameArea.rayTrigger) {
      ufo.drawUfo();
      ufo.follow(player);
      if (
        gameArea.frames > 0 &&
        (gameArea.frames - gameArea.rayLastFrame) % gameArea.rayTimer == 0
      ) {
        gameArea.rayTimer = 3 * 60 + Math.floor(Math.random() * (60 * 3));
        gameArea.rayLastFrame = gameArea.frames;
        gameArea.rayTrigger = true;
        gameArea.rayFrames = 60;
      }
    } else {
      ufo.drawUfo();
      ufo.drawBeam();
      gameArea.rayFrames--;
      if (gameArea.rayFrames <= 0) {
        gameArea.rayTrigger = false;
        soundboard.stopBeam();
      }
    }
  }

  function gameOverScreen() {
    dHeight = gameArea.canvas.height;
    dWidth = gameArea.canvas.width;
    const ctx = gameArea.context;
    ctx.fillStyle = "#2A2A46";
    ctx.fillRect(0, 0, dWidth, dHeight * 0.5);

    player.posX = dWidth * 0.5 - player.width * 0.5;
    player.posY = 150;

    player.drawCow();

    bWidth = player.width + 60;
    bPosX = player.posX + player.width * 0.5 - bWidth * 0.5;

    ctx.fillStyle = "rgba(144, 160, 191, 0.7)";
    ctx.fillRect(bPosX, 0, bWidth, dHeight);
    ctx.fillStyle = "rgba(223, 239, 255, 0.6)";
    ctx.fillRect(bPosX + 20, 0, bWidth - 40, dHeight);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0 + dHeight * 0.5, dWidth, dHeight - dHeight * 0.5);

    ctx.font = "72px Arcade";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", dWidth * 0.5, 380);
    ctx.font = "30px Arcade";
    ctx.fillText(`BEAMS AVOIDED: ${gameArea.score - 1}`, dWidth * 0.5, 410);
    ctx.strokeStyle = "white";
    ctx.strokeRect(dWidth * 0.5 - 60, 430, 120, 35);
    ctx.fillText("RESTART", dWidth * 0.5, 460);

    gameArea.gameEnded = true;
  }

  function resetProps() {
    gameArea.frames = 0;

    gameArea.rayFrames = 0;
    gameArea.rayTrigger = false;
    gameArea.rayLastFrame = 0;
    gameArea.rayTimer = 5 * 60 + Math.floor(Math.random() * (60 * 3));

    gameArea.score = 0;
    gameArea.gameEnded = false;
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

    score: 0,
    gameEnded: false,

    // draws canvas for game screen
    drawCanvas: function () {
      this.canvas.width = 600;
      this.canvas.height = 500;
      this.canvas.setAttribute("id", "game-canvas");
      this.context = this.canvas.getContext("2d");
      document.getElementById("game-screen").append(this.canvas);
    },

    // first loading of game screen and calls game loop
    start: function () {
      soundboard.playBGM();
      this.drawCanvas();
      this.reqGameAnimation = window.requestAnimationFrame(updateGameArea);
    },

    // clears whole game screen
    clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // completely stops the game
    stop: function () {
      window.cancelAnimationFrame(this.reqGameAnimation);
      this.gameOver();
    },

    // calls the game over screen and events
    gameOver: function () {
      this.clear();
      gameOverScreen();
    },

    // restarts the game after 1500 milliseconds
    restartGame: function () {
      window.location.reload(false);
      resetProps();
      document.getElementById("game-screen").style.display = "none";
      document.getElementById("start-screen").style.display = "block";
    },
  };

  // cow object function
  function Cow(x, y) {
    this.posX = x * 0.2;
    this.posY = y * 0.8;
    this.targetX = this.posX;
    this.targetY = this.posY;
    this.width = 60;
    this.height = 40;
    this.speed = 0.1;
    this.step = 20;
    this.lastKeyPressed = "left";

    this.drawCow = () => {
      this.drawHoves();
      this.drawBody();
      this.drawHead();
      this.drawTail();
    };

    this.drawBody = () => {
      const ctx = gameArea.context;
      ctx.fillStyle = "white";
      ctx.fillRect(this.posX, this.posY, this.width, this.height);
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.posX, this.posY, this.width, this.height);
      ctx.fillRect(this.posX + 12, this.posY + 7, 12, 7);

      ctx.fillStyle = "black";
      if (this.lastKeyPressed == "left") {
        ctx.fillRect(this.posX + 39, this.posY + 3, 10, 13);
        ctx.fillRect(this.posX + 30, this.posY + 9, 13, 15);
      }
      if (this.lastKeyPressed == "right") {
        ctx.fillRect(this.posX + this.width - 49, this.posY + 3, 10, 13);
        ctx.fillRect(this.posX + this.width - 43, this.posY + 9, 13, 15);
      }
    };

    this.drawHead = () => {
      this.dWidth = 30;
      this.dHeight = 40;

      if (this.lastKeyPressed == "left") {
        this.dPosX = this.posX - this.dWidth * 0.5;
        this.dPosY = this.posY - this.dHeight * 0.3;
      }
      if (this.lastKeyPressed == "right") {
        this.dPosX = this.posX - this.dWidth * 0.5 + this.width;
        this.dPosY = this.posY - this.dHeight * 0.3;
      }

      const ctx = gameArea.context;

      ctx.fillStyle = "#efefef";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(this.dPosX + 8, this.dPosY);
      ctx.lineTo(this.dPosX, this.dPosY - 8);
      ctx.lineTo(this.dPosX, this.dPosY);
      ctx.moveTo(this.dPosX + this.dWidth, this.dPosY);
      ctx.lineTo(this.dPosX + this.dWidth, this.dPosY - 8);
      ctx.lineTo(this.dPosX + this.dWidth - 8, this.dPosY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "white";
      ctx.fillRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight);
      ctx.fillStyle = "#FFBEC2";
      ctx.fillRect(
        this.dPosX,
        this.dPosY + this.dHeight * 0.65,
        this.dWidth,
        this.dHeight - this.dHeight * 0.65
      );
      ctx.strokeRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight);

      if (gameArea.rayTrigger) {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(
          this.dPosX + this.dWidth * 0.3,
          this.dPosY + this.dHeight * 0.3,
          5,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          this.dPosX + this.dWidth - this.dWidth * 0.3,
          this.dPosY + this.dHeight * 0.3,
          5,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.stroke();
      }
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.dPosX + this.dWidth * 0.3,
        this.dPosY + this.dHeight * 0.3,
        2,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        this.dPosX + this.dWidth - this.dWidth * 0.3,
        this.dPosY + this.dHeight * 0.3,
        2,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.fill();
    };

    this.drawTail = () => {
      if (this.lastKeyPressed == "left") {
        this.dPosX = this.posX + this.width;
        this.dPosY = this.posY + this.height * 0.1;
      }
      if (this.lastKeyPressed == "right") {
        this.dPosX = this.posX;
        this.dPosY = this.posY + this.height * 0.1;
      }

      const ctx = gameArea.context;
      ctx.strokeStyle = "black";

      if (gameArea.rayTrigger) {
        this.tailEnd = -25;
      } else {
        this.tailEnd = 25;
      }

      if (this.lastKeyPressed == "left") {
        ctx.beginPath();
        ctx.moveTo(this.dPosX, this.dPosY);
        ctx.lineTo(this.dPosX + 10, this.dPosY + this.tailEnd);
        ctx.closePath();
        ctx.stroke();
      }
      if (this.lastKeyPressed == "right") {
        ctx.beginPath();
        ctx.moveTo(this.dPosX, this.dPosY);
        ctx.lineTo(this.dPosX - 10, this.dPosY + this.tailEnd);
        ctx.closePath();
        ctx.stroke();
      }
    };

    this.drawHoves = () => {
      this.dWidth = 8;
      this.dHeight = 8;
      this.dPosX = this.posX + 3;
      this.dPosY = this.posY + this.height - 3;
      const ctx = gameArea.context;
      ctx.fillStyle = "black";
      ctx.fillRect(
        this.dPosX + this.dWidth + 3,
        this.dPosY,
        this.dWidth,
        this.dHeight
      );
      ctx.fillRect(
        this.dPosX + this.width - (2 * this.dWidth + 3 * 3),
        this.dPosY,
        this.dWidth,
        this.dHeight
      );
      ctx.fillRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight);
      ctx.fillRect(
        this.dPosX + this.width - (this.dWidth + 3 * 2),
        this.dPosY,
        this.dWidth,
        this.dHeight
      );
    };

    this.moveUp = () => {
      if (this.targetY > gameArea.canvas.height * 0.39) {
        this.targetY = this.posY - this.step;
      }
    };
    this.moveDown = () => {
      if (this.targetY < gameArea.canvas.height * 0.95 - this.height) {
        this.targetY = this.posY + this.step;
      }
    };
    this.moveLeft = () => {
      if (this.targetX > gameArea.canvas.width * 0.05) {
        this.targetX = this.posX - this.step;
      }
    };
    this.moveRight = () => {
      if (this.targetX < gameArea.canvas.width * 0.95 - this.width) {
        this.targetX = this.posX + this.step;
      }
    };

    this.move = () => {
      this.posX = this.targetX; // (this.targetX - this.posX) * this.speed;
      this.posY = this.targetY; // (this.targetY - this.posY) * this.speed;
    };

    this.top = () => {
      return this.posY;
    };
    this.bot = () => {
      return this.posY + this.height;
    };
    this.lft = () => {
      return this.posX;
    };
    this.rgt = () => {
      return this.posX + this.width;
    };

    this.isCaught = (obj) => {
      return (
        !(
          this.bot() < obj.top() ||
          this.top() > obj.bot() ||
          this.rgt() < obj.lft() ||
          this.lft() > obj.rgt()
        ) && gameArea.rayTrigger
      );
    };
  }

  // ufo object function
  function FlyingSaucer(x, y) {
    this.posX = x * 0.7;
    this.posY = y * 0.2;
    this.flyingHeight = 180;
    this.speed = 0.01;
    this.width = 150;
    this.height = 40;

    this.drawUfo = () => {
      this.drawLight(); // 10%
      this.drawTop(); // 50%
      this.drawCockpit(); // extra
      this.drawBot(); // 40%
    };

    this.drawTop = () => {
      this.dWidth = this.width;
      this.dHeight = this.height * 0.5;
      this.dPosX = this.posX;
      this.dPosY = this.posY;
      ctx = gameArea.context;
      ctx.fillStyle = "rgba(187, 187, 187, 1)";
      ctx.fillRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight);
    };

    this.drawLight = () => {
      this.dWidth = this.width;
      this.dHeight = this.height * 0.2;
      this.dPosX = this.posX;
      this.dPosY = this.posY + this.height * 0.45;
      ctx = gameArea.context;
      if (
        gameArea.rayTrigger ||
        ((gameArea.frames - gameArea.rayLastFrame) % gameArea.rayTimer >
          gameArea.rayTimer * 0.6 &&
          (gameArea.frames - gameArea.rayLastFrame) % gameArea.rayTimer <
            gameArea.rayTimer * 0.8)
      ) {
        ctx.fillStyle = "rgba(213, 185, 52, 1)";
      } else {
        ctx.fillStyle = "rgba(153, 137, 17, 1)";
      }
      ctx.fillRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight);
    };

    this.drawBot = () => {
      this.dWidth = this.width;
      this.dHeight = this.height * 0.4;
      this.dPosX = this.posX;
      this.dPosY = this.posY + this.height * 0.6;
      ctx = gameArea.context;
      ctx.fillStyle = "rgba(153, 153, 153, 1)";
      ctx.fillRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight);
    };

    this.drawCockpit = () => {
      this.dWidth = this.width * 0.3;
      this.dHeight = this.height * 0.35;
      this.dPosX = this.posX + this.width / 2 - this.dWidth / 2;
      this.dPosY = this.posY - this.dHeight * 0.7;
      ctx = gameArea.context;
      ctx.fillStyle = "rgba(34, 52, 153, 0.8)";
      ctx.fillRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight);
    };

    this.follow = (obj) => {
      this.targetX = obj.posX + obj.width * 0.5 - this.width * 0.5;
      this.targetY = obj.posY - this.flyingHeight;
      this.posX += (this.targetX - this.posX) * this.speed;
      this.posY += (this.targetY - this.posY) * this.speed;
    };

    this.drawBeam = () => {
      this.dWidth = 80;
      this.dHeight = this.flyingHeight;
      this.dPosX = this.posX + this.width * 0.5 - this.dWidth * 0.5;
      this.dPosY = this.posY + this.height;
      ctx = gameArea.context;
      ctx.fillStyle = "rgba(144, 160, 191, 0.7)";
      ctx.fillRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight + 5);
      ctx.fillStyle = "rgba(223, 239, 255, 0.6)";
      ctx.fillRect(
        this.dPosX + 10,
        this.dPosY,
        this.dWidth - 20,
        this.dHeight + 5
      );
    };

    this.top = () => {
      return this.posY + this.flyingHeight - 8;
    };
    this.bot = () => {
      return this.posY + this.height + this.flyingHeight + 8;
    };
    this.lft = () => {
      return this.posX + this.width * 0.5 - 30;
    };
    this.rgt = () => {
      return this.posX + this.width * 0.5 + 30;
    };
  }

  // background object function
  function Background(width, height) {
    this.width = width;
    this.height = height;

    this.draw = () => {
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
    if (!player.isCaught(ufo)) {
      if (keyPressed.keyCode == 65 || keyPressed.keyCode == 37) {
        player.moveLeft();
        player.lastKeyPressed = "left";
      }
      if (keyPressed.keyCode == 87 || keyPressed.keyCode == 38) {
        player.moveUp();
        // player.lastKeyPressed = "up";
      }
      if (keyPressed.keyCode == 68 || keyPressed.keyCode == 39) {
        player.moveRight();
        player.lastKeyPressed = "right";
      }
      if (keyPressed.keyCode == 83 || keyPressed.keyCode == 40) {
        player.moveDown();
        // player.lastKeyPressed = "down";
      }
    }
  });

  // restart button
  document.addEventListener("click", (event) => {
    const elem = document.getElementById("game-canvas");
    if (elem) {
      const elemLft = elem.offsetLeft;
      const elemTop = elem.offsetTop;
      let x = event.pageX - elemLft;
      let y = event.pageY - elemTop;
      if (gameArea.gameEnded && x > 240 && x < 360 && y > 430 && y < 465) {
        gameArea.restartGame();
      }
    }
  });

  // sound board
  function SoundBoard() {
    this.bgm = document.createElement("audio");
    this.bgm.src = "../sounds/The Alien Whistle.wav";
    this.bgm.setAttribute("preload", "auto");
    this.bgm.setAttribute("constrols", "none");
    this.bgm.loop = true;
    this.bgm.style.display = "none";
    this.bgm.volume = 0.1;
    this.playBGM = () => {
      this.bgm.play();
    };
    this.stopBGM = () => {
      this.bgm.pause();
    };

    this.beam = document.createElement("audio");
    this.beam.src =
      "../sounds/221517__alaskarobotics__sci-fi-alien-ufo-warble.wav";
    this.beam.setAttribute("preload", "auto");
    this.beam.setAttribute("constrols", "none");
    this.beam.style.display = "none";
    this.beam.volume = 0.05;
    this.playBeam = () => {
      if (this.beam.paused) {
        this.beam.play();
      } else {
        this.beam.currentTime = 0;
      }
    };
    this.stopBeam = () => {
      this.beam.pause();
    };
  }
};
