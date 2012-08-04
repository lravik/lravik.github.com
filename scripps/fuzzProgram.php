<? 

echo "FuzzBuzz Program using PHP\n";

$numList;

for($i = 1; $i < 102; $i++) {
	$numList[] = $i;
}

foreach($numList as $key => $value) {
	$threeVal = $value%3;
	$fiveVal = $value%5;
	if ($threeVal == 0 && $fiveVal == 0) {
		echo "FuzzBuzz\n";
	} else if ($threeVal != 0 && $fiveVal == 0) {
		echo "Buzz\n";
	} else if ($threeVal == 0 && $fiveVal != 0) {
		echo "Fuzz\n";
	} else {
		echo $value."\n";
	}
}

?>
