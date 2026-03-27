export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.player = null;
    this.cursors = null;
  }

  create() {
    const worldWidth = 1600;
    const worldHeight = 600;
    const tileSize = 24;

    // 设置物理世界边界
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.cameras.main, true, 0.08, 0.08);

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
        // 使用 tileset 的第 1 行作为地面（索引从 0 开始）
        // frame = row * 21 + col，在第 0 列是地面 tile
        const frameIndex = row * 21;
        const tile = this.add.image(
          x * tileSize + tileSize / 2,
          groundY + row * tileSize + tileSize / 2,
          'oak_woods_tiles',
          frameIndex
        );
        tile.setScrollFactor(0); // 地面不参与视差，跟随相机
        tile.setDepth(5);        // z = 5，地面层级
        this.groundTiles.add(tile);
      }
    }

    // 让物理世界知道地面的碰撞体
    this.groundTiles.refresh();

    console.log(`[GameScene] Phase 2 完成：地面瓦片层已添加 (${tilesAcross}×2 tiles)`);
  }
}
