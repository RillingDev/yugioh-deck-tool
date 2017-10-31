<?php

$cardUri = $_GET["n"];
$cardNames = json_decode(base64_decode($cardUri));
$requests = [];
$result = [];


/**
* Creates a curl object for every name we query
*/
foreach ($cardNames as $currentIndex => $cardName) {
    $url = "http://yugiohprices.com/api/get_card_prices/".urlencode($cardName);
    $requests[$currentIndex] = curl_init();

    curl_setopt($requests[$currentIndex], CURLOPT_URL, $url);
    curl_setopt($requests[$currentIndex], CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)');
    curl_setopt($requests[$currentIndex], CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($requests[$currentIndex], CURLOPT_CONNECTTIMEOUT, 1000);
    curl_setopt($requests[$currentIndex], CURLOPT_TIMEOUT, 1000);
}


// build the multi-curl handle, adding all curls
$mh = curl_multi_init();
foreach ($requests as $request) {
    curl_multi_add_handle($mh, $request);
}

// execute all queries simultaneously, and continue when all are complete
$running = null;
do {
    curl_multi_exec($mh, $running);
} while ($running);


//close the handles
foreach ($requests as $request) {
    curl_multi_remove_handle($mh, $request);
}
curl_multi_close($mh);


/**
* Transforms output
*/
foreach ($requests as $request) {
    $response = json_decode(curl_multi_getcontent($request));
    $data = false;

    if ($response && $response->status==="success") {
        //We only need the price data of the first entry
        $data = $response->data[0]->price_data->data->prices;
    }

    array_push($result, $data);
}

echo json_encode($result);
