import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const Test = () => {
    const myRef = useRef(null);
    const Sketch = (p) => {
        p.setup = () => {
            // Setup code here

        }

        p.draw = () => {
            // Draw code here
            p.createCanvas(800, 600)
            p.background(220);
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

export default Test;
