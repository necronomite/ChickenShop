<?php 
include 'DB_connector.php';


// $date = $_POST['date'];
$date = '2018-07-20';

$sql_get_product_sales_summary = "
	SELECT i.id, i.name, sum(s.quantity) as quantity, sum(s.chicken_head) as head, sum(cost) as cost
	FROM
    	(SELECT p.item_id, c.name, p.quantity, p.rate, p.chicken_head, round(p.quantity*p.rate , 2) as cost 
    	FROM customers c, purchases p, transactions t
    	WHERE c.id = t.customer_id AND t.id = p.transaction_id AND t.transaction_date = '$date') as s,items i 
	WHERE s.item_id = i.id
	Group By s.item_id
		";

$result = mysqli_query($conn, $sql_get_product_sales_summary);
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
	
	$item_id = $row['id'];
	
	$sql_get_breakdown_sales  = "SELECT c.name, p.quantity, p.rate, p.chicken_head, round(p.quantity*p.rate , 2) as cost 
    				   FROM customers c, purchases p, transactions t
    				   WHERE c.id = t.customer_id AND t.id = p.transaction_id AND t.transaction_date = '$date' AND p.item_id = $item_id
					";
	
	$items = array();
	$items_sql_result = mysqli_query($conn,$sql_get_breakdown_sales);
	while ($item = mysqli_fetch_assoc($items_sql_result)) {
			$items[] = $item;
	}
	$row['items'] = $items; 
	
	$data[] = $row;
}
echo "<pre>";
print_r($data);


// header('Content-Type: application/json');
// echo json_encode($data);
?>