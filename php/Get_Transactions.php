<?php 
include 'DB_connector.php';


// $date = date("Y-m-d", strtotime($_POST['date']."+1 days",)));
// $date = $_POST['date'];
$date = '2018-07-20';
$alldata = array();

$sql_get_transactions = "SELECT t.id, c.name, DATE_FORMAT(t.transaction_date, '%b %d, %Y') as transaction_date, round(sum(a.cost), 2) as total, t.amount_paid, round((sum(a.cost) - t.amount_paid), 2) as balance 
        	FROM 
		customers c, 
		transactions t, 
		(SELECT p.transaction_id as tid, p.quantity, p.rate, round(p.quantity*p.rate, 2) as cost 
         FROM purchases p, transactions t 
         WHERE t.id = p.transaction_id) a 
        WHERE t.customer_id = c.id AND t.id = a.tid AND t.transaction_date = '$date'
        GROUP BY t.id
		";

$result1 = mysqli_query($conn, $sql_get_transactions);
$customerdata = array();
while ($row = mysqli_fetch_assoc($result1)) {
	
	$transaction_id = $row['id'];
	
	$sql_get_items  = "SELECT p.transaction_id as tid, i.name, p.quantity, 'x' AS ops, p.rate as price, round((p.quantity*p.rate), 2) as cost, p.chicken_head FROM purchases p, items i, transactions t WHERE p.item_id = i.id AND t.id = p.transaction_id AND t.id = '$transaction_id'";
	
	$items = array();
	$items_sql_result = mysqli_query($conn,$sql_get_items);
	while ($item = mysqli_fetch_assoc($items_sql_result)) {
			$items[] = $item;
	}
	$row['items'] = $items;
	
	$customerdata[] = $row;
}

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
$productsdata = array();
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
	
	$productsdata[] = $row;
}

$alldata['customers'] = $customerdata;
$alldata['products'] = $productsdata;
echo "<pre>";
print_r($alldata);


// header('Content-Type: application/json');
// echo json_encode($data);
?>