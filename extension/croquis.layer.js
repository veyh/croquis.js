/*
 * layer tool for croquis
 * from croquispop@disjukr
 * edited by @lazykuna
 * dependency on jquery.
 *
 * ul - li : .selected, drag-down class should be prepared to give enough effect.
 */

Croquis.Layer = function (croquis, ulelement) {
	croquis.onLayerAdded = croquisOnLayerAdded;
    croquis.onLayerRemoved = croquisOnLayerRemoved;
    croquis.onLayerSwapped = croquisOnLayerSwapped;
    croquis.onLayerSelected = croquisOnLayerSelected;
    croquis.onUpped = croquisOnUpped;
    var self = this;
	var LAYER_MIMETYPE = 'application/x-crosspop-croquis-layer';
    self.ul = $(ulelement);

	function croquisOnLayerAdded(index) {
		console.log("new layer!");
		var ul = self.ul;
	    var label = 'Layer ' + index;
		ul.prepend('<li id="layer-' + index + '" draggable="true">' +
		          '<div class="thumbnail"></div><span class="label">' + label +
		          '</span><span class="remove">Remove</span></li>');
	  	var layer = $('#layer-' + index, ul);
	  	layer.mousedown(layerMouseDown);
	  	layer.on('dragstart', function (event) {
	    	var e = event.originalEvent;
	    	e.dataTransfer.setData(LAYER_MIMETYPE, index);
	    	e.dataTransfer.effectAllowed = 'move';
	  	}).on('dragover', function (event) {
	    var e = event.originalEvent,
	        types = e.dataTransfer.types;
	    if (types.contains ?
	        types.contains(LAYER_MIMETYPE) :
	        types.indexOf(LAYER_MIMETYPE) >= 0) {
			var i = window.parseInt(e.dataTransfer.getData(LAYER_MIMETYPE));
			if (i == index) return;
			$('li', ul).removeClass('drag-up drag-down');
			$(this).addClass(index > i ? 'drag-up' : 'drag-down');
			e.preventDefault();
	    }
		}).on('drop', function (event) {
		var e = event.originalEvent,
		    draggedIndex = window.parseInt(e.dataTransfer.getData(LAYER_MIMETYPE)),
		    droppedIndex = getIndexFromLayerId(this.id);
		$('li', ul).removeClass('drag-up drag-down');
		if (draggedIndex > droppedIndex) {
			// top down
			for (var i = draggedIndex; i > droppedIndex; --i) {
				croquis.swapLayer(i, i - 1);
			}
		} else {
			// bottom up
			for (var i = draggedIndex; i < droppedIndex; ++i) {
				croquis.swapLayer(i, i + 1);
			}
	    }
	    croquis.selectLayer(droppedIndex);
	  });
	  $('#layer-' + index + ' > .label', ul).click(function () {
	    croquis.selectLayer(index);
	  });
	  $('#layer-' + index + ' > .remove', ul).click(function () {
	    croquis.removeLayer(index);
	  });
	  return index;
	};

	function croquisOnLayerRemoved(index) {
	  for (var i = index + 1; $('#layer-' + i).length > 0; ++i) {
	    $('#layer-' + (i - 1) + ' > .label').text(
	      $('#layer-' + i + ' > .label').text()
	    );
	  }
	  $('#layer-' + (--i)).remove();
	  for (--i; i >= index; --i) {
	    updateLayerThumbnail(i);
	  }
	  croquis.selectLayer(croquis.getLayerCount() - 1);
	};

	function croquisOnLayerSwapped(a, b) {
	  var spanA = $('#layer-' + a + ' > .label'),
	      spanB = $('#layer-' + b + ' > .label'),
	      aSelected = $('#layer-' + a).hasClass('selected'),
	      bSelected = $('#layer-' + b).hasClass('selected'),
	      labelA = spanA.text();
	  updateLayerThumbnail(a);
	  updateLayerThumbnail(b);
	  spanA.text(spanB.text());
	  spanB.text(labelA);
	};
	
	function croquisOnLayerSelected(index) {
	  $('aside > .layers > ul > li').each(function () {
	    var i = getIndexFromLayerId(this.id),
	        li = $(this);
	    li[i == index ? 'addClass' : 'removeClass']('selected');
	  });
	}

	function croquisOnUpped() {
		updateLayerThumbnail(croquis.getCurrentLayerIndex());
	};

	function updateLayerThumbnail(index) {
		if (index === undefined) {
			for (var i = 0, size = croquis.getLayerCount(); i < size; ++i) {
				updateLayerThumbnail(i);
			}
			return;
		}
		var thumbnail = croquis.createLayerThumbnail(index, 40, 30);
		$('#layer-' + index + ' .thumbnail').html('').append(thumbnail);
	}

	function getIndexFromLayerId(id) {
	  return window.parseInt(id.match(/^layer-(\d+)$/)[1]);
	}

	function layerMouseDown() {
	  var index = getIndexFromLayerId(this.id);
	  croquis.selectLayer(index);
	}
}
