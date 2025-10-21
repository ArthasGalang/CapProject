<?php
$cacert = "C:/xampp/php-8.4.11/extras/ssl/cacert.pem";
echo file_exists($cacert) ? "File exists<br>" : "File missing<br>";
$ch = curl_init("https://www.google.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CAINFO, $cacert); // Directly set CA file
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification
$result = curl_exec($ch);
if(curl_errno($ch)){
    echo 'Curl error: ' . curl_error($ch);
} else {
    echo 'Success';
}
curl_close($ch);
?>