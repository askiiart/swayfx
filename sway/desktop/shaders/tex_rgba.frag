precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D tex;
uniform float alpha;
uniform float dim;
uniform vec4 dim_color;

uniform vec2 size;
uniform vec2 position;
uniform float radius;
uniform bool has_titlebar;
uniform float saturation;
const vec3 saturation_weight = vec3(0.2125, 0.7154, 0.0721);

void main() {
    vec4 color = texture2D(tex, v_texcoord);
    // Saturation
    if (saturation != 1.0) {
        vec4 pixColor = texture2D(tex, v_texcoord);
        vec3 irgb = pixColor.rgb;
        vec3 target = vec3(dot(irgb, saturation_weight));
        color = vec4(mix(target, irgb, saturation), pixColor.a);
    }
    // Dimming
    gl_FragColor = mix(color, dim_color, dim) * alpha;

    if (!has_titlebar || gl_FragCoord.y - position.y > radius) {
        vec2 corner_distance = min(gl_FragCoord.xy - position, size + position - gl_FragCoord.xy);
        if (max(corner_distance.x, corner_distance.y) < radius) {
            float dist = radius - distance(corner_distance, vec2(radius));
            float smooth = smoothstep(-1.0f, 0.5f, dist);
            gl_FragColor = mix(vec4(0), gl_FragColor, smooth);
            // Discards pixels outside the curve
            if (dist < 0.0) {
                discard;
                return;
            }
        }
    }

    if (gl_FragColor.a == 0.0) {
        discard;
    }
}
