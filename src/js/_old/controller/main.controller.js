"use strict";

(function() {
    angular
        .module("ygodeckprice")
        .controller("MainController", ["utilService", "dataService", "deckService", "encodeService", "apiService", mainCtrl]);

    function mainCtrl(utilService, dataService, deckService, encodeService, apiService) {
        const vm = this;
        const _window = window;
        const _location = _window.location;
        _window.main = vm;

        vm.data = dataService;
        vm.data.options = {
            loaded: false,
            activeAjax: false,
            price: {
                mode: "average",
                currency: "dollar_us"
            }
        };

        /**
         * When deck file is uploaded
         * @param  {String} content File content
         * @param  {String} name    File name
         */
        vm.onUpload = function(content, name) {
            const deckIds = deckService.readDeck(content, vm.data.cards.deck.parts);

            vm.loadDeck(deckIds, name);
        };

        /**
         * When deck exists in URL
         * @param  {String} uri Current URL
         */
        vm.onDeckUri = function(uri) {
            const deckUri = encodeService.decodeUriDeck(uri);

            vm.loadDeck(deckUri.deck, deckUri.name);
        };

        /**
         * Load deck into data and proccess it
         * @param  {Object} deck Deck id list
         * @param  {String} name Deck name
         */
        vm.loadDeck = function(deckIds, name) {
            const uniqueIds = deckService.getUniqueIds(deckIds);

            //Empty old data
            vm.data.cards.unique = [];
            vm.data.cards.deck.cards = {};
            vm.data.cards.deck.price = {};

            vm.data.cards.deck.ids = deckIds;
            vm.data.cards.deck.name = name;
            vm.data.cards.deck.sharelink = utilService.getLocationNoParam(_location) + encodeService.encodeUriDeck(deckIds, name);
            vm.data.cards.unique = deckService.updateUnique(vm.data.cards.unique, uniqueIds, "id", id => id);

            vm.loadNames();
        };


        /**
         * Loads card names for card ids
         */
        vm.loadNames = function() {
            const uniqueIds = vm.data.cards.unique.map(item => item.id);

            apiService.getNames(uniqueIds, _location, uniqueNames => {
                let unique = vm.data.cards.unique;

                unique = deckService.updateUnique(unique, uniqueNames, "name", name => name);
                unique = deckService.updateUnique(unique, uniqueNames, "image", name => `http://yugiohprices.com/api/card_image/${encodeURI(name)}`);
                unique = deckService.updateUnique(unique, uniqueNames, "link", name => `http://yugiohprices.com/card_price?name=${encodeURI(name)}`);

                vm.data.cards.deck.cards = deckService.updateDeck(vm.data.cards.deck.ids, unique);
                vm.data.options.loaded = true;
            });
        };

        /**
         * Loads prices from card names
         */
        vm.loadPrices = function() {
            let unique = vm.data.cards.unique;

            vm.data.options.activeAjax = true;

            apiService.getPrices(unique.map(item => item.name), _location, prices => {

                vm.data.options.activeAjax = false;

                unique = deckService.updateUnique(unique, prices, "price", price => {
                    if (price) {
                        return {
                            low: price.low,
                            average: price.average,
                            high: price.high
                        };
                    } else {
                        return {};
                    }
                });

                vm.data.cards.deck.cards = deckService.updateDeck(vm.data.cards.deck.ids, unique);
                vm.data.cards.deck.price = deckService.getTotalPrice(vm.data.cards.deck.cards);

            });
        };

        /**
         * Calculates value of card in relation to the current currency
         * @param  {Number} val Price in US Dollar
         * @return {String}     Formatted price string
         */
        vm.calcPrice = function(val) {
            const currency = vm.data.price.currency.find(currency => currency.id === vm.data.options.price.currency);
            const float = val * currency.factor;
            const roundedFloat = float.toFixed(2);

            return `${roundedFloat}${currency.label}`;
        };


        //Check for deckUri
        if (_location.search !== "") {
            vm.onDeckUri(_location.search);
        }

    }
})();
