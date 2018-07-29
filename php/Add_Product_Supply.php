<?php 

include 'DB_connector.php';


$date = $_POST['date'];
$sname = $_POST['supplier'];
$items = json_decode($_POST['items']);
// [item_name, quantity, rate, heads]

$new_suppliers = array();

//Checks if supplier exists in DB, retrieves supplier's id
$s_match = mysqli_num_rows(mysqli_query($conn, "SELECT *  FROM suppliers s WHERE s.name = '$sname'"));
if (!$s_match) { //If supplier doesn't exists, add it to DB
	mysqli_query($conn, "INSERT INTO suppliers (id, name) VALUES ('', '$sname')");
	$new_suppliers[] = $sname;
}		

$s_match = mysqli_fetch_array(mysqli_query($conn, "SELECT s.id  FROM suppliers s WHERE s.name = '$sname'"));
$supplier_id = $s_match['id'];





$new_items = array();

// Insert each items into Purchases Table if they are provided
if (count($items)>0) {
	// echo "has content";
	foreach($items as $item) {

		$item_name = $item['0'];

		//Check if item exists in DB, retrieves item's id
			$item_match = mysqli_num_rows(mysqli_query($conn, "SELECT *  FROM items i WHERE i.name = '$item_name'"));
			if (!$item_match) { //If item doesn't exists, add it to DB
				mysqli_query($conn, "INSERT INTO items (id, name) VALUES ('', '$item_name')");
				$new_items[] = $item_name;
			}
			//retrieve item's id
			$item_match = mysqli_fetch_array(mysqli_query($conn, "SELECT i.id  FROM items i WHERE i.name = '$item_name'"));
			$item_id = $item_match['id'];


		
		$quantity = $item['1'];
		$rate = $item['2'];
		$chicken_heads = $item['3'];
		mysqli_query($conn,"INSERT INTO  supplies_logs (log_date, supplier_id, item_id, quantity, rate, heads) VALUES ( '$date', $supplier_id, $item_id, $quantity, $rate, $chicken_heads)");
	}
}

//send back list (array) of new items and suppliers
$new_items_and_suppliers = array();
$new_items_and_suppliers['items'] = $new_items;
$new_items_and_suppliers['suppliers'] = $new_suppliers;

// print_r($items[1]);
header('Content-Type: application/json');
echo json_encode($new_items_and_suppliers);




?>