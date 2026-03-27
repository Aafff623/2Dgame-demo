import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, GameScene]
};

new Phaser.Game(config);
