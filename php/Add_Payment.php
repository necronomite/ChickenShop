<?php 

include 'DB_connector.php';

$cname = $_POST['name'];
$payment_amount = $_POST['amount'];

$date = date("Y-m-d");






// retrieves customer's id

$c_match = mysqli_fetch_array(mysqli_query($conn, "SELECT c.id  FROM customers c WHERE c.name = '$cname'"));
$c_id = $c_match['id'];


// Insert payment into Payments Table 
if ($payment_amount > 0) {
	mysqli_query($conn,"INSERT INTO payments (record_date, customer_id, amount) VALUES ( '$date', $c_id, $payment_amount)");
	echo json_encode('Success!');
}
else{
	echo json_encode('Payment not recorded. Given was not greater than 0.00');
}




?>