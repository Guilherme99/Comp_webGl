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
   
   var canvas = document.querySelector('#glcanvas2');
   gl = canvas.getContext('webgl2'); 
   
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
		else if ( 187 === event.keyCode )
		{
			event.preventDefault();
			/* translationZ -= jump; */
			Sx -= 0.1, Sy -= 0.1, Sz -= 0.1;
		}
		else if ( 189 === event.keyCode )
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
      if (document.getElementById('glcanvas2').contains(e.target)){
         
         this.addEventListener( "keydown", KeyDown, false );
         this.document.getElementById("2").classList.add("active");
      } else{
         // Clicked outside the box
         this.removeEventListener( "keydown", KeyDown, false );
         this.document.getElementById("2").classList.remove("active");
      }
   });
   /*===========Defining and storing the geometry==============*/
   var vertices = [
      -1,1,0,0,
      -1,-1,0,0,
      1,-1,0,0,
   ];
      
   //Create an empty buffer object and store vertex data            
   var vertex_buffer = gl.createBuffer(); 
   
   //Create a new buffer
   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);   
   
   //bind it to the current buffer			
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); 
   
   // Pass the buffer data
   gl.bindBuffer(gl.ARRAY_BUFFER, null);  
      
   /*========================Shaders============================*/
      
   //vertex shader source code 
   var vertCode =
      'attribute vec3 position;'+
      'uniform mat4 Pmatrix;'+
      'uniform mat4 Vmatrix;'+
      'uniform mat4 Mmatrix;'+
      'attribute vec3 color;'+//the color of the point
      'varying vec3 vColor;'+
      'uniform vec4 translation;'+
      'uniform mat4 u_xformMatrix;' +
      'void main(void) {' +
            'gl_Position =  (Pmatrix*Vmatrix*Mmatrix*vec4(position, u_xformMatrix*1.))+translation;'+
      '}';
      
   //Create a vertex shader program object and compile it              
   var vertShader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(vertShader, vertCode);
   gl.compileShader(vertShader);
      
   
   //fragment shader source code
   var fragCode =
      'precision mediump float;'+
      'varying vec3 vColor;'+
      'void main(void) {' +
         '   gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
      '}';
   
   //Create a fragment shader program object and compile it            
   var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
   gl.shaderSource(fragShader, fragCode);
   gl.compileShader(fragShader);
      
   //Create and use combiened shader program
   var shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertShader);
   gl.attachShader(shaderProgram, fragShader);
   gl.linkProgram(shaderProgram);
   
   gl.useProgram(shaderProgram);
   
    
   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);    
   var coordinatesVar = gl.getAttribLocation(shaderProgram, "coordinates");
   gl.vertexAttribPointer(coordinatesVar, 4, gl.FLOAT, false, 0, 0);   
   gl.enableVertexAttribArray(coordinatesVar); /* ===========Associating shaders to buffer objects============*/
  
   
   /*===========associating attributes to vertex shader ============*/

   var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
   var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
   var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");
   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

   var position = gl.getAttribLocation(shaderProgram, "position");
   gl.vertexAttribPointer(position, 4, gl.FLOAT, false,0,0) ; //position
   gl.enableVertexAttribArray(position);
   /* gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer); */

   /* var color = gl.getAttribLocation(shaderProgram, "color");
   gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ; //color
   gl.enableVertexAttribArray(color);
   gl.useProgram(shaderProgram); */


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

      var Tx = translationX, Ty = translationY, Tz = translationZ;
      var translation = gl.getUniformLocation(shaderProgram, 'translation');
      gl.uniform4f(translation, Tx, Ty, Tz, 0.0);
      

      gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
      gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
      gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);


      gl.clearColor(0, 0, 0, 1);
      gl.enable(gl.DEPTH_TEST);
      
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0,0,canvas.width,canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      //var tX = 2.0, tY = 0.0, tZ = -10.0;
      
      window.requestAnimationFrame( animate );
   }

    animate( 0.0001 );

}