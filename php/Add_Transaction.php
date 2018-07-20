<?php 

include 'DB_connector.php';


// $date = $_POST['date'];
// $cname = $_POST['name'];
// $amount_paid = $_POST['amount'];
// $invoice_id = $_POST['invoice_id'];
// $items = json_decode($_POST['items']);


$date = '2018-07-20';
$cname = 'Bestie';
$amount_paid = '000.00';
$invoice_id = '201770005';
$items = [ //item_id, kg, rate, chicken_head
			[1, 5, 60.00, 0],
			[2, 3, 100.00, 0],
			[3, 1, 100.00, 1],
		 ];

//Checks if customer exists in DB, retrieves customer's id
$c_match = mysqli_num_rows(mysqli_query($conn, "SELECT *  FROM customers c WHERE c.name = '$cname'"));
if (!$c_match) { //If customer doesn't exists, add it to DB
	echo "<br>";
	echo "New Customer!";
	mysqli_query($conn, "INSERT INTO customers (id, name) VALUES ('', '$cname')");
}

$c_match = mysqli_fetch_array(mysqli_query($conn, "SELECT c.id  FROM customers c WHERE c.name = '$cname'"));
$c_id = $c_match['id'];
// echo "<br>";
// echo "Customer's ID--> ".$c_id;

// Insert Row In Transactions Table, Get Transaction ID -> $tid
$sql_add_transaction = "INSERT INTO transactions (id, invoice_id, customer_id, amount_paid, transaction_date) VALUES ('', $invoice_id, $c_id, $amount_paid, '$date')";

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
		// echo "Recorded new item entry for purchases."; //item_id, kg, rate, chicken_head
		$item_id = $item['0'];
		$quantity = $item['1'];
		$rate = $item['2'];
		$chicken_head = $item['3'];
		mysqli_query($conn,"INSERT INTO purchases (transaction_id, item_id, quantity, rate, chicken_head) VALUES ( $tid, $item_id, $quantity, $rate, $chicken_head)");
	}
}

// print_r($items[1]);
header('Content-Type: application/json');
echo json_encode('success');




?>