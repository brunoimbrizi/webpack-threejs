// uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
	vec2 uv = vUv;
	vec4 color = vec4(0.0, 0.0, 1.0, 1.0);
	// vec4 color = texture2D(uTexture, uv);

	gl_FragColor = color;
}