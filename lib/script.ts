class BoardSettings {
  public static GRID_SIZE = 10;
  public static GRID_HEIGHT = 50;
  public static GRID_WIDTH = 50;
}

class GameOfLife {
  private board: number[][] = new Array<Array<number>>();
  private generation: number = 0;
  private playTimer;

  private canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("gameCanvas");
  private generationCounterElement: HTMLElement = document.getElementById("generationCounter");

  public isPlaying : boolean = false;

  constructor() {
    this.canvas.width = BoardSettings.GRID_WIDTH * BoardSettings.GRID_SIZE + 1;
    this.canvas.height = BoardSettings.GRID_HEIGHT * BoardSettings.GRID_SIZE + 1;
    for (var i = 0; i < BoardSettings.GRID_WIDTH; i++) {
      this.board[i] = new Array<number>();
      for (var j = 0; j < BoardSettings.GRID_HEIGHT; j++) this.board[i][j] = 0;
    }
  }

  redraw() : void {
    var ctx  = <CanvasRenderingContext2D> this.canvas.getContext("2d");

    var gridSize = BoardSettings.GRID_SIZE;

    for (var i = 0; i < BoardSettings.GRID_WIDTH; i++) {
      for (var j = 0; j < BoardSettings.GRID_HEIGHT; j++) {
        //Draw borders.
        ctx.fillStyle = "black";
        //Top border
        ctx.fillRect(gridSize*i, gridSize*j, gridSize, 1);
        //Left border
        ctx.fillRect(gridSize*i, gridSize*j, 1, gridSize);

        if (this.board[i][j] == 0) {
          ctx.fillStyle = "white";
        } else {
          ctx.fillStyle = "HotPink"
        }
        ctx.fillRect(i*gridSize + 1, j*gridSize + 1, gridSize - 1, gridSize - 1);
      }
    }
    ctx.fillStyle = "black";
    ctx.fillRect(gridSize*(BoardSettings.GRID_WIDTH), 0, 1, gridSize*BoardSettings.GRID_HEIGHT+1);
    ctx.fillRect(0, gridSize*(BoardSettings.GRID_HEIGHT), gridSize*BoardSettings.GRID_WIDTH+1, 1);
  }

  switchLife(i: number, j: number) : void {
    this.board[i][j] = this.board[i][j] == 0 ? 1 : 0;
  }

  nextGeneration() : void {
    var newBoard = new Array<Array<number>>();
    for (var i = 0; i < BoardSettings.GRID_WIDTH; i++) {
      newBoard[i] = new Array<number>();
      for (var j = 0; j < BoardSettings.GRID_HEIGHT; j++) {
        //Get neighbours and apply the four rules.
        var neighbourCount = this.getLivingNeighbours(i, j);

        //1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        //3. Any live cell with more than three live neighbours dies, as if by overcrowding.
        newBoard[i][j] = 0;

        //2. Any live cell with two or three live neighbours lives on to the next generation.
        if (this.board[i][j] == 1 && (neighbourCount == 2 || neighbourCount == 3)) {
          newBoard[i][j] = 1;
        }

        //4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if (this.board[i][j] == 0 && neighbourCount == 3) {
          newBoard[i][j] = 1;
        }
      }
    }
    this.generation++;
    this.generationCounterElement.innerHTML = this.generation.toString();
    this.board = newBoard;
  }

  getLivingNeighbours(x : number, y: number) : number {
    var count : number = 0;
    for (var i = x - 1; i <= x + 1; i++) {
      for (var j = y - 1; j <= y + 1; j++) {
        if (i < 0 || j < 0) continue;
        if (i >= BoardSettings.GRID_WIDTH || j >= BoardSettings.GRID_HEIGHT) continue;
        if (i == x && j == y) continue;
        if (this.board[i][j] == 1) count++;
      }
    }
    return count;
  }

  play(interval: number) : void {
    this.isPlaying = true;
    this.playTimer = window.setInterval(() => this.nextGeneration(), interval);
  }

  pause() : void {
    this.isPlaying = false;
    window.clearInterval(this.playTimer);
  }
}

(function() {
  var game = new GameOfLife();

  var rafLoop = function() {
    game.redraw();
    requestAnimationFrame(rafLoop);
  }
  rafLoop();

  var canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
  canvas.onclick = function(ev: MouseEvent) {
    var i = Math.floor((ev.clientX - canvas.offsetLeft) / BoardSettings.GRID_SIZE);
    var j = Math.floor((ev.clientY - canvas.offsetTop) / BoardSettings.GRID_SIZE);
    game.switchLife(i, j);
  };

  var stepButton = <HTMLButtonElement> document.getElementById("stepButton");
  stepButton.onclick = function(ev: MouseEvent) {
    game.nextGeneration();
  };

  var playButton = <HTMLButtonElement> document.getElementById("playButton");
  playButton.onclick = function(ev: MouseEvent) {
    if (game.isPlaying) {
      game.pause();
      playButton.innerHTML = "Play";
    } else {
      game.play(200);
      playButton.innerHTML = "Pause";
    }
  };
}());
