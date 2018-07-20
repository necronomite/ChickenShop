<?php 

include 'DB_connector.php';

$expenses = json_decode($_POST['expenses']);
$date = $_POST['date'];
// $date = '2017-04-26';
// $expenses = [	['Electric Bill', 1000.00],
// 				['Coffee', 100.00]
// 			];

if (count($expenses)>0) {
	// echo "has content";
	foreach($expenses as $exp) {
		$source = $exp['0'];
		$amount = $exp['1'];
		mysqli_query($conn,"INSERT INTO expenses (record_date, source, amount) VALUES ( '$date', '$source', $amount)");
	}
}

echo json_encode('success');


?>