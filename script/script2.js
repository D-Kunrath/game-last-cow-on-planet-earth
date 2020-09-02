window.onload = () => {
  const gameArea = {
    canvas: document.createElement("canvas"),
    frames: 0,

    drawCanvas: function () {
      this.canvas.width = 600;
      this.canvas.height = 500;
      this.context = this.canvas.getContext("2d");
      document.getElementById("game-screen").append(this.canvas);
    },

    start: function () {
      this.drawCanvas();
      this.reqAnimation = window.requestAnimationFrame(updateGameArea);
    },

    clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop: function () {
      cancelAnimationFrame(this.reqAnimation);
    },

    gameOver: function () {
      this.clear();
      // todo: game over screen + final score
      // todo: restart game
    },

    restartGame: function () {
      setTimeout(() => {
        document.getElementById("game-screen").removeChild("canvas");
        document.getElementById("start-screen").style.display = "block";
      }, 1500);
    },
  };

  function Cow(x, y) {
    this.posX = x * 0.2;
    this.posY = y * 0.8;
    this.targetX = this.posX;
    this.targetY = this.posY;
    this.width = 60;
    this.height = 40;
    this.speed = 0.1;
    this.step = 20;

    this.drawCow = () => {
      this.drawBody();
      // this.drawhead();
      // this.drawTail();
      // this.drawHoves();
    };

    this.drawBody = () => {
      const ctx = gameArea.context;
      ctx.fillStyle = "white";
      ctx.fillRect(this.posX, this.posY, this.width, this.height);
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.posX, this.posY, this.width, this.height);

      ctx.fillRect(this.posX + 12, this.posY + 7, 12, 7);
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
      return !(
        this.bot() < obj.top() ||
        this.top() > obj.bot() ||
        this.rgt() < obj.lft() ||
        this.lft() > obj.rgt()
      );
    };
  }

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
      ctx.fillStyle = "rgba(153, 137, 17, 1)";
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

    this.drawBeam = (obj) => {
      this.dWidth = 80;
      this.dHeight = this.flyingHeight; // + this.height * 0.4;
      this.dPosX = this.posX + this.width * 0.5 - this.dWidth * 0.5;
      this.dPosY = this.posY + this.height;
      ctx = gameArea.context;
      ctx.fillStyle = "rgba(144, 160, 191, 0.7)";
      ctx.fillRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight);
      ctx.fillStyle = "rgba(223, 239, 255, 0.6)";
      ctx.fillRect(this.dPosX + 10, this.dPosY, this.dWidth - 20, this.dHeight);
    };

    this.top = () => {
      return this.posY; // + this.height + this.flyingHeight + player.height * 0.8;
    };
    this.bot = () => {
      return this.posY + this.height; // + this.flyingHeight + player.height * 1.2;
    };
    this.lft = () => {
      return this.posX; // + this.width * 0.5 - 40;
    };
    this.rgt = () => {
      return this.posX + this.width; // * 0.5 + 40;
    };
  }

  function Background(w, h) {
    this.width = w;
    this.height = h;

    this.draw = () => {
      const ctx = gameArea.context;
      ctx.fillStyle = "#2A2A46";
      ctx.fillRect(0, 0, this.width, this.height * 0.35);
      ctx.fillStyle = "#597322";
      ctx.fillRect(0, this.height * 0.35, this.width, this.height);
    };
  }

  function startGame() {
    canvasWidth = 600;
    canvasHeight = 500;
    background = new Background(canvasWidth, canvasHeight);
    player = new Cow(canvasWidth, canvasHeight);
    ufo = new FlyingSaucer(canvasWidth, canvasHeight);
    gameArea.start();
  }

  function updateGameArea() {
    gameArea.clear();
    background.draw();

    player.drawCow();
    ufo.drawUfo();
    ufo.follow(player);

    gameArea.frames += 1;
    gameArea.reqAnimation = window.requestAnimationFrame(updateGameArea);
  }

  document.getElementById("btn-start").addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    startGame();
  });

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
