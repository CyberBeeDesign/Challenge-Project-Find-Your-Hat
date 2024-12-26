const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this.field = field;
    this.playerX = 0;
    this.playerY = 0;
    this.field[this.playerY][this.playerX] = pathCharacter;
  }

  print() {
    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(" "));
    }
  }

  isOutOfBound() {
    return (
      this.playerX < 0 ||
      this.playerY < 0 ||
      this.playerX >= this.field[0].length ||
      this.playerY >= this.field.length
    );
  }

  checkWinOrLoss() {
    if (this.isOutOfBound()) {
      console.log("You fell out of bounds!");
      return true; // Game is over
    }

    const currentPosition = this.field[this.playerY][this.playerX];
    if (currentPosition === hat) {
      console.log("You found the hat! You win!");
      return true;
    } else if (currentPosition === hole) {
      console.log("You fell into a hole! Game over.");
      return true;
    } else {
      return false; // Game continues
    }
  }

  userInput() {
    const direction = prompt(
      "Which way do you want to go?  U = up, D = down, L = left, R = right): "
    ).toLowerCase();
    if (!["U", "D", "L", "R"].includes(direction)) {
      console.log("Invalid input. Please enter U, D, L, or R.");
      return;
    }
    this.updatePosition(direction);
  }

  updatePosition(direction) {
    // Save current position
    const previousX = this.playerX;
    const previousY = this.playerY;

    // Update position based on direction
    if (direction === "U" || 'u') {
      this.playerY -= 1;
    } else if (direction === 'D'|| "d") {
      this.playerY += 1;
    } else if (direction === 'R'|| "r") {
      this.playerX += 1;
    } else if (direction === 'L'|| "l") {
      this.playerX -= 1;
    }

    // Check if out of bounds
    if (this.isOutOfBound()) {
      console.log("You moved out of bounds!");
      return;
    }

    // Update field with new position
    const currentPosition = this.field[this.playerY][this.playerX];
    if (currentPosition !== hat && currentPosition !== hole) {
      this.field[previousY][previousX] = fieldCharacter; // Clear previous position
      this.field[this.playerY][this.playerX] = pathCharacter; // Mark new position
    }
  }

  static generateField(height, width, percentage) {
    const field = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => fieldCharacter)
    );

    // Place the hat
    let hatX, hatY;
    do {
      hatX = Math.floor(Math.random() * width);
      hatY = Math.floor(Math.random() * height);
    } while (hatX === 0 && hatY === 0); // Ensure the hat is not at the start
    field[hatY][hatX] = hat;

    // Place the holes
    const totalCells = height * width;
    const numOfHoles = Math.floor(totalCells * percentage);

    let holesPlaced = 0;
    while (holesPlaced < numOfHoles) {
      const holeX = Math.floor(Math.random() * width);
      const holeY = Math.floor(Math.random() * height);
      if (field[holeY][holeX] === fieldCharacter) {
        field[holeY][holeX] = hole;
        holesPlaced++;
      }
    }

    return field;
  }
}

// Generate a random field and play the game
const myField = new Field(Field.generateField(5, 5, 0.2));
let gameOver = false;

console.log("Find your hat (^)! Avoid the holes (O)!");
while (!gameOver) {
  myField.print();
  myField.userInput();
  gameOver = myField.checkWinOrLoss();
}
