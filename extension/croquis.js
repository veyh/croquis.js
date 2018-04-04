/*global define*/
(function() {
  /**
   * @external HTMLElement
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement|HTMLElement}
   */

  /**
   * @external ImageData
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ImageData|ImageData}
   */

  /**
   * @external HTMLCanvasElement
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement|HTMLCanvasElement}
   */

  /**
   * @external CanvasRenderingContext2D
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D|CanvasRenderingContext2D}
   */

  /**
   * @typedef {object} Rect
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */

  /**
   * @typedef {object} Dimensions
   * @property {number} width
   * @property {number} height
   */

  /**
   * @typedef {object} Point
   * @property {number} x
   * @property {number} y
   */

  /**
   * @typedef {object} ColorData
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   * @param {string} htmlColor
   */

  /**
   * [description]
   *
   * @event Croquis#ondown
   * @this {Croquis} The Croquis instance.
   * @param {number} x
   * @param {number} y
   * @param {number} pressure
   */

  /**
   * [description]
   *
   * @event Croquis#onmove
   * @this {Croquis} The Croquis instance.
   * @param {number} x
   * @param {number} y
   * @param {number} pressure
   */

  /**
   * [description]
   *
   * @event Croquis#onup
   * @this {Croquis} The Croquis instance.
   * @param {number} x
   * @param {number} y
   * @param {number} pressure
   * @param {Rect} dirtyRect
   */

  /**
   * [description]
   *
   * @event Croquis#ontick
   * @this {Croquis} The Croquis instance.
   */

  /**
   * [description]
   *
   * @event Croquis#onchange
   * @this {Croquis} The Croquis instance.
   */

  /**
   * [description]
   *
   * @event Croquis#onchanged
   * @this {Croquis} The Croquis instance.
   */

  /**
   * Fired when the zoom (scale) of the canvas has changed.
   *
   * @event Croquis#onzoomchanged
   * @this {Croquis} The Croquis instance.
   */

  /**
   * Fired when the tool is changed.
   *
   * @event Croquis#ontool
   * @this {Croquis} The Croquis instance.
   * @param {object} tool
   */

  /**
   * Fired when the size of the canvas has changed.
   *
   * @event Croquis#oncanvassize
   * @this {Croquis} The Croquis instance.
   * @param {number} width
   * @param {number} height
   * @param {number} offsetX
   * @param {number} offsetY
   */

  /**
   * Fired when a layer has been added.
   *
   * @event Croquis#onlayeradd
   * @this {Croquis} The Croquis instance.
   * @param {number} index
   */

  /**
   * Fired when a layer has been removed.
   *
   * @event Croquis#onlayerremove
   * @this {Croquis} The Croquis instance.
   * @param {number} index
   */

  /**
   * Fired when two layers have been swapped.
   *
   * @event Croquis#onlayerswap
   * @this {Croquis} The Croquis instance.
   * @param {number} a Index of the first layer.
   * @param {number} b Index of the second layer.
   */

  /**
   * Fired when a layer has been selected.
   *
   * @event Croquis#onlayerselect
   * @this {Croquis} The Croquis instance.
   * @param {number} index
   */

  /**
   * [Croquis description]
   *
   * @class Croquis
   * @param {external:ImageData[]} imageDataList [description]
   * @param {object} properties    [description]
   */
  function Croquis(imageDataList, properties) {
    var self = this;

    if (properties != null)
      for (var property in properties)
        self[property] = properties[property];
    var domContainer = document.createElement('div');
    domContainer.id = 'croquis_container';
    domContainer.style.setProperty('user-select', 'none');
    domContainer.style.setProperty('-webkit-user-select', 'none');
    domContainer.style.setProperty('-ms-user-select', 'none');
    domContainer.style.setProperty('-moz-user-select', 'none');
    domContainer.style.setProperty('position', 'relative');
    domContainer.style.setProperty('overflow', 'hidden');
    //domContainer.style.setProperty('background-color', '#ccc');
    var domElement = document.createElement('div');
    domElement.style.clear = 'both';
    domElement.id = 'croquis_element';
    domElement.style.setProperty('user-select', 'none');
    domElement.style.setProperty('-webkit-user-select', 'none');
    domElement.style.setProperty('-ms-user-select', 'none');
    domElement.style.setProperty('-moz-user-select', 'none');
    domElement.style.setProperty('position', 'absolute');
    domElement.style.setProperty('cursor', 'Crosshair');
    domContainer.appendChild(domElement);
    var scale = 1;
    var canvasX = 0, canvasY = 0;
    var containerSize = {'width': 640, 'height': 480};

    /**
     * [getDOMContainer description]
     *
     * @alias Croquis#getDOMContainer
     * @return {external:HTMLElement} [description]
     */
    self.getDOMContainer = function () {
      return domContainer;
    };

    /**
     * [getDOMElement description]
     *
     * @alias Croquis#getDOMElement
     * @return {external:HTMLElement} [description]
     */
    self.getDOMElement = function () {
      return domElement;
    };

    function ScaleCroquis() {
      // @lazykuna; set parent size, zoom transformation too
      domElement.style.setProperty('transform', 'scale(' + scale + ')');
      domElement.style.setProperty('-webkit-transform', 'scale(' + scale + ')');
      domElement.style.setProperty('-ms-transform', 'scale(' + scale + ')');
      domElement.style.setProperty('-moz-transform', 'scale(' + scale + ')');
      domElement.style.setProperty('transform-origin', '0 0');
      domElement.style.setProperty('-webkit-transform-origin','0 0');
      domElement.style.setProperty('-ms-transform-origin', '0 0');
      domElement.style.setProperty('-moz-transform-origin', '0 0');
      //$(domElement).css('transform-origin', '0 0');
      //$(domElement).css('transform', 'scale(' + scale + ')');
      domElement.style.setProperty('left', canvasX+'px');
      domElement.style.setProperty('top', canvasY+'px');
      // @lazykuna; brush need to be transformed too ...

      dispatchEvent('onzoomchanged');
    }

    /**
     * [setScale description]
     *
     * @alias Croquis#setScale
     * @param {number} s [description]
     * @return {undefined}
     */
    self.setScale = function(s) {
      scale = s;
      ScaleCroquis();
      moveCroquis();  // must be called (to get centering)
    };

    /**
     * [setScaleCentered description]
     *
     * @alias Croquis#setScaleCentered
     * @param {number} s [description]
     * @return {undefined}
     */
    self.setScaleCentered = function(s) {
      var dx = size.width*(s-scale)/2;
      var dy = size.height*(s-scale)/2;
      canvasX -= dx;
      canvasY -= dy;
      self.setScale(s);
    };

    /**
     * [setContainerSize description]
     *
     * @alias Croquis#setContainerSize
     * @param {number} wid [description]
     * @param {number} hei [description]
     * @return {undefined}
     */
    self.setContainerSize = function(wid, hei) {
      containerSize.width = wid;
      containerSize.height = hei;

      domContainer.style.setProperty('width', containerSize.width+'px');
      domContainer.style.setProperty('height', containerSize.height+'px');

      moveCroquis();  // must be called (to get centering)
    };

    function moveCroquis() {
      // @lazykuna; for transform
      // get center pos
      var cx = (containerSize.width - size.width)/2;
      var cy = (containerSize.height - size.height)/2;

      domElement.style.setProperty('left', cx+canvasX+'px');
      domElement.style.setProperty('top', cy+canvasY+'px');
    }

    /**
     * [moveCanvas description]
     *
     * @alias Croquis#moveCanvas
     * @param  {number} x [description]
     * @param  {number} y [description]
     * @return {undefined}
     */
    self.moveCanvas = function(x, y) {
      canvasX = x;
      canvasY = y;
      moveCroquis();
    };

    /**
     * [getContainerSize description]
     *
     * @alias Croquis#getContainerSize
     * @return {Dimensions} [description]
     */
    self.getContainerSize = function() {
      return containerSize;
    };

    /**
     * Returns the current scale of the canvas.
     *
     * @alias Croquis#getScale
     * @return {number} [description]
     */
    self.getScale = function () {
      return scale;
    };

    /**
     * Returns the current canvas size, including scale.
     *
     * So if your canvas is 100x100 and scale is 1.5, this will return 150x150.
     *
     * @alias Croquis#getScaledCanvasSize
     * @return {Dimensions} [description]
     */
    self.getScaledCanvasSize = function() {
      return {'width': size.width*scale, 'height': size.height*scale};
    };

    /**
     * [getCanvasPosition description]
     *
     * @alias Croquis#getCanvasPosition
     * @return {Point}
     */
    self.getCanvasPosition = function() {
      return {'x': canvasX, 'y': canvasY};
    };

    /**
     * [getRelativePosition description]
     *
     * @alias Croquis#getRelativePosition
     * @param  {number} absoluteX [description]
     * @param  {number} absoluteY [description]
     * @return {Point}           [description]
     */
    self.getRelativePosition = function (absoluteX, absoluteY) {
      var rect = domElement.getBoundingClientRect();
      return {x: absoluteX - rect.left,y: absoluteY - rect.top};
    };

    /**
     * [getRelativeContainerPosition description]
     *
     * @alias Croquis#getRelativeContainerPosition
     * @param  {number} absoluteX [description]
     * @param  {number} absoluteY [description]
     * @return {Point}           [description]
     */
    self.getRelativeContainerPosition = function (absoluteX, absoluteY) {
      var rect = domContainer.getBoundingClientRect();
      return {x: absoluteX - rect.left,y: absoluteY - rect.top};
    };

    var eventListeners = {
      'ondown': [],
      'onmove': [],
      'onup': [],
      'ontick': [],
      'onchange': [],
      'onchanged': [],
      'onzoomchanged': [],
      'ontool': [],
      'oncanvassize': [],
      'onlayeradd': [],
      'onlayerremove': [],
      'onlayerswap': [],
      'onlayerselect': []
    };
    function dispatchEvent(event, e) {
      event = event.toLowerCase();
      e = e || {};
      if (eventListeners.hasOwnProperty(event)) {
        eventListeners[event].forEach(function (listener) {
          listener.call(self, e);
        });
      }
      else throw 'don\'t support ' + event;
    }

    /**
     * [addEventListener description]
     *
     * @alias Croquis#addEventListener
     * @param {string} event    [description]
     * @param {function} listener [description]
     * @return {undefined}
     */
    self.addEventListener = function (event, listener) {
      event = event.toLowerCase();
      if (eventListeners.hasOwnProperty(event)) {
        if (typeof listener !== 'function')
          throw listener + ' is not a function';
        eventListeners[event].push(listener);
      }
      else throw 'don\'t support ' + event;
    };

    /**
     * [removeEventListener description]
     *
     * @alias Croquis#removeEventListener
     * @param {string} event    [description]
     * @param {function} listener [description]
     * @return {undefined}
     */
    self.removeEventListener = function (event, listener) {
      event = event.toLowerCase();
      if (eventListeners.hasOwnProperty(event)) {
        if (listener == null) { // remove all
          eventListeners[event] = [];
          return;
        }
        var listeners = eventListeners[event];
        var index = listeners.indexOf(listener);
        if (index >= 0) listeners.splice(index, 1);
      }
      else throw 'don\'t support ' + event;
    };

    /**
     * [hasEventListener description]
     *
     * @alias Croquis#hasEventListener
     * @param {string} event    [description]
     * @param {function} listener [description]
     * @return {undefined}
     */
    self.hasEventListener = function (event, listener) {
      event = event.toLowerCase();
      if (eventListeners.hasOwnProperty(event)) {
        if (listener == null)
          return eventListeners[event].length > 0;
        return eventListeners[event].indexOf(listener) >= 0;
      }
      else return false;
    };
    var undoStack = [];
    var redoStack = [];
    var undoLimit = 10;
    var preventPushUndo = false;
    var pushToTransaction = false;

    /**
     * [getUndoLimit description]
     *
     * @alias Croquis#getUndoLimit
     * @return {number} [description]
     */
    self.getUndoLimit = function () {
      return undoLimit;
    };

    /**
     * [setUndoLimit description]
     *
     * @alias Croquis#setUndoLimit
     * @param {number} limit [description]
     * @return {undefined}
     */
    self.setUndoLimit = function (limit) {
      undoLimit = limit;
    };

    /**
     * [lockHistory description]
     *
     * @alias Croquis#lockHistory
     * @return {undefined}
     */
    self.lockHistory = function () {
      preventPushUndo = true;
    };

    /**
     * [unlockHistory description]
     *
     * @alias Croquis#unlockHistory
     * @return {undefined}
     */
    self.unlockHistory = function () {
      preventPushUndo = false;
    };

    /**
     * [beginHistoryTransaction description]
     *
     * @alias Croquis#beginHistoryTransaction
     * @return {undefined}
     */
    self.beginHistoryTransaction = function () {
      undoStack.push([]);
      pushToTransaction = true;
    };

    /**
     * [endHistoryTransaction description]
     *
     * @alias Croquis#endHistoryTransaction
     * @return {undefined}
     */
    self.endHistoryTransaction = function () {
      pushToTransaction = false;
    };

    /**
     * [clearHistory description]
     *
     * @alias Croquis#clearHistory
     * @return {undefined}
     */
    self.clearHistory = function () {
      if (preventPushUndo)
        throw 'history is locked';
      undoStack = [];
      redoStack = [];
    };

    function pushUndo(undoFunction) {
      dispatchEvent('onchange');
      if (self.onChanged)
        self.onChanged();
      if (preventPushUndo)
        return;
      redoStack = [];
      if (pushToTransaction)
        undoStack[undoStack.length - 1].push(undoFunction);
      else
        undoStack.push([undoFunction]);
      while (undoStack.length > undoLimit)
        undoStack.shift();
    }

    /**
     * [undo description]
     *
     * @alias Croquis#undo
     * @return {undefined}
     */
    self.undo = function () {
      if (pushToTransaction)
        throw 'transaction is not ended';
      if (preventPushUndo)
        throw 'history is locked';
      if (isDrawing || isStabilizing)
        throw 'still drawing';
      if (undoStack.length == 0)
        throw 'no more undo data';
      var undoTransaction = undoStack.pop();
      var redoTransaction = [];
      while (undoTransaction.length)
        redoTransaction.push(undoTransaction.pop()());
      redoStack.push(redoTransaction);
      dispatchEvent('onchanged');
    };

    /**
     * [redo description]
     *
     * @alias Croquis#redo
     * @return {undefined}
     */
    self.redo = function () {
      if (pushToTransaction)
        throw 'transaction is not ended';
      if (preventPushUndo)
        throw 'history is locked';
      if (isDrawing || isStabilizing)
        throw 'still drawing';
      if (redoStack.length == 0)
        throw 'no more redo data';
      var redoTransaction = redoStack.pop();
      var undoTransaction = [];
      while (redoTransaction.length)
        undoTransaction.push(redoTransaction.pop()());
      undoStack.push(undoTransaction);
      dispatchEvent('onchanged');
    };

    function pushLayerMetadataUndo(index) {
      index = (index == null) ? layerIndex : index;
      var snapshotMetadata = self.getLayerMetadata(index);
      var swap = function () {
        self.lockHistory();
        var temp = self.getLayerMetadata(index);
        self.setLayerMetadata(snapshotMetadata, index);
        snapshotMetadata = temp;
        self.unlockHistory();
        return swap;
      };
      pushUndo(swap);
    }

    function pushLayerOpacityUndo(index) {
      index = (index == null) ? layerIndex : index;
      var snapshotOpacity = self.getLayerOpacity(index);
      var swap = function () {
        self.lockHistory();
        var temp = self.getLayerOpacity(index);
        self.setLayerOpacity(snapshotOpacity, index);
        snapshotOpacity = temp;
        self.unlockHistory();
        return swap;
      };
      pushUndo(swap);
    }

    function pushLayerVisibleUndo(index) {
      index = (index == null) ? layerIndex : index;
      var snapshotVisible = self.getLayerVisible(index);
      var swap = function () {
        self.lockHistory();
        var temp = self.getLayerVisible(index);
        self.setLayerVisible(snapshotVisible, index);
        snapshotVisible = temp;
        self.unlockHistory();
        return swap;
      };
      pushUndo(swap);
    }

    function pushSwapLayerUndo(layerA, layerB) {
      var swap = function () {
        self.lockHistory();
        self.swapLayer(layerA, layerB);
        self.unlockHistory();
        return swap;
      };
      pushUndo(swap);
    }

    function pushAddLayerUndo(index) {
      var add = function () {
        self.lockHistory();
        self.addLayer(index);
        self.unlockHistory();
        cacheLayer(index);
        return remove;
      };
      var remove = function () {
        self.lockHistory();
        self.removeLayer(index);
        self.unlockHistory();
        return add;
      };
      pushUndo(remove);
    }
    function pushRemoveLayerUndo(index) {
      var layerContext = getLayerContext(index);
      var w = size.width;
      var h = size.height;
      var snapshotData = layerContext.getImageData(0, 0, w, h);
      var snapshotMetadata = self.getLayerMetadata(index);
      var snapshotOpacity = self.getLayerOpacity(index);
      var snapshotVisible = self.getLayerVisible(index);
      var add = function () {
        self.lockHistory();
        self.addLayer(index);
        self.setLayerMetadata(snapshotMetadata, index);
        self.setLayerOpacity(snapshotOpacity, index);
        self.setLayerVisible(snapshotVisible, index);
        var layerContext = getLayerContext(index);
        layerContext.putImageData(snapshotData, 0, 0);
        self.unlockHistory();
        cacheLayer(index);
        return remove;
      };
      var remove = function () {
        self.lockHistory();
        self.removeLayer(index);
        self.unlockHistory();
        return add;
      };
      pushUndo(add);
    }
    function pushDirtyRectUndo(x, y, width, height, index) {
      index = (index == null) ? layerIndex : index;
      var w = size.width;
      var h = size.height;
      var right = x + width;
      var bottom = y + height;
      x = Math.min(w, Math.max(0, x));
      y = Math.min(h, Math.max(0, y));
      width = Math.min(w, Math.max(x, right)) - x;
      height = Math.min(h, Math.max(y, bottom)) - y;
      if ((x % 1) > 0)
        ++width;
      if ((y % 1) > 0)
        ++height;
      x = x | 0;
      y = y | 0;
      width = Math.min(w - x, Math.ceil(width));
      height = Math.min(h - y, Math.ceil(height));
      if ((width == 0) || (height == 0)) {
        var doNothing = function () {
          return doNothing;
        };
        pushUndo(doNothing);
      }
      else {
        var layerContext = getLayerContext(index);
        var snapshotData = layerContext.getImageData(x, y, width, height);
        var swap = function () {
          var layerContext = getLayerContext(index);
          var tempData = layerContext.getImageData(x, y, width, height);
          layerContext.putImageData(snapshotData, x, y);
          snapshotData = tempData;
          cacheLayer(index);
          return swap;
        };
        pushUndo(swap);
      }
      if (renderDirtyRect)
        drawDirtyRect(x, y, width, height);
    }

    function pushContextUndo(index) {
      index = (index == null) ? layerIndex : index;
      pushDirtyRectUndo(0, 0, size.width, size.height, index);
    }

    function pushAllContextUndo() {
      var snapshotDatas = [];
      var i;
      var w = size.width;
      var h = size.height;
      for (i = 0; i < layers.length; ++i) {
        var layerContext = getLayerContext(i);
        snapshotDatas.push(layerContext.getImageData(0, 0, w, h));
      }
      var swap = function (index) {
        var layerContext = getLayerContext(index);
        var tempData = layerContext.getImageData(0, 0, w, h);
        layerContext.putImageData(snapshotDatas[index], 0, 0);
        snapshotDatas[index] = tempData;
        cacheLayer(index);
      };
      var swapAll = function () {
        for (var i = 0; i < layers.length; ++i)
          swap(i);
        return swapAll;
      };
      pushUndo(swapAll);
      dispatchEvent('onchanged');
    }

    function pushCanvasSizeUndo(width, height, offsetX, offsetY) {
      var snapshotSize = self.getCanvasSize();
      var snapshotDatas = [];
      var w = snapshotSize.width;
      var h = snapshotSize.height;
      for (var i = 0; i < layers.length; ++i) {
        var layerContext = getLayerContext(i);
        snapshotDatas[i] = layerContext.getImageData(0, 0, w, h);
      }
      function setSize(width, height, offsetX, offsetY) {
        self.lockHistory();
        self.setCanvasSize(width, height, offsetX, offsetY);
        self.unlockHistory();
      }
      var rollback = function () {
        setSize(w, h);
        for (var i = 0; i < layers.length; ++i) {
          var layerContext = getLayerContext(i);
          layerContext.putImageData(snapshotDatas[i], 0, 0);
        }
        return redo;
      };
      var redo = function () {
        rollback();
        setSize(width, height, offsetX, offsetY);
        return rollback;
      };
      pushUndo(rollback);
      dispatchEvent('onchanged');
    }
    var size = {width: 640, height: 480};

    /**
     * [getCanvasSize description]
     *
     * @alias Croquis#getCanvasSize
     * @return {Dimensions}
     */
    self.getCanvasSize = function () {
      return {width: size.width, height: size.height}; //clone size
    };

    /**
     * Set the actual canvas size, ignoring scaling. You can use the offsets to
     * move the contents of the whole canvas along with the resize.
     *
     * This will also set the container size to the given values.
     *
     * @alias Croquis#setCanvasSize
     * @param {number} width
     * @param {number} height
     * @param {number} offsetX=0 negative means left, positive means right
     * @param {number} offsetY=0 negative means up, positive means down
     * @return {undefined}
     */
    self.setCanvasSize = function (width, height, offsetX, offsetY) {
      offsetX = (offsetX == null) ? 0 : offsetX;
      offsetY = (offsetY == null) ? 0 : offsetY;
      size.width = width = Math.floor(width);
      size.height = height = Math.floor(height);
      pushCanvasSizeUndo(width, height, offsetX, offsetY);
      dispatchEvent('oncanvassize', {
        width: width, height: height,
        offsetX: offsetX, offsetY: offsetY
      });
      paintingCanvas.width = width;
      paintingCanvas.height = height;
      dirtyRectDisplay.width = width;
      dirtyRectDisplay.height = height;
      domElement.style.width = width + 'px';
      domElement.style.height = height + 'px';
      // @lazykuna; resize container
      self.setContainerSize(width, height);
      // @lazykuna; call ScaleCroquis for scaling
      ScaleCroquis();

      for (var i=0; i<layers.length; ++i) {
        var canvas = getLayerCanvas(i);
        var context = getLayerContext(i);
        var imageData = context.getImageData(0, 0, width, height);
        canvas.width = width;
        canvas.height = height;
        context.putImageData(imageData, offsetX, offsetY);
      }

      // @lazykuna; resize overlaycanvas
      for (var key in overlaylayers) {
        if(overlaylayers.hasOwnProperty(key)) {
          var canvas = getOverlayLayer(key);
          var context = canvas.getContext('2d');
          var imageData = context.getImageData(0, 0, width, height);
          canvas.width = width;
          canvas.height = height;
          context.putImageData(imageData, offsetX, offsetY);
        }
      }
    };

    /**
     * [getCanvasWidth description]
     *
     * @alias Croquis#getCanvasWidth
     * @return {number} [description]
     */
    self.getCanvasWidth = function () {
      return size.width;
    };

    /**
     * [setCanvasWidth description]
     *
     * @alias Croquis#setCanvasWidth
     * @param {number} width   [description]
     * @param {number} offsetX [description]
     * @return {undefined}
     */
    self.setCanvasWidth = function (width, offsetX) {
      self.setCanvasSize(width, size.height, offsetX, 0);
    };

    /**
     * [getCanvasHeight description]
     *
     * @alias Croquis#getCanvasHeight
     * @return {number} [description]
     */
    self.getCanvasHeight = function () {
      return size.height;
    };

    /**
     * [setCanvasHeight description]
     *
     * @alias Croquis#setCanvasHeight
     * @param {number} height  [description]
     * @param {number} offsetY [description]
     * @return {undefined}
     */
    self.setCanvasHeight = function (height, offsetY) {
      self.setCanvasSize(size.width, height, 0, offsetY);
    };

    /**
     * [getLayerCanvas description]
     *
     * @alias Croquis#getLayerCanvas
     * @param  {number} index [description]
     * @return {external:HTMLCanvasElement}       [description]
     */
    function getLayerCanvas(index) {
      return layers[index].getElementsByClassName('croquis-layer-canvas')[0];
    }

    self.getLayerCanvas = getLayerCanvas;

    function getLayerContext(index) {
      return getLayerCanvas(index).getContext('2d');
    }

    var layers = [];
    var layerIndex = 0;
    var paintingCanvas = document.createElement('canvas');
    var paintingContext = paintingCanvas.getContext('2d');
    paintingCanvas.className = 'croquis-painting-canvas';
    paintingCanvas.style.position = 'absolute';
    var dirtyRectDisplay = document.createElement('canvas');
    var dirtyRectDisplayContext = dirtyRectDisplay.getContext('2d');
    dirtyRectDisplay.className = 'croquis-dirty-rect-display';
    dirtyRectDisplay.style.position = 'absolute';
    var renderDirtyRect = false;

    function sortLayers() {
      for (var child in domElement.childNodes) {
        if (child.parent != domElement) continue;
        if (child.className == "croquis-layer-overlay") continue;
        domElement.removeChild(child);
      }
      for (var i = 0; i < layers.length; ++i) {
        var layer = layers[i];
        domElement.appendChild(layer);
      }
      domElement.appendChild(dirtyRectDisplay);
    }

    function drawDirtyRect(x, y, w, h) {
      var context = dirtyRectDisplayContext;
      context.fillStyle = '#f00';
      context.globalCompositeOperation = 'source-over';
      context.fillRect(x, y, w, h);
      if ((w > 2) && (h > 2)) {
        context.globalCompositeOperation = 'destination-out';
        context.fillRect(x + 1, y + 1, w - 2, h - 2);
      }
    }

    /**
     * [getRenderDirtyRect description]
     *
     * @alias Croquis#getRenderDirtyRect
     * @return {boolean} [description]
     */
    self.getRenderDirtyRect = function () {
      return renderDirtyRect;
    };

    /**
     * [setRenderDirtyRect description]
     *
     * @alias Croquis#setRenderDirtyRect
     * @param {boolean} render [description]
     * @return {undefined}
     */
    self.setRenderDirtyRect = function (render) {
      renderDirtyRect = render;
      if (render == false)
        dirtyRectDisplayContext.clearRect(0, 0, size.width, size.height);
    };

    /**
     * [createLayerThumbnail description]
     *
     * @alias Croquis#createLayerThumbnail
     * @param  {number} index  [description]
     * @param  {number} width  [description]
     * @param  {number} height [description]
     * @return {external:HTMLCanvasElement}        [description]
     */
    self.createLayerThumbnail = function (index, width, height) {
      index = (index == null) ? layerIndex : index;
      width = (width == null) ? size.width : width;
      height = (height == null) ? size.height : height;
      var canvas = getLayerCanvas(index);
      var thumbnail = document.createElement('canvas');
      var thumbnailContext = thumbnail.getContext('2d');
      thumbnail.width = width;
      thumbnail.height = height;
      thumbnailContext.drawImage(canvas, 0, 0, width, height);
      return thumbnail;
    };

    /**
     * [createFlattenThumbnail description]
     *
     * @alias Croquis#createFlattenThumbnail
     * @param  {number} width  [description]
     * @param  {number} height [description]
     * @return {external:HTMLCanvasElement}        [description]
     */
    self.createFlattenThumbnail = function (width, height) {
      width = (width == null) ? size.width : width;
      height = (height == null) ? size.height : height;
      var thumbnail = document.createElement('canvas');
      var thumbnailContext = thumbnail.getContext('2d');
      thumbnail.width = width;
      thumbnail.height = height;
      for (var i = 0; i < layers.length; ++i) {
        if (!self.getLayerVisible(i))
          continue;
        var canvas = getLayerCanvas(i);
        thumbnailContext.globalAlpha = self.getLayerOpacity(i);
        thumbnailContext.drawImage(canvas, 0, 0, width, height);
      }
      return thumbnail;
    };

    /**
     * [getLayers description]
     *
     * @alias Croquis#getLayers
     * @return {object[]} [description]
     */
    self.getLayers = function () {
      return layers.concat(); // clone layers
    };

    /**
     * Get number of layers.
     *
     * @alias Croquis#getLayerCount
     * @return {number}
     */
    self.getLayerCount = function () {
      return layers.length;
    };

    /**
     * Insert a new layer at given index.
     *
     * @alias Croquis#addLayer
     * @param {number} index
     * @return {external:HTMLElement}
     */
    self.addLayer = function (index) {
      index = (index == null) ? layers.length : index;
      pushAddLayerUndo(index);
      var layer = document.createElement('div');
      layer.className = 'croquis-layer';
      layer.style.visibility = 'visible';
      layer.style.opacity = 1;
      layer['croquis-metadata'] = {};
      var canvas = document.createElement('canvas');
      canvas.className = 'croquis-layer-canvas';
      canvas.width = size.width;
      canvas.height = size.height;
      canvas.style.position = 'absolute';
      layer.appendChild(canvas);
      domElement.appendChild(layer);
      layers.splice(index, 0, layer);
      sortLayers();
      self.selectLayer(layerIndex);
      dispatchEvent('onlayeradd', {index: index});
      if (self.onLayerAdded)
        self.onLayerAdded(index);
      dispatchEvent('onchanged');
      return layer;
    };

    /**
     * Remove layer at given index.
     *
     * @alias Croquis#removeLayer
     * @param  {number} index
     * @return {undefined}
     */
    self.removeLayer = function (index) {
      index = (index == null) ? layerIndex : index;
      pushRemoveLayerUndo(index);
      domElement.removeChild(layers[index]);
      layers.splice(index, 1);
      if (layerIndex == layers.length)
        self.selectLayer(layerIndex - 1);
      sortLayers();
      dispatchEvent('onlayerremove', {index: index});
      if (self.onLayerRemoved)
        self.onLayerRemoved(index);
      dispatchEvent('onchanged');
    };

    /**
     * [removeAllLayer description]
     *
     * @alias Croquis#removeAllLayer
     * @return {undefined}
     */
    self.removeAllLayer = function () {
      while (layers.length)
        self.removeLayer(0);
    };

    /**
     * [swapLayer description]
     *
     * @alias Croquis#swapLayer
     * @param  {index} layerA [description]
     * @param  {index} layerB [description]
     * @return {undefined}
     */
    self.swapLayer = function (layerA, layerB) {
      pushSwapLayerUndo(layerA, layerB);
      var layer = layers[layerA];
      layers[layerA] = layers[layerB];
      layers[layerB] = layer;
      sortLayers();
      dispatchEvent('onlayerswap', {a: layerA, b: layerB});
      if (self.onLayerSwapped)
        self.onLayerSwapped(layerA, layerB);
      dispatchEvent('onchanged');
    };

    /**
     * [getCurrentLayerIndex description]
     *
     * @alias Croquis#getCurrentLayerIndex
     * @return {number} [description]
     */
    self.getCurrentLayerIndex = function () {
      return layerIndex;
    };

    /**
     * [selectLayer description]
     *
     * @alias Croquis#selectLayer
     * @param  {number} index [description]
     * @return {undefined}
     */
    self.selectLayer = function (index) {
      var lastestLayerIndex = layers.length - 1;
      if (index > lastestLayerIndex)
        index = lastestLayerIndex;
      layerIndex = index;
      if (paintingCanvas.parentElement != null)
        paintingCanvas.parentElement.removeChild(paintingCanvas);
      layers[index].appendChild(paintingCanvas);
      dispatchEvent('onlayerselect', {index: index});
      if (self.onLayerSelected)
        self.onLayerSelected(index);
    };

    /**
     * [clearLayer description]
     *
     * @alias Croquis#clearLayer
     * @param  {number} index [description]
     * @return {undefined}
     */
    self.clearLayer = function (index) {
      index = (index == null) ? layerIndex : index;
      pushContextUndo(index);
      var context = getLayerContext(index);
      context.clearRect(0, 0, size.width, size.height);
      cacheLayer(index);
      dispatchEvent('onchanged');
    };

    /**
     * [fillLayer description]
     *
     * @alias Croquis#fillLayer
     * @param  {string} fillColor [description]
     * @param  {number} index     [description]
     * @return {undefined}
     */
    self.fillLayer = function (fillColor, index) {
      index = (index == null) ? layerIndex : index;
      pushContextUndo(index);
      var context = getLayerContext(index);
      context.fillStyle = fillColor;
      context.fillRect(0, 0, size.width, size.height);
      cacheLayer(index);
      dispatchEvent('onchanged');
    };

    /**
     * [fillLayerRect description]
     *
     * @alias Croquis#fillLayerRect
     * @param  {string} fillColor [description]
     * @param  {number} x         [description]
     * @param  {number} y         [description]
     * @param  {number} width     [description]
     * @param  {number} height    [description]
     * @param  {number} index     [description]
     * @return {undefined}
     */
    self.fillLayerRect = function (fillColor, x, y, width, height, index) {
      index = (index == null) ? layerIndex : index;
      pushDirtyRectUndo(x, y, width, height, index);
      var context = getLayerContext(index);
      context.fillStyle = fillColor;
      context.fillRect(x, y, width, height);
      cacheLayer(index);
      dispatchEvent('onchanged');
    };

    /**
     * [floodFill description]
     *
     * @alias Croquis#floodFill
     * @param  {number} x     [description]
     * @param  {number} y     [description]
     * @param  {number} r     [description]
     * @param  {number} g     [description]
     * @param  {number} b     [description]
     * @param  {number} a     [description]
     * @param  {number} index [description]
     * @return {undefined}
     */
    self.floodFill = function (x, y, r, g, b, a, index) {
      index = (index == null) ? layerIndex : index;
      pushContextUndo(index);
      var context = getLayerContext(index);
      var w = size.width;
      var h = size.height;
      if ((x < 0) || (x >= w) || (y < 0) || (y >= h))
        return;
      var imageData = context.getImageData(0, 0, w, h);
      var d = imageData.data;
      var targetColor = getColor(x, y);
      var replacementColor = (r << 24) | (g << 16) | (b << 8) | a;
      if (targetColor === replacementColor)
        return;
      function getColor(x, y) {
        var index = ((y * w) + x) * 4;
        return ((d[index] << 24) | (d[index + 1] << 16) |
          (d[index + 2] << 8) | d[index + 3]);
      }
      function setColor(x, y) {
        var index = ((y * w) + x) * 4;
        d[index] = r;
        d[index + 1] = g;
        d[index + 2] = b;
        d[index + 3] = a;
      }
      var queue = [];
      queue.push(x, y);
      while (queue.length) {
        var nx = queue.shift();
        var ny = queue.shift();
        if ((nx < 0) || (nx >= w) || (ny < 0) || (ny >= h) ||
          (getColor(nx, ny) !== targetColor))
          continue;
        var west, east;
        west = east = nx;
        do {
          var wc = getColor(--west, ny);
        } while ((west >= 0) && (wc === targetColor));
        do {
          var ec = getColor(++east, ny);
        } while ((east < w) && (ec === targetColor));
        for (var i = west + 1; i < east; ++i) {
          setColor(i, ny);
          var north = ny - 1;
          var south = ny + 1;
          if (getColor(i, north) === targetColor)
            queue.push(i, north);
          if (getColor(i, south) === targetColor)
            queue.push(i, south);
        }
      }
      context.putImageData(imageData, 0, 0);
      cacheLayer(index);
      dispatchEvent('onchanged');
    };

    /**
     * [getLayerMetadata description]
     *
     * @alias Croquis#getLayerMetadata
     * @param  {number} index [description]
     * @return {object}       [description]
     */
    self.getLayerMetadata = function (index) {
      index = (index == null) ? layerIndex : index;
      var metadata = layers[index]['croquis-metadata'];
      var clone = {};
      Object.keys(metadata).forEach(function (key) {
        clone[key] = metadata[key];
      });
      return clone;
    };

    /**
     * [setLayerMetadata description]
     *
     * @alias Croquis#setLayerMetadata
     * @param {object} metadata [description]
     * @param {number} index    [description]
     * @return {undefined}
     */
    self.setLayerMetadata = function (metadata, index) {
      index = (index == null) ? layerIndex : index;
      pushLayerMetadataUndo(index);
      layers[index]['croquis-metadata'] = metadata;
      dispatchEvent('onchanged');
    };

    /**
     * [getLayerOpacity description]
     *
     * @alias Croquis#getLayerOpacity
     * @param  {number} index [description]
     * @return {number}       [description]
     * @return {undefined}
     */
    self.getLayerOpacity = function (index) {
      index = (index == null) ? layerIndex : index;
      var opacity = parseFloat(
        layers[index].style.getPropertyValue('opacity'));
      return window.isNaN(opacity) ? 1 : opacity;
    };

    /**
     * [setLayerOpacity description]
     *
     * @alias Croquis#setLayerOpacity
     * @param {number} opacity [description]
     * @param {number} index   [description]
     * @return {undefined}
     */
    self.setLayerOpacity = function (opacity, index) {
      index = (index == null) ? layerIndex : index;
      pushLayerOpacityUndo(index);
      layers[index].style.opacity = opacity;
      dispatchEvent('onchanged');
    };

    /**
     * [getLayerVisible description]
     *
     * @alias Croquis#getLayerVisible
     * @param  {number} index [description]
     * @return {boolean}       [description]
     */
    self.getLayerVisible = function (index) {
      index = (index == null) ? layerIndex : index;
      var visible = layers[index].style.getPropertyValue('visibility');
      return visible != 'hidden';
    };

    /**
     * [setLayerVisible description]
     *
     * @alias Croquis#setLayerVisible
     * @param {boolean} visible [description]
     * @param {number} index   [description]
     * @return {undefined}
     */
    self.setLayerVisible = function (visible, index) {
      index = (index == null) ? layerIndex : index;
      pushLayerVisibleUndo(index);
      layers[index].style.visibility = visible ? 'visible' : 'hidden';
      dispatchEvent('onchanged');
    };

    function cacheLayer(index) {
      index = (index == null) ? layerIndex : index;
      var w = size.width;
      var h = size.height;
      layers[index].cache = getLayerContext(index).getImageData(0, 0, w, h);
    }

    /**
     * [getLayerImageDataCache description]
     *
     * @alias Croquis#getLayerImageDataCache
     * @param  {number} index [description]
     * @return {external:ImageData}       [description]
     */
    self.getLayerImageDataCache = function (index) {
      index = (index == null) ? layerIndex : index;
      if (layers[index].cache == null)
        cacheLayer(index);
      return layers[index].cache;
    };

    function makeColorData(imageData1x1) {
      var data = imageData1x1.data;
      var r = data[0];
      var g = data[1];
      var b = data[2];
      var a = data[3];
      return {
        r: r, g: g, b: b, a: a,
        htmlColor: 'rgba(' + [r, g, b, a / 0xff].join(',') + ')'
      };
    }

    /**
     * [pickColor description]
     *
     * @alias Croquis#pickColor
     * @param  {number} x     [description]
     * @param  {number} y     [description]
     * @param  {number} index [description]
     * @return {ColorData}       [description]
     */
    self.pickColor = function (x, y, index) {
      x = x | 0; // cast to int
      y = y | 0;
      if ((x < 0) || (x >= size.width) || (y < 0) || (y >= size.height))
        return null;
      index = (index == null) ? layerIndex : index;
      var cache = self.getLayerImageDataCache(index);
      var position = (y * size.width + x) * 4;
      var data = [];
      data[0] = cache.data[position];
      data[1] = cache.data[++position];
      data[2] = cache.data[++position];
      data[3] = cache.data[++position];
      return makeColorData({data: data});
    };

    /**
     * [eyeDrop description]
     *
     * @alias Croquis#eyeDrop
     * @param  {number} x         [description]
     * @param  {number} y         [description]
     * @param  {string} baseColor [description]
     * @return {ColorData}           [description]
     */
    self.eyeDrop = function (x, y, baseColor) {
      if (self.pickColor(x, y) == null)
        return null;
      baseColor = (baseColor == null) ? '#fff' : baseColor;
      var plane = document.createElement('canvas');
      plane.width = 1;
      plane.height = 1;
      var planeContext = plane.getContext('2d');
      planeContext.fillStyle = baseColor;
      planeContext.fillRect(0, 0, 1, 1);
      for (var i = 0; i < layers.length; ++i) {
        if (!self.getLayerVisible(i))
          continue;
        planeContext.globalAlpha = self.getLayerOpacity(i);
        planeContext.fillStyle = self.pickColor(x, y, i).htmlColor;
        planeContext.fillRect(0, 0, 1, 1);
      }
      return makeColorData(planeContext.getImageData(0, 0, 1, 1));
    };

    var tool;
    var toolStabilizeLevel = 0;
    var toolStabilizeWeight = 0.8;
    var stabilizer = null;
    var stabilizerInterval = 5;
    var tick;
    var tickInterval = 20;
    var paintingOpacity = 1;
    var paintingKnockout = false;

    /**
     * [getTool description]
     *
     * @alias Croquis#getTool
     * @return {obhect} [description]
     */
    self.getTool = function () {
      return tool;
    };

    /**
     * [setTool description]
     *
     * @alias Croquis#setTool
     * @param {object} value [description]
     * @return {undefined}
     */
    self.setTool = function (value) {
      tool = value;
      dispatchEvent('ontool', {tool: value});
      paintingContext = paintingCanvas.getContext('2d');
      if (tool && tool.setContext)
        tool.setContext(paintingContext);
    };

    self.setTool(new Croquis.Brush());

    /**
     * [getPaintingOpacity description]
     *
     * @alias Croquis#getPaintingOpacity
     * @return {number} [description]
     */
    self.getPaintingOpacity = function () {
      return paintingOpacity;
    };

    /**
     * [setPaintingOpacity description]
     *
     * @alias Croquis#setPaintingOpacity
     * @param {number} opacity [description]
     * @return {undefined}
     */
    self.setPaintingOpacity = function (opacity) {
      paintingOpacity = opacity;
      paintingCanvas.style.opacity = opacity;
    };

    /**
     * [getPaintingKnockout description]
     *
     * @alias Croquis#getPaintingKnockout
     * @return {boolean} [description]
     */
    self.getPaintingKnockout = function () {
      return paintingKnockout;
    };

    /**
     * [setPaintingKnockout description]
     *
     * @alias Croquis#setPaintingKnockout
     * @param {boolean} knockout [description]
     * @return {undefined}
     */
    self.setPaintingKnockout = function (knockout) {
      paintingKnockout = knockout;
      paintingCanvas.style.visibility = knockout ? 'hidden' : 'visible';
    };

    /**
     * [getTickInterval description]
     *
     * @alias Croquis#getTickInterval
     * @return {number} [description]
     */
    self.getTickInterval = function () {
      return tickInterval;
    };

    /**
     * [setTickInterval description]
     *
     * @alias Croquis#setTickInterval
     * @param {number} interval [description]
     * @return {undefined}
     */
    self.setTickInterval = function (interval) {
      tickInterval = interval;
    };

   /**
    * stabilize level is the number of coordinate tracker.
    * higher stabilize level makes lines smoother.
    *
    * @alias Croquis#getToolStabilizeLevel
    * @return {number} [description]
    */
    self.getToolStabilizeLevel = function () {
      return toolStabilizeLevel;
    };

    /**
     * [setToolStabilizeLevel description]
     *
     * @alias Croquis#setToolStabilizeLevel
     * @param {number} level [description]
     * @return {undefined}
     */
    self.setToolStabilizeLevel = function (level) {
      toolStabilizeLevel = (level < 0) ? 0 : level;
    };

    /**
     * higher stabilize weight makes trackers follow slower.
     *
     * @alias Croquis#getToolStabilizeWeight
     * @return {number} [description]
     */
    self.getToolStabilizeWeight = function () {
      return toolStabilizeWeight;
    };

    /**
     * [setToolStabilizeWeight description]
     *
     * @alias Croquis#setToolStabilizeWeight
     * @param {number} weight [description]
     * @return {undefined}
     */
    self.setToolStabilizeWeight = function (weight) {
      toolStabilizeWeight = weight;
    };

    /**
     * [getToolStabilizeInterval description]
     *
     * @alias Croquis#getToolStabilizeInterval
     * @return {number} [description]
     */
    self.getToolStabilizeInterval = function () {
      return stabilizerInterval;
    };

    /**
     * [setToolStabilizeInterval description]
     *
     * @alias Croquis#setToolStabilizeInterval
     * @param {number} interval [description]
     * @return {undefined}
     */
    self.setToolStabilizeInterval = function (interval) {
      stabilizerInterval = interval;
    };

    var isDrawing = false;
    var isStabilizing = false;
    var beforeKnockout = document.createElement('canvas');
    var knockoutTick;
    var knockoutTickInterval = 20;
    function gotoBeforeKnockout() {
      var context = getLayerContext(layerIndex);
      var w = size.width;
      var h = size.height;
      context.clearRect(0, 0, w, h);
      context.drawImage(beforeKnockout, 0, 0, w, h);
    }
    function drawPaintingCanvas() { //draw painting canvas on current layer
      var context = getLayerContext(layerIndex);
      var w = size.width;
      var h = size.height;
      context.save();
      context.globalAlpha = paintingOpacity;
      context.globalCompositeOperation = paintingKnockout ?
        'destination-out' : 'source-over';
      context.drawImage(paintingCanvas, 0, 0, w, h);
      context.restore();
    }
    function _move(x, y, pressure) {
      if (tool.move)
        tool.move(x, y, pressure);
      dispatchEvent('onmove', {x: x, y: y, pressure: pressure});
      if (self.onMoved)
        self.onMoved(x, y, pressure);
    }
    function _up(x, y, pressure) {
      isDrawing = false;
      isStabilizing = false;
      var dirtyRect;
      if (tool.up)
        dirtyRect = tool.up(x, y, pressure);
      if (paintingKnockout)
        gotoBeforeKnockout();
      if (dirtyRect)
        pushDirtyRectUndo(dirtyRect.x, dirtyRect.y,
                  dirtyRect.width, dirtyRect.height);
      else
        pushContextUndo();
      drawPaintingCanvas();
      paintingContext.clearRect(0, 0, size.width, size.height);
      dirtyRect = dirtyRect ||
        {x: 0, y: 0, width: size.width, height: size.height};
      dispatchEvent('onup',
        {x: x, y: y, pressure: pressure, dirtyRect: dirtyRect});
      if (self.onUpped)
        self.onUpped(x, y, pressure, dirtyRect);
      window.clearInterval(knockoutTick);
      window.clearInterval(tick);
      cacheLayer(self.getCurrentLayerIndex());
      dispatchEvent('onchanged');
    }

    /**
     * [down description]
     *
     * @alias Croquis#down
     * @param  {number} x        [description]
     * @param  {number} y        [description]
     * @param  {number} pressure [description]
     * @return {undefined}
     */
    self.down = function (x, y, pressure) {
      // @lazykuna; convert x, y
      x -= canvasX;
      y -= canvasY;
      x -= (containerSize.width - size.width)/2;
      y -= (containerSize.height - size.height)/2;
      x /= scale;
      y /= scale;

      if (isDrawing || isStabilizing)
        throw 'still drawing';
      isDrawing = true;
      if (tool == null)
        return;
      if (paintingKnockout) {
        var w = size.width;
        var h = size.height;
        var canvas = getLayerCanvas(layerIndex);
        var beforeKnockoutContext = beforeKnockout.getContext('2d');
        beforeKnockout.width = w;
        beforeKnockout.height = h;
        beforeKnockoutContext.clearRect(0, 0, w, h);
        beforeKnockoutContext.drawImage(canvas, 0, 0, w, h);
      }
      pressure = (pressure == null) ? Croquis.Tablet.pressure() : pressure;
      var down = tool.down;
      if (toolStabilizeLevel > 0) {
        stabilizer = new Croquis.Stabilizer(down, _move, _up,
          toolStabilizeLevel, toolStabilizeWeight,
          x, y, pressure, stabilizerInterval);
        isStabilizing = true;
      }
      else if (down != null)
        down(x, y, pressure);
      dispatchEvent('ondown', {x: x, y: y, pressure: pressure});
      if (self.onDowned)
        self.onDowned(x, y, pressure);
      knockoutTick = window.setInterval(function () {
        if (paintingKnockout) {
          gotoBeforeKnockout();
          drawPaintingCanvas();
        }
      }, knockoutTickInterval);
      tick = window.setInterval(function () {
        if (tool.tick)
          tool.tick();
        dispatchEvent('ontick');
        if (self.onTicked)
          self.onTicked();
      }, tickInterval);
    };

    /**
     * [move description]
     *
     * @alias Croquis#move
     * @param  {number} x        [description]
     * @param  {number} y        [description]
     * @param  {number} pressure [description]
     * @return {undefined}
     */
    self.move = function (x, y, pressure) {
      // @lazykuna; convert x, y
      x -= canvasX;
      y -= canvasY;
      x -= (containerSize.width - size.width)/2;
      y -= (containerSize.height - size.height)/2;
      x /= scale;
      y /= scale;

      if (!isDrawing)
        throw 'you need to call \'down\' first';
      if (tool == null)
        return;
      pressure = (pressure == null) ? Croquis.Tablet.pressure() : pressure;
      if (stabilizer != null)
        stabilizer.move(x, y, pressure);
      else if (!isStabilizing)
        _move(x, y, pressure);
    };

    /**
     * [up description]
     *
     * @alias Croquis#up
     * @param  {number} x        [description]
     * @param  {number} y        [description]
     * @param  {number} pressure [description]
     * @return {undefined}
     */
    self.up = function (x, y, pressure) {
      // @lazykuna; convert x, y
      x -= canvasX;
      y -= canvasY;
      x -= (containerSize.width - size.width)/2;
      y -= (containerSize.height - size.height)/2;
      x /= scale;
      y /= scale;

      if (!isDrawing)
        throw 'you need to call \'down\' first';
      if (tool == null) {
        isDrawing = false;
        return;
      }
      pressure = (pressure == null) ? Croquis.Tablet.pressure() : pressure;
      if (stabilizer != null)
        stabilizer.up(x, y, pressure);
      else
        _up(x, y, pressure);
      stabilizer = null;
    };
    // apply image data
    (function (croquis, imageDataList) {
      if (imageDataList != null) {
        if (imageDataList.length == 0)
          return;
        croquis.lockHistory();
        var first = imageDataList[0];
        croquis.setCanvasSize(first.width, first.height);
        for (var i = 0; i < imageDataList.length; ++i) {
          var current = imageDataList[i];
          if ((current.width != first.width) ||
            (current.height != first.height))
            throw 'all image data must have same size';
          croquis.addLayer();
          var context = croquis.getLayerCanvas(i).getContext('2d');
          context.putImageData(current, 0, 0);
        }
        croquis.selectLayer(0);
        croquis.unlockHistory();
      }
    }).call(null, self, imageDataList);

    /*
     * by @lazykuna; croquis extension
     * addition; for overlay layer
     */
    var overlaylayers = {};

    /**
     * [addOverlayLayer description]
     *
     * @alias Croquis#addOverlayLayer
     * @param {string} name [description]
     * @return {external:HTMLCanvasElement} [description]
     */
    self.addOverlayLayer = function(name) {
      var layer = document.createElement('div');
      layer.className = 'croquis-layer-overlay';
      layer.style.visibility = 'visible';
      layer.style.opacity = 1;
      var canvas = document.createElement('canvas');
      canvas.className = 'croquis-layer-canvas';
      canvas.width = size.width;
      canvas.height = size.height;
      canvas.style.position = 'absolute';
      layer.appendChild(canvas);

      domElement.appendChild(layer);
      overlaylayers[name] = layer;

      return canvas;
    };

    /**
     * [removeOverlayLayer description]
     *
     * @alias Croquis#removeOverlayLayer
     * @param  {string} name [description]
     * @return {undefined}
     */
    self.removeOverlayLayer = function(name) {
      if (name == undefined) {
        // remove all overlay layers
        for (var key in overlaylayers) {
          domElement.removeChild(overlaylayers[key]);
          delete overlaylayers[key];
        }
        return;
      }

      var obj = overlaylayers[name];
      if (obj == undefined)
        return;

      // remove from DOM
      domElement.removeChild(obj);

      // remove from dict
      delete overlaylayers[name];
    };

    /**
     * [setOverlayLayerData description]
     *
     * @alias Croquis#setOverlayLayerData
     * @param {name} name [description]
     * @param {external:ImageData} data [description]
     * @return {undefined}
     */
    self.setOverlayLayerData = function(name, data) {
      var ctx = self.getOverlayLayerContext(name);

      if (ctx == null)
        return;

      ctx.putImageData(data, 0, 0);
    };

    /**
     * [getOverlayLayer description]
     *
     * @alias Croquis#getOverlayLayer
     * @param  {string} name [description]
     * @return {external:HTMLCanvasElement}      [description]
     */
    function getOverlayLayer(name) {
      return overlaylayers[name]
        .getElementsByClassName('croquis-layer-canvas')[0];
    }

    /**
     * [getOverlayLayerContext description]
     *
     * @alias Croquis#getOverlayLayerContext
     * @param  {string} name [description]
     * @return {external:CanvasRenderingContext2D}      [description]
     */
    function getOverlayLayerContext(name) {
      return getOverlayLayer(name).getContext('2d');
    }

    self.getOverlayLayer = getOverlayLayer;
    self.getOverlayLayerContext = getOverlayLayerContext;
  }

  /**
   * [createChecker description]
   *
   * @alias Croquis.createChecker
   * @param  {number} cellSize [description]
   * @param  {string} colorA   [description]
   * @param  {string} colorB   [description]
   * @return {external:HTMLElement}          [description]
   */
  Croquis.createChecker = function (cellSize, colorA, colorB) {
    cellSize = (cellSize == null) ? 10 : cellSize;
    colorA = (colorA == null) ? '#fff' : colorA;
    colorB = (colorB == null) ? '#ccc' : colorB;
    var size = cellSize + cellSize;
    var checker = document.createElement('canvas');
    checker.width = checker.height = size;
    var context = checker.getContext('2d');
    context.fillStyle = colorB;
    context.fillRect(0, 0, size, size);
    context.fillStyle = colorA;
    context.fillRect(0, 0, cellSize, cellSize);
    context.fillRect(cellSize, cellSize, size, size);
    return checker;
  };

  /**
   * [createBrushPointer description]
   *
   * @alias Croquis.createBrushPointer
   * @param  {object} brushImage    [description]
   * @param  {number} brushSize     [description]
   * @param  {number} brushAngle    [description]
   * @param  {number} threshold     [description]
   * @param  {boolean} antialias     [description]
   * @param  {string} color         [description]
   * @param  {string} shadow        [description]
   * @param  {number} shadowOffsetX [description]
   * @param  {number} shadowOffsetY [description]
   * @return {external:HTMLCanvasElement}               [description]
   */
  Croquis.createBrushPointer = function (brushImage, brushSize, brushAngle,
                       threshold, antialias, color,
                       shadow, shadowOffsetX, shadowOffsetY) {
    brushSize = brushSize | 0;
    var pointer = document.createElement('canvas');
    var pointerContext = pointer.getContext('2d');
    var boundWidth;
    var boundHeight;
    if (brushSize == 0) {
      pointer.width = boundWidth = 1;
      pointer.height = boundHeight = 1;
    }
    if (brushImage == null) {
      var halfSize = (brushSize * 0.5) | 0;
      pointer.width = boundWidth = brushSize;
      pointer.height = boundHeight = brushSize;
      pointerContext.fillStyle = '#000';
      pointerContext.beginPath();
      pointerContext.arc(halfSize, halfSize, halfSize, 0, Math.PI * 2);
      pointerContext.closePath();
      pointerContext.fill();
    }
    else {
      var width = brushSize;
      var height = brushSize * (brushImage.height / brushImage.width);
      var toRad = Math.PI / 180;
      var ra = brushAngle * toRad;
      var abs = Math.abs;
      var sin = Math.sin;
      var cos = Math.cos;
      boundWidth = abs(height * sin(ra)) + abs(width * cos(ra));
      boundHeight = abs(width * sin(ra)) + abs(height * cos(ra));
      pointer.width = boundWidth;
      pointer.height = boundHeight;
      pointerContext.save();
      pointerContext.translate(boundWidth * 0.5, boundHeight * 0.5);
      pointerContext.rotate(ra);
      pointerContext.translate(width * -0.5, height * -0.5);
      pointerContext.drawImage(brushImage, 0, 0, width, height);
      pointerContext.restore();
    }
    var result;
    var alphaThresholdBorder = Croquis.createAlphaThresholdBorder(
      pointer, threshold, antialias, color);
    if (shadow) {
      shadowOffsetX = shadowOffsetX ? shadowOffsetX : 1;
      shadowOffsetY = shadowOffsetY ? shadowOffsetY : 1;
      result = document.createElement('canvas');
      result.width = boundWidth + shadowOffsetX;
      result.height = boundHeight + shadowOffsetY;
      var resultContext = result.getContext('2d');
      resultContext.shadowOffsetX = shadowOffsetX;
      resultContext.shadowOffsetY = shadowOffsetY;
      resultContext.shadowColor = shadow;
      resultContext.drawImage(
        alphaThresholdBorder, 0, 0, boundWidth, boundHeight);
    }
    else {
      result = alphaThresholdBorder;
    }
    return result;
  };

  /**
   * [createAlphaThresholdBorder description]
   *
   * @alias Croquis.createAlphaThresholdBorder
   * @param  {object} image     [description]
   * @param  {number} threshold [description]
   * @param  {boolean} antialias [description]
   * @param  {string} color     [description]
   * @return {external:HTMLCanvasElement} [description]
   */
  Croquis.createAlphaThresholdBorder = function (image, threshold,
                           antialias, color) {
    threshold = (threshold == null) ? 0x80 : threshold;
    color = (color == null) ? '#000' : color;
    var width = image.width;
    var height = image.height;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    try {
      context.drawImage(image, 0, 0, width, height);
    }
    catch (e) {
      return canvas;
    }
    var imageData = context.getImageData(0, 0, width, height);
    var d = imageData.data;
    function getAlphaIndex(index) {
      return d[index * 4 + 3];
    }
    function setRedIndex(index, red) {
      d[index * 4] = red;
    }
    function getRedXY(x, y) {
      var red = d[((y * width) + x) * 4];
      return red ? red : 0;
    }
    function getGreenXY(x, y) {
      var green = d[((y * width) + x) * 4 + 1];
      return green;
    }
    function setColorXY(x, y, red, green, alpha) {
      var i = ((y * width) + x) * 4;
      d[i] = red;
      d[i + 1] = green;
      d[i + 2] = 0;
      d[i + 3] = alpha;
    }
    //threshold
    var pixelCount = (d.length * 0.25) | 0;
    for (var i = 0; i < pixelCount; ++i)
      setRedIndex(i, (getAlphaIndex(i) < threshold) ? 0 : 1);
    //outline
    var x;
    var y;
    for (x = 0; x < width; ++x) {
      for (y = 0; y < height; ++y) {
        if (!getRedXY(x, y)) {
          setColorXY(x, y, 0, 0, 0);
        }
        else {
          var redCount = 0;
          var left = x - 1;
          var right = x + 1;
          var up = y - 1;
          var down = y + 1;
          redCount += getRedXY(left, up);
          redCount += getRedXY(left, y);
          redCount += getRedXY(left, down);
          redCount += getRedXY(right, up);
          redCount += getRedXY(right, y);
          redCount += getRedXY(right, down);
          redCount += getRedXY(x, up);
          redCount += getRedXY(x, down);
          if (redCount != 8)
            setColorXY(x, y, 1, 1, 255);
          else
            setColorXY(x, y, 1, 0, 0);
        }
      }
    }
    //antialias
    if (antialias) {
      for (x = 0; x < width; ++x) {
        for (y = 0; y < height; ++y) {
          if (getGreenXY(x, y)) {
            var alpha = 0;
            if (getGreenXY(x - 1, y) != getGreenXY(x + 1, y))
              setColorXY(x, y, 1, 1, alpha += 0x40);
            if (getGreenXY(x, y - 1) != getGreenXY(x, y + 1))
              setColorXY(x, y, 1, 1, alpha + 0x50);
          }
        }
      }
    }
    context.putImageData(imageData, 0, 0);
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
    return canvas;
  };

  /**
   * [createFloodFill description]
   *
   * @alias Croquis.createFloodFill
   * @param  {external:HTMLCanvasElement} canvas [description]
   * @param  {number} x      [description]
   * @param  {number} y      [description]
   * @param  {number} r      [description]
   * @param  {number} g      [description]
   * @param  {number} b      [description]
   * @param  {number} a      [description]
   * @return {external:HTMLCanvasElement}        [description]
   */
  Croquis.createFloodFill = function (canvas, x, y, r, g, b, a) {
    var result = document.createElement('canvas');
    var w = result.width = canvas.width;
    var h = result.height = canvas.height;
    if ((x < 0) || (x >= w) || (y < 0) || (y >= h) || !(r || g || b || a))
      return result;
    var originalContext = canvas.getContext('2d');
    var originalData = originalContext.getImageData(0, 0, w, h);
    var od = originalData.data;
    var resultContext = result.getContext('2d');
    var resultData = resultContext.getImageData(0, 0, w, h);
    var rd = resultData.data;
    var targetColor = getColor(x, y);
    var replacementColor = (r << 24) | (g << 16) | (b << 8) | a;
    function getColor(x, y) {
      var index = ((y * w) + x) * 4;
      return (rd[index] ? replacementColor :
        ((od[index] << 24) | (od[index + 1] << 16) |
         (od[index + 2] << 8) | od[index + 3]));
    }
    var queue = [];
    queue.push(x, y);
    while (queue.length) {
      var nx = queue.shift();
      var ny = queue.shift();
      if ((nx < 0) || (nx >= w) || (ny < 0) || (ny >= h) ||
        (getColor(nx, ny) !== targetColor))
        continue;
      var west, east;
      west = east = nx;
      do {
        var wc = getColor(--west, ny);
      } while ((west >= 0) && (wc === targetColor));
      do {
        var ec = getColor(++east, ny);
      } while ((east < w) && (ec === targetColor));
      for (var i = west + 1; i < east; ++i) {
        rd[((ny * w) + i) * 4] = 1;
        var north = ny - 1;
        var south = ny + 1;
        if (getColor(i, north) === targetColor)
          queue.push(i, north);
        if (getColor(i, south) === targetColor)
          queue.push(i, south);
      }
    }
    for (var i = 0; i < w; ++i) {
      for (var j = 0; j < h; ++j) {
        var index = ((j * w) + i) * 4;
        if (rd[index] == 0)
          continue;
        rd[index] = r;
        rd[index + 1] = g;
        rd[index + 2] = b;
        rd[index + 3] = a;
      }
    }
    resultContext.putImageData(resultData, 0, 0);
    return result;
  };

  Croquis.Tablet = {};
  Croquis.Tablet.plugin = function () {
    var plugin = document.querySelector(
      'object[type=\'application/x-wacomtabletplugin\']');
    if (!plugin) {
      plugin = document.createElement('object');
      plugin.type = 'application/x-wacomtabletplugin';
      plugin.style.position = 'absolute';
      plugin.style.top = '-1000px';
      document.body.appendChild(plugin);
    }
    return plugin;
  };
  Croquis.Tablet.pen = function () {
    var plugin = Croquis.Tablet.plugin();
    return plugin.penAPI;
  };
  Croquis.Tablet.pressure = function () {
    var pen = Croquis.Tablet.pen();
    return (pen && pen.pointerType) ? pen.pressure : 1;
  };
  Croquis.Tablet.isEraser = function () {
    var pen = Croquis.Tablet.pen();
    return pen ? pen.isEraser : false;
  };

  /**
   * @callback downCallback
   * @param {number} x
   * @param {number} y
   * @param {number} pressure
   */

  /**
   * @callback moveCallback
   * @param {number} x
   * @param {number} y
   * @param {number} pressure
   */

  /**
   * @callback upCallback
   * @param {number} x
   * @param {number} y
   * @param {number} pressure
   */

  /**
   * [Stabilizer description]
   *
   * @class Croquis.Stabilizer
   * @param {downCallback} down     [description]
   * @param {moveCallback} move     [description]
   * @param {upCallback} up       [description]
   * @param {number} level    [description]
   * @param {number} weight   [description]
   * @param {number} x        [description]
   * @param {number} y        [description]
   * @param {number} pressure [description]
   * @param {number} interval [description]
   */
  Croquis.Stabilizer = function (down, move, up, level, weight,
                   x, y, pressure, interval) {
    interval = interval || 5;
    var follow = 1 - Math.min(0.95, Math.max(0, weight));
    var paramTable = [];
    var current = { x: x, y: y, pressure: pressure };
    for (var i = 0; i < level; ++i)
      paramTable.push({ x: x, y: y, pressure: pressure });
    var first = paramTable[0];
    var last = paramTable[paramTable.length - 1];
    var upCalled = false;
    if (down != null)
      down(x, y, pressure);
    window.setTimeout(_move, interval);

    this.getParamTable = function () { //for test
      return paramTable;
    };

    /**
     * [move description]
     *
     * @alias Croquis.Stabilizer#move
     * @param  {number} x        [description]
     * @param  {number} y        [description]
     * @param  {number} pressure [description]
     * @return {undefined}
     */
    this.move = function (x, y, pressure) {
      current.x = x;
      current.y = y;
      current.pressure = pressure;
    };

    /**
     * [up description]
     *
     * @alias Croquis.Stabilizer#up
     * @param  {number} x        [description]
     * @param  {number} y        [description]
     * @param  {number} pressure [description]
     * @return {undefined}
     */
    this.up = function (x, y, pressure) {
      current.x = x;
      current.y = y;
      current.pressure = pressure;
      upCalled = true;
    };

    function dlerp(a, d, t) {
      return a + d * t;
    }

    function _move(justCalc) {
      var curr;
      var prev;
      var dx;
      var dy;
      var dp;
      var delta = 0;
      first.x = current.x;
      first.y = current.y;
      first.pressure = current.pressure;
      for (var i = 1; i < paramTable.length; ++i) {
        curr = paramTable[i];
        prev = paramTable[i - 1];
        dx = prev.x - curr.x;
        dy = prev.y - curr.y;
        dp = prev.pressure - curr.pressure;
        delta += Math.abs(dx);
        delta += Math.abs(dy);
        curr.x = dlerp(curr.x, dx, follow);
        curr.y = dlerp(curr.y, dy, follow);
        curr.pressure = dlerp(curr.pressure, dp, follow);
      }
      if (justCalc)
        return delta;
      if (upCalled) {
        while(delta > 1) {
          move(last.x, last.y, last.pressure);
          delta = _move(true);
        }
        up(last.x, last.y, last.pressure);
      }
      else {
        move(last.x, last.y, last.pressure);
        window.setTimeout(_move, interval);
      }
    }
  };

  Croquis.Random = {};

  /**
   * [LFSR113 description]
   *
   * @class Croquis.Random.LFSR113
   * @param {number} seed [description]
   */
  Croquis.Random.LFSR113 = function (seed) {
    var IA = 16807;
    var IM = 2147483647;
    var IQ = 127773;
    var IR = 2836;
    var a, b, c, d, e;

    /**
     * [get description]
     *
     * @alias Croquis.Random.LFSR113#get
     * @return {number} [description]
     */
    this.get = function () {
      var f = ((a << 6) ^ a) >> 13;
      a = ((a & 4294967294) << 18) ^ f;
      f  = ((b << 2) ^ b) >> 27;
      b = ((b & 4294967288) << 2) ^ f;
      f  = ((c << 13) ^ c) >> 21;
      c = ((c & 4294967280) << 7) ^ f;
      f  = ((d << 3) ^ d) >> 12;
      d = ((d & 4294967168) << 13) ^ f;
      return (a ^ b ^ c ^ d) * 2.3283064365386963e-10 + 0.5;
    };
    seed |= 0;
    if (seed <= 0) seed = 1;
    e = (seed / IQ) | 0;
    seed = (((IA * (seed - ((e * IQ) | 0))) | 0) - ((IR * e) | 0)) | 0;
    if (seed < 0) seed = (seed + IM) | 0;
    if (seed < 2) a = (seed + 2) | 0 ; else a = seed;
    e = (seed / IQ) | 0;
    seed = (((IA * (seed - ((e * IQ) | 0))) | 0) - ((IR * e) | 0)) | 0;
    if (seed < 0) seed = (seed + IM) | 0;
    if (seed < 8) b = (seed + 8) | 0; else b = seed;
    e = (seed / IQ) | 0;
    seed = (((IA * (seed - ((e * IQ) | 0))) | 0) - ((IR * e) | 0)) | 0;
    if (seed < 0) seed = (seed + IM) | 0;
    if (seed < 16) c = (seed + 16) | 0; else c = seed;
    e = (seed / IQ) | 0;
    seed = (((IA * (seed - ((e * IQ) | 0))) | 0) - ((IR * e) | 0)) | 0;
    if (seed < 0) seed = (seed + IM) | 0;
    if (seed < 128) d = (seed + 128) | 0; else d = seed;
    this.get();
  };

  /**
   * @class Croquis.Brush
   */
  Croquis.Brush = function () {
    // math shortcut
    var min = Math.min;
    var max = Math.max;
    var abs = Math.abs;
    var sin = Math.sin;
    var cos = Math.cos;
    var sqrt = Math.sqrt;
    var atan2 = Math.atan2;
    var PI = Math.PI;
    var ONE = PI + PI;
    var QUARTER = PI * 0.5;
    var random = Math.random;

    /**
     * @callback randomCallback
     * @return {number}
     */

    /**
     * [setRandomFunction description]
     *
     * @alias Croquis#setRandomFunction
     * @param {randomCallback} value=Math.random [description]
     * @return {undefined}
     */
    this.setRandomFunction = function (value) {
      random = value;
    };

    /**
     * TODO-wibe: should this actually return the brush? :D
     *
     * @alias Croquis.Brush#clone
     * @return {undefined}
     */
    this.clone = function () {
      var clone = new Croquis.Brush(context);
      clone.setColor(this.getColor());
      clone.setFlow(this.getFlow());
      clone.setSize(this.getSize());
      clone.setSpacing(this.getSpacing());
      clone.setAngle(this.getAngle());
      clone.setRotateToDirection(this.getRotateToDirection());
      clone.setNormalSpread(this.getNormalSpread());
      clone.setTangentSpread(this.getTangentSpread());
      clone.setImage(this.getImage());
    };

    var context = null;

    /**
     * [getContext description]
     *
     * @alias Croquis.Brush#getContext
     * @return {object} [description]
     */
    this.getContext = function () {
      return context;
    };

    /**
     * [setContext description]
     *
     * @alias Croquis.Brush#setContext
     * @param {object} value [description]
     * @return {undefined}
     */
    this.setContext = function (value) {
      context = value;
    };

    var color = '#000';

    /**
     * [getColor description]
     *
     * @alias Croquis.Brush#getColor
     * @return {string} [description]
     */
    this.getColor = function () {
      return color;
    };

    /**
     * [setColor description]
     *
     * @alias Croquis.Brush#setColor
     * @param {number} value [description]
     * @return {undefined}
     */
    this.setColor = function (value) {
      color = value;
      transformedImageIsDirty = true;
    };

    var flow = 1;

    /**
     * [getFlow description]
     *
     * @alias Croquis.Brush#getFlow
     * @return {number} [description]
     */
    this.getFlow = function() {
      return flow;
    };

    /**
     * [setFlow description]
     *
     * @alias Croquis.Brush#setFlow
     * @param {number} value [description]
     * @return {undefined}
     */
    this.setFlow = function(value) {
      flow = value;
      transformedImageIsDirty = true;
    };

    var size = 10;

    /**
     * [getSize description]
     *
     * @alias Croquis.Brush#getSize
     * @return {number} [description]
     */
    this.getSize = function () {
      return size;
    };

    /**
     * [setSize description]
     *
     * @alias Croquis.Brush#setSize
     * @param {number} value [description]
     * @return {undefined}
     */
    this.setSize = function (value) {
      size = (value < 1) ? 1 : value;
      transformedImageIsDirty = true;
    };

    var spacing = 0.2;

    /**
     * [getSpacing description]
     *
     * @alias Croquis.Brush#getSpacing
     * @return {number} [description]
     */
    this.getSpacing = function () {
      return spacing;
    };

    /**
     * [setSpacing description]
     *
     * @alias Croquis.Brush#setSpacing
     * @param {number} value [description]
     * @return {undefined}
     */
    this.setSpacing = function (value) {
      spacing = (value < 0.01) ? 0.01 : value;
    };

    var toRad = PI / 180;
    var toDeg = 1 / toRad;
    var angle = 0; // radian unit

    /**
     * [getAngle description]
     *
     * @alias Croquis.Brush#getAngle
     * @return {number} [description]
     */
    this.getAngle = function () { // returns degree unit
      return angle * toDeg;
    };

    /**
     * [setAngle description]
     *
     * @alias Croquis.Brush#setAngle
     * @param {number} value [description]
     * @return {undefined}
     */
    this.setAngle = function (value) {
      angle = value * toRad;
    };

    var rotateToDirection = false;

    /**
     * [getRotateToDirection description]
     *
     * @alias Croquis.Brush#getRotateToDirection
     * @return {number} [description]
     */
    this.getRotateToDirection = function () {
      return rotateToDirection;
    };

    /**
     * [setRotateToDirection description]
     *
     * @alias Croquis.Brush#setRotateToDirection
     * @param {number} value [description]
     * @return {undefined}
     */
    this.setRotateToDirection = function (value) {
      rotateToDirection = value;
    };

    var normalSpread = 0;

    /**
     * [getNormalSpread description]
     *
     * @alias Croquis.Brush#getNormalSpread
     * @return {number} [description]
     */
    this.getNormalSpread = function () {
      return normalSpread;
    };

    /**
     * [setNormalSpread description]
     *
     * @alias Croquis.Brush#setNormalSpread
     * @param {number} value [description]
     * @return {undefined}
     */
    this.setNormalSpread = function (value) {
      normalSpread = value;
    };

    var tangentSpread = 0;

    /**
     * [getTangentSpread description]
     *
     * @alias Croquis.Brush#getTangentSpread
     * @return {number} [description]
     */
    this.getTangentSpread = function () {
      return tangentSpread;
    };

    /**
     * [setTangentSpread description]
     *
     * @alias Croquis.Brush#setTangentSpread
     * @param {number} value [description]
     * @return {undefined}
     */
    this.setTangentSpread = function (value) {
      tangentSpread = value;
    };

    var image = null;
    var transformedImage = null;
    var transformedImageIsDirty = true;
    var imageRatio = 1;

    /**
     * [getImage description]
     *
     * @alias Croquis.Brush#getImage
     * @return {object} [description]
     */
    this.getImage = function () {
      return image;
    };

    /**
     * [setImage description]
     *
     * @alias Croquis.Brush#setImage
     * @param {object} value [description]
     * @return {undefined}
     */
    this.setImage = function (value) {
      if (value == null) {
        transformedImage = image = null;
        imageRatio = 1;
        drawFunction = drawCircle;
      }
      else if (value != image) {
        image = value;
        imageRatio = image.height / image.width;
        transformedImage = document.createElement('canvas');
        drawFunction = drawImage;
        transformedImageIsDirty = true;
      }
    };
    var delta = 0;
    var prevX = 0;
    var prevY = 0;
    var lastX = 0;
    var lastY = 0;
    var dir = 0;
    var prevScale = 0;
    var drawFunction = drawCircle;
    var reserved = null;
    var dirtyRect;
    function spreadRandom() {
      return random() - 0.5;
    }
    function drawReserved() {
      if (reserved != null) {
        drawTo(reserved.x, reserved.y, reserved.scale);
        reserved = null;
      }
    }
    function appendDirtyRect(x, y, width, height) {
      if (!(width && height))
        return;
      var dxw = dirtyRect.x + dirtyRect.width;
      var dyh = dirtyRect.y + dirtyRect.height;
      var xw = x + width;
      var yh = y + height;
      var minX = dirtyRect.width ? min(dirtyRect.x, x) : x;
      var minY = dirtyRect.height ? min(dirtyRect.y, y) : y;
      dirtyRect.x = minX;
      dirtyRect.y = minY;
      dirtyRect.width = max(dxw, xw) - minX;
      dirtyRect.height = max(dyh, yh) - minY;
    }
    function transformImage() {
      transformedImage.width = size;
      transformedImage.height = size * imageRatio;
      var brushContext = transformedImage.getContext('2d');
      brushContext.clearRect(0, 0,
        transformedImage.width, transformedImage.height);
      brushContext.drawImage(image, 0, 0,
        transformedImage.width, transformedImage.height);
      brushContext.globalCompositeOperation = 'source-in';
      brushContext.fillStyle = color;
      brushContext.globalAlpha = flow;
      brushContext.fillRect(0, 0,
        transformedImage.width, transformedImage.height);
    }
    function drawCircle(size) {
      var halfSize = size * 0.5;
      context.fillStyle = color;
      context.globalAlpha = flow;
      context.beginPath();
      context.arc(halfSize, halfSize, halfSize, 0, ONE);
      context.closePath();
      context.fill();
    }
    function drawImage(size) {
      if (transformedImageIsDirty)
        transformImage();
      try {
        context.drawImage(transformedImage, 0, 0, size, size * imageRatio);
      }
      catch (e) {
        drawCircle(size);
      }
    }
    function drawTo(x, y, scale) {
      var scaledSize = size * scale;
      var nrm = dir + QUARTER;
      var nr = normalSpread * scaledSize * spreadRandom();
      var tr = tangentSpread * scaledSize * spreadRandom();
      var ra = rotateToDirection ? angle + dir : angle;
      var width = scaledSize;
      var height = width * imageRatio;
      var boundWidth = abs(height * sin(ra)) + abs(width * cos(ra));
      var boundHeight = abs(width * sin(ra)) + abs(height * cos(ra));
      x += Math.cos(nrm) * nr + Math.cos(dir) * tr;
      y += Math.sin(nrm) * nr + Math.sin(dir) * tr;
      context.save();
      context.translate(x, y);
      context.rotate(ra);
      context.translate(-(width * 0.5), -(height * 0.5));
      drawFunction(width);
      context.restore();
      appendDirtyRect(x - (boundWidth * 0.5),
              y - (boundHeight * 0.5),
              boundWidth, boundHeight);
    }

    /**
     * [down description]
     *
     * @alias Croquis.Brush#down
     * @param  {number} x     [description]
     * @param  {number} y     [description]
     * @param  {number} scale [description]
     * @return {undefined}
     */
    this.down = function(x, y, scale) {
      if (context == null)
        throw 'brush needs the context';
      dir = 0;
      dirtyRect = {x: 0, y: 0, width: 0, height: 0};
      if (scale > 0) {
        if (rotateToDirection || normalSpread != 0 || tangentSpread != 0)
          reserved = {x: x, y: y, scale: scale};
        else
          drawTo(x, y, scale);
      }
      delta = 0;
      lastX = prevX = x;
      lastY = prevY = y;
      prevScale = scale;
    };

    /**
     * [move description]
     *
     * @alias Croquis.Brush#move
     * @param  {number} x     [description]
     * @param  {number} y     [description]
     * @param  {number} scale [description]
     * @return {undefined}
     */
    this.move = function(x, y, scale) {
      if (context == null)
        throw 'brush needs the context';
      if (scale <= 0) {
        delta = 0;
        prevX = x;
        prevY = y;
        prevScale = scale;
        return;
      }
      var dx = x - prevX;
      var dy = y - prevY;
      var ds = scale - prevScale;
      var d = sqrt(dx * dx + dy * dy);
      prevX = x;
      prevY = y;
      delta += d;
      var midScale = (prevScale + scale) * 0.5;
      var drawSpacing = size * spacing * midScale;
      var ldx = x - lastX;
      var ldy = y - lastY;
      var ld = sqrt(ldx * ldx + ldy * ldy);
      dir = atan2(ldy, ldx);
      if (ldx || ldy)
        drawReserved();
      if (drawSpacing < 0.5)
        drawSpacing = 0.5;
      if (delta < drawSpacing) {
        prevScale = scale;
        return;
      }
      var scaleSpacing = ds * (drawSpacing / delta);
      if (ld < drawSpacing) {
        lastX = x;
        lastY = y;
        drawTo(lastX, lastY, scale);
        delta -= drawSpacing;
      } else {
        while(delta >= drawSpacing) {
          ldx = x - lastX;
          ldy = y - lastY;
          var tx = cos(dir);
          var ty = sin(dir);
          lastX += tx * drawSpacing;
          lastY += ty * drawSpacing;
          prevScale += scaleSpacing;
          drawTo(lastX, lastY, prevScale);
          delta -= drawSpacing;
        }
      }
      prevScale = scale;
    };

    /**
     * [up description]
     *
     * @alias Croquis.Brush#up
     * @param  {number} x     [description]
     * @param  {number} y     [description]
     * @param  {number} scale [description]
     * @return {Rect}       [description]
     */
    this.up = function (x, y, scale) {
      dir = atan2(y - lastY, x - lastX);
      drawReserved();
      return dirtyRect;
    };
  };

  //
  // export
  //

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Croquis;
  }

  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return Croquis;
      });
    }
    else {
      window.Croquis = Croquis;
    }
  }
})();
