<?php

$cardUri = $_GET["n"];
$cardNames = json_decode(base64_decode($cardUri));
$requests = [];
$result = [];



// Creates a curl object for every name to query
foreach ($cardNames as $currentIndex => $cardName) {
    $url = "http://yugiohprices.com/api/get_card_prices/".urlencode($cardName);
    $requests[$currentIndex] = curl_init();

    curl_setopt($requests[$currentIndex], CURLOPT_URL, $url);
    curl_setopt($requests[$currentIndex], CURLOPT_RETURNTRANSFER, 1);
}

$mh = curl_multi_init();

foreach ($requests as $request) {
    curl_multi_add_handle($mh, $request);
}

$running = null;

do {
    curl_multi_exec($mh, $running);
} while ($running);

// Close the handles
foreach ($requests as $request) {
    curl_multi_remove_handle($mh, $request);
}

curl_multi_close($mh);



// Transforms output
foreach ($requests as $request) {
    $response = json_decode(curl_multi_getcontent($request));
    $data = [0, 0, 0];

    if (
        $response &&
        $response->status === "success" &&
        $response->data[0] &&
        $response->data[0]->price_data->status==="success"
    ) {
        // We only need the price data of the first entry
        $prices = $response->data[0]->price_data->data->prices;

        // And only three props from that
        $priceLow = $prices->low;
        $priceAverage = $prices->average;
        $priceHigh = $prices->high;

        $data = [
            is_null($priceLow) ? 0 : $priceLow,
            is_null($priceAverage) ? 0 : $priceAverage,
            is_null($priceHigh) ? 0 : $priceHigh,
        ];
    }

    array_push($result, $data);
}

echo json_encode($result);
