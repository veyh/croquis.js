/*
 * croquis.shortcutkey.js
 * from croquispop@disjukr
 * modified @lazykuna
 */

//keyboard
Croquis.ShortcutKey = function (croquis) {
	// Platform variables
	var mac = navigator.platform.indexOf('Mac') >= 0;

	document.addEventListener('keydown', documentKeyDown);
	function documentKeyDown(e) {
	    if (mac ? e.metaKey : e.ctrlKey) {
	        switch (e.keyCode) {
	        case 89: //ctrl + y
	            croquis.redo();
	            break;
	        case 90: //ctrl + z
	            croquis[e.shiftKey ? 'redo' : 'undo']();
	            break;
	        }
	    }
	}
}