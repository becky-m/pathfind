<html lang="en">
<head>
    <meta charset="utf-8">
    <title>God Jul</title>
    <link href="http://fonts.googleapis.com/css?family=Stalemate" rel="stylesheet" type="text/css">
    <script src="javascript/js/js/jquery-1.7.2.min.js"></script>
    <script src="http://ship.wickmark.se/canvas.js"></script>
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

<canvas id="christmas-card" width="600" height="800"></canvas>
  

<script type="text/javascript">
(function () {
  var data = {
    canvas: null,
    graphics: null,
    trees: [],
    hills: [],
    snowFlakes: [],
    treeLights: [],
    lastFrame: Date.now()
  };
  
  function CSnowflake(x, y, radius, speedPerSecond, color) {
    var angle = 0,
      internal = {
      reset: function () {
        x = radius + (Math.random() * (data.canvas.width - radius * 2));
        y = -(Math.random() * 700 + 100);
        speedPerSecond = Math.random() * 100 + 30;
        angle = Math.random() * 360;
      },
      move: function (dt) {
        x += (radius * 5) * Math.cos(angle * Math.PI / 180.0) * dt;
        y += dt * speedPerSecond;
        
        if (y >= data.canvas.height + radius) {
          this.reset();
        }
        
        angle += 90 * dt;
        if (angle > 360) {
          angle = 0;
        }
      },
      render: function (g) {
        g.fillStyle = color;
        g.beginPath(); 
        g.arc(x, y, radius, 0, 2 * Math.PI, true); 
        g.fill();
        
        // depending on their position, make the flake all the more translucent!
      }
    };
    
    return {
      reset: internal.reset,
      move: internal.move,
      render: internal.render
    }
  }
  
  function CFlashingLight(x, y, radius) {
    var colors = ['blue', 'red', 'pink', 'purple', 'orange', 'yellow'],
      color = Math.floor(Math.random() * colors.length),
      lastChange = 0,
      internal = {
      render: function (g) {
        g.save();
        g.fillStyle = colors[color];
        g.beginPath(); 
        g.arc(x, y, radius, 0, 2 * Math.PI, true); 
        g.fill();
        g.restore();
      },
      flicker: function (d) {
        lastChange += d;
        
        if (lastChange > 0.5) {
          color += 1;
          if (color >= colors.length) {
            color = 0;
          }
          lastChange = 0;
        }
      }
    };
    
    return {
      render: internal.render,
      flicker: internal.flicker
    }
  }

  function CHill(x, y, px1, peak, width, height, color) {
    return {
      render: function (g) {
      
        g.save();
        g.translate(x, y);
        
          var p0X = 0; 
          var p0Y = height; 
          
          var p1X = px1; 
          var p1Y = 0 - peak; 
          
          var p2X = width; 
          var p2Y = height; 
          
          g.fillStyle = color; 
          
          g.beginPath();
          g.moveTo(p0X, p0Y);    
          g.quadraticCurveTo(p1X, p1Y, p2X, p2Y);
          g.fill(); 
          
          var snowHeight = (height / 3) * 2;
          var snowY = height; 
          var snowX = 0; 

          g.beginPath(); 
          g.fillStyle = color; 
          g.fillRect(snowX, snowY, width, height); 
          g.fill();
          
          g.restore();

      }
    }
  }
  
  function CTree(x, y, width, height, colour, snowColour) {
    var lights = [], lightsInstalled = false;

    function renderStar(g, x, y, r) {
      var p = 5, m = 0.5, s = g.fillStyle;
      
      g.fillStyle = 'yellow';
      g.save();
      g.beginPath();
      g.translate(x, y);
      g.moveTo(0, 0 - r);
      
      for (var i = 0; i < p; i++) {
        g.rotate(Math.PI / p);
        g.lineTo(0, 0 - (r * m));
        g.rotate(Math.PI / p);
        g.lineTo(0, 0 - r);
      }
      
      g.fill();
      g.restore();
      g.fillStyle = s;
    }
    
    return {
      flicker: function (d) {
        if (lights.length < 1) {
          return;
        }
        
        for (var i = 0; i < lights.length; ++i) {
          lights[i].flicker(d);
        }
      },
      render: function (g) {

        var branchDistance = Math.floor(height / 3.0),
          center = Math.floor(width / 2.0),
          branchWidth = Math.floor(width / 2.0),
          tx = center, ty, c,
          scaleFactor = width / 120.0;
                  
        g.save();
        g.translate(x, y);
        
        var percentage = (height / 230) * 100; 
        if (percentage > 96) {
          percentage = 96; 
        }
        
        g.fillStyle = luminousity(colour, percentage);
        g.beginPath();
        for (ty = height - branchDistance; ty >= 0; ty -= branchDistance * 0.5) {
          g.moveTo(tx - branchWidth, ty + branchDistance);
          
          g.quadraticCurveTo(
            tx - branchWidth * 0.3, ty + branchDistance * 0.6,
            tx, ty
          );
          
          g.lineTo(tx, ty + branchDistance);
          
          g.moveTo(tx + branchWidth, ty + branchDistance);
          g.quadraticCurveTo(
            tx + branchWidth * 0.3, ty + branchDistance * 0.6,
            tx, ty
          );
          
          if (!lightsInstalled) {
            var r = scaleFactor * 3;
            
            lights.push(CFlashingLight(tx - branchWidth + r * 0.5, ty + branchDistance - r * 0.5, r, 'red'));
            lights.push(CFlashingLight(tx + branchWidth - r * 0.5, ty + branchDistance - r * 0.5, r, 'red'));
          }
          
          g.lineTo(tx, ty + branchDistance);
          branchWidth *= 0.8;
        }
        
        g.fill();

        renderStar(g, tx, 0, scaleFactor * 10);
        
        lightsInstalled = true;
        for (c = 0; c < lights.length; ++c) {
          lights[c].render(g);
        }

        var trunkWidth = Math.floor(width / 5);
        var trunkHeight = Math.floor(height / 7); 
        var trunkX = tx - Math.floor(trunkWidth / 2);
        
        g.fillStyle = '#583827';
        g.fillRect(trunkX, height, trunkWidth, trunkHeight);   
                
        var snow0x = tx - trunkWidth/2 - (width / 6); 
        var snow0y =  height + trunkHeight + (height / 20); 
        
        var snow1x = tx; 
        var snow1y =  height + trunkHeight - (height / 13);
        
        var snow2x = tx + trunkWidth /2 + (width / 12); 
        var snow2y =  height + trunkHeight + (height / 20);
        
        g.beginPath(); 
        g.moveTo(snow0x, snow0y); 
  
        g.quadraticCurveTo(snow1x, snow1y, snow2x, snow2y);
        
        g.fillStyle = snowColour; 
        g.fill();   
        g.restore();
      }
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
  
  function loop() {
    var g = data.graphics, now, dt;
    
    now = Date.now();
    dt = (now - data.lastFrame) / 1000.0;
    data.lastFrame = now;
    
    // Create Linear Gradients
    var lingrad = g.createLinearGradient(0,0,0,data.canvas.height);
    lingrad.addColorStop(0, '#100844');
    lingrad.addColorStop(1, '#00ABEB');
    
    g.fillStyle = lingrad;
    g.fillRect(0, 0, data.canvas.width, data.canvas.height);
  
    for (var i = 0; i < 200; ++i) {
      data.snowFlakes[i].move(dt);
      data.snowFlakes[i].render(g);
    }
    
    for (var i = 0; i < data.hills.length; ++i) {
      data.hills[i].render(g);
    }
    
    for (var i = 0; i < data.trees.length; ++i) {
      data.trees[i].flicker(dt);
      data.trees[i].render(g);
    }
    
    for (var i = 200; i < data.snowFlakes.length; ++i) {
      data.snowFlakes[i].move(dt);
      data.snowFlakes[i].render(g);
    }
    
   for (var i = 0; i < data.treeLights.length; ++i) {
      data.treeLights[i].render(g);
    }
        
    renderText(g, 'Merry Christmas', 'red', '80px Stalemate', 20, 100); 
    renderText(g, 'A cute little card I made for you all!', 'red', '40px Stalemate', 60, 170);  
    renderText(g, 'Something I made using Javascript', 'red', '40px Stalemate', 60, 220); 
    renderText(g, 'Have a wonderful Christmas!!', 'red', '40px Stalemate', 60, 270); 
    renderText(g, 'Beca x', 'red', '60px Stalemate', 380, 340);  
    
    requestAnimationFrame(loop);
  }
  
  function renderText(g, message, colour, font, x, y) {
    g.font = font;
    g.fillStyle = colour; 
    g.fillText(message, x, y);  
  }
  
  function init() {
    var i, flake;
  
    data.canvas = document.getElementById('pathfinder');
    data.graphics = data.canvas.getContext('2d');
    
    for(i=0; i < 10; ++i){
      var ranX = (Math.random() * 35 + 0);
      var ranY = (Math.random() * 15 - 10);
      var treePosX = ranX * i; 
      var treePosY = 380 + ranY * i; 
      
      if(treePosY < 330 || treePosX >= 170) 
      {
        treePosY = 350; 
        treePosX = 150; 
      }
      
      data.trees.push(CTree(treePosX, treePosY, 30, 50, '#032703', '#92b5c3'));    
    }

    data.trees.push(CTree(150, 400, 70, 100, '#032703', 'white'));
    data.trees.push(CTree(50, 400, 120, 200, '#032703', 'white'));
    data.trees.push(CTree(300, 380, 50, 80, '#032703', '#d9ebf4'));
    data.trees.push(CTree(300, 450, 150, 230, '#032703', 'white'));
    data.hills.push(CHill(-200, 350, 150, 200, 900, 250, '#92b5c3'));
    data.hills.push(CHill(-200, 400, 500, 100, 900, 200, '#d9ebf4'));
    data.hills.push(CHill(-100, 400, 100, 0, 800, 200, 'white'));

    for(i = 0; i < 200; i++) {
      flake = CSnowflake(0, 0, (Math.random() * 2 + 1)/2, 100,'white');
      flake.reset();
      
      data.snowFlakes.push(flake);
    }
    
   for(i = 200; i < 300; i++) {
      flake = CSnowflake(0, 0, Math.random() * 3 + 1, 80,'white');
      flake.reset();
      
      data.snowFlakes.push(flake);
    }
    loop();
  }
  
  init();
}) ();
</script>
</body>
</html>

</code>