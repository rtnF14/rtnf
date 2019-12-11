<title>rtnF NodeManager</title>
<style>

a {
	text-decoration: none;
}

ul {
	list-style: none inside;
	width: 70%;
}



.nodetext{
	padding: 5px 0px;
  padding-left: 14px;
}

li:hover{
	background-color: #e5f3ff;
	cursor: pointer;
}

body {
	font-family: helvetica;
}

.container {
margin-top: 88px;
    margin-left: 164px;
}

.sidebar {
	top: 69px;
  margin-left: 0px;
  height: 100%;
  position: fixed;
  border-right: 1px solid #068db9;
  z-index: 30;
  width: 170px;

}

</style>

<?php

//Access all files in wiki.d folder
$files = array_slice(scandir('../../wiki.d'),2);


echo "<div class='sidebar'></div>";

echo "<div class='container'>";
echo "<ul>";

//Iterate each file
foreach ($files as $a) {

	//Show only node under Main namespace
	$namespace = substr($a,0,5);
	if($namespace == "Main."){
		//Extract nodeKey
		$nodeKey = substr($a,5);
		//Create nodeURL
		$nodeURL = "http://localhost/r/Main/" . $nodeKey;

		echo "<li>";
		echo "<div class='nodetext'>".$nodeKey."</div>";
		echo "</li>";
		$hrefstring = "<a href='" . $nodeURL ."'>" . $nodeKey . "</a>";
		$b = $hrefstring . "<br>";
		//echo $b;		
	}

}

echo "</ul>";
echo "</div>";

?>