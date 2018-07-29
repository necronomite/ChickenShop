<?php 

include 'DB_connector.php';

$customers_result = mysqli_query($conn, "SELECT * FROM customers");
$items_result = mysqli_query($conn, "SELECT * FROM items");
$suppliers_result = mysqli_query($conn, "SELECT *  FROM suppliers");     

$data = array();
$customers = array();
$items = array();
$suppliers = array();

while ($row = mysqli_fetch_assoc($customers_result)) {
	$customers[] = $row;
}
while ($row = mysqli_fetch_assoc($items_result)) {
	$items[] = $row;
}
while ($row = mysqli_fetch_assoc($suppliers_result)) {
	$suppliers[] = $row;
}
$data['customers'] = $customers;
$data['items'] = $items;
$data['suppliers'] = $suppliers;

echo json_encode($data);

?>