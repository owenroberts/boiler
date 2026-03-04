import * as Cool from './cool/cool.js';
import { Game, Sprite } from './lines/src/Engine.js';

const gme = new Game({
	dps: 24,
	lineWidth: 1,
	width: 960,
	height: 480,
	multiColor: true,
	checkRetina: true,
	// debug: true,
	// stats: true,
	suspend: true,
	scenes: ['game', 'splash', 'loading'],
	bounds: {
		left: -1024,
		top: 1024,
		right: 1024,
		bottom: 1024,
	}
});

gme.load({ animations: { sprites: './data/sprites.json' }}, false);

gme.start = function() {
	const s = new Sprite(0, 0, gme.anims.sprites.sprite)
	gme.scenes.current = 'splash';
	gme.scenes.current.addToDisplay(s);
};

gme.update = function(timeElapsed) {
	gme.scenes.current.update();
};

gme.draw = function() {
	gme.scenes.current.display();
};