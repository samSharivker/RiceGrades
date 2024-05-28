import Game1 from "../components/Game1";
import Game2 from "../components/Game2";

export default function RandG() {
    const games = [<Game1 />, <Game2 />]
    const index = Math.floor(Math.random() * games.length);
    const gLoad = games[index];

    return (
        <div>
            {gLoad}
        </div>
    )
}
