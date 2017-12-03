function canvasArrow(c, color, shape, shadowFlag, type) {

    var ctx = c.getContext("2d");
    var downX, downY, flag = 1;
    //save status
    var status = {
                lineArr: [],
                arrowArr: [],
                circleArr: [],
                rectArr: [],
            };
    var type = 0;

    var arrowColor = color ? color : "#eb4654";
    
    c.addEventListener("touchstart", mDown, false);
    c.addEventListener("mousedown", mDown, false);
 
    var arrowStop = document.getElementsByClassName("stopArrow");
    for (var i = 0; i < arrowStop.length; i++) {
        arrowStop[i].addEventListener("click", function() {
            c.removeEventListener("touchstart", mDown, false);
            c.removeEventListener("mousedown", mDown, false);
        }, false)
    }

    document.getElementById("delete_canvas").addEventListener("click", clear_canvas, false);

    function clear_canvas(){
  	ctx.clearRect(0, 0, c.width, c.height);
    status.arrowArr.length = 0;
    status.circleArr.length = 0;
    status.rectArr.length = 0;
    status.lineArr.length = 0;
}    

    //set type to arrow
    document.getElementById("arrow").addEventListener("click", function(){type=1;}, false);
    //set type to circle
    document.getElementById("circle").addEventListener("click", function(){type=2;}, false);
    //set type to rect
    document.getElementById("rect").addEventListener("click", function(){type=3;}, false);
    //set type to line
    document.getElementById("line").addEventListener("click", function(){type=0;}, false);

 
    //mouse leave canvas area
    function mLeave(e) {
    }
 
    function mDown(e) {
        if (e.button === 0 || e.type === "touchstart") {
            if (e.type === "mousedown") {
                c.addEventListener("mouseup", mUp, false);
                c.addEventListener("mousemove", mMove, false);
                c.addEventListener("mouseleave", mLeave, false);
                c.removeEventListener("touchstart", mDown, false);
            } else {
                c.addEventListener("touchend", mUp, false);
                c.addEventListener("touchmove", mMove, false);
                c.addEventListener("touchleave", mLeave, false);
                c.removeEventListener("mousedown", mDown, false);
            }

            var rect = e.target.getBoundingClientRect();
            if (e.type === "mousedown") {
                downX = ~~(e.clientX - rect.left);
                downY = ~~(e.clientY - rect.top);
            } else {
                downX = ~~(e.changedTouches[0].clientX - rect.left);
                downY = ~~(e.changedTouches[0].clientY - rect.top);
            }
        }
    };
 
    function mUp(e) {
        
        if (e.button === 0 || e.type === "touchend") {
            if (e.type === "mouseup") {
                c.removeEventListener("mouseup", mUp, false);
                c.removeEventListener("mousemove", mMove, false);
                c.removeEventListener("mouseleave", mLeave, false);
                c.addEventListener("touchstart", mDown, false);
            } else {
                c.removeEventListener("touchend", mUp, false);
                c.removeEventListener("touchmove", mMove, false);
                c.removeEventListener("touchleave", mLeave, false);
                c.addEventListener("mousedown", mDown, false);
            }
        }
        //save arrow draw para
       var rect = e.target.getBoundingClientRect();
       if (e.type === "mouseup") {
                    var upX = ~~(e.clientX - rect.left);
                    var upY = ~~(e.clientY - rect.top);
                } else {
                    var upX = ~~(e.changedTouches[0].clientX - rect.left);
                    var upY = ~~(e.changedTouches[0].clientY - rect.top);
                }
        var tempObj = {
                        downX: downX,
                        downY: downY,
                        upX: upX,
                        upY: upY
                    };
       if(type == 0){
           status.lineArr.push(tempObj);
       }
       else if(type == 1){
           status.arrowArr.push(tempObj);
       } 
       else if(type == 2){
           status.circleArr.push(tempObj);
       }
       else if(type == 3){
           status.rectArr.push(tempObj);
       }
   
  //     redrawAll();

    };

    function redrawAll(){

        status.arrowArr.forEach(function(val){
            drawArrow(val.downX, val.downY, val.upX, val.upY);
        }
        )

        status.circleArr.forEach(function(val){
            drawCircle(val.downX, val.downY, val.upX, val.upY);
        }
        )

        status.lineArr.forEach(function(val){
            drawLine(val.downX, val.downY, val.upX, val.upY);
        }
        )
        status.rectArr.forEach(function(val){
            drawRect(val.downX, val.downY, val.upX, val.upY);
        }
        )

    }
 
    function mMove(e) {
        if (e.buttons === 1 || e.witch === 1 || e.type === "touchmove") {
            e.preventDefault();
            if(type != 0)
                ctx.clearRect(0, 0, c.width, c.height);
            var rect = e.target.getBoundingClientRect();
            if (e.type === "mousemove") {
                var moveX = ~~(e.clientX - rect.left);
                var moveY = ~~(e.clientY - rect.top);
            } else {
                var moveX = ~~(e.changedTouches[0].clientX - rect.left);
                var moveY = ~~(e.changedTouches[0].clientY - rect.top);
            }
            redrawAll();
            if(type == 0){
                drawLine(downX, downY, moveX, moveY); 
                
                var tempObj = {
                        downX: downX,
                        downY: downY,
                        upX: moveX,
                        upY: moveY
                    };
                status.lineArr.push(tempObj);
                downX = moveX; downY = moveY;
            }
            else if(type == 1){
                drawArrow(downX, downY, moveX, moveY);
            }
            else if(type == 2){
                drawCircle(downX, downY, moveX, moveY);
            }
            else if(type == 3){
                drawRect(downX, downY, moveX, moveY);
            }
       
        };
    };

    function drawLine(dX, dY, uX, uY) {
        ctx.lineCap = 'round';
        ctx.lineWidth = 5;
        ctx.strokeStyle = arrowColor;
        ctx.beginPath();
        ctx.moveTo(dX, dY);
        ctx.lineTo(uX, uY);
        ctx.stroke();
        ctx.closePath();

    }

     function drawCircle(dX, dY, uX, uY) {
         if (dX > uX) {
             var pointX = dX - Math.abs(dX - uX) / 2;
         } else {
             var pointX = Math.abs(dX - uX) / 2 + dX;
         }
         if (dY > uY) {
             var pointY = dY - Math.abs(dY - uY) / 2;
         } else {
             var pointY = Math.abs(dY - uY) / 2 + dY;
         }
         var lineX = Math.abs(dX - uX) / 2;
         var lineY = Math.abs(dY - uY) / 2;
         ctx.beginPath();
         ctx.ellipse(pointX, pointY, lineX, lineY, 0, 0, 2 * Math.PI);
         ctx.lineWidth = 5;
         ctx.fillStyle = 'rgba(0,0,0,0)';
         ctx.strokeStyle = arrowColor;
         ctx.fill();
         ctx.stroke();
         if (!shadowFlag) {
             ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
             ctx.shadowBlur = 4;
             ctx.shadowOffsetX = -3;
             ctx.shadowOffsetY = 0;   
        }
     }
 
    function drawArrow(dX, dY, uX, uY) {
        var theta = Math.atan2(uY - dY, -uX + dX);
        var distance = Math.sqrt((uY - dY) * (uY - dY) + (-uX + dX) * (-uX + dX));
        var l = Math.min(50, distance / 2);
        if (!shape) {
            ctx.beginPath();
            ctx.moveTo(dX, dY);
            var w = Math.min(13, distance / 10);
            if (distance < 60) {
                var tX = uX + 5 * Math.cos(theta);
                var tY = uY - 5 * Math.sin(theta);
            } else {
                var tX = uX + 30 * Math.cos(theta);
                var tY = uY - 30 * Math.sin(theta);
            }
            ctx.lineTo(tX, tY);
            ctx.lineCap = "round";
            ctx.lineWidth = w;
            ctx.strokeStyle = arrowColor;
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.fillStyle = arrowColor;
        ctx.moveTo(uX, uY);
        ctx.lineTo(uX + l * Math.cos(theta + (Math.PI / 8)), uY - l * Math.sin(theta + (Math.PI / 8)));
        if (shape == 1) {
            ctx.lineTo(uX + (l * 0.8) * Math.cos(theta + (Math.PI / 12)), uY - (l * 0.8) * Math.sin(theta + (Math.PI / 12)));
            ctx.lineTo(dX, dY);
            ctx.lineTo(uX + (l * 0.8) * Math.cos(theta - (Math.PI / 12)), uY - (l * 0.8) * Math.sin(theta - (Math.PI / 12)));
        }
        ctx.lineTo(uX + l * Math.cos(theta - (Math.PI / 8)), uY - l * Math.sin(theta - (Math.PI / 8)));
        ctx.closePath();
        if (!shadowFlag) {
             ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
             ctx.shadowBlur = 4;
             ctx.shadowOffsetX = -3;
             ctx.shadowOffsetY = 0;   
        }
        ctx.fill();
    }

    function drawRect(dX, dY, uX, uY) {
        var width  =  Math.abs(dX - uX);
        var height =  Math.abs(dY - uY);
        var realX, realY;
        var radius = 0;
        if (dX > uX) {
            realX = uX;
        } else {
            realX = dX;
        }
		if (dY > uY) {
            realY = uY;
        } else {
            realY = dY;
        }

        var x = realX;
        var y = realY;
        
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);                                                                                                                              
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        ctx.strokeStyle = arrowColor;
        ctx.lineWidth = 5;
        ctx.closePath();
        ctx.stroke();
         if (!shadowFlag) {
             ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
             ctx.shadowBlur = 4;
             ctx.shadowOffsetX = -3;
             ctx.shadowOffsetY = 0;   
        }

    }
} 

    



   
