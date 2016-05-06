var CGrid = {}

CGrid.init = function grid(x, y, width, height, color) {
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