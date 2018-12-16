import EventEmitter from 'events';
import * as THREE from 'three';

export default class InteractiveControls extends EventEmitter {

	get enabled() { return this._enabled; }

	constructor(camera, el) {
		super();

		this.camera = camera;
		this.el = el || window;

		this.plane = new THREE.Plane();
		this.raycaster = new THREE.Raycaster();

		this.mouse = new THREE.Vector2();
		this.offset = new THREE.Vector3();
		this.intersection = new THREE.Vector3();
		
		this.objects = [];
		this.hovered = null;
		this.selected = null;

		this.isDown = false;

		this.enable();
	}

	enable() {
		if (this.enabled) return;
		this.addListeners();
		this._enabled = true;
	}

	disable() {
		if (!this.enabled) return;
		this.removeListeners();
		this._enabled = false;
	}

	addListeners() {
		this.handlerDown = this.onDown.bind(this);
		this.handlerMove = this.onMove.bind(this);
		this.handlerUp = this.onUp.bind(this);
		this.handlerLeave = this.onLeave.bind(this);

		this.el.addEventListener('mousedown', this.handlerDown);
		this.el.addEventListener('mousemove', this.handlerMove);
		this.el.addEventListener('mouseup', this.handlerUp);
		this.el.addEventListener('mouseleave', this.handlerLeave);
		this.el.addEventListener('touchstart', this.handlerDown);
		this.el.addEventListener('touchmove', this.handlerMove);
		this.el.addEventListener('touchend', this.handlerUp);
	}

	removeListeners() {
		this.el.removeEventListener('mousedown', this.handlerDown);
		this.el.removeEventListener('mousemove', this.handlerMove);
		this.el.removeEventListener('mouseup', this.handlerUp);
		this.el.removeEventListener('mouseleave', this.handlerLeave);
		this.el.removeEventListener('touchstart', this.handlerDown);
		this.el.removeEventListener('touchmove', this.handlerMove);
		this.el.removeEventListener('touchend', this.handlerUp);
	}

	resize() {
		if (this.el === window) {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		}
		else {
			const rect = this.el.getBoundingClientRect();
			this.width = rect.width;
			this.height = rect.height;
		}
	}

	onMove(e) {
		e.preventDefault();

		const t = (e.touches) ? e.touches[0] : e;
		const touch = { x: t.clientX, y: t.clientY };

		this.mouse.x = (touch.x / this.width) * 2 - 1;
		this.mouse.y = -(touch.y / this.height) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse, this.camera);

		/*
		// is dragging
		if (this.selected && this.isDown) {
			if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
				this.emit('interactive-drag', { object: this.selected, position: this.intersection.sub(this.offset) });
			}
			return;
		}
		*/

		const intersects = this.raycaster.intersectObjects(this.objects);

		if (intersects.length > 0) {
			const object = intersects[0].object;
			this.intersectionData = intersects[0];

			this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(this.plane.normal), object.position);

			if (this.hovered !== object) {
				this.emit('interactive-out', { object: this.hovered });
				this.emit('interactive-over', { object });
				this.hovered = object;
			}
			else {
				this.emit('interactive-move', { object, intersectionData: this.intersectionData });
			}
		}
		else {
			this.intersectionData = null;

			if (this.hovered !== null) {
				this.emit('interactive-out', { object: this.hovered });
				this.hovered = null;
			}
		}
	}

	onDown(e) {
		e.preventDefault();

		this.isDown = true;
		this.onMove(e);

		this.emit('interactive-down', { object: this.hovered, previous: this.selected, intersectionData: this.intersectionData });
		this.selected = this.hovered;

		if (this.selected) {
			if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
				this.offset.copy(this.intersection).sub(this.selected.position);
			}
		}
	}

	onUp(e) {
		e.preventDefault();

		this.isDown = false;

		this.emit('interactive-up', { object: this.hovered });
	}

	onLeave(e) {
		this.onUp(e);
		
		this.emit('interactive-out', { object: this.hovered });
		this.hovered = null;
	}
}
