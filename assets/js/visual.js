const clearColor = [0, 0, 0, 1];

class Visual {
    init() {
        this.canvas = document.getElementById("canvas");
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        this.resize();
        this.gl.clearColor(...clearColor);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        vert_shader = new Shader(this.gl, "vertex_shader");
        frag_shader = new Shader(this.gl, "fragment_shader");

    }

    initProgram(shaders) {
        this.program = this.gl.createProgram();
        shaders.forEach(shader => {
            this.gl.attachShader(this.program, shader.shader);
        });
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error("Error linking program: ", this.gl.getProgramInfoLog(this.program));
            this.gl.deleteProgram(this.program);
            return null;
        }
        this.gl.validateProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
            

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Shader {
    constructor(gl, source) {
        this.gl = gl;
        this.type = source.includes("vertex") ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER;
        this.source = source;
        this.shader = this.gl.createShader(this.type);
        this.gl.shaderSource(this.shader, this.source);
        this.gl.compileShader(this.shader);
        if (!this.gl.getShaderParameter(this.shader, this.gl.COMPILE_STATUS)) {
            console.error("Error compiling shader: ", this.gl.getShaderInfoLog(this.shader));
        }
    }
}