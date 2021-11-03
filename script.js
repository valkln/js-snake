const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

let score = 0;

//border
const drawBorder = () => {
	ctx.fillStyle = 'gray';
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
}
//score
const drawScore = () => {
	ctx.font = '20px Courier';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.fillText('score: ' + score, blockSize, blockSize);
};
//gameover
const gameover = () => {
	clearInterval(intervalId);
	ctx.font = "60px Courier";
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText('You LOST!', width / 2, 150);
	ctx.font = "30px Courier";
	ctx.fillText('press spacebar', width / 2, 200);
	ctx.fillText('to try again', width / 2, 230);
	document.addEventListener('keyup', event => {
		if (event.code === 'Space') {
			location.reload();
		}
	})
};

//circle
const circle = (x, y, radius, fillCircle) => {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 360, false);
	if (fillCircle) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
}

//block
class Block {
	constructor(col, row) {
		this.col = col;
		this.row = row;
	}
	drawSquare(color) {
		let x = this.col * blockSize;
		let y = this.row * blockSize;
		ctx.fillStyle = color;
		ctx.fillRect(x, y, blockSize, blockSize);
	}
	drawCircle(color) {
		let centerX = this.col * blockSize + blockSize / 2;
		let centerY = this.row * blockSize + blockSize / 2;
		ctx.fillStyle = color;
		circle(centerX, centerY, blockSize / 2, true);
	}
	equal(otherBlock) {
		return this.col === otherBlock.col && this.row === otherBlock.row;
	}
}
//snake
class Snake {
	constructor() {
		this.segments = [
			new Block(7, 5),
			new Block(6, 5),
			new Block(5, 5)
		];

		this.direction = 'right';
		this.nextDirection = 'right';
	}
	draw() {
		for (let i = 0; i < this.segments.length; i++) {
			this.segments[i].drawSquare('blue');
		}
	}
	move() {
		let head = this.segments[0];
		let newHead;
		this.direction = this.nextDirection;
		if (this.direction === 'right') {
			newHead = new Block(head.col + 1, head.row);
		} else if (this.direction === 'down') {
			newHead = new Block(head.col, head.row + 1);
		} else if (this.direction === 'left') {
			newHead = new Block(head.col - 1, head.row);
		} else if (this.direction === 'up') {
			newHead = new Block(head.col, head.row - 1);
		}
		if (this.checkCollision(newHead)) {
			gameover();
			return;
		}
		this.segments.unshift(newHead);
		if (newHead.equal(apple.position)) {
			score++;
			apple.move();
		} else {
			this.segments.pop();
		}
	}
	checkCollision(head) {
		let leftCollision = (head.col === 0);
		let topCollision = (head.row === 0);
		let rightCollision = (head.col === widthInBlocks - 1);
		let bottomCollision = (head.row === heightInBlocks - 1);
		let wallCollision = leftCollision || rightCollision || topCollision || bottomCollision;
		let selfCollision = false;
		for (let i = 0; i < this.segments.length; i++) {
			if (head.equal(this.segments[i])) {
				selfCollision = true;
			}
		}
		return wallCollision || selfCollision;
	}
	setDirection(newDirection) {
		debugger;
		if (this.direction === 'up' && newDirection === 'down') {
			return;
		} else if (this.direction === 'right' && newDirection === 'left') {
			return;
		} else if (this.direction === 'left' && newDirection === 'right') {
			return;
		} else if (this.direction === 'down' && newDirection === 'up') {
			return;
		}
		this.nextDirection = newDirection;
	}
}

//apple
class Apple {
	constructor() {
		this.position = new Block(10, 10);
	}
	draw() {
		this.position.drawCircle('limegreen');
	}
	move() {
		let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
		let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
		this.position = new Block(randomCol, randomRow);
	}
}


const directions = {
	ArrowLeft: 'left',
	ArrowUp: 'up',
	ArrowRight: 'right',
	ArrowDown: 'down'
};

document.addEventListener('keydown', (e) => {
	let newDirection = directions[e.code];
	if (newDirection !== undefined) {
		snake.setDirection(newDirection);
	}
})

let snake = new Snake();
let apple = new Apple();

let intervalId = setInterval(() => {
	ctx.clearRect(0, 0, width, height);
	drawScore();
	snake.move();
	snake.draw();
	apple.draw();
	drawBorder();
}, 100);