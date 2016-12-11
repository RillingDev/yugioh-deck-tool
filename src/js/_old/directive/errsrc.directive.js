"use strict";

(function() {
    angular
        .module("ygodeckprice")
        .directive("errSrc", errSrc);

    /**
     * Replaces broken images
     * @return {Object} Angular directive
     */
    function errSrc() {
        return {
            link: function(scope, element, attrs) {
                element.bind("error", function() {
                    if (attrs.src !== attrs.errSrc) {
                        attrs.$set("src", attrs.errSrc);
                    }
                });
            }
        };

    }
})();
