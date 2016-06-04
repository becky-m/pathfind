var CPlayerNodes = {}

	CPlayerNodes.startInit = function CStartToken(nodeVal, mX, mY, mWidth, mHeight, fill, visited) {
	    var visited = false, nodeValue = nodeVal, x = mX, y = mY, width = mWidth, height = mHeight, 
	    internal = {
	        render: function (g) {
	            
	        g.save();
	        g.translate(x, y);
	
	        g.beginPath(); 
	        if(fill == false) {
	        	if(typeof imagearray != 'undefined'){
	            	color = imagearray[nodeVal];
	            }
	            else {
	                color = '#ffffff';
	            }
			}
			else {
				color = fill;
			}
			
	        g.fillStyle = color; 
	        g.fillRect(x, y, width, height); 
	        
	        g.strokeRect(x, y, width, height);
	
	        g.fill();
	        g.fillStyle = "black";
	        g.font = "8pt sans-serif";
	        g.fillText(nodeVal, x+10, y+20);
	        g.restore();
	
	        }, 
	        returnNode: function() {
	            return nodeValue; 
	        }, 
	        setVisited: function(nodeVisited) {
	            visited = nodeVisited; 
	            data.visited[nodeValue] = true; 
	
	            return visited; 
	        },
	        getVisited: function() {
	          return visited;   
	        }
	    };
	    return {
	        render: internal.render, 
	        setVisited: internal.setVisited, 
	        getVisited: internal.getVisited
	    }
	}



	CPlayerNodes.endInit = function CEndToken(nodeVal, mX, mY, mWidth, mHeight, fill, visited) {
		var visited = false, nodeValue = nodeVal, x = mX, y = mY, width = mWidth, height = mHeight, 
		internal = {
		    render: function (g) {
		        
		    g.save();
		    g.translate(x, y);
		
		    g.beginPath(); 
		    if(fill == false) {
		    	if(typeof imagearray != 'undefined'){
		        	color = imagearray[nodeVal];
		        }
		        else {
		            color = '#ffffff';
		        }
			}
			else {
				color = fill;
			}
			
		    g.fillStyle = color; 
		    g.fillRect(x, y, width, height); 
		    
		    g.strokeRect(x, y, width, height);
		
		    g.fill();
		    g.fillStyle = "white";
		    g.font = "8pt sans-serif";
		    g.fillText(nodeVal, x+10, y+20);
		    g.restore();
		
		    }, 
		    returnNode: function() {
		        return nodeValue; 
		    }, 
		    setVisited: function(nodeVisited) {
		        visited = nodeVisited; 
		        data.visited[nodeValue] = true; 
		
		        return visited; 
		    },
		    getVisited: function() {
		      return visited;   
		    }
		};
		return {
		    render: internal.render, 
		    setVisited: internal.setVisited, 
		    getVisited: internal.getVisited
		}
	}
	
	
	CPlayerNodes.frontierInit = function CFrontierToken(nodeVal, mX, mY, mWidth, mHeight, fill, visited) {
		var visited = false, nodeValue = nodeVal, x = mX, y = mY, width = mWidth, height = mHeight, 
		internal = {
		    render: function (g) {
		        
		    g.save();
		    g.translate(x, y);
		
		    g.beginPath(); 

				color = fill;
			
			
		    g.fillStyle = color; 
		    g.fillRect(x, y, width, height); 
		    
		    g.strokeRect(x, y, width, height);
		
		    g.fill();
		    g.fillStyle = "black";
		    g.font = "8pt sans-serif";
		    g.fillText(nodeVal, x+15, y+20);
		    g.restore();
		
		    }, 
		    returnNode: function() {
		        return nodeValue; 
		    }, 
		    setVisited: function(nodeVisited) {
		        visited = nodeVisited; 
		        data.visited[nodeValue] = true; 
		
		        return visited; 
		    },
		    getVisited: function() {
		      return visited;   
		    }
		};
		return {
		    render: internal.render, 
		    setVisited: internal.setVisited, 
		    getVisited: internal.getVisited
		}
	}
	
	CPlayerNodes.pathInit = function CPathToken(nodeVal, previousX, previousY, mX, mY, mWidth, mHeight, fill, visited) {
		var visited = false, nodeValue = nodeVal, x = mX, y = mY, width = mWidth, height = mHeight, 
		internal = {
		    render: function (g) {
		        
		    g.save();
		    g.translate(x, y);
		
		    g.beginPath(); 

				color = fill;
			
			
		    g.fillStyle = 'black'; 

		    if(previousY == mY) {
				g.fillRect(previousX, y+(height/2), width, 2); 
				g.strokeRect(previousX, y+(height/2), width, 2);	 
		    }
		    else {
			    //5 0 100 4 0 80
			    g.fillRect(x+(width/2), previousY, 2, height); 
			    g.strokeRect(x+(width/2), previousY, 2, height);	
		    }
		    
		    g.restore();
		
		    }, 
		    returnNode: function() {
		        return nodeValue; 
		    }, 
		    setVisited: function(nodeVisited) {
		        visited = nodeVisited; 
		        data.visited[nodeValue] = true; 
		
		        return visited; 
		    },
		    getVisited: function() {
		      return visited;   
		    }
		};
		return {
		    render: internal.render, 
		    setVisited: internal.setVisited, 
		    getVisited: internal.getVisited
		}
	}