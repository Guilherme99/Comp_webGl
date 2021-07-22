main( );



function NormalisedToDevice( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;

	var deviceCoord = ( coord + 1 ) * halfAxisSize;

	return deviceCoord;
}

function DeviceToNormalised( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;

	var normalisedCoord = ( coord / halfAxisSize ) - 1;

	return normalisedCoord;
}

function main( )
{
	const canvas = document.querySelector( "#glcanvas3" );

	const gl = canvas.getContext( "webgl2" );

	if ( !gl )
	{
		alert( "Unable to setup WebGL. Your browser or computer may not support it." );

		return;
	}

	/*===================scaling==========================*/
	const jump = 0.25;
	/*===================TRANSLATION==========================*/
	var translationX = 0.0;
	var translationY = 0.0;
	var translationZ = 0.0;
	var onFlag = -1;

	/*===================scaling==========================*/

	var Sx = 1.0, Sy = 1, Sz = 1.0;

	function KeyDown( event )
	{
		if ( 87 === event.keyCode )
		{
			translationY += jump;
		}
		else if ( 83 === event.keyCode )
		{
			translationY -= jump;
		}
		else if ( 68 === event.keyCode )
		{
			translationX += jump;
		}
		else if ( 65 === event.keyCode )
		{
			translationX -= jump;
		}
		else if ( 189 === event.keyCode )
		{
			event.preventDefault();
			/* translationZ -= 8jump; */
			Sx -= 0.1, Sy -= 0.1, Sz -= 0.1;
		}
		else if ( 187 === event.keyCode )
		{
			event.preventDefault();
			/* translationZ += jump; */
			Sx += 0.1, Sy += 0.1, Sz += 0.1;
		}else if(37 === event.keyCode){
			RotateY(mov_matrix, 30)
		}
		 else if(39 === event.keyCode){
			RotateY(mov_matrix, -30)
		}
		else if(38 === event.keyCode){
			RotateX(mov_matrix, 30)
		}
		else if(40 === event.keyCode){
			RotateX(mov_matrix, -30)
		 }
		 else if ( 56 === event.keyCode )
         {
             onFlag = onFlag*-1;
         }
		//console.log( event );
	}	

	window.addEventListener('click', function(e){   
		if (document.getElementById('glcanvas3').contains(e.target)){
		  // Clicked in box
		  this.addEventListener( "keydown", KeyDown, false );
		  this.document.getElementById("3").classList.add("active");
		} else{
			// Clicked outside the box
			this.removeEventListener( "keydown", KeyDown, false );
			this.document.getElementById("3").classList.remove("active");
		}
	});




	/*
	******************************************
	**********KEYBOARD DETECTION END**********
	******************************************
	*/
    const vertexShader = `#version 300 es
    precision mediump float;
	uniform mat4 Pmatrix;
	uniform mat4 Vmatrix;
	uniform mat4 Mmatrix;
    in vec2 position;
    in vec3 color;
    out vec3 vColor;
	uniform vec4 translation;
	uniform mat4 u_xformMatrix;
    void main()
    {
   	 gl_Position = u_xformMatrix * (/* Pmatrix*Vmatrix*Mmatrix* */vec4(position, 0, 1) + translation);
	vColor = color;
    }
    `;

    const fragmentShader = `#version 300 es
    precision mediump float;
    out vec4 fragColor;
    in vec3 vColor;
    void main()
    {
    fragColor = vec4(vColor, 0);
    }
    `;

    //Compile shader

    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vs, vertexShader);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(vs);
    gl.compileShader(fs);

    if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(vs));
    }

    if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(fs));
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

	
    const circleInfo = {
    radius: 0.25,
    vertices: 50,
    coords: [],
    color: []
    }

    for(i = 0; i < circleInfo.vertices; i++){
		const circumference = 2 * Math.PI * (i / circleInfo.vertices);
		const x = circleInfo.radius * Math.cos(circumference);
		const y = circleInfo.radius * Math.sin(circumference);
		circleInfo.coords.push(x, y);
		circleInfo.color.push(1, 1, 0);
    }


    var vertex_buffer = gl.createBuffer();
	var positionBuffer = gl.createBuffer();
    var colorBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleInfo.vertices), gl.STATIC_DRAW);


    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleInfo.coords), gl.STATIC_DRAW);
	
	 /* ===========Associating shaders to buffer objects============*/
   
	 gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);    
	 var coordinatesVar = gl.getAttribLocation(program, "coordinates");
	 gl.vertexAttribPointer(coordinatesVar, 2, gl.FLOAT, false, 0, 0);   
	 gl.enableVertexAttribArray(coordinatesVar); 

	var Pmatrix = gl.getUniformLocation(program, "Pmatrix");
	var Vmatrix = gl.getUniformLocation(program, "Vmatrix");
	var Mmatrix = gl.getUniformLocation(program, "Mmatrix");
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, gl.FALSE, 0, 0);
	
	/*===========associating attributes to vertex shader ============*/


	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleInfo.color), gl.STATIC_DRAW);
    
	const color = gl.getAttribLocation(program, 'color');
    gl.enableVertexAttribArray(color);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, gl.FALSE, 0, 0);


	/*========================= MATRIX ========================= */

	function get_projection(angle, a, zMin, zMax) {
		var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
		return [
			0.5/ang, 0 , 0, 0,
			0, 0.5*a/ang, 0, 0,
			0, 0, -(zMax+zMin)/(zMax-zMin), -1,
			0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
		];
	}

	var proj_matrix = get_projection(40, canvas.width/canvas.height, 1, 100);
	var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

	//translating z
	view_matrix[14] = view_matrix[14]-6; //zoom
	
	/*=======================rotation========================*/
	
	
	function RotateX( m, angle )
    {
    	var c = Math.cos( angle );
    	var s = Math.sin( angle );
    	var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    	m[1] = m[1] * c - m[2] * s;
    	m[5] = m[5] * c - m[6] * s;
    	m[9] = m[9] * c - m[10] * s;

    	m[2] = m[2] * c + mv1 * s;
    	m[6] = m[6] * c + mv5 * s;
    	m[10] = m[10] * c + mv9 * s;
    }

    function RotateY( m, angle )
    {
    	var c = Math.cos( angle );
    	var s = Math.sin( angle );
    	var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    	m[0] = c * m[0] + s * m[2];
    	m[4] = c * m[4] + s * m[6];
    	m[8] = c * m[8] + s * m[10];

    	m[2] = c * m[2] - s * mv0;
    	m[6] = c * m[6] - s * mv4;
    	m[10] = c * m[10] - s * mv8;
    }

    function RotateZ( m, angle )
    {
    	var c = Math.cos( angle );
    	var s = Math.sin( angle );
    	var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    	m[0] = c * m[0] - s * m[1];
    	m[4] = c * m[4] - s * m[5];
    	m[8] = c * m[8] - s * m[9];

    	m[1]=c * m[1] + s * mv0;
    	m[5]=c * m[5] + s * mv4;
    	m[9]=c * m[9] + s * mv8;
    }
        

	var time_old = 0;
   	var animate = function(time) {
		
		if(onFlag!=-1){
			var ms = 0.0006;
			var dt = time-time_old;
			RotateZ(mov_matrix, dt * ms);
			RotateY( mov_matrix, dt * ms );
			RotateX( mov_matrix, dt * ms );
			time_old = time; 
		}
		var xformMatrix = new Float32Array([
			Sx,   0.0,  0.0,  0.0,
			0.0,  Sy,   0.0,  0.0,
			0.0,  0.0,  Sz,   0.0,
			0.0,  0.0,  0.0,  1.0  
		]);
		
		var u_xformMatrix = gl.getUniformLocation(program, 'u_xformMatrix');
		gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
		
		var Tx = translationX, Ty = translationY, Tz = translationZ;
		var translation = gl.getUniformLocation(program, 'translation');
		gl.uniform4f(translation, Tx, Ty, Tz, 0.0);
		
		
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, circleInfo.vertices);

		window.requestAnimationFrame( animate );
   }

    animate( 0.0001 );
}