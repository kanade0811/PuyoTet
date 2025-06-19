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
class Block {
    /**
    * @param {number} x blockの初期X
    * @param {number} y blockの初期Y
    */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = Math.floor(Math.random() * 5 + 1)
    }
    draw(ctx) {
        ctx.fillStyle = game.map.tileColors[this.color]
        ctx.fillRect(
            this.x * width,
            this.y * width,
            width,
            width
        )
    }
}

class Type {
    constructor() {
        this.x = 4
        this.y = 0
        this.shapes = [
            [ // I
                [[-1, 0], [0, 0], [1, 0], [2, 0]], // 0
                [[0, 1], [0, 0], [0, -1], [0, -2]], // π/2
                [[1, 0], [0, 0], [-1, 0], [-2, 0]], // π
                [[0, -1], [0, 0], [0, 1], [0, 2]] // 3π/2
            ], [ // O
                [[0, 0], [0, 1], [1, 1], [1, 0]],
                [[0, 1], [1, 1], [1, 0], [0, 0]],
                [[1, 1], [1, 0], [0, 0], [0, 1]],
                [[1, 0], [0, 0], [0, 1], [1, 1]]
            ], [ // T
                [[0, 0], [-1, 1], [0, 1], [1, 1]],
                [[-1, 1], [0, 2], [0, 1], [0, 0]],
                [[0, 2], [1, 1], [0, 1], [-1, 1]],
                [[1, 1], [0, 0], [0, 1], [0, 2]]
            ], [ // J
                [[-1, 0], [-1, 1], [0, 1], [1, 1]],
                [[0, 1], [1, 1], [1, 0], [1, -1]],
                [[1, 1], [1, 0], [0, 0], [-1, 0]],
                [[0, -1], [-1, -1], [-1, 0], [-1, 1]]
            ], [ // L
                [[1, 0], [-1, 1], [0, 1], [1, 1]],
                [[0, -1], [1, 1], [1, 0], [1, -1]],
                [[-1, 1], [1, 0], [0, 0], [-1, 0]],
                [[0, 1], [-1, -1], [-1, 0], [-1, 1]]
            ], [ // S
                [[0, 0], [1, 0], [-1, 1], [0, 1]],
                [[0, 0], [0, -1], [1, 1], [1, 0]],
                [[0, 1], [-1, 1], [1, 0], [0, 0]],
                [[0, 0], [0, 1], [-1, -1], [-1, 0]]
            ], [ // Z
                [[-1, 0], [0, 0], [0, 1], [1, 1]],
                [[0, 1], [0, 0], [1, 0], [1, -1]],
                [[1, 1], [0, 1], [0, 0], [-1, 0]],
                [[0, -1], [0, 0], [-1, 0], [-1, 1]]
            ]]
    }
    create(type) {
        for (let k = 0; k < 4; k++) {
            game.playBlocks[k] = new Block(
                game.playable.x + this.shapes[type][0][k][0],
                game.playable.y + this.shapes[type][0][k][1]
            )
        }
    }
    rotate() {
        console.log("do rotate")
        game.playable.rotation = (game.playable.rotation + 1) % 4
        let nextX = []
        for (let k = 0; k < game.playBlocks.length; k++) {
            nextX.push(game.playable.x + this.shapes[game.playable.type][game.playable.rotation][k][0])
        }
        console.log(nextX)
        let max = -1
        let min = game.map.lengthX + 1
        for (let k = 0; k < nextX.length; k++) {
            if (nextX[k] > max) {
                max = nextX[k]
            } else if (nextX[k] < min) {
                min = nextX[k]
            }
        }
        console.log(min, max)
        if (min < 0) {
            for (let k = 0; k < nextX.length; k++) {
                nextX[k]++
            }
        } else if (max >= game.map.lengthX) {
            console.log("do")
            for (let k = 0; k < nextX.length; k++) {
                nextX[k]--
            }
        }
        console.log(nextX)
        for (let k = 0; k < game.playBlocks.length; k++) {
            game.playBlocks[k].x = nextX[k]
            game.playBlocks[k].y = game.playable.y + this.shapes[game.playable.type][game.playable.rotation][k][1]
        }
        /*
        for (let k = 0; k < game.playBlocks.length; k++) {
            game.playBlocks[k].x = game.playable.x + this.shapes[game.playable.type][game.playable.rotation][k][0]
            game.playBlocks[k].y = game.playable.y + this.shapes[game.playable.type][game.playable.rotation][k][1]
        }
        */
    }
}

// gameの初期設定
class Game {
    constructor() {
        this.map = new Map()
        this.type = new Type()
        this.playable = {
            x: 4,
            y: 0,
            type: null,
            rotation: 0
        }
        this.playBlocks = []
        this.score = 0
        this.gameInterval = setInterval(draw, 1000 / fps)
        this.speed = 1
    }
}
let game;

window.onload = function () {

    game = new Game();
    // ゲーム開始時に上真ん中にランダムなblockを配置
    setPlayable()
    game.playable.type = Math.floor(Math.random() * 7)
    game.type.create(game.playable.type)

    // 左右が押されたら瞬時に移動
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyA" || event.code === "KeyD") {
            let move = { KeyA: -1, KeyD: 1 };
            let dx = move[event.code];
            let nextMove = true
            for (let k of game.playBlocks) {
                if (dx !== undefined) {
                    let nextX = k.x + dx
                    if (!(0 <= nextX && nextX < game.map.lengthX)) {
                        nextMove = false
                    }
                }
            }
            if (nextMove === true) {
                game.playable.x += dx
                for (let k of game.playBlocks) {
                    k.x = k.x + dx
                }
            }
        }
    });
    // 下が押されたら落下速度上昇
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyS") {
            setSpeed(1)
        }
    });
    // 下が離されたら落下速度を元に戻す
    document.addEventListener("keyup", (event) => {
        if (event.code === "KeyS") {
            setSpeed(0)
        }
    });
    // 上が押されたら回転
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyW") {
            game.type.rotate()
        }
    });
}

function setPlayable() {
    game.playable.x = 4;
    game.playable.y = 0;
    game.playable.type = null;
    game.playable.rotation = 0
}

// canvasの作成
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// 1フレームごとに描写する
function draw() {
    clear()
    background()
    blocks()
    playable()

    if (putOrNot() === true) {
        put()
        clearBlock()
        // lineClear()
        // colorClear()
        if (!isContinue()) {
            gameover()
        }
    }
}

function clear() {
    ctx.clearRect(0, 0, 1000, 1000)
}

function background() {
    // 背景色
    ctx.fillStyle = "orange"
    ctx.fillRect(0, 0, 500, 750)

    // マス目
    for (let y = 0; y < game.map.lengthY; y++) {
        for (let x = 0; x < game.map.lengthX; x++) {
            ctx.strokeRect(width * x, width * y, width, width)
        }
    }

    // スコアの描写
    ctx.fillStyle = "black"
    ctx.font = "50px serif"
    // ctx.fillText(("score:" + game.score), (width * (game.map.lengthX + 1)), (width * (game.map.lengthY - 1)))
    ctx.fillText(("score:" + game.score), 0, (width * (game.map.lengthY + 1)))
}

function blocks() {
    for (let y = 0; y < game.map.lengthY; y++) {
        for (let x = 0; x < game.map.lengthX; x++) {
            let color = game.map.tileColors[game.map.tileAt(x, y)]
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

function playable() {
    game.playable.y += game.speed / fps
    for (let k of game.playBlocks) {
        k.y += game.speed / fps  // y軸に常に移動
        k.draw(ctx)  // 今動かしているblockを描写
    }
}

const defaultSpeed = 1
const incraseSpeed = 9
function setSpeed(keydown) {
    game.speed = defaultSpeed + incraseSpeed * keydown
}

function putOrNot() {
    if (game.playBlocks.length === 0) return;
    let putable = false
    for (let k of game.playBlocks) {
        let x = k.x
        let y = Math.floor(k.y)
        if (y + 1 >= game.map.lengthY || game.map.tileAt(x, y + 1) !== 0) {
            putable = true
        }
    }
    return putable
}

function put() {
    for (let k of game.playBlocks) {
        let x = k.x
        let y = Math.floor(k.y)
        game.map.tiles[game.map.tileNumber(x, y)] = k.color
    }
    blocks()
}

// lineを消し、colorを動かさせる
function clearBlock() {
    for (let k of game.playBlocks) {
        if (k.color === -1) continue;
        let lineClearable = true
        let y = Math.floor(k.y)
        for (let x = 0; x < game.map.lengthX; x++) {
            if (game.map.tileAt(x, y) === 0) {
                lineClearable = false
            }
        }
        if (lineClearable === true) {
            clearColor(k)
            game.map.tiles.splice(game.map.tileNumber(0, y), game.map.lengthX)
            for (let m = 0; m < game.map.lengthX; m++) {
                game.map.tiles.unshift(0)
            }
            for (let n = 0; n < game.playBlocks.length; n++) {
                if (game.playBlocks[n].y === y) {
                    game.playBlocks[n].color = -1
                }
            }
            game.score += game.map.lengthX
        } else if (lineClearable === false) {
            clearColor(k)
        }
    }
    blocks()
}

let doClear = true
function clearColor(k) {
    if (doClear === false || k.color === -1) return;
    doClear = false
    let x = k.x
    let y = Math.floor(k.y)
    if (game.map.tileAt(x, y) === 0) {
        doClear = true
        return
    }
    let sameColor = [[x, y]]
    for (let l = 0; l < sameColor.length; l++) {
        let base = sameColor[l]
        let search = [
            [base[0], base[1] - 1],
            [base[0] - 1, base[1]],
            [base[0], base[1] + 1],
            [base[0] + 1, base[1]]
        ]
        for (let m = 0; m < search.length; m++) {   // 同じ色かつsameColorに無い座標だったら追加
            if (game.map.tileAt(base[0], base[1]) === game.map.tileAt(search[m][0], search[m][1])) {
                let exist = true
                for (let n = 0; n < sameColor.length; n++) {
                    if (search[m][0] === sameColor[n][0] && search[m][1] === sameColor[n][1]) {
                        exist = false
                    }
                }
                if (exist === true) {
                    sameColor.push(search[m])
                }
            }
        }
    }
    if (sameColor.length >= 4) {    // 4つ以上色が揃ったら0にしてScore加算
        for (let l = 0; l < sameColor.length; l++) {
            game.map.tiles[game.map.tileNumber(sameColor[l][0], sameColor[l][1])] = 0
        }
        game.score += sameColor.length

        let clear = false
        for (let m of game.playBlocks) {
            clear = false
            for (let n of sameColor) {
                if (m.x === n[0] && n.y === n[1]) {
                    clear = true
                    break
                }
            }
            if (clear === true) {
                m.color = -1
            }
        }
    }
    doClear = true
}

function isContinue() {
    if (game.map.tileAt(4, 0) === 0) {
        game.playBlocks = []
        setPlayable()
        game.playable.type = Math.floor(Math.random() * 7)
        game.type.create(game.playable.type)
        return true
    } else {
        clearInterval(game.gameInterval)
        return false
    }
}

function gameover() {
    ctx.fillStyle = "black"
    ctx.font = "50px serif"
    // ctx.fillText("game over", (width * (game.map.lengthX + 1)), (width * (game.map.lengthY - 2)))
    ctx.fillText(("score:" + game.score), 0, (width * (game.map.lengthY + 2)))
}

// lineClear,colorClearは現在未使用
function lineClear() {
    for (let k = 0; k < game.playBlocks.length; k++) {
        if (game.playBlocks[k] !== null) {
            let clearable = true
            let x = game.playBlocks[k].x
            let y = Math.floor(game.playBlocks[k].y)
            for (let x = 0; x < game.map.lengthX; x++) {
                if (game.map.tileAt(x, y) === 0) {
                    clearable = false
                }
            }
            if (clearable === true) {
                game.map.tiles.splice(game.map.tileNumber(0, y), game.map.lengthX)
                for (let k = 0; k < game.map.lengthX; k++) {
                    game.map.tiles.unshift(0)
                }
                for (let m = 0; m < game.playBlocks.length; m++) {
                    if (game.playBlocks[m].y === y) {
                        game.playBlocks[m].color = -1
                    }
                }
                game.score += game.map.lengthX
            }
        }
    }

    /*
    for (let k of game.playBlocks) {
        let clearable = true
        let y = Math.floor(k.y)
        for (let x = 0; x < game.map.lengthX; x++) {
            if (game.map.tileAt(x, y) === 0) {
                clearable = false
            }
        }
        if (clearable === true) {
            game.map.tiles.splice(game.map.tileNumber(0, y), game.map.lengthX)
            for (let k = 0; k < game.map.lengthX; k++) {
                game.map.tiles.unshift(0)
            }
            game.playBlocks
            game.score += game.map.lengthX
        }
    }
    */
}
// let doClear=true
function colorClear() {
    if (doClear === false) return;
    for (let k = 0; k < game.playBlocks.length; k++) {
        doClear = false
        if (game.playBlocks[k].color !== -1) {
            let x = game.playBlocks[k].x
            let y = Math.floor(game.playBlocks[k].y)
            let sameColor = [[x, y]]
            for (let k = 0; k < sameColor.length; k++) {
                let base = sameColor[k]
                let search = [
                    [base[0], base[1] - 1],
                    [base[0] - 1, base[1]],
                    [base[0], base[1] + 1],
                    [base[0] + 1, base[1]]
                ]
                for (let m = 0; m < search.length; m++) {   // 同じ色かつsameColorに無い座標だったら追加
                    if (game.map.tileAt(base[0], base[1]) === game.map.tileAt(search[m][0], search[m][1])) {
                        let exist = true
                        for (let n = 0; n < sameColor.length; n++) {
                            if (search[m][0] === sameColor[n][0] && search[m][1] === sameColor[n][1]) {
                                exist = false
                            }
                        }
                        if (exist === true) {
                            sameColor.push(search[m])
                        }
                    }
                }
            }

            if (sameColor.length >= 4) {    // 4つ以上色が揃ったら0にしてScore加算
                for (let k = 0; k < sameColor.length; k++) {
                    game.map.tiles[game.map.tileNumber(sameColor[k][0], sameColor[k][1])] = 0
                }
                game.score += sameColor.length

                let clear = false
                for (let m = 0; m < game.playBlocks.length; m++) {
                    clear = false
                    for (let n = 0; n < sameColor.length; n++) {
                        if (game.playBlocks[m].x === sameColor[n][0] && Math.floor(game.playBlocks[m].y) === sameColor[n][1]) {
                            clear = true
                            break
                        }
                    }
                    if (clear === true) {
                        game.playBlocks[m].color = -1
                    }
                }
            }
        }
    }
    doClear = true

    /*
    for (let n of game.playBlocks) {
        let x = n.x
        let y = Math.floor(n.y)
        let sameColor = [[x, y]]
        for (let k = 0; k < sameColor.length; k++) {
            let base = sameColor[k]
            let search = [
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

        if (sameColor.length >= 4) {    // 4つ以上色が揃ったら0にしてScore加算
            for (let k = 0; k < sameColor.length; k++) {
                game.map.tiles[game.map.tileNumber(sameColor[k][0], sameColor[k][1])] = 0
            }
            game.score += sameColor.length
        }
    }
    */
}