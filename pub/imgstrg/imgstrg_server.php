<?php


$img_id = $_GET['id'];
$path = $path_string = 'img/'.$img_id.'.json';
$raw_data = file_get_contents($path);
$raw_data = json_decode($raw_data);
//$raw_data = $raw_data.dataurl;
//var_dump($raw_data);
echo $raw_data->{'dataURL'};
?>