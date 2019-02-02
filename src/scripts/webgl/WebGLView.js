import 'three';
import 'three-examples/controls/TrackballControls';

import 'three-examples/shaders/CopyShader';
import 'three-examples/shaders/SobelOperatorShader';

import 'three-examples/postprocessing/EffectComposer';
import 'three-examples/postprocessing/RenderPass';
import 'three-examples/postprocessing/ShaderPass';

import InteractiveControls from './controls/InteractiveControls';

const glslify = require('glslify');

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
		try {
			this.trackball = new THREE.TrackballControls(this.camera, this.renderer.domElement);
			this.trackball.rotateSpeed = 2.0;
			this.trackball.enabled = true;
		}
		catch(e) { }

		this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
		this.interactive.on('interactive-down', this.onInteractiveDown.bind(this));
		this.interactive.objects.push(this.object3D);
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
		this.composer = new THREE.EffectComposer(this.renderer);

		const renderPass = new THREE.RenderPass(this.scene, this.camera);
		// renderPass.renderToScreen = true;
		this.composer.addPass(renderPass);

		const sobelPass = new THREE.ShaderPass(THREE.SobelOperatorShader);
		sobelPass.renderToScreen = true;
		this.composer.addPass(sobelPass);
		this.sobelPass = sobelPass;
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

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.composer.setSize(window.innerWidth, window.innerHeight);
		this.sobelPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);

		if (this.trackball) this.trackball.handleResize();
		if (this.interactive) this.interactive.resize();
	}

	onInteractiveDown(e) {
		this.object3D.material.wireframe = !e.object;
	}
}
