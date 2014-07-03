Patched things
=======================

140703
-----------------------

* croquis.move.js - now coordinate works in relative
* croquis.js - cursor in crosshair
* croquis.js - added onchanged handler for undo/redo, and onchange calls after canvas drawing(fixed pushUndo, _up function, and push*, fill functions for dispatchevent(onchange).)
* croquis.js - added onzoomchanged handler.
* croquis.js - now croquis_container, croquis_element created for ease of CSS.

This croquis module provides additional methods -

* addOverlayLayer(name)
* removeOverlayLayer(name)
* setOverlayLayerData(name, data)
* getOverlayLayer(name)
* getOverlayLayerContext(name)
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

and, with croquis.mobile.js, you can use croquis even at mobile!

```javascript
var croquis = new Croquis();
Croquis.addToElement(croquis, document.body);
```

and, with croquis.move.js, you can make croquis thumbnail for move!

```javascript
var croquis = new Croquis();
Croquis.moveNavigator(croquis, document.getElementById("navigator"), 300, 200);
```

both librarys must used with new version of croquis.js commited here.

these librarys are used at [netcanvas_croquis](https://github.com/kuna/netcanvas_croquis). you may check it out for detail usage. or you may check some example *.htms included here.