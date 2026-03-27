export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.player = null;
    this.cursors = null;
    this.wasd = null;
  }

  create() {
    const worldWidth = 1600;
    const worldHeight = 600;
    const tileSize = 24;

    // ============ Phase 1: 3个背景图层（视差滚动） ============

    const bg1 = this.add.image(worldWidth / 2, worldHeight / 2, 'bg_layer_1');
    bg1.setScrollFactor(0.3);
    bg1.setDepth(0);
    bg1.setScale(worldWidth / bg1.width, 1);

    const bg2 = this.add.image(worldWidth / 2, worldHeight / 2, 'bg_layer_2');
    bg2.setScrollFactor(0.5);
    bg2.setDepth(1);
    bg2.setScale(worldWidth / bg2.width, 1);

    const bg3 = this.add.image(worldWidth / 2, worldHeight / 2, 'bg_layer_3');
    bg3.setScrollFactor(0.8);
    bg3.setDepth(2);
    bg3.setScale(worldWidth / bg3.width, 1);

    console.log('[GameScene] Phase 1 完成：3个背景图层已加载');

    // ============ Phase 2: 地面瓦片层 ============

    // 地面高度：2层瓦片 = 48px
    const groundHeight = tileSize * 2;
    const groundY = worldHeight - groundHeight; // y = 552

    // 创建地面组（静态物体）
    this.groundTiles = this.physics.add.staticGroup();

    // 横向铺满整个世界宽度
    const tilesAcross = Math.ceil(worldWidth / tileSize); // 67 tiles

    for (let x = 0; x < tilesAcross; x++) {
      for (let row = 0; row < 2; row++) {
        const frameIndex = row * 21;
        const tile = this.add.image(
          x * tileSize + tileSize / 2,
          groundY + row * tileSize + tileSize / 2,
          'oak_woods_tiles',
          frameIndex
        );
        tile.setScrollFactor(0);
        tile.setDepth(5);
        this.groundTiles.add(tile);
      }
    }

    this.groundTiles.refresh();

    console.log(`[GameScene] Phase 2 完成：地面瓦片层已添加 (${tilesAcross}×2 tiles)`);

    // ============ Phase 3: 角色与动画 ============

    // 创建角色精灵（物理体）
    this.player = this.physics.add.sprite(200, groundY - 28, 'char_blue');
    this.player.setDepth(10);
    this.player.setCollideWorldBounds(true);

    // 玩家尺寸与地面碰撞
    this.player.body.setSize(40, 48);
    this.player.body.setOffset(8, 8);

    // 设置物理世界边界
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // 与地面碰撞
    this.physics.add.collider(this.player, this.groundTiles);

    // 创建动画
    // idle: 帧 0-5 (第1行前6个)
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('char_blue', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    // walk: 帧 16-23 (第3行)
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('char_blue', { start: 16, end: 23 }),
      frameRate: 10,
      repeat: -1
    });

    // 攻击动画（备用）
    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers('char_blue', { start: 8, end: 13 }),
      frameRate: 12,
      repeat: 0
    });

    // 键盘输入
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.player.play('idle');

    console.log('[GameScene] Phase 3 完成：角色、动画和键盘控制已添加');
  }

  update() {
    const speed = 160;
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const facingLeft = this.player.flipX;

    if (left) {
      this.player.setVelocityX(-speed);
      if (facingLeft) this.player.flipX = false;
      if (this.player.body.onFloor() && !this.player.anims.isPlaying || this.player.anims.currentAnim?.key !== 'walk') {
        this.player.play('walk', true);
      }
    } else if (right) {
      this.player.setVelocityX(speed);
      if (!facingLeft) this.player.flipX = true;
      if (this.player.body.onFloor() && !this.player.anims.isPlaying || this.player.anims.currentAnim?.key !== 'walk') {
        this.player.play('walk', true);
      }
    } else {
      this.player.setVelocityX(0);
      if (this.player.body.onFloor()) {
        this.player.play('idle', true);
      }
    }
  }
}
