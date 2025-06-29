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
            ]
        ]
        this.position = [
            [0, 1 / 2], [0, 0], [1 / 2, 0], [1 / 2, 0], [1 / 2, 0], [1 / 2, 0], [1 / 2, 0]
        ]
    }
    create() {
        let b=game.next.playBlocks
        for (let k = 0; k < game.type.shapes[game.next.playable.type][0].length; k++) {
            b[k]={}
            b[k].color=Math.floor(Math.random() * 5 + 1)
        }
        if (b[0].color === b[1].color&& b[0].color === b[2].color&& b[0].color === b[3].color) {
            setPlayable()
        }
    }
    rotate() {
        let p = game.now.playable
        p.rotation = (p.rotation + 1) % 4
        let nextX = []
        for (let k = 0; k < game.now.playBlocks.length; k++) {
            nextX.push(p.x + this.shapes[p.type][p.rotation][k][0])
        }
        let max = -1
        let min = game.map.lengthX + 1
        for (let k = 0; k < nextX.length; k++) {
            if (nextX[k] > max) {
                max = nextX[k]
            } else if (nextX[k] < min) {
                min = nextX[k]
            }
        }
        if (min === -2) {
            p.x += 2
        } else if (min === -1) {
            p.x++
        } else if (max === game.map.lengthX) {
            p.x--
        } else if (max === game.map.lengthX + 1) {
            p.x -= 2
        }
    }
}

// gameの初期設定
class Game {
    constructor() {
        this.map = new Map()
        this.type = new Type()
        this.now = null
        this.next = null
        this.hold = null
        this.score = 0
        this.gameInterval = setInterval(draw, 1000 / fps)
        this.speed = 1
        this.defaultSpeed = 1
        this.incraseSpeed = 8
        this.clear = []
    }
}
let game

window.onload = function () {

    game = new Game()
    // ゲーム開始時に上真ん中にランダムなblockを配置
    game.next = {
        playBlocks: [],
        playable: {
            x: 4,
            y: 0,
            type: Math.floor(Math.random() * 7),
            rotation: 0
        }
    }
    game.type.create(game.next.playable.type)
    game.now = game.next
    setPlayable()

    // 左右が押されたら瞬時に移動
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyA" || event.code === "KeyD") {
            let move = { KeyA: -1, KeyD: 1 }
            let dx = move[event.code]
            let nextMove = true
            if (dx === undefined) return
            for (let k = 0; k < game.now.playBlocks.length; k++) {
                let nextX = nowBlockX(k) + dx
                if (!(0 <= nextX && nextX < game.map.lengthX)) {
                    nextMove = false
                    break
                }
            }
            if (nextMove === true) {
                game.now.playable.x += dx
            }
        }
    })
    // 下が押されたら落下速度上昇
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyS") {
            setSpeed(1)
        }
    })
    // 下が離されたら落下速度を元に戻す
    document.addEventListener("keyup", (event) => {
        if (event.code === "KeyS") {
            setSpeed(0)
        }
    })
    // 上が押されたら回転
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyW") {
            game.type.rotate()
        }
    })
    // Qが押されたらhold(未実装)
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyQ") {
            hold()
        }
    })
}

function setSpeed(keydown) {
    game.speed = game.defaultSpeed + game.incraseSpeed * keydown
}

function hold() {
    if (game.hold === null) {
        // color,type,rotationをコピーする
        game.hold = {
            playable: {
                type: null,
                rotation: null
            },
            playBlocks: []
        }
        game.hold.playBlocks = game.now.playBlocks
        game.hold.playable.type = game.now.playable.type
        game.hold.playable.rotation = game.now.playable.rotation
        game.now = game.next
        setPlayable()
    } else {
        let temporary = structuredClone(game.hold)
        game.hold.playBlocks = structuredClone(game.now.playBlocks)
        game.hold.playable.type = game.now.playable.type
        game.hold.playable.rotation = game.now.playable.rotation
        game.now.playBlocks = temporary.playBlocks
        game.now.playable.type = temporary.playable.type
        game.now.playable.rotation = temporary.playable.rotation
        temporary = null
    }
}

function setPlayable() {
    game.next = {
        playBlocks: [],
        playable: {
            x: 4,
            y: 0,
            type: Math.floor(Math.random() * 7),
            rotation: 0
        }
    }
    game.type.create(game.next.playable.type)
}

function nowBlockX(k) {
    return game.now.playable.x + game.type.shapes[game.now.playable.type][game.now.playable.rotation][k][0]
}

function nowBlockY(k) {
    return game.now.playable.y + game.type.shapes[game.now.playable.type][game.now.playable.rotation][k][1]
}

// canvasの作成
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// 1フレームごとに描写する
function draw() {
    ctx.clearRect(0, 0, 1000, 1000)
    background()
    drawBlocks()
    drawNext()
    drawHold()
    playable()

    if (putOrNot()) {
        put()
        clearBlocks()
        if (!isContinue()) {
            gameover()
        }
    }
    drawScore()
}

function background() {
    // 背景色
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 500, 750)

    // マス目
    for (let y = 0; y < game.map.lengthY; y++) {
        for (let x = 0; x < game.map.lengthX; x++) {
            ctx.strokeRect(width * x, width * y, width, width)
        }
    }
}

function drawBlocks() {
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

function drawNext() {
    ctx.fillStyle = "black"
    ctx.font = "40px serif"
    ctx.fillText(
        "next block",
        (width * (game.map.lengthX + 1)),
        width
    )
    let p = game.next.playable
    for (let k = 0; k < game.next.playBlocks.length; k++) {
        ctx.fillStyle = game.map.tileColors[game.next.playBlocks[k].color]
        ctx.fillRect(
            ((game.map.lengthX + 2) + game.type.shapes[p.type][p.rotation][k][0] + game.type.position[p.type][0]) * width,
            (2 + game.type.shapes[p.type][p.rotation][k][1] + game.type.position[p.type][1]) * width,
            width,
            width
        )
    }
}

function drawHold() {
    ctx.fillStyle = "black"
    ctx.font = "40px serif"
    ctx.fillText(
        "next block",
        (width * (game.map.lengthX + 1)),
        width * 5
    )
    if (game.hold === null) return
    let p = game.hold.playable
    let b = game.hold.playBlocks
    for (let k = 0; k < game.hold.playBlocks.length; k++) {
        ctx.fillStyle = game.map.tileColors[b[k].color]
        ctx.fillRect(
            ((game.map.lengthX + 3) + game.type.shapes[p.type][p.rotation][k][0]) * width,
            (6 + game.type.shapes[p.type][p.rotation][k][1]) * width,
            width,
            width
        )
    }
}

function playable() {
    game.now.playable.y += game.speed / fps
    let b = game.now.playBlocks
    for (let k = 0; k < game.now.playBlocks.length; k++) {
        let x = nowBlockX(k)
        let y = nowBlockY(k)
        if (y <= -1) continue
        ctx.fillStyle = game.map.tileColors[b[k].color]
        if (0 <= y) {
            ctx.fillRect(
                x * width,
                y * width,
                width,
                width
            )
        } else {
            ctx.fillRect(
                x * width,
                0 * width,
                width,
                (1 + y) * width
            )
        }
    }
}

function putOrNot() {
    if (game.now.playBlocks.length === 0) return false
    let putable = false;
    for (let k = 0; k < game.now.playBlocks.length; k++) {
        let x = nowBlockX(k)
        let y = Math.floor(nowBlockY(k))
        if (y === -2) {
            continue
        }
        if (y + 1 >= game.map.lengthY || game.map.tileAt(x, y + 1) !== 0) {
            putable = true
            break
        }
    }
    return putable
}

function put() {
    for (let k = 0; k < game.now.playBlocks.length; k++) {
        let x = nowBlockX(k)
        let y = Math.floor(nowBlockY(k))
        game.map.tiles[game.map.tileNumber(x, y)] = game.now.playBlocks[k].color
    }
    drawBlocks()
}

function clearBlocks() {
    game.clear = []
    for (let k = 0; k < game.now.playBlocks.length; k++) {
        game.clear.push({
            x: nowBlockX(k),
            y: nowBlockY(k),
            color: game.now.playBlocks[k].color
        })
    }
    for (let k of game.clear) {
        if (k.color === -1) continue
        lineClear(k)
    }
}

// lineを消し、colorを動かさせる
function lineClear(k) {
    if (k.color === -1) return
    let lineClearable = true
    let y = Math.floor(k.y)
    for (let x = 0; x < game.map.lengthX; x++) {
        if (game.map.tileAt(x, y) === 0) {
            lineClearable = false
            break
        }
    }
    if (lineClearable === true) {
        colorClearable(k)
        game.map.tiles.splice(game.map.tileNumber(0, y), game.map.lengthX)
        for (let m = 0; m < game.map.lengthX; m++) {
            game.map.tiles.unshift(0)
        }
        // 処理が被るblockは色を-1に
        for (let m of game.clear) {
            if (m.y === y) m.color = -1
        }
        game.score += game.map.lengthX
        createBlocksY(y)
    } else {
        colorClearable(k)
    }
    drawBlocks()
}

// lineで消した後に自由落下してきたblockに対するclear判定
function createBlocksY(Y) {
    for (let X = 0; X < game.map.lengthX; X++) {
        if (game.map.tileAt(X, Y) === 0) continue
        game.clear.push({
            x: X,
            y: Y,
            color: game.map.tileAt(X, Y)
        })
    }
}

// 色が揃って消えるかどうかの判定
function colorClearable(k) {
    let x = k.x
    let y = Math.floor(k.y)
    if (game.map.tileAt(x, y) === 0) return
    let sameColor = [[x, y]]
    // 同じ色の隣同士を同じ色かどうか調べる
    for (let l = 0; l < sameColor.length; l++) {
        let base = sameColor[l]
        let search = [
            [base[0], base[1] - 1],
            [base[0] - 1, base[1]],
            [base[0], base[1] + 1],
            [base[0] + 1, base[1]]
        ]
        // 基準のblockと同じ色かつsameColorに無い座標だったら配列に追加
        for (let m = 0; m < search.length; m++) {
            if (game.map.tileAt(base[0], base[1]) === game.map.tileAt(search[m][0], search[m][1])) {
                let exist = true
                // もし既にsameColorに入っていた場合は重複して入れない
                for (let n = 0; n < sameColor.length; n++) {
                    if (search[m][0] === sameColor[n][0] && search[m][1] === sameColor[n][1]) {
                        exist = false
                        break
                    }
                }
                if (exist === true) {
                    sameColor.push(search[m])
                }
            }
        }
    }
    // 色が4つ以上揃ったら消す
    if (sameColor.length >= 4) {
        // 配列をyの昇順→xの昇順になるように並び替える
        sameColor.sort((a, b) => {
            if (a[1] !== b[1]) return b[1] - a[1]
            return b[0] - a[0]
        })
        colorClear(sameColor)
    }
    // if (sameColor.length >= 4) colorClear(makeClearBlocks(sameColor))
    doClear = true
}

// sameColorをy座標が大きい順に並び替えclearBlocksを作る
function makeClearBlocks(sameColor) {
    let clearBlocks = []
    for (let m = 0; m < sameColor.length; m++) {
        // 最初は確定で配列に追加
        if (m === 0) {
            clearBlocks.push(sameColor[m])
            continue
        }
        // 特定の場所のy以上ならその前に要素を追加
        for (let n = 0; n < clearBlocks.length; n++) {
            if (sameColor[m][1] >= clearBlocks[n][1]) {
                clearBlocks.splice(n, 0, sameColor[m])
                break
            }
        }
        // もしy座標が一番小さかったら配列の最後に追加
        if (sameColor[m][1] < clearBlocks.at(-1)[1]) {
            clearBlocks.push(sameColor[m])
        }
    }
    return clearBlocks
}

function colorClear(clearBlocks) {
    // ミノと消すblockが被っていたらcolor=-1として他で処理しないように
    for (let m of game.clear) {
        for (let n of clearBlocks) {
            if (m.x === n[0] && m.y === n[1]) {
                m.color = -1
            }
        }
    }
    game.score += clearBlocks.length
    dropBlocks(clearBlocks)
    drawBlocks()
    // 落下したblockに対して、異なるx座標の大きいyからcolorClearする
    let clearedX = []
    for (let l = 0; l < clearBlocks.length; l++) {
        // x軸が同じものは複数回実行しない
        if (clearedX.includes(clearBlocks[l][0]) === true) continue
        clearedX.push(clearBlocks[l][0])
        createBlocksX(clearBlocks[l][0], clearBlocks[l][1])
    }
}

// 色が揃った部分のみで落下判定
function dropBlocks(clearBlocks) {
    // 処理済みのx座標を保存する配列
    let clearedX = []
    for (let l = 0; l < clearBlocks.length; l++) {
        // 同じx座標について1回だけ落下処理をする
        x = clearBlocks[l][0]
        if (clearedX.includes(x) === true) continue
        clearedX.push(x)
        Y = clearBlocks[l][1]     // 変更先のblock
        y = clearBlocks[l][1] - 1   // 変更元のblock
        // 上の色を落としてくる
        while (y >= 0) {
            for (let m = 0; m < clearBlocks.length; m++) {
                // 配列内の同じblockは考えない
                if (l === m) continue
                // 配列内で同じx座標で違うy座標のblockがあった場合、更にもう一つ上のblockを参照する
                if (x === clearBlocks[m][0] && y === clearBlocks[m][1]) y--;
            }
            // 適切なy座標の色を落としてくる
            game.map.tiles[game.map.tileNumber(x, Y)] = game.map.tiles[game.map.tileNumber(x, y)]
            Y--
            y--
        }
        // 上にblockが無くなった場合は透明blockを追加
        while (Y >= 0) {
            game.map.tiles[game.map.tileNumber(x, Y)] = 0
            Y--
        }
    }
}

// colorで消した後の落下したblock全てをclearに追加
function createBlocksX(X, Y) {
    for (Y; Y > 0; Y--) {
        if (game.map.tileAt(X, Y) === 0) continue
        game.clear.push({
            x: X,
            y: Y,
            color: game.map.tileAt(X, Y)
        })
    }
}

function isContinue() {
    if (game.map.tileAt(4, 0) === 0) {
        game.now = game.next
        setPlayable()
        return true
    } else {
        clearInterval(game.gameInterval)
        return false
    }
}

function gameover() {
    ctx.fillStyle = "black"
    ctx.font = "50px serif"
    ctx.fillText(
        "game over",
        (width * (game.map.lengthX + 1)),
        (width * (game.map.lengthY - 1 - 1 / 4))
    )
    // ctx.fillText("game over", 0, (width * (game.map.lengthY + 2)))
}

function drawScore() {
    // スコアの描写
    ctx.fillStyle = "black"
    ctx.font = "50px serif"
    ctx.fillText(
        ("score:" + game.score),
        (width * (game.map.lengthX + 1)),
        (width * (game.map.lengthY - 1 / 4))
    )
    // ctx.fillText(("score:" + game.score), 0, (width * (game.map.lengthY + 1)))
}