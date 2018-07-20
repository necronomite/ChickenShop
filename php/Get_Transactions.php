<?php 
include 'DB_connector.php';


// $date = date("Y-m-d", strtotime($_POST['date']."+1 days",)));
// $date = $_POST['date'];
$date = '2018-07-20';

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

$result = mysqli_query($conn, $sql_get_transactions);
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
	
	$transaction_id = $row['id'];
	
	$sql_get_items  = "SELECT p.transaction_id as tid, i.name, p.quantity, 'x' AS ops, p.rate as price, round((p.quantity*p.rate), 2) as cost, p.chicken_head FROM purchases p, items i, transactions t WHERE p.item_id = i.id AND t.id = p.transaction_id AND t.id = '$transaction_id'";
	
	$items = array();
	$items_sql_result = mysqli_query($conn,$sql_get_items);
	while ($item = mysqli_fetch_assoc($items_sql_result)) {
			$items[] = $item;
	}
	$row['items'] = $items;
	
	$data[] = $row;
}
// echo "<pre>";
// print_r($data);


header('Content-Type: application/json');
echo json_encode($data);
?>