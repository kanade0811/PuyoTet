// 環境変数
const fps = 30
const width=50

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

        this.tileColors=[
                null,
                "red",
                "blue",
                "yellow",
                "green",
                "purple",
                "black" // 落下物に色を付ける前の仮の色
            ]
    }

    // 座標(x,y)を配列の番号に変換
    tileNumber(x,y){
        if (x < 0 || this.lengthX <= x || y < 0 || this.lengthY <= y){
            throw new Error("存在しないタイル")
        }
        return (y * this.lengthX + x)
    }
    // 座標(x,y)を配列の何番目かに変換
    tileAt(x, y) {
        return this.tiles[this.tileNumber(x,y)]
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
        this.color=6    // 仮として黒固定
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
        this.score=0
        this.gameInterval=setInterval(draw, 1000 / fps)
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
}

// 1フレームごとに描写する
function draw() {
    // canvasの作成
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    ctx.clearRect(0,0,1000,750)
    drawBack(ctx)
    drawBlocks(ctx)
    drawPlayable(ctx)
    if(drawPut()==="done"){
        lineClear()
        if(!isContinue()){
            ctx.font="50px serif"
            ctx.fillText("game over",(width*(game.map.lengthX+1)),(width*(game.map.lengthY-2)))
        }
    }
}

// 背景の描写
function drawBack(ctx){
    // 背景色
    ctx.fillStyle = "orange"
    ctx.fillRect(0, 0, 500, 750)

    // マス目→見にくい気がする
    for(let y=0;y<game.map.lengthY;y++){
        for(let x=0;x<game.map.lengthX;x++){
            ctx.strokeRect(width*x,width*y,width,width)
        }
    }

    // スコアの描写
    ctx.fillStyle = "black"
    ctx.font="50px serif"
    ctx.fillText(("score:"+game.score),(width*(game.map.lengthX+1)),(width*(game.map.lengthY-1)))
}

// 設置するかどうかの判定
function drawPut(){
    if(!game.playable) return;
    let x=game.playable.x
    let y=Math.floor(game.playable.y)   // y座標の丸め誤差を調整
    if(y+1>=game.map.lengthY){
        put(x,y)
        return "done"
    }else{
        if(game.map.tileAt(x,y+1)!==0){
            put(x,y)
            return "done"
        }
    }
}

// 設置処理
function put(x,y){
    game.map.tiles[game.map.tileNumber(x,y)]=game.playable.color
    game.playable=null
    return "done"
}

// 横一列揃ったら消す
function lineClear(){
    let isClear=true
    for(let y=0;y<game.map.lengthY;y++){
        isClear=true
        for(let x=0;x<game.map.lengthX;x++){
            if(game.map.tileAt(x,y)===0){
                isClear=false
                break
            }
        }
        if(isClear){
            game.map.tiles.splice(game.map.tileNumber(0,y),game.map.lengthX)
            for(let k=0;k<game.map.lengthX;k++){
                game.map.tiles.unshift(0)
            }
            game.score+=game.map.lengthX
        }
    }
}

// continue or gameoverの判定
function isContinue(){
    if(game.map.tileAt(4,0)===0){
        game.playable = new Playable(4, 0, Math.floor(Math.random() * 7 + 1))
        return true
    }else{
        clearInterval(game.gameInterval)
        return false
    }
}

// 既に積んでいるblockの描写
function drawBlocks(ctx){
    // 既に設置したblockを描写
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

// 落下物の処理
function drawPlayable(ctx){
    game.playable.y+=5/fps  // y軸に常に移動、5は仮の値(落下時の処理を見たかったため早めに設定)
    game.playable.draw(ctx)  // 今動かしているblockを描写
}