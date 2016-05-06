var CNode = {}

	CNode.init = function CNode(nodeVal, mX, mY, mWidth, mHeight, fill, visited) {
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
				color = 'black';
			}
			
		    g.fillStyle = color; 
		    g.fillRect(x, y, width, height); 
		    
		    g.strokeRect(x, y, width, height);
		
		    g.fill();
		    g.fillStyle = "black";
		    g.font = "8pt sans-serif";
		    g.fillText(nodeVal, x+20, y+20);
		    g.restore();
		
		    }, 
		    setColor: function(g, color) {
		        g.fillStyle = color; 
		        g.fillRect(x, y, width, height); 
		    },
		    getX: function() {
		        return mX; 
		    },
		    getY: function() {
		        return y;     
		    },
		    getWidth: function() {
		        return width;    
		    }, 
		    getHeight: function() {
		        return height;     
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
		    getVisited: internal.getVisited, 
		    setColor: internal.setColor, 
		    getX: internal.getX, 
		    getY: internal.getY, 
		    getWidth: internal.getWidth, 
		    getHeight: internal.getHeight
		}
	}
