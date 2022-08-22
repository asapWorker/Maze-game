/*Maze pointer constants
--------------------------*/
const START_R = 1;
const START_C = 1;


/*Session start
----------------------------*/
showGreetingMenu();
addStartBtnListener(showMaze);


/*Maze functional
----------------------------*/
function showMaze() {
  closeMenu();

  //Maze props
  const mazeData = createMaze();
  const move = mazeData.move;
  let paths = mazeData.paths;

  move(START_R, START_C);

  document.addEventListener('pointerdown', handlePointerDown);
  document.addEventListener('keydown', handleKeyDown);

  function handlePointerDown(event) {
    const startX = event.clientX;
    const startY = event.clientY;

    document.addEventListener('pointerup', handlePointerUp);

    function handlePointerUp(event) {
      const delX = event.clientX - startX;
      const delY = event.clientY - startY;
      let dir = -1;

      if (Math.abs(delX) > Math.abs((delY))) {
        if (delX < 0) {
          //Left
          dir = 2;
        } else {
          //Right
          dir = 0;
        }
      } else {
        if (delY < 0) {
          //Top
          dir = 3;
        } else if (delX > 0) {
          //Bottom
          dir = 1;
        }
      }

      moveInDirection(dir);

      document.removeEventListener('pointerup', handlePointerUp);
    }
  }


  function handleKeyDown(event) {
    const key = event.key;
    let dir = -1;

    switch (key) {
      case 'ArrowLeft':
        dir = 2;
        break;
      case 'ArrowRight':
        dir = 0;
        break;
      case 'ArrowUp':
        dir = 3;
        break;
      case 'ArrowDown':
        dir = 1;
        break;
    }

    moveInDirection(dir);
  }

  function moveInDirection(dir) {
    if (dir === -1) return;
    const cur = paths[dir];
    if (cur) {
      move(cur.row, cur.col);

      //restart game
      if (cur.isExit) {
        document.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
        showMenu();
      }

      //modify paths object
      cur[(dir + 2) % 4] = paths;
      paths = cur;
    }
  }
}
