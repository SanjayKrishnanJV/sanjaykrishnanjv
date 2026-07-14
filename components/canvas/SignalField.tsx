'use client';

import { useEffect, useRef } from 'react';

const VERTEX_SRC = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// Telemetry field: horizontal signal-trace bands (stretched noise, sliced
// into iso-lines) drifting left to right and brightening near the cursor —
// like a live readout on a monitoring console. Accent-colored, alpha-only.
const FRAGMENT_SRC = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform float uAccent[3];

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p *= 2.02;
    amp *= 0.55;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 auv = uv;
  auv.x *= uResolution.x / uResolution.y;
  vec2 amouse = uMouse;
  amouse.x *= uResolution.x / uResolution.y;

  vec2 toMouse = amouse - auv;
  float dist = length(toMouse);

  vec2 p = auv * vec2(1.6, 7.0) + vec2(uTime * 0.045, 0.0);
  p += toMouse * (0.5 / (dist * 4.0 + 0.7));

  float n = fbm(p);
  float trace = fract(n * 7.0);
  float line = smoothstep(0.0, 0.05, trace) - smoothstep(0.05, 0.11, trace);

  float vignette = smoothstep(1.0, 0.1, dist);
  float alpha = line * mix(0.05, 0.5, vignette);

  gl_FragColor = vec4(uAccent[0], uAccent[1], uAccent[2], alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

interface SignalFieldProps {
  className?: string;
  accent?: [number, number, number];
}

export function SignalField({ className, accent = [0.31, 0.82, 0.65] }: SignalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true });
    if (!gl) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SRC));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC));
    gl.linkProgram(program);
    gl.useProgram(program);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uAccent = gl.getUniformLocation(program, 'uAccent');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const mouse = { x: 0.5, y: 0.5 };
    const mouseTarget = { x: 0.5, y: 0.5 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = canvas as HTMLCanvasElement;
      canvas!.width = clientWidth * dpr;
      canvas!.height = clientHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseTarget.x = (e.clientX - rect.left) / rect.width;
      mouseTarget.y = 1.0 - (e.clientY - rect.top) / rect.height;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    gl.uniform3f(uAccent, accent[0], accent[1], accent[2]);

    let raf = 0;
    let start = performance.now();

    function frame(now: number) {
      mouse.x += (mouseTarget.x - mouse.x) * 0.06;
      mouse.y += (mouseTarget.y - mouse.y) * 0.06;
      gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      if (!reducedMotion) raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    if (reducedMotion) {
      gl.uniform1f(uTime, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      cancelAnimationFrame(raf);
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reducedMotion) {
        start = performance.now() - start;
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [accent]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
