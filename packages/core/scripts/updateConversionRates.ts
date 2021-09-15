import axios from "axios";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

/**
 * This scripts updates the conversion rates in {@link CONVERSION_RATES_PATH}
 * based on the latest values available from this API:
 * https://www.frankfurter.app/docs/
 */

const CONVERSION_RATES_PATH = join(
    __dirname,
    "../src/price/currencyConversionRates.json"
);
const ENCODING = "utf8";

const BASE_CURRENCY = "USD";

// Only contains data of the response we need.
interface PartialApiResponse {
    readonly rates: Record<string, number>;
}

const updateConversionRates = async (): Promise<void> => {
    const conversionRates = JSON.parse(
        await readFile(CONVERSION_RATES_PATH, { encoding: ENCODING })
    ) as Record<string, number>;

    const requestedCurrencies = Object.keys(conversionRates).filter(
        (currency) => currency != BASE_CURRENCY
    );

    const response = await axios.get<PartialApiResponse>(
        "https://api.frankfurter.app/latest",
        {
            params: {
                from: BASE_CURRENCY,
                to: requestedCurrencies.join(","),
            },
            responseType: "json",
        }
    );
    const rates = response.data.rates;

    for (const requestedCurrency of requestedCurrencies) {
        if (requestedCurrency in rates) {
            conversionRates[requestedCurrency] = rates[requestedCurrency];
        } else {
            throw new TypeError(
                `Missing currency '${requestedCurrency}' in response.`
            );
        }
    }
    console.log(conversionRates);

    await writeFile(CONVERSION_RATES_PATH, JSON.stringify(conversionRates), {
        encoding: ENCODING,
    });
};

updateConversionRates()
    .then(() => console.log("Updated conversion rates."))
    .catch((e) => console.error(e));
