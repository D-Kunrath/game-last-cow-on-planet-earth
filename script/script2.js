window.onload = () => {
  const canvasHeight = 500;
  const canvasWidth = 600;
  const gameArea = {
    canvas: document.createElement("canvas"),
    frames: 0,

    drawCanvas: () => {
      this.canvas.width = canvasHeight;
      this.canvas.height = canvasHeight;
      this.context = this.canvas.getContext("2d");
      document.getElementById("game-screen").append(this.canvas);
    },

    start: () => {
      this.drawCanvas();
      this.reqAnimation = window.requestAnimationFrame(updateGameArea);
    },

    clear: () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop: () => {
      cancelAnimationFrame(this.reqAnimation);
    },

    gameOver: () => {
      this.clear();
      // todo: game over screen + final score
      // todo: restart game
    },

    restartGame: () => {
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

      ctx, fillRect(this.posX + 12, this.posY + 7, 12, 7);
    };

    this.moveUp = () => {
      this.targetY = this.posY - this.step;
    };
    this.moveDown = () => {
      this.targetY = this.posY + this.step;
    };
    this.moveUp = () => {
      this.targetY = this.posY - this.step;
    };
    this.moveUp = () => {
      this.targetY = this.posY - this.step;
    };

    this.move = () => {
      this.posX = (this.targetX - this.posX) * this.speed;
      this.posY = (this.targetY - this.posY) * this.speed;
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
    this.flyingHeight = gameArea.canvas.height + player.height;
    this.speed = 1;
    this.width = 150;
    this.height = 42;

    this.drawUfo = () => {
      this.drawLight();
      this.drawTop();
      this.drawCockpit();
      this.drawBot();
    };

    this.drawCockpit = () => {
      this.dWidth = Math.floor(this.width / 5);
      this.dHeight = Math.floor(this.height / 4);
      this.dPosX = this.posX + this.width / 2 - this.dWidth / 2;
      this.dposY = this.posY - this.dHeight * 0.9;
      const ctx = gameArea.context;
      ctx.fillStyle = "rgba(34, 52, 153, 0.8)";
      ctx.fillRect(this.dPosX, this.dPosY, this.dWidth, this.dHeight);
    };
  }
};
