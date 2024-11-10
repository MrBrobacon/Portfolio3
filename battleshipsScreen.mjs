import { GAME_BOARD_DIM, FIRST_PLAYER, SECOND_PLAYER } from "../consts.mjs";
import { clearScreen, print } from "../utils/io.mjs";
import KeyBoardManager from "../utils/io.mjs";



const createBattleshipScreen = () => {

    let currentPlayer = FIRST_PLAYER;
    let firstPlayerBoard = null;
    let secondPlayerBoard = null;
    let currentBoard = null;
    let opponentBoard = null;
    let cursorX = 0;
    let cursorY = 0;


    function swapPlayer() {
        currentPlayer *= -1;
        if (currentPlayer == FIRST_PLAYER) {
            currentBoard = firstPlayerBoard;
            opponentBoard = secondPlayerBoard;
        } else {
            currentBoard = secondPlayerBoard;
            opponentBoard = firstPlayerBoard;
        }
        clearScreen();
        print(`Player ${currentPlayer === FIRST_PLAYER ? "1" : "2"}'s turn`);
    }

    function isGameOver() {
        for (let row = 0; row < GAME_BOARD_DIM; row++) {
            for (let col = 0; col < GAME_BOARD_DIM; col++) {
                if (opponentBoard[row][col] > 0) {
                    return false;
                }
            }
        }
        return true;
    }
    function fireShot() {
        if (opponentBoard[cursorY][cursorX] > 0) {
            opponentBoard[cursorY][cursorX] = -1;
            print(`Hit at (${cursorX + 1}, ${cursorY + 1})!`);
        } else if (opponentBoard[cursorY][cursorX] === 0) {
            opponentBoard[cursorY][cursorX] = -2
            print(`Miss at (${cursorX + 1}, ${cursorY + 1})!`);
        }
        if (isGameOver()) {
            print(`Player ${currentPlayer === FIRST_PLAYER ? "1" : "2"} wins!`);
            this.transitionTo = "game over";
            return;
        }
        swapPlayer();
    }

    function renderBoard(board, revealShips = false) {
        let output = "\n  ";
        for (let x = 0; x < GAME_BOARD_DIM; x++) {
            output += ` ${String.fromCharCode(65 + x)} `;
        }
        output += "\n";

        for (let y = 0; y < GAME_BOARD_DIM; y++) {
            output += `${y + 1} `.padStart(2, ' ');

            for (let x = 0; x < GAME_BOARD_DIM; x++) {
                if (y === cursorY && x === cursorX) {
                    output += "[x]";
                } else if (board[y][x] === - 1) {
                    output += " H ";
                } else if (board[y][x] === -2) {
                    output += " M ";
                } else if (board[y][x] > 0 && revealShips) {
                    output += " S ";
                } else {
                    output += " ~ ";
                }
            }
            output += ` ${y + 1}\n`;
        }
        output += "  ";
        for (let x = 0; x < GAME_BOARD_DIM; x++) {
            output += ` ${String.fromCharCode(65 + x)} `;
        }
        print(output);
    }



    return {
        isDrawn: false,
        next: null,
        transitionTo: null,


        init: function (firstPBoard, secondPBoard) {
            firstPlayerBoard = firstPBoard;
            secondPlayerBoard = secondPBoard;
            currentBoard = firstPlayerBoard;
            opponentBoard = secondPlayerBoard;
            print("Player 1, press Enter to start!")
        },

        update: function (dt) {
            if (KeyBoardManager.isUpPressed()) {
                cursorY = Math.max(0, cursorY - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isDownPressed()) {
                cursorY = Math.min(GAME_BOARD_DIM - 1, cursorY + 1);
                this.isDrawn = false; 
            }
            if (KeyBoardManager.isLeftPressed()) {
                cursorX = Math.max(0, cursorX - 1);
                this.isDrawn = false
            }
            if (KeyBoardManager.isRightPressed()) {
                cursorX = Math.min(GAME_BOARD_DIM - 1, cursorX + 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isEnterPressed()) {
                fireShot.call(this);
                this.isDrawn = false;
            }
            
        },

        draw: function (dr) {
            if (!this.isDrawn == false) {
                this.isDrawn = true;
                clearScreen();

                print(`Player ${currentPlayer === FIRST_PLAYER ? "1" : "2"}'s turn. Target opponent’s board and press Enter to fire.`);
                renderBoard(opponentBoard, false);

            }
        }

    };
};

export default createBattleshipScreen;