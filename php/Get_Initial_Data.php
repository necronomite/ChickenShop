<?php 

include 'DB_connector.php';

$customers_result = mysqli_query($conn, "Select * FROM customers");
$items_result = mysqli_query($conn, "Select * FROM items");               

$data = array();
$customers = array();
$items = array();
while ($row = mysqli_fetch_assoc($customers_result)) {
	$customers[] = $row;
}
while ($row = mysqli_fetch_assoc($items_result)) {
	$items[] = $row;
}
$data['customers'] = $customers;
$data['items'] = $items;

// echo "<pre>";
// print_r($data);
echo json_encode($data);

?>