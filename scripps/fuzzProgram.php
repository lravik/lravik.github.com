<? 

echo "FuzzBuzz Program using PHP\n";

$numList;

for($i = 1; $i < 102; $i++) {
	$numList[] = $i;
}

foreach($numList as $key => $value) {
	echo $key ." -- ". $value."\n";
}

?>
