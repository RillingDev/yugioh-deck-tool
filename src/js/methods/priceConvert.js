"use strict";

const priceConvert = function (price) {
    const vm = this;
    const currency = vm.price.currencies.find(item => item.id === vm.price.activeCurrency);
    const val = (price * currency.val).toFixed(2);

    return `${val}${currency.label}`;
};

export default priceConvert;
