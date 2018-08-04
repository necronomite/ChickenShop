<?php 
include 'DB_connector.php';


$date = $_POST['date'];
$period = $_POST['period'];
// $ddate = '2018-07-20';
// $period = 'week';
// $period = 'month';


$date = new DateTime($ddate);
$year = $date->format("Y");
$month = $date->format("m");

// returns the start and end date of a week
function getStartAndEndDate($week, $year) {
  $dto = new DateTime();
  $ret['week_start'] = $dto->setISODate($year, $week)->format('Y-m-d');
  $ret['week_end'] = $dto->modify('+6 days')->format('Y-m-d');
  return $ret;
}


// storage for data to be returned by this file
$data = array();


// initialize start and end date
if($period == 'week') {

	$week = $date->format("W");
	$week_array = getStartAndEndDate($week,$year);

	$start = $week_array['week_start'];
	$end = $week_array['week_end'];
}
else if ($period == 'month') {
	$start = date('Y-m-01', strtotime($ddate));
	$end = date('Y-m-t', strtotime($ddate));
}




// Get the total count, chicken heads and cost of each item
	$items_data = array();
	$sql_get_product_sales_summary_for_a_week = "
							SELECT items.id, items.name, trans.quantity as sold_quantity, trans.sold_heads, trans.cost as sold_price
	                            FROM
	                                        (
	                                        SELECT i.id, i.name, round(sum(s.quantity), 2) AS quantity, round(sum(s.chicken_head), 2) AS sold_heads, sum(cost) AS cost
	                                        FROM
	                                            (SELECT p.item_id, p.quantity, p.rate, p.chicken_head, round(p.quantity*p.rate , 2) AS cost 
	                                             FROM purchases p, transactions t
	                                             WHERE t.id = p.transaction_id AND t.transaction_date BETWEEN '$start' and '$end'
	                                             ) AS s, 
	                                             items AS i 
	                                        WHERE s.item_id = i.id
	                                        GROUP BY s.item_id
	                                        ) as trans
	                            RIGHT JOIN 
	                                items
	                            ON  (items.id = trans.id)
									";

	$items_result = mysqli_query($conn, $sql_get_product_sales_summary_for_a_week);
	
	while ($row = mysqli_fetch_assoc($items_result)) {
		if ($row['sold_quantity'] == null) { $row['sold_quantity'] = number_format(00.00, 2);	}
		if ($row['sold_heads'] == null) { $row['sold_heads'] = 0; }
		if ($row['sold_price'] == null) { $row['sold_price'] = number_format(00.00, 2); }
		$items_data[] = $row;
	}
	
	$data['product_sales'] = $items_data;






// Get Remaining Count, Chicken Heads, and Cost of each item (or product)
	$get_total_supply = "
						SELECT items.*, supply.supply_cost, supply.supply_heads, supply.supply_quantity
						FROM
							(
							SELECT s.item_id, round(sum(s.quantity*s.rate), 2) as supply_cost, sum(s.heads) as supply_heads, round(sum(s.quantity), 2) as supply_quantity
	                        FROM supplies_logs s
	                        GROUP BY s.item_id
	                        ) as supply
	                    RIGHT JOIN 
	                         items
	                    ON  (items.id = supply.item_id)
	                    ORDER BY supply_cost DESC
					  ";

	$supply_data = array();
	$supply_result = mysqli_query($conn, $get_total_supply);
			
			while ($row = mysqli_fetch_assoc($supply_result)) {
				// change null values to 0 or 0.00
					if ($row['supply_cost'] == null) { $row['supply_cost'] = number_format(00.00, 2);	}
					if ($row['supply_heads'] == null) { $row['supply_heads'] = 0; }
					if ($row['supply_quantity'] == null) { $row['supply_quantity'] = number_format(00.00, 2); }

				// get total sold count of item
					$item_id = $row['id'];
					$sql_get_product_sales_summary = "
		                            SELECT s.item_id, round(sum(s.quantity), 2) AS sold_quantity, round(sum(s.chicken_head), 2) AS sold_heads, sum(cost) AS sold_price
		                            FROM
		                                (SELECT p.item_id, p.quantity, p.rate, p.chicken_head, round(p.quantity*p.rate , 2) AS cost 
		                                 FROM purchases p, transactions t
		                                 WHERE t.id = p.transaction_id AND t.transaction_date AND p.item_id = '$item_id'
		                                 ) AS s
		                            GROUP BY s.item_id
		                            ";
		             $sold_item_result = mysqli_fetch_assoc(mysqli_query($conn, $sql_get_product_sales_summary));

		         // Update the remaining value of item
	             $row['supply_quantity'] = number_format(($row['supply_quantity'] - $sold_item_result['sold_quantity']), 2); //deduct total quantity of sold item to original supply quantity
	             $row['supply_heads'] = number_format(($row['supply_heads'] - $sold_item_result['sold_heads']), 2); //deduct head count of sold item to original supply head count
	             $row['sold_price'] = number_format(($row['supply_cost'] - $sold_item_result['sold_price']), 2); //deduct total cost of sold item to original cost of supply

				
				$supply_data[] = $row;
	}
			
	$data['supply'] = $supply_data;


// echo "start date : $start";
// echo "<br>end date : $end";
// echo "<pre>";
// print_r($data);


// header('Content-Type: application/json');
echo json_encode($data);
?>