        //Rony Ahmmed EdTech-BDU
        //bdu.rony@gmail.com
        const gameBoard = document.getElementById("gameBoard");
        const ctx = gameBoard.getContext("2d");
        const scoretext = document.getElementById("gameScore");
        const gameStartPauseBtn = document.getElementById("gameStartPause");
        const resetBtn = document.getElementById("gameReset");

       const alphabet = ["ক","খ","গ","ঘ","ঙ","চ","ছ","জ","ঝ","ঞ","ট","ঠ","ড","ঢ","ণ","ত","থ","দ","ধ","ন","প","ফ","ব","ভ","ম","য","র","ল","ব","শ","ষ","স","হ","য়","ড়","ঢ়","ৎ","ং","ঃ","ঁ"];
       const winPoints = alphabet.length;
       const imgBox = [];
       for(var i=1; i<=winPoints; i++){
            imgBox.push(document.getElementById("img"+i));
       }
       
        const gameWidth = gameBoard.width;
        const gameHeight = gameBoard.height;

        const boardBackground = "white";
        const runnerColor = "lightgreen";
        const runnerBorder = "black";
        const foodColor = "tomato";
        const unitSize = 50;
        const speeds = 400;

        let running = false;
        let xVelocity = unitSize;
        let yVelocity = 0;
        let foodX;
        let foodY;
        let score = 0;
        let runner = [
            { x: unitSize * 2, y: 0 },
            { x: unitSize, y: 0 },
            { x: 0, y: 0 }
        ];

        window.addEventListener("keydown", changeDirection);
        gameStartPauseBtn.addEventListener("click", gameStartNow);
        resetBtn.addEventListener("click", resetGame);

        welcome();

        function gameStartNow() {
            gameStart();
            gameStartPauseBtn.style.display = 'none';
        }

        function gameStart() {
            running = true;
            scoretext.textContent = score;
            createFood();
            drawFood();
            nextTick();
        };
        function nextTick() {
            if (winPoints == score) {
                winGame();
            } else if (running) {
                setTimeout(() => {
                    clearBoard();
                    drawFood();
                    moveRunner();
                    drawrunner();
                    checkGameOver();
                    nextTick();
                }, speeds);
            } else {
                displayGameOver();
            }
        };
        function clearBoard() {
            ctx.fillStyle = boardBackground;
            ctx.fillRect(0, 0, gameWidth, gameHeight);
        };
        //createFood location
        function createFood() {
            function randomFood(min, max) {
                const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
                return randNum;
            }
            foodX = randomFood(0, gameWidth - unitSize);
            foodY = randomFood(0, gameHeight - unitSize);

        };
        //Drawing Food on board  =====================================
        function drawFood() {
            ctx.font = "35px";
            ctx.fillStyle = "red";
            ctx.drawImage(imgBox[score], 0, 0, 600, 400);
            ctx.fillText(alphabet[score], foodX+20, foodY+35);
            ctx.strokeRect(foodX, foodY, unitSize, unitSize);
        };


        function moveRunner() {
            const head = {
                x: runner[0].x + xVelocity,
                y: runner[0].y + yVelocity,
            }
            runner.unshift(head);

            if (runner[0].x == foodX && runner[0].y == foodY) {
                score = score + 1;
                scoretext.innerText = score;
                createFood();
            } else {
                runner.pop();
            }
        };

        function drawrunner() {
            ctx.fillStyle = runnerColor;
            ctx.strokeStyle = runnerBorder;
            runner.forEach((runnerPart, index) => {
                alpha(index, runnerPart.x, runnerPart.y);
                ctx.strokeRect(runnerPart.x, runnerPart.y, unitSize, unitSize);
            });
        };
        function changeDirection() {
            const kp = event.keyCode;

            switch (kp) {
                case 37:
                    xVelocity = -unitSize;
                    yVelocity = 0;
                    break;

                case 38:
                    xVelocity = 0;
                    yVelocity = -unitSize;
                    break;

                case 39:
                    xVelocity = unitSize;
                    yVelocity = 0;
                    break;

                case 40:
                    xVelocity = 0;
                    yVelocity = unitSize;
                    break;

            }

        };
        function checkGameOver() {
            switch (true) {
                case (runner[0].x < 0):
                    running = false;
                    break;

                case (runner[0].x >= gameWidth):
                    running = false;
                    break;

                case (runner[0].y < 0):
                    running = false;
                    break;

                case (runner[0].y >= gameHeight):
                    running = false;
                    break;
            }
            for (let i = 1; i < runner.length; i += 1) {
                if (runner[i].x == runner[0].x && runner[i].y == runner[0].y) {
                    running = false;
                }
            }

        };
        function displayGameOver() {
            ctx.font = "50px  Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Game Over!", gameWidth / 2, gameHeight / 2);
            running = false;
        };

        function resetGame() {
            running = false;
            xVelocity = unitSize;
            yVelocity = 0;
            foodX;
            foodY;
            score = 0;
            runner = [
                { x: unitSize * 2, y: 0 },
                { x: unitSize, y: 0 },
                { x: 0, y: 0 }
            ];
            gameStart();

        };
//=============================================================== after eat
        function alpha(index, w, h) {
            ctx.font = "35px  Arial";
            ctx.fillStyle = "black";
            if (index > 2) {
                ctx.fillText(alphabet[index - 3], w+20, h+35);
            } else {
                ctx.fillText(" ", w+20, h+35);
            }
        }


        function welcome() {
            ctx.font = "20px  Arial";
            ctx.fillStyle = "green";
            ctx.textAlign = "center";
            ctx.fillText("Welcome to Bornomala!", gameWidth / 2, gameHeight / 2);
            running = false;
        };

        function winGame() {
            running = false;
            document.getElementById("gameTime").innerText = "Winer!";

            initConfetti();
            render();

            ctx.font = "20px  Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("You Are Winer!", gameWidth / 2, gameHeight / 2);

        }



        const cx = ctx.canvas.width / 2;
        const cy = ctx.canvas.height / 2;


        let confetti = [];
        const confettiCount = 1000;
        const gravity = 0.5;
        const terminalVelocity = 5;
        const drag = 0.075;
        const colors = [
            { front: 'red', back: 'darkred' },
            { front: 'green', back: 'darkgreen' },
            { front: 'blue', back: 'darkblue' },
            { front: 'yellow', back: 'darkyellow' },
            { front: 'orange', back: 'darkorange' },
            { front: 'pink', back: 'darkpink' },
            { front: 'purple', back: 'darkpurple' },
            { front: 'turquoise', back: 'darkturquoise' }];



        randomRangeC = (min, max) => Math.random() * (max - min) + min;

        function initConfetti() {
            for (let i = 0; i < confettiCount; i++) {
                confetti.push({
                    color: colors[Math.floor(randomRangeC(0, colors.length))],
                    dimensions: {
                        x: randomRangeC(10, 20),
                        y: randomRangeC(10, 30)
                    },

                    position: {
                        x: randomRangeC(0, gameBoard.width),
                        y: gameBoard.height - 1
                    },

                    rotation: randomRangeC(0, 2 * Math.PI),
                    scale: {
                        x: 1,
                        y: 1
                    },

                    velocity: {
                        x: randomRangeC(-25, 25),
                        y: randomRangeC(0, -50)
                    }
                });


            }
        };

        //---------Render-----------
        render = () => {
            ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

            confetti.forEach((confetto, index) => {
                let width = confetto.dimensions.x * confetto.scale.x;
                let height = confetto.dimensions.y * confetto.scale.y;

                ctx.translate(confetto.position.x, confetto.position.y);
                ctx.rotate(confetto.rotation);

                confetto.velocity.x -= confetto.velocity.x * drag;
                confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
                confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

                confetto.position.x += confetto.velocity.x;
                confetto.position.y += confetto.velocity.y;

                if (confetto.position.y >= gameBoard.height) confetti.splice(index, 1);

                if (confetto.position.x > gameBoard.width) confetto.position.x = 0;
                if (confetto.position.x < 0) confetto.position.x = gameBoard.width;

                confetto.scale.y = Math.cos(confetto.position.y * 0.1);
                ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

                ctx.fillRect(-width / 2, -height / 2, width, height);

                ctx.setTransform(1, 0, 0, 1, 0, 0);
            });

            //if (confetti.length <= 10) initConfetti();
            if (confetti.length <= 10) {
                ctx.font = "20px  Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText("You Are Winer!", gameWidth / 2, gameHeight / 2);
            };

            window.requestAnimationFrame(render);
        };