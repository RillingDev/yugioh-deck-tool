import axios from "axios";
import { readFile, writeFile } from "fs/promises";
import { requireNonNilElseThrow } from "lightdash";
import process from "process";

/**
 * This scripts updates the conversion rates in {@link path}
 * based on the latest values available from this API: https://www.frankfurter.app/docs/
 *
 * Usage: Invoke this script with the path to the JSON file as argument.
 */

const ENCODING = "utf8";

const BASE_CURRENCY = "USD";

// Only contains data of the response we need.
interface PartialApiResponse {
    readonly rates: Record<string, number>;
}

const updateConversionRates = async (path: string): Promise<void> => {
    const conversionRates = JSON.parse(
        await readFile(path, { encoding: ENCODING })
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

    await writeFile(path, JSON.stringify(conversionRates), {
        encoding: ENCODING,
    });
};

const path = requireNonNilElseThrow(
    process.argv[2],
    () => new TypeError("No path provided.")
);
updateConversionRates(path)
    .then(() => console.log("Updated conversion rates."))
    .catch((e) => console.error(e));
