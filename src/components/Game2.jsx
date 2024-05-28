import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const Game2 = () => {
    const myRef = useRef(null);

    const Sketch = (p) => {
        let frame = 0;
        let score = 0;
        let circles = [];
        let gameStatus = 0; // 0 = start page || true = begin game || false = game over

        p.setup = () => {
            p.createCanvas(800, 600);
            p.background(220);
            p.ellipse(p.width / 2, p.height / 2, 100);
            p.textSize(32);
            p.textAlign(p.CENTER);
            p.text("Start", p.width / 2, p.height / 2 + 10);
        }

        p.draw = () => {
            if (gameStatus === true) {
                p.background(220);
                timer();

                // adding new circle every 0.5 second
                if (frame % 30 === 0) {
                    let circle = {
                        x: p.constrain(p.random(p.width), 50, p.width - 50),
                        y: p.constrain(p.random(p.height), 50, p.height - 50),
                        opacity: 255
                    };
                    p.stroke(circle.opacity, circle.opacity);
                    p.fill(255, 255, 255, circle.opacity);
                    p.ellipse(circle.x, circle.y, 100);
                    circles.push(circle);
                }

                // loop through each circle and decrease opacity
                circles.forEach((event, index) => {
                    event.opacity -= 1;
                    p.stroke(event.opacity, event.opacity);
                    p.fill(255, 255, 255, event.opacity);
                    p.ellipse(event.x, event.y, 100);
                    if (event.opacity === 0) {
                        gameStatus = false;
                    }
                });

            } else if (gameStatus === false) {
                p.background(220);
                p.fill(0);
                p.textSize(60);
                p.text("Game Over", p.width / 2, p.height / 2 - 100);
                p.textSize(32);
                p.text(`Score: ${score}`, p.width / 2, p.height / 2);
                p.fill(255);
                p.ellipse(p.width / 2, p.height / 2 + 200, 100);
                p.fill(0);
                p.text("Again", p.width / 2, p.height / 2 + 210);
            }
        }

        function timer() {
            // default fps is 60
            frame += 1;
            if (frame === 120) {
                frame = 0;
            }
        }

        p.mousePressed = () => {
            if (gameStatus === 0) {
                let d = p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2 + 10);
                if (d < 60) {
                    gameStatus = true;
                }
            } else if (gameStatus === true) {
                // +1 point when user click the circle
                for (let i = 0; i < circles.length; i++) {
                    let d = p.dist(p.mouseX, p.mouseY, circles[i].x, circles[i].y);
                    if (d < 60) {
                        score += 1;
                        circles.splice(i, 1);  // delete specific circle user click on
                        console.log(score);
                        break;
                    }
                }
            } else { // reset score, circles
                let d = p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2 + 200);
                if (d < 60) {
                    gameStatus = true;
                    circles = [];
                    score = 0;
                }
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

export default Game2;
