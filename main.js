var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function() {
  // 背景色の設定
  this.cameras.main.setBackgroundColor('#99CCFF');

  // 背景作成（物理エンジン対象ではなく、背景となる雪）
  this.createBackground();
  
  // 人間の作成
  this.createHuman();
  
  // スペースキーで靴下発射
  this.input.keyboard.on('keydown-SPACE', function(event) {
    this.createSocks();
  }, this);
  
  // ゲームオーバーを表す変数。初期値は「false」
  this.isGameOver = false;
  // スコア
  this.score = 0;
  // 文字の表示
  this.scoreText = this.add.text(600, 30, "スコア:"+this.score , {
      font: '40px Open Sans',
      fill: '#ff0000'
  });
  this.presentType = ['present1', 'present2', 'present3', 'present4'];
  
  // 靴下グループの作成
  this.createSocksGroup();
  
  // サンタの作成
  this.createSanta();
  
  // プレゼントグループの作成
  this.createPresentGroup();
  
};

mainScene.update = function() {
  // ゲームオーバーなら「update」を実行しない
  if( this.isGameOver ) {
    return false;
  }

  var speed = 600;
  
  var cursors = this.input.keyboard.createCursorKeys();
  if(cursors.right.isDown) {
    // 右に移動
    this.human.anims.play('right', true);
    this.human.setVelocityX(speed);
  } else if(cursors.left.isDown) {
    // 左に移動
    this.human.anims.play('left', true);
    this.human.setVelocityX(-speed);
  } else {
    // 移動停止
    this.human.anims.play('turn', true);
    this.human.setVelocityX(0);
  }
  
  // サンタが画面上部を左右に移動する
  if (this.santa.x < 100) {
    this.santa.dx = -this.santa.dx;
    this.santa.setFlipX(true);
  }
  if (this.santa.x > 700) {
    this.santa.dx = -this.santa.dx;
    this.santa.setFlipX(false);
  }
  this.santa.x += this.santa.dx;

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
  this.socksGroup = this.physics.add.group();
};

mainScene.createSocks = function() {
  // 人間がなげる靴下を作成する
  var x = this.human.body.center.x;
  var y = this.human.body.center.y;
  
  var socks = this.socksGroup.create(x, y, 'socks');
  socks.setDisplaySize(120, 120);
  socks.setVelocityY(-400);
  socks.body.setAllowGravity(false);
};

mainScene.createSanta = function() {
  // サンタを作成する
  this.santa = this.physics.add.image(400, 80, 'santa');
  this.santa.setDisplaySize(150, 150);
  this.santa.body.setAllowGravity(false);
  this.santa.setFlipX(true);
  this.santa.hp = 10;
  this.santa.dx = 5;
  // 文字の表示
  this.hpText = this.add.text(650, 100, "HP:"+this.santa.hp , {
      font: '40px Open Sans',
      fill: '#ff0000'
  });      
  this.physics.add.overlap(this.santa, this.socksGroup, this.hitSanta, null, this);
  
};

mainScene.createPresentGroup = function() {
  // プレゼントグループを作成する
  this.presentGroup = this.physics.add.group();
  
  this.physics.add.overlap(this.presentGroup, this.socksGroup, this.hitPresent, null, this);  
  
  this.presentTimer = this.time.addEvent({
    delay : 500,
    callback : this.createPresent,
    loop : true,
    callbackScope : this
  });  
};

mainScene.createPresent = function() {
  // サンタの位置にプレゼントを作成する
  var x = this.santa.body.center.x;
  var y = this.santa.body.center.y;
  var presentType = Phaser.Math.RND.pick(this.presentType);
  
  var present = this.presentGroup.create(x, y, presentType);
  present.setDisplaySize(70, 70);
};

mainScene.hitPresent = function(present, socks) {
  // プレゼントと靴下が衝突したときの処理
  present.destroy();
  socks.destroy();
  this.score++;
  this.scoreText.setText("スコア:"+this.score);
  if (this.score >= 20) {
    this.gameClear();
  }
  
};

mainScene.hitSanta = function(santa, socks) {
  // サンタに靴下が衝突したときの処理
  socks.destroy();
  santa.hp--;
  var text = "HP:" + santa.hp;
  
  if (santa.hp >= 0) {
    this.hpText.setText(text);
  }
  if (santa.hp <= 0) {
    this.gameOver();
  }
  
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
