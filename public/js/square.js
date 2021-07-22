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
	
	const canvas = document.querySelector( "#glcanvas" );

	const gl = canvas.getContext( "webgl" );

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
			translationY += 0.5;
		}
		else if ( 83 === event.keyCode )
		{
			translationY -= 0.5;
		}
		else if ( 68 === event.keyCode )
		{
			translationX += 0.5;
		}
		else if ( 65 === event.keyCode )
		{
			translationX -= 0.5;
		}
		else if ( 187 === event.keyCode )
		{
			event.preventDefault();
			/* translationZ -= 0.5; */
			Sx -= 0.1, Sy -= 0.1, Sz -= 0.1;
		}
		else if ( 189 === event.keyCode )
		{
			event.preventDefault();
			/* translationZ += 0.5; */
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
		if (document.getElementById('glcanvas').contains(e.target)){
		  this.addEventListener( "keydown", KeyDown, false );
		  this.document.getElementById("1").classList.add("active");
		} else{
			// Clicked outside the box
			this.removeEventListener( "keydown", KeyDown, false );
			this.document.getElementById("1").classList.remove("active");
		}
	});




	/*
	******************************************
	**********KEYBOARD DETECTION END**********
	******************************************
	*/

	var vertices = [
		-0.5,0.5,0.0,
		-0.5,-0.5,0.0,
		0.5,-0.5,0.0,
		0.5,0.5,0.0 
	 ];

	indices = [3,2,1,3,1,0];



	// Create an empty buffer object to store vertex buffer
	var vertex_buffer = gl.createBuffer();

	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

	// Pass the vertex data to the buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	// Unbind the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// Create an empty buffer object to store Index buffer
	var Index_Buffer = gl.createBuffer();

	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

	// Pass the vertex data to the buffer
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	// Unbind the buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


	var vertCode = 
	[
		'attribute vec3 coordinates;',
		'precision mediump float;',
		'attribute vec3 position;',
		'uniform mat4 Pmatrix;',
		'uniform mat4 Vmatrix;',
		'uniform mat4 Mmatrix;',
		'attribute vec2 textureCoord;',
		'varying vec2 vTextureCoord;',
		'uniform vec3 translation;',
		'uniform mat4 u_xformMatrix;',
		'void main()',
		'{',
			'vTextureCoord = textureCoord;',
			' gl_Position = (Pmatrix * Vmatrix * Mmatrix * vec4(coordinates + translation, u_xformMatrix*1.0));',
			/* 'gl_Position = (Pmatrix * Vmatrix * Mmatrix * vec4(position, u_xformMatrix*1.0) + vec4(vec3(translation.x, translation.y, 0.0), - translation.z));', */
		'}'
	].join( '\n' );

	// Create a vertex shader object
	var vertShader = gl.createShader(gl.VERTEX_SHADER);

	// Attach vertex shader source code
	gl.shaderSource(vertShader, vertCode);

	// Compile the vertex shader
	gl.compileShader(vertShader);

	var fragCode =
	[
		'precision mediump float;',
		'void main()',
		'{',
			' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);',
		'}'
	].join( '\n' );

	 // Create fragment shader object 
	 var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

	 // Attach fragment shader source code
	 gl.shaderSource(fragShader, fragCode);

	 // Compile the fragmentt shader
	 gl.compileShader(fragShader);

	 // Create a shader program object to
	 // store the combined shader program
	 var shaderProgram = gl.createProgram();

	 // Attach a vertex shader
	 gl.attachShader(shaderProgram, vertShader);

	 // Attach a fragment shader
	 gl.attachShader(shaderProgram, fragShader);

	 // Link both the programs
	 gl.linkProgram(shaderProgram);
	
	
	/* ===========Associating shaders to buffer objects============*/
   
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

	// Bind index buffer object
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer); 
 
	var coordinatesVar = gl.getAttribLocation(shaderProgram, "coordinates");
	gl.vertexAttribPointer(coordinatesVar, 3, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(coordinatesVar); 
	
	/*===========associating attributes to vertex shader ============*/
 
	var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
	var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
	var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
 
	var position = gl.getAttribLocation(shaderProgram, "position");
	gl.vertexAttribPointer(position, 3, gl.FLOAT, false,0,0) ; //position
	gl.enableVertexAttribArray(position);
	gl.useProgram( shaderProgram );
 
  
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
		
		var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
		gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
		 
		
		 /*============= Drawing the Quad ================*/

		// Clear the canvas
		gl.clearColor(0, 0, 0, 1);

		// Enable the depth test
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		
		// Set the view port
		gl.viewport(0,0,canvas.width,canvas.height);
		// Clear the color buffer bit
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


		gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
		gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
		gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

	
		//var tX = 2.0, tY = 0.0, tZ = -10.0;
		var translation = gl.getUniformLocation( shaderProgram, 'translation' );
		gl.uniform3f( translation, translationX, translationY, translationZ )

         // Draw the triangle
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);

		window.requestAnimationFrame( animate );
    }

    animate( 0.0001 ); 
}