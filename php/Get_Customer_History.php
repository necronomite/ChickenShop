<?php 
include 'DB_connector.php';


// $start_date = $_POST['start_date'];
// $end_date = $_POST['end_date'];
// $name = $_POST['name'];

$start_date = '2018-07-19';
$end_date = '2018-07-20';
$name = 'Sanny Servidad';

$sql_cid_result = mysqli_fetch_assoc(mysqli_query($conn,"SELECT id FROM customers WHERE name = '$name'"));

$customer_id = $sql_cid_result['id'];

$sql_get_transactions = "
	SELECT * FROM 
		((SELECT '' as tid, d.record_date as transaction_date, 'debt' as type, d.amount as total_price, '0.00' as paid
			FROM debts d, customers c
			WHERE c.id = d.customer_id AND c.id = '$customer_id' AND d.record_date BETWEEN '$start_date' AND '$end_date')
		UNION
		(SELECT t.id as tid, s.transaction_date, 'purchase' as type, sum(s.cost) as total_price, t.amount_paid as paid
			FROM transactions t, 
			(SELECT t.id, t.transaction_date, t.customer_id, p.item_id, p.quantity, p.rate, round(p.quantity*p.rate, 2) as cost
			     
			     FROM transactions t, purchases p
			     
			     WHERE t.id = p.transaction_id AND t.customer_id='$customer_id' AND t.transaction_date BETWEEN '$start_date' AND '$end_date') as s
			WHERE t.id = s.id
			Group By t.transaction_date)
		UNION 
		(SELECT '' as tid, p.record_date as transaction_date, 'payment' as type, '0.00' as total_price, p.amount as paid
			FROM payments p, customers c
			WHERE c.id = p.customer_id AND c.id = '$customer_id' AND p.record_date BETWEEN '$start_date' AND '$end_date')
		              
		 ) g
	ORDER By g.transaction_date
		";

$result = mysqli_query($conn, $sql_get_transactions);
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
	if ($row['type'] == 'purchase') {
		$transaction_id = $row['tid'];
		$sql_get_items  = "
			SELECT  i.name, p.quantity, p.rate, round(p.quantity*p.rate, 2) as cost, p.chicken_head
			FROM purchases p, items i
			WHERE '$transaction_id' = p.transaction_id AND p.item_id = i.id
			";
	
		$items = array();
		$items_sql_result = mysqli_query($conn,$sql_get_items);
		while ($item = mysqli_fetch_assoc($items_sql_result)) {
				$items[] = $item;
		}
		$row['items'] = $items;
	}
	
	$data[] = $row;
}
echo "<pre>";
print_r($data);


// header('Content-Type: application/json');
// echo json_encode($data);
?>