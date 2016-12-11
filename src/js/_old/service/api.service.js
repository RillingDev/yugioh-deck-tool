"use strict";

(function() {
    angular
        .module("ygodeckprice")
        .service("apiService", ["$http", "utilService", "encodeService", apiService]);

    function apiService($http, utilService, encodeService) {
        const _this = this;

        /**
         * Loads names from ids
         * @param  {Array}   uniqueIds    Array of all unique Ids
         * @param  {Object}  _location Browser window.location
         * @param  {Function} callback  Ajax.done callback
         */
        _this.getNames = function(uniqueIds, _location, callback) {
            const idUri = encodeService.encodeArray("ids", uniqueIds);
            const currentUri = utilService.getLocationNoParam(_location);
            const url = `https://ygoprodeck.com/priceapp/api/getNames.php${idUri}`;

            console.log("Name", url);

            $http({
                url,
                method: 'GET'
            }).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback() {
                throw "Error while loading names";
            });
        };

        /**
         * Loads prices from names
         * @param  {Array}   uniqueNames    Array of all unique names
         * @param  {Object}  _location Browser window.location
         * @param  {Function} callback  Ajax.done callback
         */
        _this.getPrices = function(uniqueNames, _location, callback) {
            const nameUri = encodeService.encodeArray("names", uniqueNames);
            const currentUri = utilService.getLocationNoParam(_location);
            const url = `https://ygoprodeck.com/priceapp/api/getPrices.php${nameUri}`;

            console.log("Price", url);

            $http({
                url,
                method: 'GET'
            }).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback() {
                throw "Error while loading prices";
            });
        };

    }
})();
