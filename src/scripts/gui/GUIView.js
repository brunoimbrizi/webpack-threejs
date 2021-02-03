import * as THREE from 'three';
import Tweakpane from 'tweakpane';
import Stats from 'stats.js';

export default class GUIView {

	constructor(app) {
		this.app = app;

		this.postProcessing = false;
		this.density = 1;
		this.optionOptions = { 'option A': 0 , 'option B': 1 };
		this.optionSelected = 0;
		this.color = '#0000FF';
		this.wireframe = true;

		this.initPane();
		// this.initStats();

		this.enable();
	}

	initPane() {
		let folder;
		
		this.pane = new Tweakpane();
		// this.pane.containerElem_.classList.add('full');

		folder = this.pane.addFolder({ title: 'Parameters' });
		folder.addInput(this, 'optionSelected', { label: 'render', options: this.optionOptions }).on('change', this.onOptionChange.bind(this));
		folder.addInput(this, 'wireframe').on('change', this.onWireframeChange.bind(this));
		folder.addInput(this, 'density', { label: 'density', min: 0, max: 4, step: 1 }).on('change', this.onDensityChange.bind(this));
		folder.addInput(this, 'color').on('change', this.onColorChange.bind(this));
	}

	initStats() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	enable() {
		this.pane.hidden = false;
		if (this.stats) this.stats.dom.style.display = '';

		if (!this.pane.containerElem_.classList.contains('full')) return;
		this.app.el.style.width = `calc(100vw - ${this.pane.containerElem_.offsetWidth}px)`;
		this.app.resize();
	}

	disable() {
		this.pane.hidden = true;
		if (this.stats) this.stats.dom.style.display = 'none';

		if (!this.pane.containerElem_.classList.contains('full')) return;
		this.app.el.style.width = ``;
		this.app.resize();
	}

	toggle() {
		if (!this.pane.hidden) this.disable();
		else this.enable();
	}

	onOptionChange(value) {
		console.log('onOptionChange', value);
	}

	onDensityChange(value) {
		const obj = this.app.webgl.object3D;
		const geometry = new THREE.IcosahedronBufferGeometry(50, value);
		const material = obj.material;

		obj.geometry.dispose();
		obj.parent.remove(obj);

		this.app.webgl.object3D = new THREE.Mesh(geometry, material);
		this.app.webgl.scene.add(this.app.webgl.object3D);
	}

	onColorChange(value) {
		this.app.webgl.object3D.material.uniforms.uColor.value.set(value);
	}

	onWireframeChange(value) {
		this.app.webgl.object3D.material.wireframe = value;
	}

}