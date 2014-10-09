
var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;
const offsetVal = 0.01;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.
    
    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    /*var vertices = [
        vec2( RNG(-1.5, -0.5), RNG(-1.5, -0.5) ),
        vec2(  RNG(-0.5, 0.5),  RNG(0.5, 1.5) ),
        vec2(  RNG(0.5, 1.5), RNG(-1.5, -0.5) )
    ];*/

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function triangle( a, b, c )
{
    points.push( a, b, b, c, c, a );
}

function divideTriangle( a, b, c, count )
{
    /*a2 = RNG(a - 0.5, a + 0.5);
    b2 = RNG(b - 0.5, b + 0.5);
    c2 = RNG(c - 0.5, c + 0.5);
    console.log(a2, b2, c2)*/

    // check for end of recursion
    
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
    
        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );
        //console.log(ab, ac, bc);

        /*ab[0] = ab[0] - RNG(0, 0.5);
        ab[1] = ab[1] + RNG(0, 0.5);
        ac[0] = ac[0] - RNG(0, 0.5);
        ac[1] = ac[1] + RNG(0, 0.5);
        bc[0] = bc[0] - RNG(0, 0.5);
        bc[1] = bc[1] + RNG(0, 0.5);*/

        /*ab[0] = ab[0] + offsetVal;
        ab[1] = ab[1] - offsetVal;
        ac[0] = ac[0] + offsetVal;
        ac[1] = ac[1] - offsetVal;
        bc[0] = bc[0] + offsetVal;
        bc[1] = bc[1] - offsetVal;
        console.log(ab, ac, bc);*/

        ab[0] = ab[0] + 0.02;
        ab[1] = ab[1] - 0.004;
        ac[0] = ac[0] + 0.01;
        ac[1] = ac[1] - 0.007;
        bc[0] = bc[0] + 0.008;
        bc[1] = bc[1] - 0.03;
        //console.log(ab, ac, bc);

        --count;

        // three new triangles
        
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length );
}

function RNG(min, max) {
    return Math.random() * (max - min) + min;
}
