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

// Build the multi-curl handle, adding all curls
$mh = curl_multi_init();

foreach ($requests as $request) {
    curl_multi_add_handle($mh, $request);
}

// Execute all queries simultaneously, and continue when all are complete
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
    $data = null;

    if ($response && $response->status==="success") {
        // We only need the price data of the first entry
        $prices = $response->data[0]->price_data->data->prices;
        // And only three props from that
        $data = [$prices->low, $prices->average, $prices->high];
    }

    array_push($result, $data);
}

echo json_encode($result);
