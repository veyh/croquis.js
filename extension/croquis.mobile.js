/*
 * croquis extension for mobile
 * by @lazykuna
 */

Croquis.addToElement = function (croquis, element) {
	if (croquis.getDOMContainer == null) {
		element.appendChild(croquis.getDOMElement());
	} else {
		element.appendChild(croquis.getDOMContainer());
	}

	// mouse event
	element.addEventListener('mousedown', function (e) {
		var p = croquis.getRelativeContainerPosition(e.clientX, e.clientY);
	    croquis.down(p.x, p.y);
	    document.addEventListener('mousemove', onMouseMove);
	    document.addEventListener('mouseup', onMouseUp);
	});
	function onMouseMove(e) {
		var p = croquis.getRelativeContainerPosition(e.clientX, e.clientY);
	    croquis.move(p.x, p.y);
	}
	function onMouseUp(e) {
		var p = croquis.getRelativeContainerPosition(e.clientX, e.clientY);
	    croquis.up(p.x, p.y);
	    document.removeEventListener('mousemove', onMouseMove);
	    document.removeEventListener('mouseup', onMouseUp);
	}

	// touch event
	element.addEventListener('touchstart', function (e) {
		var p = croquis.getRelativeContainerPosition(e.touches[0].pageX, e.touches[0].pageY);
	    croquis.down(p.x, p.y);
	    document.addEventListener('touchmove', onTouchMove);
	    document.addEventListener('touchend', onTouchUp);
	});
	var tx, ty;
	function onTouchMove(e) {
		var p = croquis.getRelativeContainerPosition(e.touches[0].pageX, e.touches[0].pageY);
		tx = p.x;
		ty = p.y;
	    croquis.move(p.x, p.y);
	    e.preventDefault();
	}
	function onTouchUp(e) {
	    croquis.up(tx, ty);
	    document.removeEventListener('touchmove', onMouseMove);
	    document.removeEventListener('touchend', onMouseUp);
	}
};