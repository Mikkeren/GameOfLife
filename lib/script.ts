class BoardSettings {
  public static GRID_SIZE = 10;
  public static GRID_HEIGHT = 100;
  public static GRID_WIDTH = 100;
}

class GameOfLife {
  private board: number[][] = new Array<Array<number>>();

  constructor() {
    for (var i = 0; i < BoardSettings.GRID_WIDTH; i++) {
      this.board[i] = new Array<number>();
      for (var j = 0; j < BoardSettings.GRID_HEIGHT; j++) this.board[i][j] = 0;
    }
    this.board[50][0] = 1;

    this.board[4][4] = 1;
    this.board[5][5] = 1;
    this.board[5][6] = 1;
    this.board[6][5] = 1;
    this.board[6][6] = 1;
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
  }
}

(function() {
  var game = new GameOfLife();
  game.redraw();
}());
