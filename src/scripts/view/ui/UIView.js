import ControlKit from '@brunoimbrizi/controlkit';
import Stats from 'stats.js';

export default class UIView {

	constructor(view) {
		this.view = view;

		this.postProcessing = false;

		this.range = [0, 1];

		this.initControlKit();
		this.initStats();

		this.disable();
	}

	initControlKit() {
		this.controlKit = new ControlKit();
		this.controlKit.addPanel({ width: 300, enable: false })

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
		if (!this.view.webgl.composer) return;
		this.view.webgl.composer.enabled = this.postProcessing;
		this.view.webgl.object3D.material.wireframe = !this.postProcessing;
	}
}
