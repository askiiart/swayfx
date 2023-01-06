precision mediump float;
varying vec4 v_color;
varying vec2 v_texcoord;

void main() {
    gl_FragColor = v_color;

    if (gl_FragColor.a == 0.0) {
        discard;
    }
}
