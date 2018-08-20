<?php 

include 'DB_connector.php';

$date = $_POST['date'];
// $date = '2018-07-31';

$sql_get_exps = "SELECT * FROM expenses WHERE record_date='$date'";


$result_exps = mysqli_query($conn, $sql_get_exps);
$data_exp = array();
while ($row = mysqli_fetch_assoc($result_exps)) {
	$data_exp[] = $row;
}


// expenses from supplies
//  supplier_name, total
$sql_get_supplies = "SELECT s.name, s.id, supplier_id, round(sum(l.quantity*l.rate)) AS total
					 FROM supplies_logs l, suppliers s
					 WHERE l.log_date = '$date' AND s.id = l.supplier_id
					 GROUP BY l.supplier_id";
$result_suppliers = mysqli_query($conn, $sql_get_supplies);
$data_supps = array();
while ($row = mysqli_fetch_assoc($result_suppliers)) {
	$s_id = $row['supplier_id'];
	//list of products per supplier
		$sql_get_products = "SELECT i.name, s.quantity, s.rate, s.heads
						 FROM supplies_logs s, items i
						 WHERE log_date = '$date' AND s.supplier_id = '$s_id' AND i.id = s.item_id";
		$result_products = mysqli_query($conn, $sql_get_products);
		$data_holder = array();
		while ($temp_row = mysqli_fetch_assoc($result_products)) {
			$data_holder[] = $temp_row;
		}

	$row['products'] = $data_holder;
	$data_supps[] = $row;
}


$data = array();
$data['expenses'] = $data_exp;
$data['supply'] = $data_supps;

// echo "<pre>";
// print_r($data);
echo json_encode($data);


?>