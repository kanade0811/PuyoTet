// 環境変数
const fps = 30;

/*色とミノの形のメモ

red blue yellow green purple

1111

11
11

010
111

1
111

001
111

011
110

110
011
*/

// 盤面をここに保存
class Map {
    constructor() {
        this.tiles = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]
        this.lengthX = 10
        this.lengthY = 15
    }
    // 座標(x,y)を配列の何番目かに変換
    tileAt(x, y) {
        if (x < 0 || this.lengthX <= x || y < 0 || this.lengthY <= y) return 1;
        return this.tiles[y * this.lengthX + x];
    }
}

// 落下中のblock
class Playable {
    /**
    * @param {number} x blockの初期X
    * @param {number} y blockの初期Y
    * @param {number} type blockの種類
    */
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        // ここにblockの種類を追加
    }
    draw(ctx, width) {
        // 後にここでblockの色を指定
        ctx.fillStyle = "black"
        ctx.fillRect(
            this.x * width,
            this.y * width,
            width,
            width
        )
    }
}

// // blockのx軸(入力された左右)の動き
// class MoveX {
//     /**
//      * @param {Playable} block 移動中のblock
//      * @param {number} dx x軸上の移動
//      */
//     constructor(block, dx) {
//         this.block = block
//         this.dx = dx
//         // この下4つは仮の値
//         this.beginX = -1
//         this.endX = -1
//         this.frame = 0
//     }

//     exec() {
//         if (this.done) return this.done
//         this.frame++
//         if (this.frame === 1) {
//             this.beginX = this.block.x
//             this.endX = this.block.x + this.dx
//         }
//         this.block.x = this.beginX + this.frame * this.dx / fps
//         return this.done;
//     }

//     /*
//     // 1フレームずつblockを移動させる
//     exec() {
//         if (this.done) return this.done
//         this.frame++
//         if (this.frame === 1) {
//             this.beginX = this.block.x
//             this.endX = this.block.x + this.dx
//         }
//         this.block.x = this.beginX + this.frame * this.dx / fps
//         return this.done;
//     }
//     */

//     /**
//      * @returns {boolean} コマンドが終了していればtrue、実行中ならfalse
//      */
//     get done() {
//         return this.frame >= fps
//     }
// }

// blockのy軸(自然落下)の動き
class MoveY {
    /**
     * @param {Playable} block 移動中のblock
     */
    constructor(block) {
        this.block = block
        this.dy = 1
        this.beginY = -1
        this.endY = -1
        this.frame = 0
    }

    // 1フレームずつblockを移動させる
    exec() {
        if (this.done) return this.done
        this.frame++
        if (this.frame === 1) {
            this.beginY = this.block.y
            this.endY = this.block.y + this.dy
        }
        this.block.y = this.beginY + this.frame * this.dy / fps
        return this.done;
    }
}

// gameの初期設定
class Game {
    constructor() {
        this.map = new Map()
        this.block = null
        this.blocks = []
        // ↑これいらなさそうなので後に消しておきます
        this.commands = []
    }
}
let game

window.onload = function () {
    game = new Game();
    // ゲーム開始時に上真ん中にランダムなblockを配置
    game.playable = new Playable(4, 0, Math.floor(Math.random() * 7 + 1))
}

// 1フレームごとに描写する
const draw = function () {
    // canvasの作成
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    // 描写はifの中に
    if (canvas.getContext) {
        let width = 50
        // 背景色
        ctx.fillStyle = "orange";
        ctx.fillRect(0, 0, 500, 750);

        /*
        // A,Dが押されたら左右に移動
        if (game.commands.length === 0) {
            document.addEventListener("keydown", (event) => {
                let move = { KeyA: -1, KeyD: 1 };
                let dx = move[event.code];
                if (dx !== undefined) {
                    game.commands.push(new MoveX(game.playable, dx));
                }
            });
        }
        */

        // x軸方向に瞬時に移動
        if (game.commands.length === 0) {
            document.addEventListener("keydown", (event) => {
                let move = { KeyA: -1, KeyD: 1 };
                let dx = move[event.code];
                if (dx !== undefined) {
                    game.playable.x = game.playable.x + dx
                }

            });
        }

        // y軸に常に移動
        game.commands.push(new MoveY(game.playable))

        // blockを動かす行為を毎フレーム実行
        for (let c of game.commands) {
            c.exec();
        }
        game.commands = game.commands.filter(c => !c.done)

        // 既に設置したblockを描写→ifは後で直します
        for (let y = 0; y < game.map.lengthY; y++) {
            for (let x = 0; x < game.map.lengthX; x++) {
                let tileColors = [
                    null, // 後に透明のblockを描写することになるかも？
                    "red",
                    "blue",
                    "yellow",
                    "green",
                    "purple"
                ]
                // ぷよの色となる部分→後でMapのclassに入れておきます
                let color = tileColors[game.map.tileAt(x, y)]
                if (color !== null) {
                    ctx.fillStyle = color
                    ctx.fillRect(
                        x * width,
                        y * width,
                        width,
                        width
                    )
                }
            }
        }

        // 今動かしているblockを描写
        game.playable.draw(ctx, width)

    } else { // 描画に関係ない部分をこの中に

    }
}

setInterval(draw, 1000 / fps)