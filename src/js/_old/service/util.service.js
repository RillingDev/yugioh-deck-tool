"use strict";

(function() {
    angular
        .module("ygodeckprice")
        .service("utilService", utilService);

    function utilService() {
        const _this = this;

        /**
         * Iterate over Object keys
         * @param  {Object}   object Object to iterate
         * @param  {Function} fn     Function to call
         */
        _this.eachObject = function(object, fn) {
            const keys = Object.keys(object);
            const l = keys.length;
            let i = 0;

            while (i < l) {
                const currentKey = keys[i];

                fn(object[currentKey], currentKey, i);
                i++;
            }
        };

        /**
         * Returns current URL without URI parameters
         * @param  {Object} _location window.location object
         * @return {String}           current URL
         */
        _this.getLocationNoParam = function(_location) {
            return _location.origin + _location.pathname;
        };

    }
})();
