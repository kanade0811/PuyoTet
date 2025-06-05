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

// blockのy軸(自然落下)の動き
class Gravity {
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

    // 左右が押されたら瞬時に移動
    document.addEventListener("keydown", (event) => {
        if(game.commands.length===0) return;
        let move = { KeyA: -1, KeyD: 1 };
        let dx = move[event.code];
        if (dx !== undefined) {
            let nextX = game.playable.x + dx
            // 移動先が枠内だったときのみ移動を実行
            if (0 <= nextX && nextX < game.map.lengthX)
                game.playable.x = nextX
        }
    });
}

// 1フレームごとに描写する
const draw = function () {
    // canvasの作成
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    const width=50

    drawBack(ctx,width)
    drawBlocks(ctx,width)
    movePlayable()
    game.playable.draw(ctx, width)  // 今動かしているblockを描写
}

setInterval(draw, 1000 / fps)

// 背景の描写
function drawBack(ctx,width){
    // 背景色
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, 500, 750);

    // マス目→見にくい気がしたんで消します
    /*
    for(let y=0;y<game.map.lengthY;y++){
        for(let x=0;x<game.map.lengthX;x++){
            ctx.strokeRect(width*x,width*y,width,width)
        }
    }
    */
}

// 既に積んでいるblockの描写
function drawBlocks(ctx,width){
    // 既に設置したblockを描写
    for (let y = 0; y < game.map.lengthY; y++) {
        for (let x = 0; x < game.map.lengthX; x++) {
            // tileColors=ぷよの色となる部分→後でMapのclassに入れておきます
            let tileColors = [
                null, // 後に透明のblockを描写することになるかも？
                "red",
                "blue",
                "yellow",
                "green",
                "purple"
            ]
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
}

// 落下物の処理→そのうち簡潔に書き直します
function movePlayable(){
    // y軸に常に移動
    game.commands.push(new Gravity(game.playable))
    // blockを動かす行為を毎フレーム実行
    for (let c of game.commands) {
        c.exec();
    }
    game.commands = game.commands.filter(c => !c.done)
}