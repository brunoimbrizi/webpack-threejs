const glslify = require('glslify');
import 'three';
import 'three-examples/controls/TrackballControls';

import 'three-examples/shaders/CopyShader';
import 'three-examples/shaders/SobelOperatorShader';

import 'three-examples/postprocessing/EffectComposer';
import 'three-examples/postprocessing/RenderPass';
import 'three-examples/postprocessing/ShaderPass';

export default class WebGLView {

	constructor(view) {
		this.view = view;

		this.initThree();
		this.initControls();
		this.initObject();
		this.initPostProcessing();
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;

		// renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	}

	initControls() {
		this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
		this.controls.target.set(0, 0, 0);
		this.controls.rotateSpeed = 2.0;
		this.controls.zoomSpeed = 0.8;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = false;
		this.controls.dynamicDampingFactor = 0.15;
		this.controls.maxDistance = 3000;
		this.controls.enabled = true;
	}

	initObject() {
		const geometry = new THREE.IcosahedronBufferGeometry(50, 1);

		const material = new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: glslify(require('../../../shaders/default.vert')),
			fragmentShader: glslify(require('../../../shaders/default.frag')),
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
		if (this.controls) this.controls.update();
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

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.composer.setSize(window.innerWidth, window.innerHeight);
		this.sobelPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);

		if (this.controls) this.controls.handleResize();
	}
}
