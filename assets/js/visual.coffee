---
---
# clear_color = [0.0, 0.0, 0.0, 1.0]

# visual_instance = new Visual()

class Visual
    constructor: ->
        return visual_instance if visual_instance?
        visual_instance = this
        return this

    init: ->
        @canvas = document.getElementById('canvas')
        @gl = @canvas.getContext('webgl') or @canvas.getContext('experimental-webgl')
        @resize()
        @gl.clearColor(clear_color[0], clear_color[1], clear_color[2], clear_color[3])
        @gl.clear(@gl.COLOR_BUFFER_BIT)

        vert_shader = new Shader(@gl, 'vert-shader')
        frag_shader = new Shader(@gl, 'frag-shader')
        @init_program([vert_glsl, frag_glsl])

        @gl.useProgram(@program)

    init_program: (shaders) ->
        @program = @gl.createProgram()
        for shader in shaders
            @gl.attachShader(@program, @create_shader(shader)) if shader?
        @gl.linkProgram(@program)
        if not @gl.getProgramParameter(@program, @gl.LINK_STATUS)
            throw new Error(@gl.getProgramInfoLog(@program))
            @gl.deleteProgram(@program)
            return null
        return @program

    resize: ->
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        @gl.viewport(0, 0, @gl.drawingBufferWidth, @gl.drawingBufferHeight);
        if @program?
            resolutionLocation = @gl.getUniformLocation(@program, "u_resolution");
            @gl.uniform2f(resolutionLocation, @gl.drawingBufferWidth, @gl.drawingBufferHeight);
    
    draw: ->
        
        @gl.clear(@gl.COLOR_BUFFER_BIT)
        @gl.drawArrays(@gl.TRIANGLES, 0, 6)


# class Renderer
#     constructor: ->
#         @canvas = document.getElementById('canvas')
#         @gl = @canvas.getContext('webgl') or @canvas.getContext('experimental-webgl')
#         @resize()
#         @gl.clearColor(clear_color[0], clear_color[1], clear_color[2], clear_color[3])
#         @gl.clear(@gl.COLOR_BUFFER_BIT)

#         vert_shader = new Shader(@gl, 'vert-shader')
#         frag_shader = new Shader(@gl, 'frag-shader')
#         @program = new Program(@gl, [vert_glsl, frag_glsl])

#         @gl.useProgram(@program)



# class Program
#     constructor: (@gl, shaders) ->
#         @program = @gl.createProgram()
#         for shader in shaders
#             @gl.attachShader(@program, @create_shader(shader)) if shader?
#         @gl.linkProgram(@program)
#         if not @gl.getProgramParameter(@program, @gl.LINK_STATUS)
#             throw new Error(@gl.getProgramInfoLog(@program))
#             @gl.deleteProgram(@program)
#             return null
#         return @program

# class Shader
#     constructor: (@gl, scriptId) ->
#         source = document.getElementById(scriptId).innerHTML
#         type = if scriptId.indexOf('vert') > -1 then @gl.VERTEX_SHADER else @gl.FRAGMENT_SHADER
#         @shader = @gl.createShader(type)
#         @gl.shaderSource(@shader, source)
#         @gl.compileShader(@shader)
#         if not @gl.getShaderParameter(@shader, @gl.COMPILE_STATUS)
#             throw new Error(@gl.getShaderInfoLog(@shader))
#             @gl.deleteShader(@shader)
#             return null
#         return @shader