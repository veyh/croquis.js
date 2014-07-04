Patched things
=======================

140704
-----------------------
* croquis.js - fixed important bug on overlay layer resizing
* croquis.js - fixed important bug on sortLayer() - now overlay layer won't remove

140703
-----------------------

* croquis.mobile.js - fixed some for compatibility. now coordinate works in relative.
* croquis.move.js - first commit.
* croquis.js - cursor in crosshair
* croquis.js - added onchanged handler for undo/redo, and onchange calls after canvas drawing(fixed pushUndo, _up function, and push*, fill functions for dispatchevent(onchange).)
* croquis.js - added onzoomchanged handler.
* croquis.js - now croquis_container, croquis_element created for ease of CSS.
* croquis.colorpicker.js - first commit.
* croquis.shortcutkey.js - first commit.
* croquis.layer.js - first commit.


140701
-----------------------

* croquis.js - added overlay layer function.
* croquis.mobile.js - first commit.


Additional methods
=======================

This croquis module provides additional methods -

* addOverlayLayer(name)
* removeOverlayLayer(name)
* setOverlayLayerData(name, data)
* getOverlayLayer(name)
* getOverlayLayerContext(name)
* setContainerSize(width, height)
* setContainerSizeCentered(width, height)
* setScale(scale)
* setScaleCentered(scale)
* getScale()
* getScaledCanvasSize()
* getRelativeContainerPosition(x, y)
* moveCanvas(name)
* getDOMContainer() <code>use this instead of getDOMElement!</code>
* moveCanvas(name)
* moveCanvas(name)
* ScaleCroquis() (private)
* moveCroquis() (private)

so you can use overlay image/zoom without interferencing original layers.

extensions
=======================

croquis.mobile.js
-----------------------

with croquis.mobile.js, you can use croquis even at mobile!

```javascript
var croquis = new Croquis();
Croquis.addToElement(croquis, document.body);
```

croquis.move.js
-----------------------

with croquis.move.js, you can make croquis thumbnail for move!

```javascript
var croquis = new Croquis();
Croquis.moveNavigator(croquis, document.getElementById("navigator"), 300, 200);
```

croquis.colorpicker.js
-----------------------

with croquis.colorpicker.js, you can make colorpicker for croquis!

aware dependency of HSBRect, TinyColor, jquery.

```html
<script>
var croquis = new Croquis();
Croquis.ColorPicker(croquis, 200, 200,
	document.getElementById("colorpicker"),
	document.getElementById("colorpicker-hue-slider"),
	document.getElementById("colorpicker-alpha-slider"));
</script>

...

<div>
	<div id="colorpicker"></div>
	<input id="colorpicker-hue-slider" type="range" min="0" max="360">
	<input id="colorpicker-alpha-slider" type="range" min="0" max="100" value="100">
</div>
```

croquis.shortcutkey.js
-----------------------

make some shortcutkey work in broswer, such as Ctrl+Z or Ctrl+Y.

```javascript
Croquis.ShortcutKey(croquis);
```

croquis.layer.js
-----------------------

make layer UI easily with croquis.layer.js!

```html
<script>
var croquis = new Croquis();
Croquis.Layer(croquis, document.getElementById("layerlist"));	// must called immediately after croquis created
</script>

...

<ul id="layerlist"></ul>
```

croquis.brushimage.js
-----------------------

make brush image UI easily with croquis.brushimage.js!

```html
<script>
var croquis = new Croquis();
Croquis.BrushImage(croquis,
	[null, "./brushes/1.png", "./brushes/2.png", "./brushes/3.png", "./brushes/4.png", "./brushes/5.png"],
	document.getElementById("brushimage"));
</script>
<style>
	#brushimage { margin:0; padding:0; clear:both; }
	#brushimage li { cursor:hand; float:left; display:block; width:36px; height:36px; border:1px solid #ccc; }
	#brushimage img { display:block; width: 16px; height:16px; margin:10px; }
</style>
...

<ul id="brushimage"></ul>
```

claims
=======================

both librarys must used with new version of croquis.js commited here.

these librarys are used at [netcanvas_croquis](https://github.com/kuna/netcanvas_croquis). you may check it out for detail usage. or you may check some example *.htms included here.