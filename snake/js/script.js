(function() {

    const REFRESH_RATE = 200;
    const UNIT_WIDTH = 30;
    const UNIT_HEIGHT = 30;
    const BOARD_WIDTH = 960;
    const BOARD_HEIGHT = 510;
    const X_UNIT_COUNT = BOARD_WIDTH / UNIT_WIDTH;
    const Y_UNIT_COUNT = BOARD_HEIGHT / UNIT_HEIGHT;
    const INITIAL_LENGTH = 3;

	let directions = [0, 1, 0, -1, 0];
	let currentDirection = 1;

    document.onkeydown = checkKey;

    function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == '38') {
            // up arrow
            currentDirection = 2;
        }
        else if (e.keyCode == '40') {
            // down arrow
            currentDirection = 0;
        }
        else if (e.keyCode == '37') {
           // left arrow
           currentDirection = 3;
        }
        else if (e.keyCode == '39') {
           // right arrow
           currentDirection = 1;
        }

    }

    function getRandom(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    class GameUnit {
        constructor(x, y, unitType) {
            this.x = x;
            this.y = y;

            this.element = $(document.createElement("div"));
			this.element.attr("id", unitType + x +"x"+ y+"y");
			this.element.attr("class", unitType);
            $("#mainFrame").append(this.element);
        }

        remove() {
            this.element.remove();
        }

        isColliding(node) {
            return this.x === node.x && this.y === node.y;
        }

        render() {
            const newX = this.x * UNIT_WIDTH;
            const newY = this.y * UNIT_HEIGHT;
            if (newX < 0 || newX > BOARD_WIDTH - 1 || newY < 0 || newY > BOARD_HEIGHT - 1) {
                return false;
            }

            this.element.css({
				'left': newX + 'px',
				'top': newY + 'px',
            });
            return true;
        }

    }

    class SnakeUnit extends GameUnit {
        constructor(x, y) {
            super(x, y, "gameBox");
        }
    }

    class FoodUnit extends GameUnit {
        constructor(snake) {
            const snakeX = snake.map(unit => unit.x);
            const snakeY = snake.map(unit => unit.y);

            let newX = getRandom(X_UNIT_COUNT);
            let newY = getRandom(Y_UNIT_COUNT);
            while(snake.some(unit => unit.x === newX && unit.y === newY)) {
                newX = getRandom(X_UNIT_COUNT);
                newY = getRandom(Y_UNIT_COUNT);
            }

            super(newX, newY, "foodBox");
            this.render();
        }


    }

	class SnakeGame {
		constructor() {
            this.snake = [];
            for(let i=0; i<INITIAL_LENGTH; i++) {
                this.snake.unshift(new SnakeUnit(i,0));
            }

            this.food = new FoodUnit(this.snake);
		}

		play() {
            const head = this.snake[0];
            const nextX = head.x + directions[currentDirection];
            const nextY = head.y + directions[currentDirection + 1];

            const newNode = new SnakeUnit(nextX, nextY);
            if (this.snake.some(unit => newNode.isColliding(unit))) {
                this.gameOver();
            }

            this.snake.unshift(newNode);

            if (newNode.isColliding(this.food)) {
                this.food.remove();
                this.food = new FoodUnit(this.snake);
            } else {
                const temp = this.snake.pop();
                temp.remove();
            }

			this.render();
		}

        gameOver() {
            $(document.getElementById("mainFrame")).hide();
        }

		render() {
			this.snake.map(unit => {
                const didRender = unit.render();
                if (!didRender) {
                    this.gameOver();
                }
            });
		}
	}

	function main(){
        const game = new SnakeGame();
        game.play();
        setInterval(() => {
            game.play();

        }, REFRESH_RATE);
	}

	main();

})();
