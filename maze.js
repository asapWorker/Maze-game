function createMaze() {
  let maze = document.getElementById("maze");

  let [cellSide, rows, cols] = calculateMazeSizes();

  modifyMazeArea(maze, cellSide, rows, cols);

  generateMazePaths(maze, cellSide, rows, cols);
}

function calculateMazeSizes() {
  let mazeHeight = document.documentElement.offsetHeight;
  let mazeWidth = document.documentElement.offsetWidth;

  if (mazeHeight > mazeWidth) {
    let x = mazeHeight;
    mazeHeight = mazeWidth;
    mazeWidth = x;
  }
  mazeHeight *= 0.9;
  mazeWidth = Math.min(mazeHeight * 1.5, mazeWidth);

  let cellSide = Math.max(Math.floor(mazeHeight * 0.04), 10);
  let rows = Math.floor(mazeHeight / cellSide);
  let cols = Math.floor(mazeWidth / cellSide);
  cols -= (cols - 1) % 2;
  rows -= (rows - 1) % 2;

  return [cellSide, rows, cols];
}

function modifyMazeArea(mazeArea, cellSide, rows, cols) {
  let w = cols * cellSide;
  let h = rows * cellSide;

  mazeArea.width = w;
  mazeArea.height = h;

  let ctx = mazeArea.getContext('2d');
  ctx.fillStyle = 'rgb(100, 100, 100)';
  ctx.fillRect(0, 0, w, h);

  drawPath(mazeArea, cellSide, 0, 0, 2);
  drawPath(mazeArea, cellSide, rows - 1, cols - 1, 0);
}

function generateMazePaths(mazeArea, cellSide, rows, cols) {
  const DIRS = [[0, 2], [2, 0], [0, -2], [-2, 0]];
  const DIRS_COUNT = 4;

  let seenCells = new Set();

  function generatePaths(row, col, dir) {
    if (row < 1 || col < 1 || row >= rows - 1 || col >= cols - 1) return null;

    let cellId = `${row},${col}`;
    if (seenCells.has(cellId)) return null;

    seenCells.add(cellId);
    drawPath(mazeArea, cellSide, row, col, dir);
    if (row === rows - 1 && col === cols - 1) return null;

    let usedDirections = new Set();

    while (usedDirections.size < DIRS_COUNT) {
      let chosenDirNumber = intRandom(DIRS_COUNT - usedDirections.size);

      for (let i = 0; i < DIRS_COUNT; i++) {
        if (usedDirections.has(i)) continue;
        else {
          if (!chosenDirNumber) {
            usedDirections.add(i);
            generatePaths(row + DIRS[i][0], col + DIRS[i][1], i);
            break;
          } else chosenDirNumber--;
        }
      }
    }
  }
  generatePaths(1, 1, -1);
}

function drawPath(mazeArea, cellSide, row, col, translationInd) {
  let RECT_SIDES = [[1, 2], [2, 1]];

  if (translationInd === -1) {
    if (mazeArea.getContext) {
      const ctx = mazeArea.getContext('2d');
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(cellSide, cellSide, cellSide, cellSide);
    }
    return;
  }

  if (!translationInd) {
    col--;
  } else if (translationInd === 1) {
    row--;
  }
  if (mazeArea.getContext) {
    const ctx = mazeArea.getContext('2d');
    let rectType = RECT_SIDES[translationInd % 2];
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(col * cellSide, row * cellSide, rectType[1] * cellSide, rectType[0] * cellSide);
  }
}







