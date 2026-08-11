/**
 * LUMORA Graphics — Decoupled WebGL 2.0 Rendering Pipeline Engine
 */

import { computeHomography } from "../graphics/matrix";
import { buildMeshVertexBuffers } from "../graphics/mesh";
import type { MeshGrid } from "../graphics/mesh";
import {
  VERTEX_SHADER_QUAD,
  VERTEX_SHADER_MESH,
  FRAGMENT_SHADER_SURFACE,
  FRAGMENT_SHADER_CALIBRATION
} from "../graphics/shaders";

export interface SurfaceRenderConfig {
  id: string;
  name: string;
  type: "rectangle" | "quad" | "triangle" | "polygon" | "mesh";
  visible: boolean;
  opacity: number;
  zIndex: number;
  corners: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
  };
  mesh?: MeshGrid;
  polygonPoints?: { x: number; y: number }[];
  effects: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    gamma: number;
    blur: number;
    opacity: number;
  };
  blendMode: "normal" | "add" | "screen" | "multiply" | "overlay" | "lighten" | "darken";
  textureElement?: HTMLVideoElement | HTMLImageElement | ImageBitmap | null;
}

export interface PipelineRenderState {
  width: number;
  height: number;
  surfaces: SurfaceRenderConfig[];
  blackout: boolean;
  whiteout: boolean;
  calibrationMode: boolean;
  calibrationPattern: number; // 0=grid, 1=crosshair, etc.
}

export class WebGLPipeline {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | null = null;

  // Shader Programs
  private quadProgram: WebGLProgram | null = null;
  private meshProgram: WebGLProgram | null = null;
  private calibrationProgram: WebGLProgram | null = null;

  // Buffers & Textures
  private quadVBO: WebGLBuffer | null = null;
  private meshVBOCache: Map<string, WebGLBuffer> = new Map();
  private dummyTexture: WebGLTexture | null = null;
  private textureCache: Map<string, WebGLTexture> = new Map();

  // Performance tracking
  private frameCount = 0;
  private lastFpsCheck = performance.now();
  private currentFps = 60;
  private frameTimeMs = 16.6;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initGL();
  }

  private initGL() {
    this.gl = this.canvas.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });

    if (!this.gl) {
      console.error("LUMORA WebGLPipeline: WebGL 2.0 is not supported on this graphics controller.");
      return;
    }

    const gl = this.gl;

    // Handle context loss & restoration
    this.canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      console.warn("LUMORA WebGLPipeline: WebGL context lost!");
    }, false);

    this.canvas.addEventListener("webglcontextrestored", () => {
      console.log("LUMORA WebGLPipeline: WebGL context restored! Rebuilding GPU pipeline...");
      this.initGL();
    }, false);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Build shader programs
    this.quadProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_SURFACE);
    this.meshProgram = this.createProgram(VERTEX_SHADER_MESH, FRAGMENT_SHADER_SURFACE);
    this.calibrationProgram = this.createProgram(VERTEX_SHADER_MESH, FRAGMENT_SHADER_CALIBRATION);

    // Create quad VBO (Unit square 0..1)
    this.quadVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVBO);
    // [x, y, u, v]
    const quadVertices = new Float32Array([
      0, 0, 0, 0,
      1, 0, 1, 0,
      1, 1, 1, 1,
      0, 0, 0, 0,
      1, 1, 1, 1,
      0, 1, 0, 1
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    // Create 1x1 dummy solid fallback texture
    this.dummyTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.dummyTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([79, 148, 255, 255]));
  }

  private createProgram(vsSource: string, fsSource: string): WebGLProgram | null {
    if (!this.gl) return null;
    const gl = this.gl;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("Vertex Shader Error:", gl.getShaderInfoLog(vs));
      return null;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment Shader Error:", gl.getShaderInfoLog(fs));
      return null;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program Link Error:", gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  public getTextureForElement(id: string, element?: HTMLVideoElement | HTMLImageElement | ImageBitmap | null): WebGLTexture {
    if (!this.gl) return this.dummyTexture!;
    const gl = this.gl;

    if (!element) return this.dummyTexture!;

    let tex = this.textureCache.get(id);
    if (!tex) {
      tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      this.textureCache.set(id, tex);
    }

    gl.bindTexture(gl.TEXTURE_2D, tex);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element as TexImageSource);
    } catch {
      return this.dummyTexture!;
    }

    return tex;
  }

  public disposeTexture(id: string) {
    if (!this.gl) return;
    const tex = this.textureCache.get(id);
    if (tex) {
      this.gl.deleteTexture(tex);
      this.textureCache.delete(id);
    }
  }

  public purgeUnusedTextures(activeIds: Set<string>) {
    if (!this.gl) return;
    for (const [id, tex] of this.textureCache.entries()) {
      if (!activeIds.has(id)) {
        this.gl.deleteTexture(tex);
        this.textureCache.delete(id);
      }
    }
  }

  public render(state: PipelineRenderState) {
    if (!this.gl) return;
    const gl = this.gl;
    const startTime = performance.now();

    // Resize viewport if canvas dimensions change
    if (this.canvas.width !== state.width || this.canvas.height !== state.height) {
      this.canvas.width = state.width;
      this.canvas.height = state.height;
      gl.viewport(0, 0, state.width, state.height);
    }

    // 1. BLACKOUT handling
    if (state.blackout) {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.updatePerformanceMetrics(startTime);
      return;
    }

    // 2. WHITEOUT handling
    if (state.whiteout) {
      gl.clearColor(1, 1, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.updatePerformanceMetrics(startTime);
      return;
    }

    gl.clearColor(0.02, 0.02, 0.04, 1.0); // Polished Dark Background
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 3. CALIBRATION mode test patterns
    if (state.calibrationMode && this.calibrationProgram) {
      gl.useProgram(this.calibrationProgram);
      gl.uniform1i(gl.getUniformLocation(this.calibrationProgram, "u_pattern"), state.calibrationPattern);
      gl.uniform2f(gl.getUniformLocation(this.calibrationProgram, "u_resolution"), state.width, state.height);

      // Render full screen calibration quad
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVBO);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

      // Simple 2D projection matrix
      const projMat = new Float32Array([
        2 / state.width, 0, 0,
        0, -2 / state.height, 0,
        -1, 1, 1
      ]);
      gl.uniformMatrix3fv(gl.getUniformLocation(this.calibrationProgram, "u_projection"), false, projMat);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      this.updatePerformanceMetrics(startTime);
      return;
    }

    // 4. Render Surfaces ordered by zIndex
    const sortedSurfaces = [...state.surfaces]
      .filter(s => s.visible)
      .sort((a, b) => a.zIndex - b.zIndex);

    // Orthographic projection matrix mapping (0..width, 0..height) to clip space (-1..1)
    const projMat = new Float32Array([
      2 / state.width, 0, 0,
      0, -2 / state.height, 0,
      -1, 1, 1
    ]);

    for (const surface of sortedSurfaces) {
      this.applyBlendMode(surface.blendMode);

      if (surface.type === "mesh" && surface.mesh && this.meshProgram) {
        this.renderMeshSurface(surface, projMat);
      } else if (this.quadProgram) {
        this.renderQuadSurface(surface, projMat);
      }
    }

    this.updatePerformanceMetrics(startTime);
  }

  private renderQuadSurface(surface: SurfaceRenderConfig, projMat: Float32Array) {
    const gl = this.gl!;
    const prog = this.quadProgram!;
    gl.useProgram(prog);

    // Compute Homography matrix for quad corner pinning
    const H = computeHomography(surface.corners);

    gl.uniformMatrix3fv(gl.getUniformLocation(prog, "u_homography"), false, new Float32Array(H));
    gl.uniformMatrix3fv(gl.getUniformLocation(prog, "u_projection"), false, projMat);

    // Effects uniforms
    const fx = surface.effects;
    gl.uniform1f(gl.getUniformLocation(prog, "u_opacity"), surface.opacity * fx.opacity);
    gl.uniform1f(gl.getUniformLocation(prog, "u_brightness"), fx.brightness);
    gl.uniform1f(gl.getUniformLocation(prog, "u_contrast"), fx.contrast);
    gl.uniform1f(gl.getUniformLocation(prog, "u_saturation"), fx.saturation);
    gl.uniform1f(gl.getUniformLocation(prog, "u_hue"), fx.hue);
    gl.uniform1f(gl.getUniformLocation(prog, "u_gamma"), fx.gamma);

    // Bind texture
    const texture = this.getTextureForElement(surface.id, surface.textureElement);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(prog, "u_texture"), 0);

    // Bind quad buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVBO);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  private renderMeshSurface(surface: SurfaceRenderConfig, projMat: Float32Array) {
    const gl = this.gl!;
    const prog = this.meshProgram!;
    gl.useProgram(prog);

    const { vertices, indexCount } = buildMeshVertexBuffers(surface.mesh!);

    // Reuse persistent mesh VBO to prevent GC stutter & memory allocation inside render loop
    let meshVBO = this.meshVBOCache.get(surface.id);
    if (!meshVBO) {
      meshVBO = gl.createBuffer()!;
      this.meshVBOCache.set(surface.id, meshVBO);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, meshVBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    gl.uniformMatrix3fv(gl.getUniformLocation(prog, "u_projection"), false, projMat);

    const fx = surface.effects;
    gl.uniform1f(gl.getUniformLocation(prog, "u_opacity"), surface.opacity * fx.opacity);
    gl.uniform1f(gl.getUniformLocation(prog, "u_brightness"), fx.brightness);
    gl.uniform1f(gl.getUniformLocation(prog, "u_contrast"), fx.contrast);
    gl.uniform1f(gl.getUniformLocation(prog, "u_saturation"), fx.saturation);
    gl.uniform1f(gl.getUniformLocation(prog, "u_hue"), fx.hue);
    gl.uniform1f(gl.getUniformLocation(prog, "u_gamma"), fx.gamma);

    const texture = this.getTextureForElement(surface.id, surface.textureElement);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(prog, "u_texture"), 0);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    gl.drawArrays(gl.TRIANGLES, 0, indexCount);
  }

  private applyBlendMode(mode: SurfaceRenderConfig["blendMode"]) {
    const gl = this.gl!;
    gl.enable(gl.BLEND);
    switch (mode) {
      case "add":
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        break;
      case "screen":
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
        break;
      case "multiply":
        gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
        break;
      case "normal":
      default:
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        break;
    }
  }

  private updatePerformanceMetrics(startTime: number) {
    this.frameCount++;
    const elapsed = performance.now() - startTime;
    this.frameTimeMs = elapsed;

    const now = performance.now();
    if (now - this.lastFpsCheck >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsCheck));
      this.frameCount = 0;
      this.lastFpsCheck = now;
    }
  }

  public getPerformanceStats() {
    return {
      fps: this.currentFps,
      frameTimeMs: Number(this.frameTimeMs.toFixed(2)),
      droppedFrames: this.currentFps < 55 ? Math.max(0, 60 - this.currentFps) : 0
    };
  }

  public dispose() {
    if (!this.gl) return;
    for (const tex of this.textureCache.values()) {
      this.gl.deleteTexture(tex);
    }
    this.textureCache.clear();

    for (const buf of this.meshVBOCache.values()) {
      this.gl.deleteBuffer(buf);
    }
    this.meshVBOCache.clear();

    if (this.quadVBO) this.gl.deleteBuffer(this.quadVBO);
  }
}
