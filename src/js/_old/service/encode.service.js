"use strict";

(function() {
    angular
        .module("ygodeckprice")
        .service("encodeService", encodeService);

    function encodeService() {
        const _this = this;

        /**
         * Returns Object of URL parameters
         * @param  {String} uriParamString current URL parameter string
         * @return {Object} URL parameter key->value
         */
        const getUriParams = function(uriParamString) {
            const result = {};
            const uriSets = uriParamString.substr(1).split("&");

            uriSets.forEach(set => {
                const pair = set.split("=");

                result[pair[0]] = pair[1];
            });

            return result;
        };

        /**
         * Encodes Deck file to URI
         * @param  {Object} deck Deck id data
         * @param  {String} name Deck name
         * @return {String}      Base64 encoded deck-URI
         */
        _this.encodeUriDeck = function(deck, name) {
            const nameUri = btoa(name);
            const deckUri = btoa(JSON.stringify(deck));

            return `?n=${nameUri}&d=${deckUri}`;
        };

        /**
         * Encode Deck from URI
         * @param  {String} uri Base64 encoded deck-URI
         * @return {Object}     Deck object
         */
        _this.decodeUriDeck = function(uri) {
            const uriParams = getUriParams(uri);

            return {
                name: atob(uriParams.n),
                deck: JSON.parse(atob(uriParams.d))
            };
        };

        /**
         * encodes array to URI
         * @param  {String} arrKey Key for the URI
         * @param  {Array} arr    Array to encode
         * @return {String}        Base64 encoded array-URI
         */
        _this.encodeArray = function(arrKey, arr) {
            const arrUri = btoa(JSON.stringify(arr));

            return `?${arrKey}=${arrUri}`;
        };

        /*_this.encodeString = function(nameKey, name) {
            const nameUri = btoa(name);

            return `?${nameKey}=${nameUri}`;
        };*/
    }
})();
