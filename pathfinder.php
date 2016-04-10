<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>A* Pathfinder</title>
    <link href="http://fonts.googleapis.com/css?family=Stalemate" rel="stylesheet" type="text/css">
     <script src="js/jquery.js"></script>
    <script src="js/canvas.js"></script>
    <style>
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }
    body {
      text-align: center;
      background: black;
    }
    </style>
</head>

<body> 

<canvas id="pathfind" width="600" height="800"></canvas>
  

<script type="text/javascript">
(function () {
  var data = {
    canvas: null,
    graphics: null,
    grid: [],
    nodes: [],
    map: [],
    lastFrame: Date.now()
  };
    
    var colour = ['green', 'yellow', 'orange', 'red'];
    var map =   [
                {value:24, weight:3},
                {value:25, weight:3},
                {value:26, weight:3},
                {value:27, weight:3},
                {value:28, weight:3},
                {value:29, weight:3},
                {value:34, weight:3},
                {value:35, weight:3},
                {value:36, weight:3},
                {value:37, weight:3},
                {value:38, weight:3},
                {value:39, weight:3},
                {value:60, weight:3},
                {value:61, weight:3},
                {value:62, weight:3},
                {value:63, weight:3},
                {value:64, weight:3},
                {value:65, weight:3},
                {value:66, weight:3},
                {value:67, weight:3},
                {value:75, weight:3},
                {value:85, weight:3}
            ];   
    
    function findIfInArray(map, value) {
        isInArray = -1;
        for (var i=0;i<map.length;i++) {
            if(map[i]['value'] == value) {
                isInArray = i;
            }
        }
        return isInArray;
    }
  
    function CGrid(x, y, width, height, color) {
        return {
            render: function (g) {

            g.save();
            g.translate(x, y);

            g.beginPath(); 
            g.fillStyle = color; 
            g.fillRect(x, y, width, height); 
                
            g.fill();

            g.restore();

            }
        }
    }
    
    function CNode(nodeVal, x, y, width, height, fill) {
            internal = {
            render: function (g) {
                


            g.save();
            g.translate(x, y);

            g.beginPath(); 
         
            if(fill != -1) {
                color = colour[map[fill]['weight']];
                g.fillStyle = color; 
                g.fillRect(x, y, width, height); 
            }
            g.strokeRect(x, y, width, height);

            g.fill();
            g.fillStyle = "black";
            g.font = "8pt sans-serif";
            g.fillText(nodeVal, x+20, y+20);
            g.restore();

            }
        };
        return {
            render: internal.render
        }
 }


  function luminousity(hex, percent){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 400).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 400).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 400).toString(16)).substr(1);
    }
  
  function loop(g) {
    now = Date.now();
    dt = (now - data.lastFrame) / 1000.0;
    data.lastFrame = now;

    data.graphics.fillRect(0, 0, data.canvas.width, data.canvas.height);
  
    data.grid[0].render(data.graphics);
      
    for (i = 0; i < data.nodes.length; ++i) {
        data.nodes[i].render(data.graphics);
    }

    requestAnimationFrame(loop);
  }
  
  function renderText(g, message, colour, font, x, y) {
    g.font = font;
    g.fillStyle = colour; 
    g.fillText(message, x, y);  
  }
  
  function init() {
    var i, flake;
  
    data.canvas = document.getElementById('pathfind');
    data.graphics = data.canvas.getContext('2d');
      
      
    data.grid.push(CGrid(0, 0, 400, 400, 'white'));
      
    for(nodeX = 0; nodeX < 10; nodeX++) {   
        multiply = nodeX * 10; 
        for(nodeY = 0; nodeY < 10; nodeY++) { 
            trueColor = false;
            nodeVal = nodeY+multiply; 

            trueColor = findIfInArray(map, nodeVal);
            //console.log(trueColor);
            data.nodes.push(CNode(nodeVal, nodeX*20, nodeY*20, 40, 40, trueColor));
            //renderText(data.graphics, nodeVal, 'red', '80px Stalemate', nodeX*20, nodeY*20); 


        }
    }
      

      
    loop(data.graphics);
      
  }
  
  init();
}) ();
</script>
</body>
</html>