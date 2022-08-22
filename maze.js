const BGColor = 'rgb(0, 40, 70)';
const PATHColor = 'rgb(0, 120, 150)';
const POINTColor = 'rgb(255, 0, 0)';

let mazeArea = document.getElementById("maze");
const [cellHeight, cellWidth, rows, cols] = calculateMazeSizes(mazeArea);

drawPath = drawPath.bind(null, mazeArea, cellHeight, cellWidth);
drawPointer = drawPointerWrapper(mazeArea, cellHeight, cellWidth, drawPointer);


/* Create maze
---------------------------------*/
function createMaze() {
  if (mazeArea.getContext) {
    const ctx = mazeArea.getContext('2d');
    ctx.fillStyle = BGColor;
    ctx.fillRect(0, 0, cellWidth * cols, cellHeight * rows);
  }

  const pathsObj = generateMazePaths(mazeArea, cellHeight, cellWidth, rows, cols);

  return {
    paths: pathsObj,
    move: drawPointer,
  }
}


/* Calculate maze sizes
---------------------------------*/
function calculateMazeSizes(mazeArea) {
  let mazeHeight = mazeArea.height;
  let mazeWidth = mazeArea.width;

  let rows = Math.floor(mazeHeight / 7);
  let cols = Math.floor(mazeWidth / (mazeHeight / rows * 1.7));
  rows -= (rows + 1) % 2;
  cols -= (cols + 1) % 2;

  let cellHeight = Math.floor(mazeHeight / rows);
  let cellWidth = Math.floor(mazeWidth / cols);

  return [cellHeight, cellWidth, rows, cols];
}


/* Generate maze paths
---------------------------------*/
function generateMazePaths(mazeArea, cellHeight, cellWidth, rows, cols) {
  //DIRS = [right, bottom, left, top]
  const DIRS = [[0, 2], [2, 0], [0, -2], [-2, 0]];
  const DIRS_COUNT = 4;

  let seenCells = new Set();

  function generatePaths(row, col, dir) {
    if (row < 1 || col < 1 || row >= rows - 1 || col >= cols - 1) return null;

    let cellId = `${row},${col}`;
    if (seenCells.has(cellId)) return null;

    seenCells.add(cellId);
    drawPath(row, col, dir);
    if (row === rows - 2 && col === cols - 2) {

      let exitCellRow = row;
      let exitCellCol = col;
      if (!dir) exitCellCol++;
      else exitCellRow++;
      const curObj = {
        [0]: null,
        [1]: null,
        [2]: null,
        [3]: null,
        isExit: true,
      }
      curObj.row = exitCellRow;
      curObj.col = exitCellCol
      drawPath(exitCellRow, exitCellCol, dir);
      return curObj;
    }

    let usedDirections = new Set();

    //object statistics
    const curObj = {};
    let noTurns = true;

    while (usedDirections.size < DIRS_COUNT) {
      let chosenDirNumber = intRandom(DIRS_COUNT - usedDirections.size);

      for (let i = 0; i < DIRS_COUNT; i++) {
        if (usedDirections.has(i)) continue;
        else {
          if (!chosenDirNumber) {
            usedDirections.add(i);

            //move to adjacent cell
            const adjacentObj = generatePaths(row + DIRS[i][0], col + DIRS[i][1], i);
            if (noTurns && (i !== dir) && adjacentObj) noTurns = false;
            curObj[i] = adjacentObj;
            
            break;
          } else chosenDirNumber--;
        }
      }
    }
    // is part of direct path
    if (noTurns && curObj[dir]) {
      return curObj[dir];
    } else {
      curObj.row = row;
      curObj.col = col;
      return curObj;
    }
  }
  return(generatePaths(1, 1, -1));
}


/* Draw path
---------------------------------*/
function drawPath(mazeArea, cellHeight, cellWidth, row, col, translationInd) {
  let RECT_SIDES = [[1, 2], [2, 1]];

  if (translationInd === -1) {
    if (mazeArea.getContext) {
      const ctx = mazeArea.getContext('2d');
      ctx.fillStyle = PATHColor;
      ctx.fillRect(cellWidth, cellHeight, cellWidth, cellHeight);
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
    const rectType = RECT_SIDES[translationInd % 2];
    const w = rectType[1];
    const h = rectType[0];
    ctx.fillStyle = PATHColor;
    ctx.fillRect(col * cellWidth, row * cellHeight, w * cellWidth, h * cellHeight);
  }
}

/* Draw pointer
---------------------------------*/
function drawPointerWrapper(maze, cellHeight, cellWidth, drawPointer) {
  let prevX = -1;
  let prevY = -1;

  return function(row, col) {
    drawPointer(maze, cellHeight, cellWidth, prevX, prevY, PATHColor);
    drawPointer(maze, cellHeight, cellWidth, row, col, POINTColor);

    prevX = row;
    prevY = col;
  }
}

function drawPointer(maze, cellHeight, cellWidth, row, col, color) {
  if (maze.getContext) {
    const ctx = maze.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
  }
}







