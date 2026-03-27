export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.cameras = null;
    this.player = null;
    this.cursors = null;
  }

  create() {
    // 获取游戏设计尺寸（比canvas大，用于 parallax 效果）
    const worldWidth = 1600;
    const worldHeight = 600;

    // 设置世界边界
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    // 相机跟随
    this.cameras.main.startFollow(this.cameras.main, true, 0.08, 0.08);

    // ============ Phase 1: 3个背景图层（视差滚动） ============

    // 远景 - scrollFactor 小，滚动最慢
    const bg1 = this.add.image(400, 240, 'bg_layer_1');
    bg1.setOrigin(0.5, 0.5);
    bg1.setScrollFactor(0.3);
    bg1.setDepth(0);

    // 中景 - scrollFactor 中等
    const bg2 = this.add.image(400, 240, 'bg_layer_2');
    bg2.setOrigin(0.5, 0.5);
    bg2.setScrollFactor(0.5);
    bg2.setDepth(1);

    // 近景 - scrollFactor 最大，滚动最快
    const bg3 = this.add.image(400, 240, 'bg_layer_3');
    bg3.setOrigin(0.5, 0.5);
    bg3.setScrollFactor(0.8);
    bg3.setDepth(2);

    // 背景层适应世界宽度（平辅）
    bg1.setScale(worldWidth / bg1.width, 1);
    bg2.setScale(worldWidth / bg2.width, 1);
    bg3.setScale(worldWidth / bg3.width, 1);

    // 居中 Y
    bg1.setY(worldHeight / 2);
    bg2.setY(worldHeight / 2);
    bg3.setY(worldHeight / 2);

    // Phase 1 完成标记
    console.log('[GameScene] Phase 1 完成：3个背景图层已加载');
  }
}
