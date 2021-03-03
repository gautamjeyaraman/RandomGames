(function() {

    const REFRESH_RATE = 200;
    const UNIT_WIDTH = 30;
    const UNIT_HEIGHT = 30;
    const BOARD_WIDTH = 960;
    const BOARD_HEIGHT = 510;
    const X_UNIT_COUNT = BOARD_WIDTH / UNIT_WIDTH;
    const Y_UNIT_COUNT = BOARD_HEIGHT / UNIT_HEIGHT;

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


    class SnakeUnit {
        constructor(x, y) {
            this.x = x;
            this.y = y;

            this.element = $(document.createElement("div"));
			this.element.attr("id", "gameBox" + x +"x"+ y+"y");
			this.element.attr("class", "gameBox");
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
            if (newX < 0 || newX > BOARD_WIDTH || newY < 0 || newY > BOARD_HEIGHT) {
                return false;
            }

            this.element.css({
				'left': newX + 'px',
				'top': newY + 'px',
            });
            return true;
        }

    }

    class FoodUnit {
        constructor(snake) {
            const snakeX = snake.map(unit => unit.x);
            const snakeY = snake.map(unit => unit.y);

            this.x = this.getRandom(X_UNIT_COUNT);
            while(snakeX.includes(this.x)) {
                this.x = this.getRandom(X_UNIT_COUNT);
            }
            this.y = this.getRandom(Y_UNIT_COUNT);
            while(snakeY.includes(this.y)) {
                this.y = this.getRandom(Y_UNIT_COUNT);
            }

            this.element = $(document.createElement("div"));
			this.element.attr("id", "foodBox" + this.x +"x"+ this.y+"y");
			this.element.attr("class", "foodBox");
            $("#mainFrame").append(this.element);
            this.render();
        }

        getRandom(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        remove() {
            this.element.remove();
        }

        isColliding(node) {
            return this.x === node.x && this.y === node.y;
        }

        render() {
            this.element.css({
				'left': this.x * UNIT_WIDTH + 'px',
				'top': this.y * UNIT_HEIGHT + 'px',
            });
        }

    }

	class SnakeGame {
		constructor() {
			this.snake = [
                new SnakeUnit(4,0),
                new SnakeUnit(3,0),
                new SnakeUnit(2,0),
                new SnakeUnit(1,0),
                new SnakeUnit(0,0),
            ];

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
