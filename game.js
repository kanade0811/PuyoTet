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
class Block {
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

class Move {
    /**
     * @param {Block} block 移動させたいblock
     * @param {number} dx x軸上の移動
     */
    constructor(block, dx) {
        this.block = block
        this.dx = dx
        // y軸は落下するため-1固定
        // →そのうちxとyの動きを別で管理するかも？
        this.dy = -1
        // この下4つは仮の値
        this.beginX = -1
        this.beginY = -1
        this.endX = -1
        this.endY = -1
        this.frame = 0
    }

    // 1フレームずつblockを移動させる
    exec() {
        if (this.done) return this.done
        this.frame++
        if (this.frame === 1) {
            this.beginX = this.block.x
            this.beginY = this.block.y
            this.endX = this.block.x + this.dx
            this.endY = this.block.y-1
        }
        this.block.x = this.beginX + this.frame * this.dx / fps
        this.block.y = this.beginY + this.frame * this.dy / fps
        return this.done;
    }

    /**
     * @returns {boolean} コマンドが終了していればtrue、実行中ならfalse
     */
    get done() {
        return this.frame >= fps
    }
}

// gameの初期設定
class Game {
    constructor() {
        this.map=new Map()
        this.block = null
        this.blocks=[]
        // ↑これいらなさそうなので後に消しておきます
        this.commands = []
    }
}
let game

window.onload = function () {
    game = new Game();
    // ゲーム開始時に上真ん中にランダムなblockを配置
    let block = new Block(4,0, Math.floor(Math.random()*7+1))
    game.block = block
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

        // A,Dが押されたら左右に移動
        if (game.commands.length === 0) {
            document.addEventListener("keydown", (event) => {
                console.log(`keydown:${event.code}`)
                let move = { KeyA: -1, KeyD: 1};
                let dx = move[event.code];
                if (dx !== undefined) {
                    game.commands.push(new Move(game.block, dx));
                }
            });
        }

        // blockを動かす行為を毎フレーム実行
        for (let c of game.commands) {
            c.exec();
        }
        game.commands = game.commands.filter(c => !c.done)

        // 既に設置したblockを描写→ifは後で直します
        for (let y = 0; y < game.map.lengthY; y++) {
            for (let x = 0; x < game.map.lengthX; x++) {
                let tile = game.map.tileAt(x, y)
                if (tile === 1) {
                    ctx.fillStyle = "red"
                    ctx.fillRect(
                        this.x * width,
                        this.y * width,
                        width,
                        width
                    )
                }
                if (tile === 2) {
                    ctx.fillStyle = "blue"
                    ctx.fillRect(
                        this.x * width,
                        this.y * width,
                        width,
                        width
                    )
                }
                if (tile === 3) {
                    ctx.fillStyle = "yellow"
                    ctx.fillRect(
                        this.x * width,
                        this.y * width,
                        width,
                        width
                    )
                }
                if (tile === 4) {
                    ctx.fillStyle = "green"
                    ctx.fillRect(
                        this.x * width,
                        this.y * width,
                        width,
                        width
                    )
                }
                if (tile === 5) {
                    ctx.fillStyle = "purple"
                    ctx.fillRect(
                        this.x * width,
                        this.y * width,
                        width,
                        width
                    )
                }
            }
        }

        // 今動かしているblockを描写
        game.block.draw(ctx, width)
        // for (let k of game.block) {
        //     k.draw(ctx, width)
        // }
    } else { // 描画に関係ない部分をこの中に

    }
}

setInterval(draw, 1000 / fps);