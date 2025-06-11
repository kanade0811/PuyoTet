// 環境変数
const fps = 30
const width = 50

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

        this.tileColors = [
            null,
            "red",
            "blue",
            "yellow",
            "green",
            "purple",
        ]
    }

    // 座標(x,y)を配列の番号に変換
    tileNumber(x, y) {
        if (x < 0 || this.lengthX <= x || y < 0 || this.lengthY <= y) {
            return null
        }
        return (y * this.lengthX + x)
    }
    // 座標(x,y)を配列の何番目かに変換
    tileAt(x, y) {
        return this.tiles[this.tileNumber(x, y)]
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
        this.color = Math.floor(Math.random() * 5 + 1)
    }
    draw(ctx) {
        // 後にここでblockの色を指定
        ctx.fillStyle = game.map.tileColors[this.color]
        ctx.fillRect(
            this.x * width,
            this.y * width,
            width,
            width
        )
    }
}

// gameの初期設定
class Game {
    constructor() {
        this.map = new Map()
        this.playable = null
        this.score = 0
        this.gameInterval = setInterval(draw, 1000 / fps)
        // canvasの作成
        const canvas = document.getElementById("canvas")
        const ctx = canvas.getContext("2d")
        this.draw = new Draw(ctx)
        this.system = new System()
    }
}
let game

window.onload = function () {

    game = new Game();
    // ゲーム開始時に上真ん中にランダムなblockを配置
    game.playable = new Playable(4, 0, Math.floor(Math.random() * 7 + 1))

    // 左右が押されたら瞬時に移動
    document.addEventListener("keydown", (event) => {
        let move = { KeyA: -1, KeyD: 1 };
        let dx = move[event.code];
        if (dx !== undefined) {
            let nextX = game.playable.x + dx
            // 移動先が枠内だったときのみ移動を実行
            if (0 <= nextX && nextX < game.map.lengthX)
                game.playable.x = nextX
        }
    });
    // 下が押されたら落下速度上昇
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyS") {
            game.system.setSpeed(1)
        }
    });
    // 下が離されたら落下速度を元に戻す
    document.addEventListener("keyup", (event) => {
        if (event.code === "KeyS") {
            game.system.setSpeed(0)
        }
    });
}

// 1フレームごとに描写する
function draw() {
    game.draw.clear()
    game.draw.background()
    game.draw.blocks()
    game.draw.playable()

    let xy = game.system.putOrNot()
    if (xy) {
        game.draw.put(xy)
        game.system.lineClear(xy)
        game.system.colorClear(xy)
        if (!game.system.isContinue()) {
            game.draw.gameover()
        }
    }
}

class Draw {
    constructor(ctx) {
        this.ctx = ctx
    }
    clear() {
        this.ctx.clearRect(0, 0, 1000, 750)
    }
    background() {
        // 背景色
        this.ctx.fillStyle = "orange"
        this.ctx.fillRect(0, 0, 500, 750)

        // マス目
        for (let y = 0; y < game.map.lengthY; y++) {
            for (let x = 0; x < game.map.lengthX; x++) {
                this.ctx.strokeRect(width * x, width * y, width, width)
            }
        }

        // スコアの描写
        this.ctx.fillStyle = "black"
        this.ctx.font = "50px serif"
        this.ctx.fillText(("score:" + game.score), (width * (game.map.lengthX + 1)), (width * (game.map.lengthY - 1)))
    }
    blocks() {
        for (let y = 0; y < game.map.lengthY; y++) {
            for (let x = 0; x < game.map.lengthX; x++) {
                let color = game.map.tileColors[game.map.tileAt(x, y)]
                if (color !== null) {
                    this.ctx.fillStyle = color
                    this.ctx.fillRect(
                        x * width,
                        y * width,
                        width,
                        width
                    )
                }
            }
        }
    }
    playable() {
        game.playable.y += game.system.speed / fps  // y軸に常に移動
        game.playable.draw(this.ctx)  // 今動かしているblockを描写
    }
    put(xy) {
        game.map.tiles[game.map.tileNumber(xy[0], xy[1])] = game.playable.color
        this.blocks()
        game.playable = null
    }
    gameover() {
        this.ctx.fillStyle = "black"
        this.ctx.font = "50px serif"
        this.ctx.fillText("game over", (width * (game.map.lengthX + 1)), (width * (game.map.lengthY - 2)))
    }
}

class System {
    constructor() {
        this.defaultSpeed = 1
        this.speed = this.defaultSpeed
    }
    setSpeed(keydown) {
        this.incraseSpeed = keydown * 10
        this.speed = this.defaultSpeed + this.incraseSpeed
    }
    putOrNot() {
        if (!game.playable) return;
        let x = game.playable.x
        let y = Math.floor(game.playable.y)   // y座標の丸め誤差を調整
        if (y + 1 >= game.map.lengthY || game.map.tileAt(x, y + 1) !== 0) {
            return [x, y]
        }
    }
    lineClear(xy) {
        let y = xy[1]
        for (let x = 0; x < game.map.lengthX; x++) {
            if (game.map.tileAt(x, y) === 0) {
                return
            }
        }
        game.map.tiles.splice(game.map.tileNumber(0, y), game.map.lengthX)
        for (let k = 0; k < game.map.lengthX; k++) {
            game.map.tiles.unshift(0)
        }
        game.score += game.map.lengthX
    }
    colorClear(xy) {
        // xy=[x,y]　設置したblockの座標の配列
        console.log(xy)
        let sameColor = []
        sameColor.push(xy)
        for (let m = 0; m < sameColor.length; m++) {
            console.log("before:", sameColor[m]) // ここが既に出来てない
        }
        for (let k = 0; k < sameColor.length; k++) {
            let base = sameColor[k]
            let search = [    // 探索する上下左右のblock
                [base[0], base[1] - 1],
                [base[0] - 1, base[1]],
                [base[0], base[1] + 1],
                [base[0] + 1, base[1]]
            ]
            for (let l = 0; l < search.length; l++) {   // 同じ色かつsameColorに無い座標だったら追加
                if (game.map.tileAt(base[0], base[1]) === game.map.tileAt(search[l][0], search[l][1])) {
                    let exist = true
                    for (let m = 0; m < sameColor.length; m++) {
                        if (search[l][0] === sameColor[m][0] && search[l][1] === sameColor[m][1]) {
                            exist = false
                        }
                    }
                    if (exist === true) {
                        sameColor.push(search[l])
                    }
                }
            }
        }
        for (let m = 0; m < sameColor.length; m++) {
            console.log("after:", sameColor[m])
        }
        if (sameColor.length >= 4) {    // 4つ以上色が揃ったら0にしてScore加算
            for (let k = 0; k < sameColor.length; k++) {
                game.map.tiles[game.map.tileNumber(sameColor[k][0], sameColor[k][1])] = 0
            }
            game.score += (sameColor.length)
        }
    }
    isContinue() {
        if (game.map.tileAt(4, 0) === 0) {
            game.playable = new Playable(4, 0, Math.floor(Math.random() * 7 + 1))
            return true
        } else {
            clearInterval(game.gameInterval)
            return false
        }
    }
}