import React from "react";
import { Link } from "react-router-dom";
import './Buttons.css';
import {
    gameBoardWidthLarge, gameBoardHeightLarge, gameBoardWidthMedium,
    gameBoardHeightMedium, gameBoardWidthSmall, gameBoardHeightSmall,
    gameBoardWidthShape, gameBoardHeightShape, canvasWidthLarge,
    canvasHeightLarge, canvasWidthMedium, canvasHeightMedium, canvasWidthSmall,
    canvasHeightSmall, canvasWidthShape, canvasHeightShape,
} from "../../game/canvas";

import {smallBoard, mediumBoard, largeBoard, shapeBoard} from "../../game/logic";

const Buttons = ({handleChange}) => {

    return(
        <div className="row buttonRowButtons">
            <button className="buttonButtons"  onClick={() => {
                handleChange(gameBoardWidthSmall, gameBoardHeightSmall, canvasWidthSmall, canvasHeightSmall, smallBoard);
            }}>
                <h2>SMALL</h2>
            </button>

            <button className="buttonButtons"  onClick={() => {
                handleChange(gameBoardWidthMedium, gameBoardHeightMedium, canvasWidthMedium, canvasHeightMedium, mediumBoard);
            }}>
                <h2>MEDIUM</h2>
            </button>

            <button className="buttonButtons"  onClick={() => {
                handleChange(gameBoardWidthLarge, gameBoardHeightLarge, canvasWidthLarge, canvasHeightLarge, largeBoard);
            }}>
                <h2>LARGE</h2>
            </button>

            <button className="buttonButtons"  onClick={() => {
                handleChange(gameBoardWidthShape, gameBoardHeightShape, canvasWidthShape, canvasHeightShape, shapeBoard);
            }}>
                <h2>CRAZY</h2>
            </button>
            <Link className="link" to="/">
                <button className="buttonButtons"  onClick={() => {}}>
                    <h2>MAIN MENU</h2>
                </button>
            </Link>
        </div>
    )
}

export default Buttons;