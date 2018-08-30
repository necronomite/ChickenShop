<?php 
include 'DB_connector.php';


$sql_all_customers = mysqli_query($conn,"SELECT * FROM customers");
$all_data = array();
while ($row = mysqli_fetch_assoc($sql_all_customers)) {

	$customer_id = $row['id'];

		$sql_get_transactions = "
			SELECT * 

			FROM 

				(
					(
						SELECT '' as tid, d.record_date as transaction_date, 'debt' as type, d.amount as total_price, '0.00' as paid, '' as invoice
						FROM debts d, customers c
						WHERE c.id = d.customer_id AND c.id = '$customer_id'
					)

					UNION

					(
						SELECT t.id as tid, s.transaction_date, 'purchase' as type, sum(s.cost) as total_price, t.amount_paid as paid, s.invoice
						FROM transactions t, 	
						(
							SELECT t.id, t.transaction_date, t.customer_id, p.item_id, p.quantity, p.rate, round(p.quantity*p.rate, 2) as cost, t.invoice_id as invoice
						    FROM transactions t, purchases p
						    WHERE t.id = p.transaction_id AND t.customer_id='$customer_id'
						) as s
						WHERE t.id = s.id
						GROUP BY t.transaction_date
					)

					UNION 

					(
						SELECT '' as tid, p.record_date as transaction_date, 'payment' as type, '0.00' as total_price, p.amount as paid, '' as invoice
						FROM payments p, customers c
						WHERE c.id = p.customer_id AND c.id = '$customer_id'
					)
					              
				) AS g

			ORDER BY g.transaction_date
			";

		$result = mysqli_query($conn, $sql_get_transactions);

		$data = array();
		while ($row_temp = mysqli_fetch_assoc($result)) {
			if ($row_temp['type'] == 'purchase') {
				$transaction_id = $row_temp['tid'];
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
				$row_temp['items'] = $items;
			}
			
			$data[] = $row_temp;
		}//end of inner while

	$name = $row['name'];
	$all_data[''.$name] = $data;
	
}//end of main while




// echo "<pre>";
// print_r($all_data);


// header('Content-Type: application/json');
echo json_encode($all_data);
?>