Patched things
* croquis.move.js - now coordinate works in relative (140703)
* croquis.js - cursor in crosshair (140703)
* croquis.js - added onchange handler for undo/redo, and onchange calls after canvas drawing(fixed pushUndo function, and push* functions for dispatchevent(onchange).)

This croquis module provides additional methods -

* addOverlayLayer(name)
* removeOverlayLayer(name)
* setOverlayLayerData(name, data)
* getOverlayLayer(name)
* getOverlayLayerContext(name)
* setScale(name)
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