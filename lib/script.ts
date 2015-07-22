class BoardSettings {
  public static GRID_SIZE = 25;
  public static GRID_HEIGHT = 3;
  public static GRID_WIDTH = 3;
}

class GameOfLife {
  private board: number[][] = new Array<Array<number>>();

  constructor() {
    for (var i = 0; i < BoardSettings.GRID_WIDTH; i++) {
      this.board[i] = new Array<number>();
      for (var j = 0; j < BoardSettings.GRID_HEIGHT; j++) this.board[i][j] = 0;
    }
  }

  redraw() : void {
    var canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
    var ctx  = <CanvasRenderingContext2D> canvas.getContext("2d");

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
    this.redraw();
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
    this.board = newBoard;
    this.redraw();
  }

  getLivingNeighbours(x : number, y: number) : number {
    var count : number = 0;
    for (var i = x - 1; i <= x + 1; i++) {
      if (i >= 0 && i < BoardSettings.GRID_WIDTH) {
        for (var j = y - 1; j <= y + 1; j++) {
          if (j >= 0 && j < BoardSettings.GRID_HEIGHT) {
            //TODO: Fix this.
            console.log(i, j, this.board[i][j]);
            if ((i != x  && j != y) && this.board[i][j] == 1) count++;
          }
        }
      }
    }
    return count;
  }
}

(function() {
  var game = new GameOfLife();
  game.redraw();

  var canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
  canvas.onclick = function(ev: MouseEvent) {
    var i = Math.floor(ev.layerX / BoardSettings.GRID_SIZE);
    var j = Math.floor(ev.layerY / BoardSettings.GRID_SIZE);
    game.switchLife(i, j);
  };

  var button = <HTMLButtonElement> document.getElementById("stepButton");
  button.onclick = function(ev: MouseEvent) {
    game.nextGeneration();
  }

}());
