(function() {
    'use strict';

    function canScrollDown(element) {
        var startScroll = element.scrollTop();
        if (startScroll === 0) { return true; }
        element.scrollTop(startScroll + 1);
        if (element.scrollTop() === startScroll + 1) {
            element.scrollTop(startScroll);
            return true;
        }
        return false;
    }

    function canScrollUp(element) {
        return element.scrollTop() !== 0;
    }

    function allowScroll(dScreenY, target, findScrollableParent) {
        // If no change, then continue.
        if (dScreenY === 0) { return true; }

        // Find if we're inside a scrollable element.
        var targetScrollable = findScrollableParent(target);

        // Disallow scroll if scrollable parent not found.
        if (!targetScrollable) {
            return false;
        }

        // screenY increasing -> Swiping down -> Scroll up
        if (dScreenY > 0) {
            return canScrollUp(targetScrollable);
        } else { // screenY decreasing -> Swiping up
            return canScrollDown(targetScrollable);
        }
    }

    function attach(options) {
        options = options || {};

        var scrollableSelector = options.scrollableSelector || '.scrollable';
        var layer = options.layer || document.body;

        function findScrollableParent(element) {
            var scrollables = $(scrollableSelector).has($(element));
            if (scrollables.length === 0) {
                return null;
            } else {
                return scrollables[0];
            }
        }

        var lastScreenY;

        layer.addEventListener('touchstart', function(evt) {
            lastScreenY = evt.changedTouches[0].screenY;
        }, false);

        layer.addEventListener('touchmove', function (evt) {
            var newScreenY = evt.changedTouches[0].screenY;
            var dScreenY = newScreenY - lastScreenY;
            
            if (!allowScroll(dScreenY, evt.target, findScrollableParent)) {
                evt.preventDefault();
            }

            lastScreenY = newScreenY;
            return true;
        }, false);
    }

    window.Underscroll = { attach: attach };

    // Export only for unit testing.
    if (window.jasmine) {
        window.Underscroll.internal = {
            allowScroll: allowScroll,
            canScrollDown: canScrollDown,
            canScrollUp: canScrollUp
        };
    }

})();
