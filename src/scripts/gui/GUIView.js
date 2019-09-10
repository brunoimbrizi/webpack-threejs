import ControlKit from '@brunoimbrizi/controlkit';
import Stats from 'stats.js';

export default class GUIView {

	constructor(app) {
		this.app = app;

		this.postProcessing = false;

		this.range = [0, 1];

		this.initControlKit();
		this.initStats();

		this.disable();
	}

	initControlKit() {
		this.controlKit = new ControlKit();
		this.controlKit.addPanel({ width: 300, enable: true })

		.addGroup({label: 'Post Processing', enable: true })
		// .addSlider(this, 'postOpacity', 'range', { label: 'opacity', onChange: () => { this.onPostProcessingChange(); } })
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
	}

	disable() {
		this.controlKit.disable();
		if (this.stats) this.stats.dom.style.display = 'none';
	}

	toggle() {
		if (this.controlKit._enabled) this.disable();
		else this.enable();
	}

	onPostProcessingChange() {
		if (!this.app.webgl.composer) return;
		this.app.webgl.composer.enabled = this.postProcessing;
	}
}
