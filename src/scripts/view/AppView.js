import WebGLView from './webgl/WebGLView';
import UIView from './ui/UIView';

export default class AppView {

	constructor() {
		this.initWebGL();
		this.initUI();
		this.addListeners();
		this.animate();
		this.resize();
	}

	initWebGL() {
		this.webgl = new WebGLView(this);

		// move canvas to container
		document.querySelector('.container').appendChild(this.webgl.renderer.domElement);
	}

	initUI() {
		this.ui = new UIView(this);
	}

	addListeners() {
		// const el = this.webgl.renderer.domElement;

		this.handlerAnimate = this.animate.bind(this);

		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));
		// el.addEventListener('click', this.onClick.bind(this));
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
		// this.ui.stats.begin();
		if(this.webgl) this.webgl.update();
	}

	draw() {
		if(this.webgl) this.webgl.draw();
		// this.ui.stats.end();
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if(this.webgl) this.webgl.resize();
	}

	keyup(e) {
		// g
		if (e.keyCode == 71) { if (this.ui) this.ui.toggle(); }
		// r
		if (e.keyCode == 82) { if (this.webgl.trackball) this.webgl.trackball.reset(); }
	}
}
