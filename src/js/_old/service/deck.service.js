"use strict";

(function() {
    angular
        .module("ygodeckprice")
        .service("deckService", ["utilService", deckService]);

    function deckService(utilService) {
        const _this = this;

        /**
         * Read file content to deck
         * @param  {String} content File text
         * @param  {Array} parts   List od deck parts
         * @return {Object}        Deck Id object
         */
        _this.readDeck = function(content, parts) {
            const trim = function(item) {
                return item.length > 2;
            };
            const result = {};
            const arr = content.split(/[#!].+/g).filter(trim);

            //Loop over deck parts
            parts.forEach((deckpart, index) => {
                const currentEntry = arr[index];

                //Push if deck has data for deckpart
                if (currentEntry) {
                    result[deckpart.id] = currentEntry.split("\n").filter(trim).map(card => Number(card));
                }
            });

            return result;
        };

        /**
         * Create array of unique ids
         * @param  {Object} deck Deck Id object
         * @return {Array}      List of unique ids
         */
        _this.getUniqueIds = function(deck) {
            let result = [];

            //push every value to result that doesnt already exist
            utilService.eachObject(deck, deckpart => {
                deckpart.forEach(card => {
                    if (result.indexOf(card) === -1) {
                        result.push(card);
                    }
                });
            });

            //return sorted by lowest to highest
            return result.sort((a, b) => a - b);
        };

        /**
         * Update unique card data
         * @param  {Array}   unique The current unique array
         * @param  {Array}   data   Data to fill in
         * @param  {String}   key   Key to use
         * @param  {Function} fn    Transformer fn
         * @return {Array}          New unique array
         */
        _this.updateUnique = function(unique, data, key, fn) {
            const result = unique;

            data.forEach((item, index) => {
                const itemValue = fn(item, index);

                if (!result[index]) {
                    result[index] = {};
                }

                result[index][key] = itemValue;
            });

            return result;
        };

        /**
         * Updates deck cards from unique array
         * @param  {Object} deck   Deck card object
         * @param  {Array} unique  unique cards array
         * @return {Object}        New deck card object
         */
        _this.updateDeck = function(deck, unique) {
            const result = {};

            utilService.eachObject(deck, (deckpart, key) => {
                result[key] = [];

                deckpart.forEach(id => {
                    const card = unique.find(item => item.id === id);

                    result[key].push(card);
                });
            });

            //console.log(result);
            return result;
        };

        /**
         * Calculates total prices for deck parts
         * @param  {Object} deck Deck card data
         * @return {Object}      Object of total prices
         */
        _this.getTotalPrice = function(deck) {
            const result = {};
            result.total = {
                low: 0,
                average: 0,
                high: 0
            };

            utilService.eachObject(deck, (deckpart, key) => {
                const totalPrice = {
                    low: 0,
                    average: 0,
                    high: 0
                };

                deckpart.forEach(card => {
                    if (card.price.low) {
                        totalPrice.low += card.price.low;
                        totalPrice.average += card.price.average;
                        totalPrice.high += card.price.high;
                    }
                });

                result[key] = totalPrice;
                result.total.low += totalPrice.low;
                result.total.average += totalPrice.average;
                result.total.high += totalPrice.high;
            });

            return result;
        };

    }
})();
