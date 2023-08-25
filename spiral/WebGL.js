;(() => {
    "use strict";

    window.addEventListener("load", setupWebGL, false);
    let gl;
    let program;

    let params = {
        speed : 1,
    };

    async function setupWebGL(evt) {
        window.removeEventListener(evt.type, setupWebGL, false);
        if (!(gl = getRenderingContext())) return;

        let vert = document.querySelector("#vertex-shader").innerHTML;
        let frag = await getFragmentShader();
        
        program = webglUtils.createProgramFromSources(gl, [vert, frag]);
        
        window.onresize = () => {
            webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
            gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
            bindPositionAttribute(gl, program);
        };
        
        gl.useProgram(program);
        initializeAttributes(gl, program);
        bindPositionAttribute(gl, program);
    }

    async function getFragmentShader() {
        // load spiral.frag file
        return await fetch("spiral.frag").then((response) => response.text());
    }

    let buffer;
    let time = 0;
    function initializeAttributes(gl, program) {
        const timeLocation = gl.getUniformLocation(program, "u_time");

        setInterval(() => {
            time += 0.01 * params.speed;
            gl.uniform1f(timeLocation, time);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }, 10);

        const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    function bindPositionAttribute(gl, program) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,  // first triangle
            1, -1,
            -1,  1,
            -1,  1,  // second triangle
            1, -1,
            1,  1,   
        ]), gl.STATIC_DRAW);

        const positionAttributeLocation = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(
            positionAttributeLocation,
            2,          // 2 components per iteration
            gl.FLOAT,   // the data is 32bit floats
            false,      // don't normalize the data
            0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
            0,          // start at the beginning of the buffer
        );
        gl.drawArrays(
            gl.TRIANGLES,
            0,     // offset
            6,     // num vertices to process
        );
    }

    function getRenderingContext() {
        const canvas = document.querySelector("canvas");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) {
            const paragraph = document.querySelector("p");
            paragraph.textContent = "Failed. Your browser or device may not support WebGL.";
            return null;
        }
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(1.0, 0.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        return gl;
    }

    window.onmessage = (evt) => {
        if (evt.data.id == "update") {
            params = evt.data.data;
        }
    };
})();