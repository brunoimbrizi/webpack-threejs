import * as THREE from 'three';
import glslify from 'glslify';
import AsyncPreloader from 'async-preloader';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class WebGLView {

	constructor(app) {
		this.app = app;

		this.initThree();
		this.initGrid();
		this.initObject();
		this.initControls();
	}

	initThree() {
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		this.clock = new THREE.Clock();
	}

	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enabled = true;
	}

	initGrid() {
		const helper = new THREE.GridHelper(2000, 20);
		helper.position.y = -50;
		helper.material.opacity = 0.25;
		helper.material.transparent = true;
		this.scene.add(helper);
	}

	initObject() {
		const geometry = new THREE.IcosahedronGeometry(50, 1);

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uColor: { value: new THREE.Color(0.2, 0.2, 1) },
			},
			vertexShader: glslify(require('../../shaders/default.vert')),
			fragmentShader: glslify(require('../../shaders/default.frag')),
			wireframe: true
		});

		this.object3D = new THREE.Mesh(geometry, material);
		this.scene.add(this.object3D);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (this.controls) this.controls.update();
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize(vw, vh) {
		if (!this.renderer) return;
		this.camera.aspect = vw / vh;
		this.camera.updateProjectionMatrix();

		// this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
		// this.fovWidth = this.fovHeight * this.camera.aspect;

		this.renderer.setSize(vw, vh);
	}
}
