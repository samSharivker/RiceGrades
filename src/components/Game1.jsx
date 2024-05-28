import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const Game1 = () => {
    const myRef = useRef(null);

    const Sketch = (p) => {
        let canvasX = 800;
        let ballX = 400;
        let ballY = 300;
        let ballSpeedX = 5;
        let ballSpeedY = 5;
        let paddleHeight = 30;
        let gameStatus = 0;

        p.setup = () => {
            p.createCanvas(canvasX, 600);
        }

        p.draw = () => {
            p.background(128);
            if (gameStatus === 0) {
                p.textSize(32);
                p.text("Click to start", p.width / 2 - 100, p.height / 2 + 25);
            } else {
                moveBall();
                checkCollide();
                drawPaddle();
                drawBall();
            }
        }

        function moveBall() {
            ballX += ballSpeedX;
            ballY += ballSpeedY;
        }

        function checkCollide() {
            if (ballX < 0 || ballX > p.width) {
                ballSpeedX *= -1;
            }
            if (ballY < 0) {
                ballSpeedY *= -1;
            }
            if (ballY > p.height - paddleHeight) {
                if (ballX > p.constrain(p.mouseX - 100, 0, p.width - 200) && ballX < p.mouseX + 100) {
                    ballSpeedX = p.constrain(p.map(ballX, p.constrain(p.mouseX - 100, 0, p.width - 200), p.constrain(p.mouseX + 100, 200, p.width), -10, 10), -10, 10);
                    ballSpeedY *= -1;
                    ballSpeedY -= 1;
                    if (canvasX <= 1500) {
                        canvasX += 50;
                    }
                } else {
                    p.text("GAME OVER!", p.width / 2, p.height / 2);
                    p.noLoop();
                }
            }
        }

        function drawBall() {
            p.noStroke();
            p.ellipse(ballX, ballY, 20, 20);
        }

        function drawPaddle() {
            p.strokeWeight(4);
            p.rect(p.constrain(p.mouseX - 100, 0, p.width - 200), p.height - paddleHeight - 4, 200, paddleHeight);
        }

        p.mousePressed = () => {
            if (gameStatus === 0) {
                gameStatus = true;
            }
        }
    }

    useEffect(() => {
        const myP5 = new p5(Sketch, myRef.current);

        return () => {
            myP5.remove();
        }
    }, []);

    return (
        <div ref={myRef}></div>
    );
}

export default Game1;
