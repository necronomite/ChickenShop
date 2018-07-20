<?php 

include 'DB_connector.php';

// $date = $_POST['date'];
$date = '2017-04-26';

$sql_get_exps = "SELECT * FROM expenses WHERE record_date='$date'";
$result = mysqli_query($conn, $sql_get_exps);
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
	$data[] = $row;
}



echo json_encode($data);


?>