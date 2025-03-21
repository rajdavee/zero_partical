import 'three';
import { TweenLite } from 'gsap/TweenMax';

import InteractiveControls from './controls/InteractiveControls';
import Particles from './particles/Particles';

export default class WebGLView {
	constructor(app) {
		this.app = app;

		const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 649.88 649.88"><path fill="#e94444" d="M241.94 10.86a323.79 323.79 0 00-108.64 51.78 203.38 203.38 0 0134-12.37c108.36-28.63 219.41 36 248 144.36s-36 219.41-144.35 248-219.41-36-248.05-144.35a202.28 202.28 0 01-4.75-80.5A323.31 323.31 0 0010.83 408c45.83 173.46 223.61 276.92 397.07 231.08S684.82 415.41 639 241.94 415.4-34.98 241.94 10.86z"/><path fill="#2f444e" d="M167 283.33a81.14 81.14 0 01160.28-17.82 121.82 121.82 0 10-97.37 97A81.14 81.14 0 01167 283.33z"/></svg>`;

		// Convert SVG to data URL
		this.svgPath = 'data:image/svg+xml;base64,' + btoa(svgContent);

		this.initThree();
		this.initParticles();
		this.initControls();

		// Initialize with SVG
		this.particles.init(this.svgPath);
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;

		// renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(0x000000, 1); // Set renderer background to pure black
		document.querySelector('.container').appendChild(this.renderer.domElement);

		// clock
		this.clock = new THREE.Clock(true);
	}

	initControls() {
		this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
	}

	initParticles() {
		this.particles = new Particles(this);
		this.scene.add(this.particles.container);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		const delta = this.clock.getDelta();
		if (this.particles) this.particles.update(delta);
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
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

		if (this.interactive) this.interactive.resize();
		if (this.particles) this.particles.resize();
	}
}