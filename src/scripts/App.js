import WebGLView from './webgl/WebGLView';

export default class App {
	constructor() {
		// Empty constructor
	}

	init() {
		this.initWebGL();
		this.addListeners();
		this.animate();
		this.resize();
	}

	initWebGL() {
		this.webgl = new WebGLView(this);
		document.querySelector('.container').appendChild(this.webgl.renderer.domElement);
	}

	addListeners() {
		this.handlerAnimate = this.animate.bind(this);
		window.addEventListener('resize', this.resize.bind(this));
	}

	animate() {
		this.update();
		this.draw();
		this.raf = requestAnimationFrame(this.handlerAnimate);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (this.webgl) this.webgl.update();
	}

	draw() {
		if (this.webgl) this.webgl.draw();
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (this.webgl) this.webgl.resize();
	}
}
