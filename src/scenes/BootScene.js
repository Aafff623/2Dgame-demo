export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // 加载统一资源索引
    this.load.json('assetsManifest', 'assets/oakwoods/assets.json');
  }

  create() {
    const manifest = this.cache.json.get('assetsManifest');
    const basePath = manifest.basePath; // "assets/oakwoods/oak_woods_v1.0"

    // 加载背景图层
    manifest.images.forEach(img => {
      this.load.image(img.key, `${basePath}/${img.path}`);
    });

    // 加载精灵图
    manifest.spritesheets.forEach(ss => {
      this.load.spritesheet(ss.key, `${basePath}/${ss.path}`, {
        frameWidth: ss.frameWidth,
        frameHeight: ss.frameHeight,
        spacing: ss.spacing || 0,
        margin: ss.margin || 0
      });
    });

    // 加载瓦片集
    manifest.tilesets.forEach(ts => {
      this.load.image(ts.key, `${basePath}/${ts.path}`);
    });

    // 加载装饰物
    manifest.decorations.forEach(dec => {
      if (dec.type === 'spritesheet') {
        this.load.spritesheet(dec.key, `${basePath}/${dec.path}`, {
          frameWidth: dec.frameWidth,
          frameHeight: dec.frameHeight
        });
      } else {
        this.load.image(dec.key, `${basePath}/${dec.path}`);
      }
    });

    // 等待所有资源加载完毕再进入 GameScene
    this.load.once('complete', () => {
      this.scene.start('GameScene');
    });

    this.load.start();
  }
}
