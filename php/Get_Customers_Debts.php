<?php 

include 'DB_connector.php';



$sql_debts = "
			SELECT id, customer_id, name, trans_date, total_purchase_cost, sum(amount_paid), unpaid_purchase_cost, (unpaid_purchase_cost+debt) as total_debt
			FROM (SELECT t.id, c.id as customer_id, c.name, max(t.transaction_date) as trans_date, round(sum(a.cost), 2) as total_purchase_cost, t.amount_paid, (sum(a.cost) - t.amount_paid) as unpaid_purchase_cost, b.debt
				FROM customers c, transactions t,
        			(SELECT p.transaction_id as tid, i.name, p.quantity, p.unit_type AS unit, 'x' as ops, 
            		CASE p.unit_type WHEN 'kg' THEN i.kg_price WHEN 'pcs' THEN i.pcs_price END as price, (p.quantity* 
                	CASE p.unit_type WHEN 'kg' THEN i.kg_price WHEN 'pcs' THEN i.pcs_price END) as cost 
                    FROM purchases p, items i, transactions t 
					WHERE p.item_id = i.id AND t.id = p.transaction_id) a,
        			(SELECT d.customer_id, c.name, max(d.record_date) as date, sum(d.amount) as debt 
        			FROM customers c, debts d WHERE c.id = d.customer_id GROUP BY d.customer_id) b
            		WHERE t.customer_id = c.id AND t.id = a.tid AND c.id = b.customer_id
            GROUP BY t.customer_id) w GROUP BY customer_id
			";

$result = mysqli_query($conn, $sql_debts);
$data = array();
$customer_summary = array();
$debt_details = array();
while ($row = mysqli_fetch_assoc($result)) {
	$customer_summary['summary'] = $row;
	$customer_id = $row['customer_id'];
	$sql_details = "
					SELECT t.id, c.name, t.transaction_date, round(sum(a.cost), 2) as total_purchase, t.amount_paid, round(sum(a.cost) - t.amount_paid, 2) as unpaid_amount 
			        FROM customers c, transactions t, 
			        	(SELECT p.transaction_id as tid, i.name, p.quantity, p.unit_type AS unit, 'x' as ops, 
				            CASE p.unit_type WHEN 'kg' THEN i.kg_price WHEN 'pcs' THEN i.pcs_price END as price, 
				            (p.quantity* CASE p.unit_type WHEN 'kg' THEN i.kg_price WHEN 'pcs' THEN i.pcs_price END) as cost 
			            FROM purchases p, items i, transactions t 
			            WHERE p.item_id = i.id AND t.id = p.transaction_id) a 
			        WHERE t.customer_id = c.id AND t.id = a.tid AND t.customer_id = '$customer_id'
			        GROUP BY t.transaction_date
			         ";
	$details_result = mysqli_query($conn, $sql_debts);
	while ($d = mysqli_fetch_assoc($details_result)) {
		$debt_details[] = $d;
	}
	$customer_summary['details'] = $debt_details;
	$data[] = $customer_summary;
}

echo json_encode($data);


?>