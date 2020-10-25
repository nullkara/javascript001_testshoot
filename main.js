//変数定義
mp = null;   
kycode = null;
xx=0; //自機x座標
yy=270; //自機y座標
sizesize=20; //自機大きさ
lef=0; //左矢印押下フラグ
rig=0; //右矢印押下フラグ
spa=0; //スペース押下フラグ
scool=0; //自弾クールダウン
enhass=0; //敵機出現間隔
cnt=0; //経過時間
gameover=0; //ゲームオーバーフラグ
sco=0; //スコア
lev=0; //レベル

msx=[-1,-1,-1]; //自弾x座標
msy=[-1,-1,-1]; //自弾y座標
msmax=3; //自弾最大
mssize=5; //自弾サイズ

enx=[]; //敵機x座標
eny=[]; //敵機y座標
ent=[]; //敵機体力
ensize=20; //敵機大きさ
enmax=2000; //敵機最大

//敵機配列作成
for(var i=0;i<enmax;i++){
    enx.push(-1);
    eny.push(-1);
    ent.push(-1);
}

//jsが読み込まれたときに実行される
function ldstart()
{
    //キャンバス情報を保持する
	let canvas = document.getElementById('canvas_e');   
    let ctx    = canvas.getContext('2d');  
    mp = new MainPanel(canvas, ctx);
    //リスタートボタン非表示
    document.getElementById('rstart').style.display = "none";
}

//スタートボタン押下時に実行される
function clstart()
{
    //スタートボタン非表示
    document.getElementById('start').style.display = "none";
    //キャンパスをクリアする
    mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
    //初期化処理
    ini();
    //メインループ実行
    main();
}

//リスタートボタン押下時に実行される
function rclstart()
{
    //リスタートボタン非表示
    document.getElementById('rstart').style.display = "none";
    //キャンパスをクリアする
    mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
    //初期化処理
    ini();
    //メインループ実行
    main();
}

//キャンパス情報を保持する
function MainPanel(canvas, ctx)
{
	this.canvas = canvas;   
	this.ctx    = ctx;   
	return this;
}

//キー押下時処理
//downでture、upでfalseにするため、押下中はフラグは常にtrueになる
document.onkeydown = function(e) {
    var keyCode = false;
 
    if (e) event = e;
 
    if (event) {
        if (event.keyCode) {
            keyCode = event.keyCode;
        } else if (event.which) {
            keyCode = event.which;
        }
    }
 
    kycode=keyCode;
    //左矢印
    if(keyCode==37) lef=1;
    //右矢印
    if(keyCode==39) rig=1;
    //スペース
    if(keyCode==32) spa=1;
};

//キーを離したときの処理
document.onkeyup = function(e) {
    var keyCode = false;
 
    if (e) event = e;
 
    if (event) {
        if (event.keyCode) {
            keyCode = event.keyCode;
        } else if (event.which) {
            keyCode = event.which;
        }
    }
 
    kycode=keyCode;
    if(keyCode==37) lef=0;
    if(keyCode==39) rig=0;
    if(keyCode==32) spa=0;
};

//初期化処理
function ini(){
    xx = 200;
    lef=0;
    rig=0;
    spa=0;
    scool=0;
    for(var i=0;i<enmax;i++){
        enx[i]=-1;
        eny[i]=-1;
        ent[i]=-1;
    }
    enhass=50;
    cnt=0;
    gameover=0;
    sco=0;
    lev=1;
}

//描画処理
function draw() {
    //キャンパスをクリアする
    mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
    //水色
    mp.ctx.fillStyle = "rgb(0, 255, 255)";
    mp.ctx.fillRect(xx,yy,sizesize,sizesize); //自機
    //緑
    mp.ctx.fillStyle = "rgb(0, 255, 0)";
    for(var i=0;i<msmax;i++){
        if(msx[i]!=-1){
            mp.ctx.fillRect(msx[i],msy[i],mssize,mssize); //自弾
        }
    }
    for(var i=0;i<enmax;i++){
        if(enx[i]!=-1){
            mp.ctx.fillStyle = "rgb("+String(ent[i]*255/5)+", 0, 0)"; //敵機の体力によって色を変える
            mp.ctx.fillRect(enx[i],eny[i],ensize,ensize); //敵機
        }
    }
    //黒
    mp.ctx.fillStyle = "rgb(0, 0, 0)";
    mp.ctx.strokeRect(0,0,400,300); //外枠
    //紫
    mp.ctx.fillStyle = "rgb(255, 0, 255)";
    //文字は15ptのMSゴシック
    mp.ctx.font = "15px 'ＭＳ ゴシック'";
    mp.ctx.fillText("count:"+String(cnt), 10, 20); //時間
    mp.ctx.fillText("score:"+String(sco), 10, 40); //スコア
    mp.ctx.fillText("level:"+String(lev), 10, 60); //レベル
}

//自機移動処理
function mymove(){
    //押した方向に移動
    if(lef==1) xx--;
    if(rig==1) xx++;
    //画面外なら補正
    if(xx<=0) xx=1;
    if(xx>=400-sizesize) xx=399-sizesize;
}

//自弾処理
function myshot(){
    //クールタイム減少
    scool--;
    //スペースキー押下中で、クールタイム中でないなら
    if(spa==1&&scool<0){
        //自弾データの中で使っていない所を探す
        //ないなら、発射上限のため発射しない
        for(var i=0;i<msmax;i++){
            if(msx[i]==-1){
                //発射
                msx[i]=xx+sizesize/2-mssize/2;
                msy[i]=yy-1;
                scool=20;
                break;
            }
        }
    }
    //発射中の弾を進める
    for(var i=0;i<msmax;i++){
        if(msx[i]!=-1){
            msy[i]-=6;
        }
        //画面外なら削除
        if(msy[i]<-10){
            msy[i]=-1;
            msx[i]=-1;
        }
    }
}

//敵機移動
function enmove(){
    //時間が100経過するごとにレベルを上げる
    if(cnt%100==0){
        //敵出現間隔を狭める
        enhass--;
        lev++;
        if(enhass==0) enhass=1;
    }
    //敵出現間隔ごとに敵機出現
    if(cnt%enhass==0){
        //未使用データを探す
        for(var i=0;i<enmax;i++){
            if(enx[i]==-1){
                //場所はランダム
                enx[i]=Math.floor( Math.random() * (399-ensize) );
                eny[i]=1;
                ent[i]=Math.floor( Math.random() * 5 )+1;
                //レベル50以上なら体力に補正を加える
                if(lev>=50) ent[i]+=Math.floor((lev-50)/5);
                break;
            }
        }
    }
    //敵機を動かす
    for(var i=0;i<enmax;i++){
        if(enx[i]!=-1){
            eny[i]++;
        }
    }
}

//四角×四角の衝突判定
function atari(x1,y1,w1,h1,x2,y2,w2,h2){
    //中点に補正
    x1+=w1/2;
    y1+=h1/2;
    x2+=w2/2;
    y2+=h2/2;
    //衝突しているなら1を返す
    if(Math.abs(x1-x2) < w1/2 + w2/2 &&
        Math.abs(y1-y2) < h1/2 + h2/2 ){
        return 1;
      }
      return 0;
}

//当たり判定処理
function colmyem(){
    //敵機と自弾
    for(var i=0;i<enmax;i++){
        if(enx[i]!=-1){
            for(var j=0;j<msmax;j++){
                if(msx[j]!=-1){
                    //当たり判定を行う
                    if(atari(enx[i],eny[i],ensize,ensize,msx[j],msy[j],mssize,mssize)==1){
                        //当たっているので敵機の体力を1減らす
                        //自弾は消す
                        ent[i]--;
                        msx[j]=-1;
                        msy[j]=-1;
                        if(ent[i]<=0){
                            //敵機の体力が無くなったら、敵機を消す
                            ent[i]=-1;
                            enx[i]=-1;
                            eny[i]=-1;
                            //スコアアップ！
                            sco++;
                            break;
                        }
                    }
                }
            }
        }
    }
    //敵機と自機
    for(var i=0;i<enmax;i++){
        if(enx[i]!=-1){
            //当たり判定を行う
            if(atari(enx[i],eny[i],ensize,ensize,xx,yy,sizesize,sizesize)==1){
                //ゲームオーバー処理を行う
                //フラグを1にすることでゲームを止める
                gameover=1;
                //リスタートボタン表示
                document.getElementById('rstart').style.display = "block";
                mp.ctx.fillStyle = "rgb(255, 0, 255)";
                mp.ctx.font = "30px 'ＭＳ ゴシック'";
                //紫色30ptでゲームオーバー表示
                mp.ctx.fillText("GAME OVER", 20, 120);
            }
        }
    }
}

//メインループ処理
function main(){
    //ゲームオーバーでない限り続ける
    if(gameover==0){
        cnt++;
        mymove();
        draw();
        myshot();
        enmove();
        colmyem();
        //これを入れるとループされる
        requestAnimationFrame( main );
    }
    else{
    }
}
//終了処理...かな？
MainPanel.prototype.finish = function()
{
}
			
