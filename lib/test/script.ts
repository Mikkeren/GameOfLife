export class BoardSettings {
  public static GRID_SIZE = 5;
}


class GameOfLife {
  private board: number[][];

  constructor() {
    for (var i = 0; i < 100; i++) {
      for (var j = 0; j < 100; j++) this.board[i][j] = 0;
    }

    this.board[5][5] = 1;
  }

  redraw() : void {
    var canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
    var ctx  = <CanvasRenderingContext2D> canvas.getContext("2d");

    var gridSize = BoardSettings.GRID_SIZE;

    for (var i = 0; i < 100; i++) {
      for (var j = 0; j < 100; j++) {
        //Draw borders.
        ctx.fillStyle = "black";
        //Top border
        ctx.fillRect(gridSize*i, gridSize*j, gridSize, 1)
        //Bottom border
        ctx.fillRect(gridSize*(i+1), gridSize*j, gridSize, 1)
        //Left border
        ctx.fillRect(gridSize*i, gridSize*(j+1), 1, gridSize)
        //Right border
        ctx.fillRect(gridSize*i, gridSize*(j+1), 1, gridSize)
        if (this.board[i][j] == 0) {

          ctx.fillStyle = "white";
        }
        ctx.fillRect(i*gridSize+1, j*gridSize+1, gridSize-1, gridSize-1);
      }
    }

  }
}

(function() {
  var game = new GameOfLife();
  game.redraw();
})();
