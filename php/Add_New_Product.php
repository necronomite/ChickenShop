<?php 

include 'DB_connector.php';

// $date = $_POST['date'];
$cname = $_POST['name'];
$debt_amount = $_POST['amount'];

$date = date("Y-m-d");
// $cname = 'Raraa';
// $debt_amount = '100.00';






//Checks if customer exists in DB, retrieves customer's id
$p_match = mysqli_num_rows(mysqli_query($conn, "SELECT *  FROM items p WHERE p.name = '$pname'"));
if (!$p_match) { //If customer doesn't exists, add it to DB
	mysqli_query($conn, "INSERT INTO items (id, name) VALUES ('', '$pname')");
}

$p_match = mysqli_fetch_array(mysqli_query($conn, "SELECT p.id  FROM items p WHERE p.name = '$pname'"));
$p_id = $p_match['id'];


// Insert balance into Debts Table if greater then 0.00
if ($debt_amount > 0) {
	mysqli_query($conn,"INSERT INTO debts (record_date, customer_id, amount) VALUES ( '$date', $c_id, $debt_amount)");
}



echo json_encode('Success!');


?>