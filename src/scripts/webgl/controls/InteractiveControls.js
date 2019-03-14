import EventEmitter from 'events';
import * as THREE from 'three';

import { passiveEvent } from '../../utils/event.utils.js';

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
		this.handlerTouchStart = this.onTouchStart.bind(this);
		this.handlerTouchMove = this.onTouchMove.bind(this);
		this.handlerTouchEnd = this.onTouchEnd.bind(this);
		this.handlerMouseDown = this.onMouseDown.bind(this);
		this.handlerMouseMove = this.onMouseMove.bind(this);
		this.handlerMouseUp = this.onMouseUp.bind(this);
		this.handlerMouseLeave = this.onMouseLeave.bind(this);

		this.el.addEventListener('touchstart', this.handlerTouchStart, passiveEvent);
		this.el.addEventListener('touchmove', this.handlerTouchMove, passiveEvent);
		this.el.addEventListener('touchend', this.handlerTouchEnd, passiveEvent);

		this.el.addEventListener('mousedown', this.handlerMouseDown);
		this.el.addEventListener('mousemove', this.handlerMouseMove);
		this.el.addEventListener('mouseup', this.handlerMouseUp);
		this.el.addEventListener('mouseleave', this.handlerMouseLeave);
	}

	removeListeners() {
		this.el.removeEventListener('touchstart', this.handlerTouchStart);
		this.el.removeEventListener('touchmove', this.handlerTouchMove);
		this.el.removeEventListener('touchend', this.handlerTouchEnd);

		this.el.removeEventListener('mousedown', this.handlerMouseDown);
		this.el.removeEventListener('mousemove', this.handlerMouseMove);
		this.el.removeEventListener('mouseup', this.handlerMouseUp);
		this.el.removeEventListener('mouseleave', this.handlerMouseLeave);
	}

	resize(x, y, width, height) {
		if (x || y || width || height) {
			this.rect = { x, y, width, height };
		}
		else if (this.el === window) {
			this.rect = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
		}
		else {
			this.rect = this.el.getBoundingClientRect();
		}
	}

	onMove(e) {
		const t = (e.touches) ? e.touches[0] : e;
		const touch = { x: t.clientX, y: t.clientY };

		this.mouse.x = ((touch.x + this.rect.x) / this.rect.width) * 2 - 1;
		this.mouse.y = -((touch.y + this.rect.y) / this.rect.height) * 2 + 1;

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
		this.isDown = false;

		this.emit('interactive-up', { object: this.hovered });
	}

	onTouchStart(e) {
		this.isTouch = true;
		this.onDown(e);
	}

	onTouchMove(e) {
		this.isTouch = true;
		this.onMove(e);
	}

	onTouchEnd(e) {
		this.isTouch = true;
		this.onUp(e);
	}

	onMouseDown(e) {
		if (!this.isTouch) this.onDown(e);
	}

	onMouseMove(e) {
		if (!this.isTouch) this.onMove(e);
	}

	onMouseUp(e) {
		if (!this.isTouch) this.onUp(e);
	}

	onMouseLeave(e) {
		this.onUp(e);
		
		this.emit('interactive-out', { object: this.hovered });
		this.hovered = null;
	}
}
