/*
 * by @lazykuna
 * provides navigator to move croquis.
 *
 */


Croquis.moveNavigator = function (croquis, element, wid, hei) {
	var DOMElement = document.createElement('div');
	DOMElement.style.setProperty('width', wid+'px');
	DOMElement.style.setProperty('height', hei+'px');
	DOMElement.style.setProperty('cursor', 'Move');
	var canvas = document.createElement('canvas');
	canvas.width = wid;
	canvas.height = hei;

	DOMElement.appendChild(canvas);
	element.appendChild(DOMElement);

	// mouse event
	function convertPosToRelative(nx, ny) {
		var r = DOMElement.getBoundingClientRect();
		return {x:nx - r.left, y:ny - r.top};
	}

	DOMElement.addEventListener('mousedown', function (e) {
		var p = convertPosToRelative(e.clientX, e.clientY);
	    navigatordown(p.x, p.y);
	    document.addEventListener('mousemove', onMouseMove);
	    document.addEventListener('mouseup', onMouseUp);
	});
	function onMouseMove(e) {
		var p = convertPosToRelative(e.clientX, e.clientY);
	    navigatormove(p.x, p.y);
	}
	function onMouseUp(e) {
		var p = convertPosToRelative(e.clientX, e.clientY);
	    navigatorup(p.x, p.y);
	    document.removeEventListener('mousemove', onMouseMove);
	    document.removeEventListener('mouseup', onMouseUp);
	}

	// touch event
	DOMElement.addEventListener('touchstart', function (e) {
		var p = convertPosToRelative(e.touches[0].pageX, e.touches[0].pageY);
	    navigatordown(p.x, p.y);
	    document.addEventListener('touchmove', onTouchMove);
	    document.addEventListener('touchend', onTouchUp);
	});
	var tx, ty;
	function onTouchMove(e) {
		var p = convertPosToRelative(e.touches[0].pageX, e.touches[0].pageY);
		tx = p.x;
		ty = p.y;
	    navigatormove(p.x, p.y);
	    e.preventDefault();
	}
	function onTouchUp(e) {
	    navigatorup(tx, ty);
	    document.removeEventListener('touchmove', onMouseMove);
	    document.removeEventListener('touchend', onMouseUp);
	}

	var size = {'width': wid, 'height': hei};
	var thumbnail = null;
	var thumbRect = null;
	var containerSize = null;
	var containerRect = null;
	var canvasSize = null;
	var scaledSize = null;	// scaled for thumbnail drawing
	var posCanvas = null;
	var sScale;
	var canvasScale;		// scale size of croquis

	// navigator part
	function draw(retrieve) {
		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// get new thumbnail, moveposition, canvassize, scale of croquis
		if (retrieve == true) {
			thumbnail = croquis.createFlattenThumbnail();
			containerSize = croquis.getContainerSize();
			canvasSize = croquis.getCanvasSize();
			canvasScale = croquis.getScale();
		}
		posCanvas = croquis.getCanvasPosition();

		// calculate fit size for thumbnail
		sScale = size.width / canvasSize.width;
		if (sScale > size.height / canvasSize.height)
			sScale = size.height / canvasSize.height;

		scaledSize = {width: canvasSize.width*sScale, height: canvasSize.height*sScale};
		thumbRect = {left: size.width/2-scaledSize.width/2, top: size.height/2-scaledSize.height/2, 
			width: scaledSize.width, height: scaledSize.height};
		var cCorrection = {width: (containerSize.width - canvasSize.width)/2*sScale,
			height: (containerSize.height - canvasSize.height)/2*sScale};
		containerRect = {left: thumbRect.left - cCorrection.width,
			top: thumbRect.top - cCorrection.height, 
			width: thumbRect.width + cCorrection.width*2,
			height: thumbRect.height + cCorrection.height*2}



		// draw thumbnail
		ctx.drawImage(thumbnail, thumbRect.left, thumbRect.top, 
			thumbRect.width, thumbRect.height);

		// draw border
		ctx.beginPath();
		ctx.lineWidth="1";
		ctx.strokeStyle="black";
		ctx.rect(thumbRect.left, thumbRect.top, 
			thumbRect.width, thumbRect.height);
		ctx.stroke();
		ctx.closePath();

		// draw view area
		ctx.beginPath();
		ctx.lineWidth="2";
		ctx.strokeStyle="red";
		ctx.rect(containerRect.left - posCanvas.x*sScale/canvasScale, containerRect.top - posCanvas.y*sScale/canvasScale,
			containerRect.width/canvasScale, containerRect.height/canvasScale);
		ctx.stroke();
		ctx.closePath();
	}

	var sx, sy;
	var sPos;
	var isDragging = false;

	function convertCoordinateToThumb(x, y) {
		x -= thumbRect.left;
		y -= thumbRect.top;
		return {'x': x/sScale, 'y': y/sScale};
	}

	function navigatordown(x, y) {
		if (isDragging) {
			console.log("already dragging, didn't you called up event?");
			return;
		}
		isDragging = true;
		p = convertCoordinateToThumb(x, y);
		sx = p.x;
		sy = p.y;
		sPos = croquis.getCanvasPosition();
		draw(true);
	}

	function navigatormove(x, y) {
		if (isDragging) {
			// convert coordinate
			p = convertCoordinateToThumb(x, y);
			nx = (p.x - sx) - sPos.x;
			ny = (p.y - sy) - sPos.y;
			croquis.moveCanvas(-nx, -ny);
			draw();
		}
	}

	function navigatorup(x, y) {
		if (!isDragging) {
			console.log("not dragging, didn't you called down event?");
			return;
		}
		isDragging = false;
		draw();
	}

	var moveNavigator_ = function () {
		this.Invalidate = function () {
			draw(true);
		};
	};
    
    croquis.addEventListener('onchanged', function () {
    	draw(true);
    });

    croquis.addEventListener('onzoomchanged', function () {
		canvasScale = croquis.getScale();
    	draw();
    });
	
	draw(true);
	return new moveNavigator_();
}