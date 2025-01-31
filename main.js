var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function() {
  // 背景色の設定
  this.cameras.main.setBackgroundColor('#99CCFF');

  // 背景作成（物理エンジン対象ではなく、背景となる雪）
  this.createBackground();
  
  // 人間の作成
  this.createHuman();
  
  // スペースキーで靴下発射

  
  // ゲームオーバーを表す変数。初期値は「false」
  this.isGameOver = false;

  
  // 靴下グループの作成

  
  // サンタの作成

  
  // プレゼントグループの作成

  
};

mainScene.update = function() {
  // ゲームオーバーなら「update」を実行しない
  if( this.isGameOver ) {
    return false;
  }

  // 人間が、左右キーで、左右にアニメーションつきで移動する

  
  // サンタが画面上部を左右に移動する


};

mainScene.createBackground = function() {
  // 物理エンジンではなく背景としての雪を作成
  this.background = this.add.tileSprite(0,0, 1066, 800, 'snow');
  this.background.setOrigin(0, 0);

};

mainScene.createHuman = function() {
  // 人間を作成する
　// 物理エンジン対応の人間スプライト読み込み
  this.human = this.physics.add.sprite(400, 575, 'human');

  // 人間の表示サイズ変更
  this.human.setDisplaySize(70,70);

  // 人間の最初のフレームを設定
  this.human.setFrame(10);

  // 人間がゲーム空間と衝突
  this.human.setCollideWorldBounds(true);  
  
  // 左向きのアニメーション
  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('human', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1
  });
  // 右向きのアニメーション
  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('human', { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1
  });
  // 上向きのアニメーション
  this.anims.create({
      key: 'turn',
      frames: [ { key: 'human', frame: 10 } ],
      frameRate: 20
  });  
  
  
};

mainScene.createSocksGroup = function() {
  // 靴下グループを作成する


};

mainScene.createSocks = function() {
  // 人間がなげる靴下を作成する



};

mainScene.createSanta = function() {
  // サンタを作成する



  
};

mainScene.createPresentGroup = function() {
  // プレゼントグループを作成する



};

mainScene.createPresent = function() {
  // サンタの位置にプレゼントを作成する



};

mainScene.hitPresent = function(present, socks) {
  // プレゼントと靴下が衝突したときの処理


  
};

mainScene.hitSanta = function(santa, socks) {
  // サンタに靴下が衝突したときの処理


  
};

mainScene.gameOver = function() {
  /*
   * ゲームオーバーの処理
   * サンタのHPが「0」になった
   */
  // ゲームオーバーの変数を「true」
  this.isGameOver = true;
  // ゲームオーバー画像を表示
  this.gameover = this.add.image(400, 300, 'gameover');
  this.gameover.setDisplaySize(500,500);
  
  // 物理エンジン停止
  this.physics.pause();
  // 人間を赤色にする
  this.human.setTint(0xff0000);
  // プレゼント作成のタイマーを停止
  this.presentTimer.remove();
  
  // ボタンをおして、スタート画面へ戻る
  this.input.keyboard.on('keydown',function(event){
    this.scene.start("startScene");
  },this);  
};

mainScene.gameClear = function() {
  /*
   * ゲームクリアの処理
   * スコアが「20」になった
   */
  // ゲームオーバーの変数を「true」
  this.isGameOver = true;
  // プレゼント作成のタイマーを停止
  this.presentTimer.remove();
  // サンタが逃げ去る
  this.santa.setVelocity(300, -400);
  
  // 1秒後にリスタートするタイマー処理
  this.time.addEvent({
    delay : 1000,
    callback : this.restart,
    loop : false,
    callbackScope : this,
  });
};

mainScene.restart = function() {

  // ボタンをおして、スタート画面へ戻る
  this.input.keyboard.on('keydown',function(event){
    this.scene.start("startScene");
  },this);  
  
};
