import { ANSI } from "../utils/ansi.mjs";
import KeyBoardManager, { clearScreen } from "../utils/io.mjs";
import { print, printCenterd } from "../utils/io.mjs";
import { GAME_BOARD_DIM } from "../consts.mjs";
import createBattleshipScreen from '../game/battleshipsScreen.mjs';
let currentActiveMenuItem = 0
let currentLanguage = "English";

const translations = {
    English: {
        startGame: "Start Game",
        exitGame: "Exit Game",
        changeLanguage: "Change Language",
    },
    Norwegian: {
        startGame: "Start Spill",
        exitGame: "Avslutt Spill",
        changeLanguage: "Bytt Språk",
    }
};

function toggleLanguage(menu) {
    currentLanguage = currentLanguage === "English" ? "Norwegian" : "English";
    menu.isDrawn = false;
    clearScreen();
}

function createPlayerBoard() {
    const board = Array.from({ length: GAME_BOARD_DIM }, () => Array(GAME_BOARD_DIM).fill(0));
    return board;
}

function startGame(menu) {
    const battleshipScreen = createBattleshipScreen();
    const firstPlayerBoard = createPlayerBoard();
    const secondPlayerBoard = createPlayerBoard();

    battleshipScreen.init(firstPlayerBoard, secondPlayerBoard);

    menu.next = battleshipScreen;
    menu.transitionTo = "battleshipScreen";
}

function exitGame() {
    print(ANSI.SHOW_CURSOR);
    clearScreen();
    process.exit();
}

function createMenu() {
    const menu = {
        isDrawn: false,
        next: null,
        transitionTo: null,
        

        update: function (dt) {
            if (KeyBoardManager.isUpPressed()) {
                currentActiveMenuItem--;
                if (currentActiveMenuItem < 0) {
                    currentActiveMenuItem = 0;
                }
                this.isDrawn = false;
            }
            else if (KeyBoardManager.isDownPressed()) {
                currentActiveMenuItem++;
                if (currentActiveMenuItem >= this.menuItems.length) {
                    currentActiveMenuItem = this.menuItems.length - 1;
                }
                this.isDrawn = false;
            }
            else if (KeyBoardManager.isEnterPressed()) {
                if (this.menuItems[currentActiveMenuItem].action) {
                    this.menuItems[currentActiveMenuItem].action(this);
                }
            }
            if (this.transitionTo === "battleshipScreen") {
                return this.next;
            }
        },

        draw: function () {
            if (!this.isDrawn) {
                this.isDrawn = true;
                clearScreen();
                let output = "";
                this.menuItems = [
                    { text: translations[currentLanguage].startGame, id: 0, action: startGame },
                    { text: translations[currentLanguage].exitGame, id: 1, action: exitGame },
                    { text: translations[currentLanguage].changeLanguage, id: 2, action: toggleLanguage },
                ];

                for (let index in this.menuItems) {
                    let menuItem = this.menuItems[index]
                    let title = menuItem.text;
                    title = currentActiveMenuItem == menuItem.id ? `*${title}*` : ` ${title} `;
                    output += title + "\n";
                }

                printCenterd(output);

            }
        }

    };

    return menu;
}



export default createMenu;