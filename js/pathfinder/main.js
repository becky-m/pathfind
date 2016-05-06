
(function () {
	var data = {
		canvas: null,
		graphics: null,
		grid: [],
		nodes: [],
		map: [],
		frontier: [],
		end: [],
		start: [],
		visited: [],
		lastFrame: Date.now()
	};
	
	var startPosition = null;
	
	var colour = ['green', 'yellow', 'orange', 'red'];

  	/*
	* render my text. Any messages or grid values that need to be rendered directly on the canvas.  
	*/
	function renderText(g, message, colour, font, x, y) {
		g.font = font;
		g.fillStyle = colour; 
		g.fillText(message, x, y);  
	}
  
 	/*
	* Get the x position of my click and work out which node we're working with horizontally.
	*/ 
	function getClickXPosition(e) {
		var offset = $('#pathfind').offset();
		var x = (e.pageX - offset.left) + $(window).scrollLeft();

		x = x/2; 
		var squarex = Math.floor(x/20)*20;
		
		return squarex;
	}
	
	/*
	* Get the y position of my click and work out which node we're working with vertically.
	*/
	function getClickYPosition(e) {
		var offset = $('#pathfind').offset();
		var y = (e.pageY - offset.top) + $(window).scrollLeft();

		y = y/2; 
		var squarey = Math.floor(y/20)*20;
		
		return squarey;
	}
	
	/*
	*	Message to be displayed when the player chooses an incorrect square on the grid.
	*/
	function chooseAnotherSquare() {
		$('#endText').css('display', 'none');
		$('#endNoText').css('display', 'block');		
	}
	
	/*
	* meesages to be displayed when end node is set.
	*/
	function showEndNodeMessage() {
		$('#endNoText').css('display', 'none');//hide any error message set as a result of incorrect node setting.
		$('#endText').css('display', 'none');//hide the end node addition text.
		$('#clickStart').css('display', 'block');//display the 'begin game' dialogue.
	}
	
	/*
	*	messages to be displayed when start node is set.
	*/
	function showStartNodeMessage() {
		//console.log(startPosition);
		 $('#startText').css('display', 'none');//hide the first message before start node is clicked.
		 $('#endText').css('display', 'block');	//display prompt for end node to be added to the grid.
	}
	
	/*
	* 	what should happen when I add my end node.
	*/
	function addEndToken(squarex, squarey) {
		var obj = CPlayerNodes.endInit('end', squarex, squarey, 40, 40, 'blue', false);
		data.end.push(obj);
		showEndNodeMessage();
	}
		
	/*
	* what should happen when I add my start node. 
	*/
	function addStartToken(squarex, squarey) {
		var obj = CPlayerNodes.startInit('start', squarex, squarey, 40, 40, 'yellow', false);
		data.start.push(obj);
		
		startPosition = [{'x':squarex}, {'y':squarey}];	
		showStartNodeMessage();//display the correct messages after the start node is added.
	}
	
	/*
	*	player nodes, set up the start and end nodes for the pathfinging algorithms to work with.
	*/
	function addPlayerNodes(e) {
		var squarex = getClickXPosition(e);
		var squarey = getClickYPosition(e);

		var colorArray = getSquareColor(squarex, squarey);
		
		notPassable(colorArray);
		
		if(data.start.length && !data.end.length){//If the start token exists and no end token exists then we can look at adding an end token
			if(squarex !== startPosition[0].x && squarey !== startPosition[0].y) {//the end token cannot be added to the same square as the start token. Only add it if it's a different square.
				addEndToken(squarex, squarey);
			}
			else {
				chooseAnotherSquare();//if no matches, then something is wrong, display an error message
			}
		}
		else if(!data.start.length) {
			addStartToken(squarex, squarey);//if no start token exists then we need to add it!
		}
	}
	
	function notPassable(colorArray) {
			
		console.log(colorArray);	
		
	}
	
	/*
	* Get the color of the square we are clicking on.
	*/
	function getSquareColor(squarex, squarey) {
		var arrayPosX = (squarex/20).toString();
		var arrayPosY = (squarey/20).toString();
		
		var arrayPos = parseInt(arrayPosX + arrayPosY);
		
		return imagearray[arrayPos];		
	}
	
	/*
	* set up the grid, colors, nodes etc.
	*/
	function setUpGrid() {
		//$.extend( CNode, CFrontierToken );  //CFrontierToken should inherit the basic functions of CNode.
		data.grid.push(CGrid.init(0, 0, 400, 400, 'white'));//Set up grid.
		  
		for(nodeX = 0; nodeX < 10; nodeX++) {   //Set up nodes.
		    multiply = nodeX * 10; 
		    for(nodeY = 0; nodeY < 10; nodeY++) { 
		        trueColor = false;
		        nodeVal = nodeY+multiply; 
		
		        data.nodes.push(CNode.init(nodeVal, nodeX*20, nodeY*20, 40, 40, trueColor, false));
		
		    }
		}		
	}

	/*
	*	do all of my rendering here. 
	*/
	function loop(g) {
		//I need to set up a consistent animation for the node animation loops.
		now = Date.now();
		dt = (now - data.lastFrame) / 1000.0;
		data.lastFrame = now;
		
		data.graphics.fillRect(0, 0, data.canvas.width, data.canvas.height);//draw my canvas!
		
		data.grid[0].render(data.graphics);//draw the grid.
		  
		 //draw my grid nodes (these are the grid elements that load my maps and display the 'terrain'.
		for (i = 0; i < data.nodes.length; ++i) {
		    data.nodes[i].render(data.graphics);
		}
		
		//render my start node.
		if(data.start.length){
			data.start[0].render(data.graphics);
		}
		
		//render my end node.
		if(data.end.length){
			data.end[0].render(data.graphics);
		}
		
		requestAnimationFrame(loop);//this is sorta my update method.
	}
	
	/*
	* This is where everything is basically called. 
	*/
	function init() {
		var i, flake;
		
		data.canvas = document.getElementById('pathfind');//set up my canvas.
		data.graphics = data.canvas.getContext('2d');//set the context.
		  
		setUpGrid();//set up the grid and grid nodes.
		
		data.canvas.addEventListener("click", addPlayerNodes, false);//call start and end node function. These nodes will determine from where and to where the player will perform pathfinding.
		
		loop(data.graphics);//rending gets done here.
	}
  
	init();
}) ();

