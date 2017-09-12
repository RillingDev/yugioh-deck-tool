const priceForCard = function (id, mode) {
    const vm = this;
    const price = vm.cards.data[id].price[mode];

    if (price) {
        return vm.priceConvert(price);
    } else {
        return "Not found";
    }
};

export default priceForCard;
