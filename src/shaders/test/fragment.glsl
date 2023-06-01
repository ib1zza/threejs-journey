varying vec2 vUv;
#define PI 3.1415926535897932384626433832795

float random (vec2 st) {
        return fract(sin(dot(st.xy,  vec2(12.9898,78.233))) * 43758.5453123);
    }
    
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}


void main()
{
    float x = vUv.x;
    float y = vUv.y;

    // rgb (pattern 1)
    // gl_FragColor = vec4(x, y, 1.0 - (x - y) / 2.0, 1.0);

    // from green to red (pattern 2)
    // gl_FragColor = vec4(x,y, 0.0, 1.0);

    // from black to white (pattern 3)
    // gl_FragColor = vec4(x,x, x, 1.0);

    // float strength = vUv.x;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // from white top to black bottom (pattern 4)
    // float strength = vUv.y;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // from black top to white bottom (pattern 5)
    // float strength = 1.0 - vUv.y;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // almost white but little black on bottom (pattern 6)
    // float strength = vUv.y * 10.0;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // black lines on white bg (pattern 7)
    // float strength = mod(vUv.y * 10.0, 1.0 );

    // black lines on white bg more strength (pattern 8)
    // float strength = mod(vUv.y * 10.0, 1.0 );
    // strength = step(0.5, strength);


    // black lines on white bg more strength and more gap (pattern 9)
    // float strength = mod(vUv.y * 10.0, 1.0 );
    // strength = step(0.8, strength);

    // black lines on white bg more strength and more gap
    // but rotated from left to right (pattern 10)
    // float strength = mod(vUv.x * 10.0, 1.0 );
    // strength = step(0.8, strength);
    
    
    // grid like pattern (pattern 11)
    // float strength = mod(vUv.x * 10.0, 1.0 );
    // strength = step(0.8, strength);
    // float strength2 = mod(vUv.y * 10.0, 1.0 );
    // strength2 = step(0.8, strength2);
    // strength += strength2;

    // dot like pattern (pattern 12)

    // float strength = mod(vUv.x * 10.0, 1.0 );
    // strength = step(0.8, strength);
    // float strength2 = mod(vUv.y * 10.0, 1.0 );
    // strength2 = step(0.8, strength2);
    // strength += strength2;
    // strength = 1.0 - step(strength, 1.5);

    // or

    // float strength = mod(vUv.x * 10.0, 1.0 );
    // strength = step(0.8, strength);
    // float strength2 = mod(vUv.y * 10.0, 1.0 );
    // strength2 = step(0.8, strength2);
    // strength *= strength2;
    
    // lines like pattern (pattern 13)
    // float strength = mod(vUv.y * 10.0, 1.0 );
    // strength = step(0.8, strength);
    // float strength2 = mod(vUv.x * 10.0, 1.0 );
    // strength2 = step(0.6, strength2);
    // strength -= strength2;

    // or

    // float strength = mod(vUv.x * 10.0, 1.0 );
    // strength = step(0.4, strength);
    // float strength2 = mod(vUv.y * 10.0, 1.0 );
    // strength2 = step(0.8, strength2);
    // strength *= strength2;

    // arrows like pattern (pattern 14)
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0 ));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0 ));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0 ));
    // barY *= step(0.8, mod(vUv.x * 10.0, 1.0 ));
    // float strength = barX + barY;

    // plus like pattern (pattern 15)
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0 ));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0 ));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0 ));
    // barY *= step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0 ));
    // float strength = barX + barY;

    // from white in borders to black in the centre (pattern 16)
    // float strength = abs(vUv.x - 0.5);

     // from white in borders to black in the centre extended (pattern 17)
    // float strength = min(abs(vUv.x - 0.5),  abs(vUv.y - 0.5));

    // from white in borders to black in the centre extended (pattern 18)
    // float strength = max(abs(vUv.x - 0.5),  abs(vUv.y - 0.5));

    // from white in borders to black cube in the centre (pattern 19)
    // float strength = step(0.2, max(abs(vUv.x - 0.5),  abs(vUv.y - 0.5)));


    // from white in borders to black cube in the centre (pattern 20)
    // float strength = step(0.4, max(abs(vUv.x - 0.5),  abs(vUv.y - 0.5)));

    // or

    // float strength = step(0.45, abs(vUv.y - 0.5));
    // strength += step(0.45, abs(vUv.x - 0.5));

    // Pattern 21 black to white steps
    // float strength = floor(vUv.x * 10.0) / 10.0;
    
    // Pattern 22 black to white cubes 
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

    // Pattern 23 random noise 

    // float strength = random(vUv);
    

    // Pattern 24 random noise cubed
    // float strength = random(vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0));

    // or

    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv);

    // Pattern 25 random noise cubed and offsetted
    //  vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0);
    // float strength = random(gridUv);

    // Pattern 26 little dark and more light
    // float strength = length(vUv);

    // Pattern 27 black circle
    // float strength = length(vUv - 0.5);

    // or

    // float strength = distance(vUv, vec2(0.5, 0.5));


    // Pattern 28 prev pattern inverted
    // float strength = 1.0 - length(vUv - 0.5);

    // Pattern 29 star effect
    // float strength = 0.015 / length(vUv - 0.5);


    // Pattern 30 star effect extended
    // float strength = 0.015 / length(vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25) - 0.5);

    // Pattern 31 star effect extended

    // float strength2 = 0.015 / length(vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25) - 0.5);
    // float strength3 = 0.015 / length(vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25) - 0.5);

    // float strength = strength2 * strength3;

    // Pattern 32 star effect extended rotated
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // float strength2 = 0.015 / length(vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25) - 0.5);
    // float strength3 = 0.015 / length(vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25) - 0.5);

    // float strength = strength2 * strength3;

    // Pattern 32 big black circle at center
    // float strength = step( 0.25, abs(length(vUv - 0.5)));

    // or

    // float strength = distance(vUv, vec2(0.5));

    // Pattern 34 big black donut at center
    // float strength = abs( distance(vUv, vec2(0.5)) - 0.25);

      // Pattern 35 black circle at center
    // float strength = step(0.01, abs( distance(vUv, vec2(0.5)) - 0.25));

    // Pattern 37 waved white circle at center
    // vec2 wavedUv = vec2(vUv.x, vUv.y +  sin(vUv.x * 30.0) / 10.0 );
    // float strength = 1.0 - step(0.01, abs( distance(wavedUv, vec2(0.5)) - 0.25));

    // Pattern 38 all waved white circle at center
    // vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 30.0) / 10.0, vUv.y +  sin(vUv.x * 30.0) / 10.0 );
    // float strength = 1.0 - step(0.01, abs( distance(wavedUv, vec2(0.5)) - 0.25));

    // Pattern 39 all waved white circle extended x100
    // vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 100.0) / 10.0, vUv.y +  sin(vUv.x * 100.0) / 10.0 );
    // float strength = 1.0 - step(0.01, abs( distance(wavedUv, vec2(0.5)) - 0.25));

    // Pattern 40 angle changing
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
       
       // Pattern 41 angle changing offsetted
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;

    // Pattern 42 angle changing full circle
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = mod(angle, 0.05) * 20.0;

    // Pattern 43 
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 100.0) ;

    // Pattern 45 cool circle

    //  float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 100.0);
    // float radius = 0.25 + sinusoid * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // Pattern 46 perlin noise
    // float strength = cnoise(vUv * 10.0);

     // Pattern 47 perlin noise
    // float strength = step(0.0, cnoise(vUv * 10.0));

    // Pattern 48 perlin noise
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // Pattern 49 perlin noise sin

    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // Pattern 50 perlin noise step
    // float strength = step(0.7, sin(cnoise(vUv * 10.0) * 20.0));
    float strength = sin(cnoise(vUv * 10.0) * 20.0) + 1.0;
    

    // color there

    vec3 color1 = vec3(0.0, 0.0, 0.0);
    // vec3 color2 = vec3(0.0, 1.0, 0.0);
    vec3 uvColor = vec3(vUv.x, vUv.y, 0.5);
    vec3 mixed = mix(color1, uvColor, strength);

    gl_FragColor = vec4(mixed, 1.0);

    // strength += sinusoid;


    // gl_FragColor = vec4(strength, strength, strength, 1.0);


}