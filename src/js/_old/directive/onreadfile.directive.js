"use strict";

(function() {
    angular
        .module("ygodeckprice")
        .directive("onReadFile", onReadFile);

    /**
     * Binds directive to file upload
     * @param  {Object} $parse Angular parse object
     * @return {Object}        Angular directive
     */
    function onReadFile($parse) {
        return {
            restrict: "A",
            scope: false,
            link: function(scope, element, attrs) {
                const fn = $parse(attrs.onReadFile);
                element.on("change", function(onChangeEvent) {
                    const reader = new FileReader();
                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            fn(scope, {
                                $fileContent: onLoadEvent.target.result,
                                //File Name
                                $fileName: element[0].value.substr(12)
                            });
                        });
                    };
                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            }
        };
    }
})();
