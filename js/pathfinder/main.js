
(function () {
	var data = {
		canvas: null,
		graphics: null,
		grid: [],
		nodes: [],
		nodeGraph: [],
		map: [],
		visited: [],
		frontier: [],
		end: [],
		start: [],
		path:[],
		visited: [],
		lastFrame: Date.now()
	};
	
	var startPosition = [];
	var endPosition = [];
	var frontierPosition = [];
	var nodeGraph = [];
	
	var finished = false;//when have we finished analysing the grid. 
	var pathBuilt = false;//a flag to set once the dataset for our path has been prepared. 
	var pathDrawn = false;//a flag to set once the path has been drawn.
	
	var squareSize = 20;
	var squareWidth = 40; 
	var squareHeight = 40;
	
	var distanceLimitation = 60; //squares cannot interact if they are three squares away from eachother in any direction. Set this here. 

	var numNodesX = 10; 
	var numNodesY = 10; 
		
	var gridWidth = squareWidth*numNodesX; //the width of the grid can be worked out by taking my square width and then multiplying that by the number of nodes I want on the X axis. The same goes for the Y axis and the grid height. 
	var gridHeight = squareHeight*numNodesY; 
	
	var gridSize = (squareSize*numNodesX) - squareSize; //the grid size is slightly different and we determine this using the square 'size'.

	
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
		var squarex = Math.floor(x/squareSize)*squareSize;
		
		return squarex;
	}
	
	/*
	* Get the y position of my click and work out which node we're working with vertically.
	*/
	function getClickYPosition(e) {
		var offset = $('#pathfind').offset();
		var y = (e.pageY - offset.top) + $(window).scrollLeft();

		y = y/2; 
		var squarey = Math.floor(y/squareSize)*squareSize;
		
		return squarey;
	}
	
	/*
	*	Message to be displayed when the player chooses an incorrect square on the grid.
	*/
	function chooseAnotherSquare() {
		$('#endText').css('display', 'none');
		$('#startText').css('display', 'none');
		$('#tooClose').css('display', 'none');
		$('#endNoText').css('display', 'block');		
	}
	
	/*
	*	Message to be displayed when the player chooses an incorrect square on the grid.
	*/
	function chooseAnotherSquareTooClose() {
		$('#endText').css('display', 'none');
		$('#startText').css('display', 'none');
		$('#endNoText').css('display', 'none');
		$('#tooClose').css('display', 'block');	
	}
	
	/*
	* meesages to be displayed when end node is set.
	*/
	function showEndNodeMessage() {
		$('#tooClose').css('display', 'none');
		$('#endNoText').css('display', 'none');//hide any error message set as a result of incorrect node setting.
		$('#endText').css('display', 'none');//hide the end node addition text.
		$('#clickStart').css('display', 'block');//display the 'begin game' dialogue.
	}
	
	/*
	*	messages to be displayed when start node is set.
	*/
	function showStartNodeMessage() {
		$('#tooClose').css('display', 'none');
		//console.log(startPosition);
		 $('#startText').css('display', 'none');//hide the first message before start node is clicked.
		 $('#endText').css('display', 'block');	//display prompt for end node to be added to the grid.
		 $('#endNoText').css('display', 'none');//hide any error message set as a result of incorrect node setting.
	}


	/*
	* 	what should happen when I add my end node.
	*/
	function addPathToken(previous, val, squarex, squarey) {
		
		var endSquare = getSquare(getEndNodeX(), getEndNodeY());
		
		if(val == endSquare) {
			pathDrawn = true;	
			
		}
		
		if(pathDrawn == false) {
			var previousCoords = getSquareFromValue(previous); 
			//console.log(previous, previousCoords.x, previousCoords.y, val, squarex, squarey);
			var obj = CPlayerNodes.pathInit(previous, previousCoords.x, previousCoords.y, squarex, squarey, squareWidth, squareHeight, '#add8e6', false);
			data.path.push(obj);
			
			setFrontierPosition(val, squarex, squarey); //set start position.
		}
	}
		
	/*
	* 	what should happen when I add my end node.
	*/
	function addFrontierToken(parent, val, squarex, squarey) {
		var obj = CPlayerNodes.frontierInit(parent, squarex, squarey, squareWidth, squareHeight, '#37bc37', false);
		data.frontier.push(obj);
		
		setFrontierPosition(val, squarex, squarey); //set start position.
	}
	
	/*
	* 	what should happen when I add my end node.
	*/
	function addEndToken(squarex, squarey) {
		var obj = CPlayerNodes.endInit('end', squarex, squarey, squareWidth, squareHeight, 'blue', false);
		data.end.push(obj);
		
		setEndPosition(squarex, squarey); //set start position.
		showEndNodeMessage();
	}
		
	/*
	* what should happen when I add my start node. 
	*/
	function addStartToken(squarex, squarey) {
		var obj = CPlayerNodes.startInit('start', squarex, squarey, squareWidth, squareHeight, 'yellow', false);
		data.start.push(obj);
		
		setStartPosition(squarex, squarey); //set start position.
		showStartNodeMessage();//display the correct messages after the start node is added.
	}
	
	/*
	*	player nodes, set up the start and end nodes for the pathfinging algorithms to work with.
	*/
	function addPlayerNodes(e) {
		var squarex = getClickXPosition(e);
		var squarey = getClickYPosition(e);

		var squareValue = getSquare(squarex, squarey);
		var squareColor = getSquareColor(squarex, squarey);
		
		var flag = notPassable(squareColor);//is the square accessible:true or inaccessible:false

		if(data.start.length && !data.end.length && flag == true){//If the start token exists and no end token exists then we can look at adding an end token
			var tooClose = notTooClose(squarex, squarey);
			if(tooClose == false) {//the end token cannot be added to the same square as the start token. Only add it if it's a different square.
				//console.log('blah');
				addEndToken(squarex, squarey);
			}
			else {
				if(tooClose == true) {
					chooseAnotherSquareTooClose();
				}
				else {
					chooseAnotherSquare();//if no matches, then something is wrong, display an error message
				}
			}
		}
		else if(!data.start.length && flag == true) {
			addStartToken(squarex, squarey);//if no start token exists then we need to add it!
		}
		
		if(flag == false) {
			chooseAnotherSquare();//if no matches, then something is wrong, display an error message	
		}
	}
	
	/*
	*The red squares are not terrain that you can trek over in normal circumstances. So they cannot be starting nodes.
	*/
	function notPassable(squareColor) {
		var	flag = true;
		if(!data.end.length) {
			if(squareColor == 'red') {
				flag = false;
			}
		}
		return flag;	
	}
	
	/*
	* The start and end nodes cannot be too close to eachother.
	*/
	function notTooClose(squarex, squarey) {
		var flag = false;
		var closeXDistance = getStartNodeX() - squarex;//get the distance on x axis.
		var closeYDistance = getStartNodeY() - squarey;//get the distance on y axis.

		//if the value after deduction is less than 0. To measure the distance just multiply it by minus 1.
		if(closeXDistance < 0) {
			closeXDistance = closeXDistance * - 1; 
		}
		
		if(closeYDistance < 0) {
			closeYDistance = closeYDistance * - 1; 
		}
		
		//now check to see if the distance between the nodes on either axis is less than 100.
		if(closeXDistance <= distanceLimitation) {
			flag = true;
		}
		
		if(flag == true) {//if true, check the other axis.
			if(closeYDistance > distanceLimitation ){
				flag = false;//if in this instance it's greater than 60 on the Y axis, it's safe to say that the other node is far enough away and the flag should be set to flase.
			}
		} 
		
		//console.log(flag);
		//console.log(closeYDistance);
		
		return flag;
	}
	
	function setStartPosition(x, y){
		startPosition['x'] =  x; 
		startPosition['y'] =  y;			
	}
	
	function setFrontierPosition(val, x, y){
		frontierPosition['x'] =  x; 
		frontierPosition['y'] =  y;			
	}
	
	
	function setEndPosition(x, y){
		endPosition['x'] =  x; 
		endPosition['y'] =  y;			
	}
	
	function getStartNodeX() {
		return startPosition['x'];	
	}
	
	function getStartNodeY() {
		return startPosition['y'];	
	}
	
	function getEndNodeX() {
		return endPosition['x'];	
	}
	
	function getEndNodeY() {
		return endPosition['y'];	
	}
	
	function getNodeGraph() {
		return nodeGraph;
	}
	
	
	function getSquare(squarex, squarey) {
		var arrayPosX = (squarex/squareSize).toString();
		var arrayPosY = (squarey/squareSize).toString();
		
		var arrayPos = parseInt(arrayPosX + arrayPosY);
		//console.log(arrayPos);
		return arrayPos;
	}
	
	function getSquareFromValue(square) {
		return nodeGraph[square];
	}
	
	/*
	* Get the color of the square we are clicking on.
	*/
	function getSquareColor(squarex, squarey) {

		var arrayPos = getSquare(squarex, squarey);
		
		return imagearray[arrayPos];		
	}
	
	/*
	* set up the grid, colors, nodes etc.
	*/
	function setUpGrid() {
		//$.extend( CNode, CFrontierToken );  //CFrontierToken should inherit the basic functions of CNode.
		data.grid.push(CGrid.init(0, 0, gridWidth, gridHeight, 'white'));//Set up grid.
		  
		for(nodeX = 0; nodeX < numNodesX; nodeX++) {   //Set up nodes.
		    multiply = nodeX * numNodesX; 
		    for(nodeY = 0; nodeY < numNodesY; nodeY++) { 
		        trueColor = false;
		        var nodeVal = nodeY+multiply; 
		        
		        //set up my walkable graph nodes. For the noew this can be a grid, later we'll make this more efficient for larger maps.
				setNodeGraph(nodeX*squareSize, nodeY*squareSize)
		        
		        data.nodes.push(CNode.init(nodeVal, nodeX*squareSize, nodeY*squareSize, squareWidth, squareHeight, trueColor, false));
		        
		        //unvisitable nodes should just be added to the visited array.
		        if(typeof imagearray != 'undefined'){
			        if(imagearray[nodeVal] == 'red') {
			        	data.visited[nodeVal] = nodeVal; 
			        }
			        else {
				        data.visited[nodeVal] = false; 
			        }
			    } else {
			    
					data.visited[nodeVal] = false; 
				}
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
	
	function animateFrontier(g) {
		//I need to set up a consistent animation for the node animation loops.
		now = Date.now();
		dt = (now - data.lastFrame) / 1000.0;
		data.lastFrame = now;
	
		//render my end node.
		if(data.frontier.length){
			for (i = 0; i < data.frontier.length; ++i) {
				data.frontier[i].render(data.graphics);
			}
		}
		//render my end node.
		if(data.path.length){
			for (i = 0; i < data.path.length; ++i) {
				data.path[i].render(data.graphics);
			}
		}

		requestAnimationFrame(animateFrontier);//this is sorta my update method.
		return true;
	}
	
	function setNodeGraph(nodeX, nodeY) {
		var current = getSquare(nodeX, nodeY); //which node am I looking at? Check the map grid sent in after the map loads.

		//set up the visible nodes in our grid of nodes. Use navigation mesh in step 2.
		if(imagearray[current] == 'green') {
			//set up my nodegraph of positions. 
        	nodeGraph[current] = {'x': nodeX, 'y': nodeY, 'weight': 1};
		}
		else if(imagearray[current] == 'orange') { 
			//set up my nodegraph of positions. 
        	nodeGraph[current] = {'x': nodeX, 'y': nodeY, 'weight': 2};
        	
		}	

		return nodeGraph;
	}
	
	function handleNeighbours(current) {
		
		var currentSquare = getSquareFromValue(current); 
		
		var currentNodeX = currentSquare.x;
		var currentNodeY = currentSquare.y;
		
		var neighbours = null;
		var neighbourNodes = [];
		
		var neighbour = getSquare(currentNodeX+squareSize, currentNodeY);
		neighbours = setNeightbourNode(currentNodeX, currentNodeY);
		
		neighbours.forEach(function(checkNeighbour) {
			if (typeof checkNeighbour !== "undefined") {
				setNeighbouringSquare(checkNeighbour, current, neighbourNodes); //for each neighbouring square we want to set the square up on the grid etc.
				foundEndNode(checkNeighbour); //always check to see if the end node has been reached. If it has, then there is no point continuing.
				
				
			}
		});
	}
	
	function setNeighbouringSquare(checkNeighbour, current, neighbourNodes) {
		if(finished == false){
			var squareValue = getSquare(checkNeighbour.x, checkNeighbour.y);//get the square value.
			//console.log(checkNeighbour);
			
			//only render if the neighbouring square has not yet 
			if(data.visited[squareValue] == false ) {
				neighbourNodes[squareValue] = checkNeighbour; 
				
				var endSquare = getSquare(getEndNodeX(), getEndNodeY());
				var startSquare = getSquare(getStartNodeX(), getStartNodeY());
				
				//we only want to draw onto squares that are not our start or end nodes, so make sure this is not our end node we are drawing onto.
				if(endSquare != squareValue && startSquare != squareValue) {
					addFrontierToken(current, squareValue, checkNeighbour.x, checkNeighbour.y);
				}
				
				if(squareValue != current) {
					//console.log(squareValue, current);
					data.visited[squareValue] = current;
				}
	
				setTimeout(function() { handleNeighbours(squareValue); },200);//delay the function call so that we can see the outcome of the pathfinding.
			}
		}		
	}
	
	function foundEndNode(checkNeighbour) {
		//if we can't find false in the array then we are finished with our search.
		if(jQuery.inArray(false, data.visited) == -1) {
			var squareValue = getSquare(checkNeighbour.x, checkNeighbour.y);//get the square value.
			
			finished = squareValue;//this is a global variable that we want to persist throughout the 'game', set it to true so we know that the path has been found.		
			//start with the end node not the last node logged.
			var endSquare = getSquare(getEndNodeX(), getEndNodeY());
			setPathNodes(endSquare);//now that we have found the final node, we should build our path.
		}			
	}
	
	function setPathNodes(finished) {
		var parent = getParent(finished); 
		setPathNode(finished, parent); 	
	}
	
	function setPathNode(previous, pathNode) {
		var startSquare = getSquare(getStartNodeX(), getStartNodeY());

		if(jQuery.inArray(pathNode, data.path) == -1) {
			//data.path.push(pathNode);
			var currentSquare = getSquareFromValue(pathNode); 
			addPathToken(previous, pathNode, currentSquare.x, currentSquare.y);
			
			if(pathNode && pathBuilt == false){
				previous = pathNode;
				var pathNode = getParent(pathNode);//for as long as we find a parent, we call this function.
				var startSquare = getSquare(getStartNodeX(), getStartNodeY());
				if(pathNode != startSquare) {					
					setPathNode(previous, pathNode); 
				}
			}
		}
	}
	
	function getParent(childNode) {
		var startSquare = getSquare(getStartNodeX(), getStartNodeY());

		var parent = data.visited[childNode]; 
		//if we've reached our start square then there's no need to carry on. 
		if(startSquare == parent) {
			pathBuilt = true;
		}
		return parent; 
	}
	
	function setNeightbourNode(x, y) {
		console.log('original: ' + getSquare(x, y), 'co-ords: ' + x, y, 'neighbours: ' + getSquare(x+squareSize, y), getSquare(x, y-squareSize), getSquare(x-squareSize, y), getSquare(x, y+squareSize));
		var neighbours = [];
		
		if(x+squareSize >= 0 && x+squareSize <= gridSize) {
			neighbours[0] = nodeGraph[getSquare(x+squareSize, y)]; //go right 160, 0
		}
		
		if(y-squareSize >= 0&& y-squareSize <= gridSize) {
			neighbours[1] = nodeGraph[getSquare(x, y-squareSize)]; //go down 140, -20
		}
		
		if(x-squareSize >= 0&& x-squareSize <= gridSize) {
			neighbours[2] = nodeGraph[getSquare(x-squareSize, y)]; //go left 120, 0
		}
		
		if(y+squareSize >= 0&& y+squareSize <= gridSize) {
			neighbours[3] = nodeGraph[getSquare(x, y+squareSize)]; //go left 0, 180
		} 
		
		return neighbours;
	}
	
	function drawPath() {
			}
	
	/*
	* Handle the pathfinding.
	*/	
	function pathfind(){
		$('#startPathfind').on('click', function() {
			//set up the walkable grid.
			var walkable = setNodeGraph();
			
			var startSquare = getSquare(getStartNodeX(), getStartNodeY());
			handleNeighbours(startSquare);
		});
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
		pathfind();
		loop(data.graphics);//rending gets done here.
		animateFrontier(data.graphics);
	}
  
	init();
}) ();

