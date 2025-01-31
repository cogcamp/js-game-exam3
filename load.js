// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
  // スタート画像
  this.load.image('gamestart', 'assets/images/gamestart.gif');
  // ゲームオーバー画像
  this.load.image('gameover', 'assets/images/gameover.png');
  // 背景画像
  this.load.image('snow', 'assets/images/snow_town.png');
  // プレイヤー画像の読み込み
  this.load.spritesheet('human', 'assets/images/player1.png', { frameWidth: 32, frameHeight: 32 });
  
  // 靴下画像の読み込み
  this.load.image('socks', 'assets/images/socks.png');
  // サンタ画像の読み込み
  this.load.image('santa', 'assets/images/santa.png');
  // プレゼント画像の読み込み
  this.load.image('present1', 'assets/images/present1.png');
  this.load.image('present2', 'assets/images/present2.png');
  this.load.image('present3', 'assets/images/present3.png');
  this.load.image('present4', 'assets/images/present4.png');

};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
