This croquis module provides additional methods -

* addOverlayLayer(name)
* removeOverlayLayer(name)
* setOverlayLayerData(name, data)
* getOverlayLayer(name)
* getOverlayLayerContext(name)

so you can use overlay image without interferencing original layers.

and, with croquis.mobile.js, you can use croquis even at mobile!

'''javascript
var croquis = new Croquis();
Croquis.addToElement(croquis, document.body);
'''

these librarys are used at [netcanvas_croquis](https://github.com/kuna/netcanvas_croquis). you may check it out for detail usage.