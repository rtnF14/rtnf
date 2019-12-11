<?php


$config = file_get_contents('config.inf');
$counter_pointer = (int)$config;



$json_string = json_encode($_POST);
$path_string = 'img/'.$counter_pointer.'.json';
$file_handle = fopen($path_string,'w');
fwrite($file_handle,$json_string);
fclose($file_handle);
echo $counter_pointer;
$counter_pointer = (int)$counter_pointer + 1;
file_put_contents('config.inf',$counter_pointer);

?>