<?php 

include 'DB_connector.php';


$date = $_POST['date'];
$cname = $_POST['name'];
$amount_paid = $_POST['amount'];
$debt_amount = $_POST['balance'];
$items = json_decode($_POST['items']);


// $date = '2017-04-26';
// $cname = 'Raraa';
// $amount_paid = '000.00';
// $debt_amount = '100.00';
// $items = [
// 			['1', 5, 'kg'],
// 			['2', 3, 'kg'],
// 			['3', 1, 'kg'],
// 		 ];

//Checks if customer exists in DB, retrieves customer's id
$c_match = mysqli_num_rows(mysqli_query($conn, "SELECT *  FROM customers c WHERE c.name = '$cname'"));
if (!$c_match) { //If customer doesn't exists, add it to DB
	// echo "<br>";
	// echo "New Customer!";
	mysqli_query($conn, "INSERT INTO customers (id, name) VALUES ('', '$cname')");
}

$c_match = mysqli_fetch_array(mysqli_query($conn, "SELECT c.id  FROM customers c WHERE c.name = '$cname'"));
$c_id = $c_match['id'];
// echo "<br>";
// echo "Customer's ID--> ".$c_id;

// Insert Row In Transactions Table, Get Transaction ID -> $tid
$sql_add_transaction = "INSERT INTO transactions (id, customer_id, amount_paid, transaction_date) VALUES ('', $c_id, $amount_paid, '$date')";
mysqli_query($conn, $sql_add_transaction);
$tid = mysqli_insert_id($conn);

// echo "<br>";
// echo "Added new transaction. Here's the ID--> ".$tid;
// echo count($items);

// Insert each items into Purchases Table if they are provided
if (count($items)>0) {
	// echo "has content";
	foreach($items as $item) {
		// echo "<br>";
		// echo "Recorded new item entry for purchases.";
		$item_id = $item['0'];
		$quantity = $item['1'];
		$unit_type = $item['2'];
		mysqli_query($conn,"INSERT INTO purchases (transaction_id, item_id, quantity, unit_type) VALUES ( $tid, $item_id, $quantity, '$unit_type')");
	}
	$data = 'has inserted items!';
}




// Insert balance into Debts Table if greater then 0.00
if ($debt_amount > 0) {
	// echo "<br>";
	// echo "Recorded new debt entry.";
	mysqli_query($conn,"INSERT INTO debts (record_date, customer_id, amount) VALUES ( '$date', $c_id, $debt_amount)");
}
// print_r($items[1]);
header('Content-Type: application/json');
echo json_encode($data);




?>