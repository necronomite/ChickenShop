<?php 

include 'DB_connector.php';

// $date = $_POST['date'];
// $cname = $_POST['name'];
// $debt_amount = $_POST['amount'];

$date = '2017-04-26';
$cname = 'Raraa';
$debt_amount = '100.00';






//Checks if customer exists in DB, retrieves customer's id
$c_match = mysqli_num_rows(mysqli_query($conn, "SELECT *  FROM customers c WHERE c.name = '$cname'"));
if (!$c_match) { //If customer doesn't exists, add it to DB
	mysqli_query($conn, "INSERT INTO customers (id, name) VALUES ('', '$cname')");
}

$c_match = mysqli_fetch_array(mysqli_query($conn, "SELECT c.id  FROM customers c WHERE c.name = '$cname'"));
$c_id = $c_match['id'];


// Insert balance into Debts Table if greater then 0.00
if ($debt_amount > 0) {
	mysqli_query($conn,"INSERT INTO debts (record_date, customer_id, amount) VALUES ( '$date', $c_id, $debt_amount)");
}



echo json_encode('Success!');


?>