import glslify from 'glslify';

import {
	EffectComposer,
	BrightnessContrastEffect,
	EffectPass,
	RenderPass,
	ShaderPass,
	BlendFunction,
} from 'postprocessing';

import 'three';
import 'three-examples/controls/TrackballControls';

import InteractiveControls from './controls/InteractiveControls';

export default class WebGLView {

	constructor(app) {
		this.app = app;

		this.initThree();
		this.initObject();
		this.initControls();
		this.initPostProcessing();
	}

	initThree() {
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		this.clock = new THREE.Clock();
	}

	initControls() {
		this.trackball = new THREE.TrackballControls(this.camera, this.renderer.domElement);
		this.trackball.rotateSpeed = 2.0;
		this.trackball.enabled = true;

		this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
		// this.interactive.on('interactive-down', this.onInteractiveDown.bind(this));
		// this.interactive.objects.push(this.object3D);
	}

	initObject() {
		const geometry = new THREE.IcosahedronBufferGeometry(50, 1);

		const material = new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: glslify(require('../../shaders/default.vert')),
			fragmentShader: glslify(require('../../shaders/default.frag')),
			wireframe: true
		});

		this.object3D = new THREE.Mesh(geometry, material);
		this.scene.add(this.object3D);
	}

	initPostProcessing() {
		this.composer = new EffectComposer(this.renderer);
		this.composer.enabled = true;

		const renderPass = new RenderPass(this.scene, this.camera);
		renderPass.renderToScreen = false;

		const contrastEffect = new BrightnessContrastEffect({ contrast: 1 });
		const contrastPass = new EffectPass(this.camera, contrastEffect);
		contrastPass.renderToScreen = true;
		
		this.composer.addPass(renderPass);
		this.composer.addPass(contrastPass);

		// kickstart composer
		this.composer.render(1);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		const delta = this.clock.getDelta();
		
		if (this.trackball) this.trackball.update();
	}

	draw() {
		if (this.composer && this.composer.enabled) this.composer.render();
		else this.renderer.render(this.scene, this.camera);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.renderer) return;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
		this.fovWidth = this.fovHeight * this.camera.aspect;

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.composer.setSize(window.innerWidth, window.innerHeight);

		if (this.trackball) this.trackball.handleResize();
		if (this.interactive) this.interactive.resize();
	}
}
