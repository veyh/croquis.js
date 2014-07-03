/*
 * color picker for croquis
 * from croquispop@disjukr
 * edited by @lazykuna
 * dependency on HSBRect, TinyColor, jquery.
 */

Croquis.ColorPicker = function(croquis, width, height, picker, hueslider, alphaslider) {
    var colorPickerHueSlider = hueslider;
    var colorPickerAlphaSlider = alphaslider;
    var sbSizeWidth = width;
    var sbSizeHeight = height;

    var colorPickerSb = $(picker);
    colorPickerSb.css('overflow', 'hidden');
    colorPickerSb.css('position', 'relative');
    colorPickerSb.width(width);
    colorPickerSb.height(height);

    var colorPickerHSBRect = new HSBRect(width, height);
    colorPickerHSBRect.DOMElement.id = 'color-picker-hsbrect';
    colorPickerHSBRect.DOMElement.style.setProperty('cursor', 'Crosshair');
    colorPickerSb.append(colorPickerHSBRect.DOMElement);

    var colorPickerThumb = document.createElement('div');
    colorPickerThumb.id = 'color-picker-thumb';
    colorPickerThumb.style.setProperty('position', 'absolute');
    colorPickerThumb.style.setProperty('border-radius', '7.5px');
    colorPickerThumb.style.setProperty('border-style', 'solid');
    colorPickerThumb.style.setProperty('border-width', '2px');
    colorPickerThumb.style.setProperty('width', '11px');
    colorPickerThumb.style.setProperty('height', '11px');
    colorPickerSb.append(colorPickerThumb);

    var brush = croquis.getTool();
    colorPickerHueSlider.value = tinycolor(brush.getColor()).toHsv().h;

    function setColor() {
        var halfThumbRadius = 7.5;
        var h = colorPickerHueSlider.value;
        var s = parseFloat(
            colorPickerThumb.style.getPropertyValue('margin-left'));
        var b = parseFloat(
            colorPickerThumb.style.getPropertyValue('margin-top'));
        s = (s + halfThumbRadius) / sbSizeWidth;
        b = 1 - ((b + halfThumbRadius + sbSizeHeight) / sbSizeHeight);
        var a = croquis.getPaintingOpacity();
        var color = tinycolor({h: h, s:s, v: b, a: a});
        console.log(color.toHexString());

        brush = croquis.getTool();
        brush.setColor(color.toHexString());
        croquis.setTool(brush);
        //colorPickerColor.style.backgroundColor = color.toRgbString();
        //colorPickerColor.textContent = color.toHexString();
    }

    colorPickerHueSlider.onchange = function () {
        colorPickerHSBRect.hue = colorPickerHueSlider.value;
        setColor();
    }
    colorPickerAlphaSlider.onchange = function () {
        var alpha = colorPickerAlphaSlider.value / 100;
        croquis.setPaintingOpacity(alpha);
    }

    function colorPickerPointerDown(e) {
        $(document).bind('mousemove', colorPickerPointerMove);
        colorPickerPointerMove(e);
    }
    function colorPickerPointerUp(e) {
        $(document).unbind('mousemove', colorPickerPointerMove);
    }
    function colorPickerPointerMove(e) {
        var boundRect = colorPickerSb.offset();
        var x = (e.clientX - boundRect.left);
        var y = (e.clientY - boundRect.top);
        pickColor(x, y);
    }
    function minmax(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }
    function pickColor(x, y) {
        var halfThumbRadius = 7.5;
        colorPickerThumb.style.setProperty('margin-left',
            (minmax(x, 0, sbSizeWidth) - halfThumbRadius) + 'px');
        colorPickerThumb.style.setProperty('margin-top',
            (minmax(y, 0, sbSizeHeight) - (sbSizeHeight + halfThumbRadius)) + 'px');
        colorPickerThumb.style.setProperty('border-color',
            (y < sbSizeHeight * 0.5)? '#000' : '#fff');
        setColor();
    }
    colorPickerSb.bind('mousedown', colorPickerPointerDown);
    $(document).bind('mouseup', colorPickerPointerUp);
}