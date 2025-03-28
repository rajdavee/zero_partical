// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;
attribute float angle;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform sampler2D uTouch;

uniform float uTransitionState;
uniform float uScatter;

varying vec2 vPUv;
varying vec2 vUv;

float random(float n) {
	return fract(sin(n) * 43758.5453123);
}

void main() {
	vUv = uv;

	// particle uv
	vec2 puv = offset.xy / uTextureSize;
	vPUv = puv;

	// pixel color
	vec4 colA = texture2D(uTexture, puv);
	float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

	// Initial random position
	vec3 scattered = vec3(
		(random(pindex) - 0.5) * uScatter,
		(random(offset.x + pindex) - 0.5) * uScatter,
		random(pindex) * uDepth * 2.0
	);

	// Logo position with subtle randomness
	vec3 centered = offset;
	centered.xy -= uTextureSize * 0.5;
	
	// Add subtle random offset based on color intensity
	float randomOffset = 2.0; // Adjust this value to control randomness (smaller = more subtle)
	centered.x += (random(pindex * 2.345) - 0.5) * randomOffset * (grey < 0.5 ? 2.0 : 1.0);
	centered.y += (random(pindex * 1.234) - 0.5) * randomOffset * (grey < 0.5 ? 2.0 : 1.0);
	centered.z += random(pindex) * uDepth;

	// Transition between scattered and centered
	vec3 displaced = mix(scattered, centered, uTransitionState);

	// Add touch interaction
	float t = texture2D(uTouch, puv).r;
	displaced.z += t * 10.0;
	displaced.x += cos(angle) * t * 10.0;
	displaced.y += sin(angle) * t * 10.0;

	// particle size
	float psize = grey * uSize;

	// final position
	vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
	mvPosition.xyz += position * psize;
	vec4 finalPosition = projectionMatrix * mvPosition;

	gl_Position = finalPosition;
}
