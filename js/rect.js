/**
 * Rect
 * low-level utility class for basic geometry
 */

(function (window, factory) {
    // universal module definition
    /* jshint strict: false */ /* globals define, module */
    if (typeof define == 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof module == 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        // browser global
        window.Packery = window.Packery || {};
        window.Packery.Rect = factory();
    }

}(window, function factory() {
    'use strict';

    // -------------------------- Rect -------------------------- //

    function Rect(props) {
        // extend properties from defaults
        for (var prop in Rect.defaults) {
            this[prop] = Rect.defaults[prop];
        }

        for (prop in props) {
            this[prop] = props[prop];
        }

    }

    Rect.defaults = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    var proto = Rect.prototype;

    /**
     * Determines whether or not this rectangle wholly encloses another rectangle or point.
     * @param {Rect} rect
     * @returns {Boolean}
    **/
    proto.contains = function (rect) {
        // points don't have width or height
        var otherWidth = rect.width || 0;
        var otherHeight = rect.height || 0;
        return this.x <= rect.x &&
            this.y <= rect.y &&
            this.x + this.width >= rect.x + otherWidth &&
            this.y + this.height >= rect.y + otherHeight;
    };

    /**
     * Determines whether or not the rectangle intersects with another.
     * @param {Rect} rect
     * @returns {Boolean}
    **/
    proto.overlaps = function (rect) {
        var thisRight = this.x + this.width;
        var thisBottom = this.y + this.height;
        var rectRight = rect.x + rect.width;
        var rectBottom = rect.y + rect.height;

        // http://stackoverflow.com/a/306332
        return this.x < rectRight &&
            thisRight > rect.x &&
            this.y < rectBottom &&
            thisBottom > rect.y;
    };

    /**
     * @param {Rect} rect - the overlapping rect
     * @returns {Array} freeRects - rects representing the area around the rect
    **/
    proto.getMaximalFreeRects = function (rect) {

        // if no intersection, return false
        if (!this.overlaps(rect)) {
            return false;
        }

        var freeRects = [];
        var freeRect;

        var thisRight = this.x + this.width;
        var thisBottom = this.y + this.height;
        var rectRight = rect.x + rect.width;
        var rectBottom = rect.y + rect.height;

        // top
        if (this.y < rect.y) {
            freeRect = new Rect({
                x: this.x,
                y: this.y,
                width: this.width,
                height: rect.y - this.y
            });
            freeRects.push(freeRect);
        }

        // right
        if (thisRight > rectRight) {
            freeRect = new Rect({
                x: rectRight,
                y: this.y,
                width: thisRight - rectRight,
                height: this.height
            });
            freeRects.push(freeRect);
        }

        // bottom
        if (thisBottom > rectBottom) {
            freeRect = new Rect({
                x: this.x,
                y: rectBottom,
                width: this.width,
                height: thisBottom - rectBottom
            });
            freeRects.push(freeRect);
        }

        // left
        if (this.x < rect.x) {
            freeRect = new Rect({
                x: this.x,
                y: this.y,
                width: rect.x - this.x,
                height: this.height
            });
            freeRects.push(freeRect);
        }

        return freeRects;
    };

    proto.canFit = function (rect) {
        return this.width >= rect.width && this.height >= rect.height;
    };

    return Rect;

}));
