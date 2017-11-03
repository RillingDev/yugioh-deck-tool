const priceConvert = (val, currency) => (val * currency.val).toFixed(2) + currency.label;

export default priceConvert;
