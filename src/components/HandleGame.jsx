import React, { useState, useEffect } from 'react';
import Game1 from "./Game1";
import Game2 from "./Game2";
import TooSmall from "./TooSmall";

export default function HandleGame() {
    const games = [<Game1 />, <Game2 />];
    const [gLoad, setGLoad] = useState(games[Math.floor(Math.random() * games.length)]);

    useEffect(() => {
        let timeoutId;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if(window.innerWidth < 800) {
                    console.log("too small");
                    setGLoad(<TooSmall />);
                } else {
                    setGLoad(games[Math.floor(Math.random() * games.length)]);
                }
            }, 200); // Adjust delay as needed
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [games]);

    return (
        <div>
            {gLoad}
        </div>
    );
}
