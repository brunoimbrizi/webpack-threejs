import '../styles/main';

import WebGLView from './webgl/WebGLView';
import GUIView from './gui/GUIView';

export default class App {

	constructor() {
		this.el = document.querySelector('.container');
	}

	init() {
		this.initWebGL();
		this.initGUI();
		this.addListeners();
		this.animate();
		this.resize();
	}

	initWebGL() {
		this.webgl = new WebGLView(this);
		this.el.appendChild(this.webgl.renderer.domElement);
	}

	initGUI() {
		this.gui = new GUIView(this);
	}

	addListeners() {
		this.handlerAnimate = this.animate.bind(this);

		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));
	}

	animate() {
		this.update();
		this.draw();

		this.raf = requestAnimationFrame(this.handlerAnimate);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (this.gui.stats) this.gui.stats.begin();
		if (this.webgl) this.webgl.update();
	}

	draw() {
		if (this.webgl) this.webgl.draw();
		if (this.gui.stats) this.gui.stats.end();
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		const vw = document.querySelector('.container').offsetWidth || window.innerWidth;
		const vh = document.querySelector('.container').offsetHeight || window.innerHeight;

		if (this.webgl) this.webgl.resize(vw, vh);
	}

	keyup(e) {
		// g or p
		if (e.keyCode == 71 || e.keyCode == 80) { if (this.gui) this.gui.toggle(); }
		// h
		if (e.keyCode == 72) { if (this.webgl.trackball) this.webgl.trackball.reset(); }
	}
}
