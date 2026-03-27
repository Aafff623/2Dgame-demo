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

    // 地面高度：1层瓦片 = 24px
    const groundHeight = tileSize;
    const groundY = worldHeight - groundHeight; // y = 576

    // 只添加视觉瓦片，不创建碰撞
    for (let x = 0; x < Math.ceil(worldWidth / tileSize); x++) {
      const tile = this.add.image(
        x * tileSize + tileSize / 2,
        groundY + tileSize / 2,
        'oak_woods_tiles',
        0
      );
      tile.setScrollFactor(0);
      tile.setDepth(5);
    }

    // 创建空的地板组（占位，后续用 TileMap 替代）
    this.groundTiles = this.physics.add.staticGroup();

    console.log('[GameScene] Phase 2 完成：地面瓦片已添加（无碰撞）');

    // ============ Phase 3: 角色与动画 ============

    // 创建角色精灵（物理体）
    // 角色底部应该在地面顶部，所以 Y = groundY - 角色高度
    this.player = this.physics.add.sprite(200, groundY - 48, 'char_blue');
    this.player.setDepth(10);
    this.player.setCollideWorldBounds(true);

    // 暴露 player 到全局，供测试使用
    window.player = this.player;

    // 玩家碰撞箱 - 稍微小一点以避免卡住
    this.player.body.setSize(36, 44);
    this.player.body.setOffset(10, 12);

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

    if (left) {
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
      if (this.player.body.onFloor() && this.player.anims.currentAnim?.key !== 'walk') {
        this.player.play('walk', true);
      }
    } else if (right) {
      this.player.setVelocityX(speed);
      this.player.flipX = false;
      if (this.player.body.onFloor() && this.player.anims.currentAnim?.key !== 'walk') {
        this.player.play('walk', true);
      }
    } else {
      this.player.setVelocityX(0);
      if (this.player.body.onFloor() && this.player.anims.currentAnim?.key !== 'idle') {
        this.player.play('idle', true);
      }
    }
  }
}
