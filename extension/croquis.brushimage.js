/*
 * croquis.brushes.js
 * easily initalize brushes with this library
 * by @lazykuna
 */

Croquis.BrushImage = function(croquis, brushpaths, ulelement, onChangeEvent) {
	var self = this;
	self.onChange = onChangeEvent;
	self.imgs = [];

	for (i=0; i<brushpaths.length; i++) {
		var path = brushpaths[i];
	    var brushimg = document.createElement('img');
	    if (path == null) {
	    	// TODO
	    	brushimg.className = "nobrush";
	    	brushimg.style.setProperty("display", "block");
	    	brushimg.style.setProperty("border-radius", "23px");
	    	brushimg.style.setProperty("background-color", "black");
	    } else {
	    	console.log(path);
	   		brushimg.src = path;
	    }

	    var brushele = document.createElement('li');
	    brushele.className = i;
	    brushele.addEventListener('click', function () {
	    	var i = this.className;
	    	console.log(i);
	    	var p = brushpaths[i];
	    	var img = self.imgs[i];
	    	var brush = croquis.getTool();
	    	if (p == null) {
	    		brush.setImage(null);
	    	} else {
	    		brush.setImage(img);
	    	}

			if (self.onChange != null) {
				self.onChange(p);
			}
	    });

	    self.imgs.push(brushimg);

	    brushele.appendChild(brushimg);
		ulelement.appendChild(brushele);
	}
}