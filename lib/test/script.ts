var drawDongs = function() {
  var canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
  var ctx  = <CanvasRenderingContext2D> canvas.getContext("2d");
  ctx.fillStyle = "HotPink";
  ctx.fillRect(50, 25, 150, 100);
}

drawDongs();
