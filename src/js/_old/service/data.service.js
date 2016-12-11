"use strict";

(function() {
    angular
        .module("ygodeckprice")
        .service("dataService", dataService);

    function dataService() {
        const _this = this;

        _this.cards = {
            unique: [],
            deck: {
                name: "",
                sharelink: "",
                ids: {},
                cards: {},
                price: {},
                parts: [{
                    id: "main",
                    name: "Main",
                    size: [0, 60],
                    color: "#b99273"
                }, {
                    id: "extra",
                    name: "Extra",
                    size: [0, 15],
                    color: "#c786c7"
                }, {
                    id: "side",
                    name: "Side",
                    size: [0, 15],
                    color: "#65af6c"
                }]
            }
        };

        _this.price = {
            modes: [{
                id: "low",
                name: "Low",
                color: "#caf9ae"
            }, {
                id: "average",
                name: "Average",
                color: "#fff6a1"
            }, {
                id: "high",
                name: "High",
                color: "#fdc1b0"
            }],
            currency: [{
                id: "dollar_us",
                name: "US Dollar",
                label: "$",
                factor: 1
            }, {
                id: "euro",
                name: "Euro",
                label: "€",
                factor: 0.89
            }, {
                id: "pound",
                name: "Pound",
                label: "£",
                factor: 0.77
            }, {
                id: "dollar_ca",
                name: "Canadian Dollar",
                label: "$",
                factor: 1.32
            }, {
                id: "dollar_au",
                name: "Australian Dollar",
                label: "$",
                factor: 1.31
            }]
        };
    }
})();
