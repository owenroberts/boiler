// loading animation pre lines render
const title = document.getElementById('title');
function loadingAnimation() {
	let t = '~' + title.textContent + '~';
	title.textContent = t;
}
let loadingInterval = setInterval(loadingAnimation, 1000 / 12);

const isMobile = Cool.mobilecheck();
if (isMobile) document.body.classList.add('mobile');

/* this is the game part */
const gme = new Game({
	dps: 24,
	lineWidth: 1,
	zoom: isMobile ? 1 : 1.5,
	width: window.innerWidth,
	height: window.innerHeight,
	multiColor: true,
	checkRetina: true,
	// debug: true,
	// stats: true,
	suspend: true,
	events: isMobile ? ['touch'] : ['keyboard', 'mouse'],
	scenes: ['game', 'splash', 'loading'],
	bounds: {
		left: -1024,
		top: 1024,
		right: 1024,
		bottom: 1024,
	}
});

gme.load({ 
	scenery: 'data/scenery.json',
	textures: 'data/textures.json',
	sprites: 'data/sprites.json',
	ui: 'data/ui.json',
}, false);


gme.start = function() {
	gme.scenes.current = 'splash';
};

gme.update = function(timeElapsed) {
	gme.scenes.current.update();
};

gme.draw = function() {
	gme.scenes.current.display();
};