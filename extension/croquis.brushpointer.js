/*
 * croquis.brushpointer.js
 * provides brushpointer for croquis
 * original from croquispop - @disjukr
 */


Croquis.BrushPointer = function (croquis) {
	var IEVersion;
	(function () {
	    var ua = navigator.userAgent.toLowerCase();
	    IEVersion = (ua.indexOf('msie') == -1) ?
	                Infinity : parseInt(ua.split('msie')[1]);
	})();

    croquisDOMElement = croquis.getDOMElement();
    croquisDOMElement.addEventListener('mouseover', function () {
      croquisDOMElement.addEventListener('mousemove', croquisMouseMove);
      document.body.appendChild(brushPointerContainer);
    });
    croquisDOMElement.addEventListener('mouseout', function () {
      croquisDOMElement.removeEventListener('mousemove', croquisMouseMove);
      if (brushPointerContainer.parentNode) {
        brushPointerContainer.parentNode.removeChild(brushPointerContainer);
      }
    });

	// brush pointer
	var brushPointerContainer = document.createElement('div');
	brushPointerContainer.className = 'brush-pointer';

	function croquisMouseMove(e) {
	  if (IEVersion > 10) {
	    var x = e.clientX + window.pageXOffset;
	    var y = e.clientY + window.pageYOffset;
	    brushPointerContainer.style.setProperty('position', 'absolute');
	    brushPointerContainer.style.setProperty('font-size', '0');
	    brushPointerContainer.style.setProperty('pointer-events', 'none');
	    brushPointerContainer.style.setProperty('z-index', '9999');
	    brushPointerContainer.style.setProperty('left', x + 'px');
	    brushPointerContainer.style.setProperty('top', y + 'px');
	  }
	}

	function updatePointer(brush) {
	  if (IEVersion > 10) {
	    var image = brush.getImage();
	    var threshold;
	    if (image == null)
	      threshold = 0xff;
	    else
	      threshold = 0x30;
	    var brushPointer = Croquis.createBrushPointer(
	      image, brush.getSize(), threshold, true);
	    brushPointer.style.setProperty('margin-left',
	      '-' + (brushPointer.width * 0.5) + 'px');
	    brushPointer.style.setProperty('margin-top',
	      '-' + (brushPointer.height * 0.5) + 'px');
	    brushPointerContainer.innerHTML = '';
	    brushPointerContainer.appendChild(brushPointer);
	  }
	}

	this.updatePointer = updatePointer;
}