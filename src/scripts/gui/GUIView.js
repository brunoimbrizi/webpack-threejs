import ControlKit from '@brunoimbrizi/controlkit';
import Stats from 'stats.js';

export default class GUIView {

	constructor(app) {
		this.app = app;

		this.postProcessing = false;
		this.postDensity = 0.8;
		this.postOptions = ['Option A', 'Option B'];
		this.postSelected = 0;

		this.range = [0, 1];

		this.initControlKit();
		this.initStats();

		this.disable();
	}

	initControlKit() {
		this.controlKit = new ControlKit({ full: true });
		this.controlKit.addPanel({ width: 340, enable: true })

		.addGroup({label: 'Post Processing', enable: true })
		.addSelect(this, 'postOptions', { label: 'options', selected: this.postSelected, onChange: (index) => { this.onPostProcessingSelect(index); } })
		.addSlider(this, 'postDensity', 'range', { label: 'density', onChange: () => { this.onPostProcessingChange(); } })
		.addCheckbox(this, 'postProcessing', { label: 'post processing', onChange: () => { this.onPostProcessingChange(); } })
	}

	initStats() {
		this.stats = new Stats();

		document.body.appendChild(this.stats.dom);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	enable() {
		this.controlKit.enable();
		if (this.stats) this.stats.dom.style.display = '';

		if (!this.controlKit._full) return;
		this.app.el.style.width = `calc(100vw - ${this.controlKit._panels[0]._width}px)`;
		this.app.resize();
	}

	disable() {
		this.controlKit.disable();
		if (this.stats) this.stats.dom.style.display = 'none';

		if (!this.controlKit._full) return;
		this.app.el.style.width = ``;
		this.app.resize();
	}

	toggle() {
		if (this.controlKit._enabled) this.disable();
		else this.enable();
	}

	onPostProcessingChange() {
		if (!this.app.webgl.composer) return;
		this.app.webgl.composer.enabled = this.postProcessing;
		this.app.webgl.scanlineEffect.setDensity(this.postDensity);
	}

	onPostProcessingSelect(index) {
		if (!this.app.webgl.object3D) return;
		this.app.webgl.object3D.material.wireframe = (index == 0);
	}
}
