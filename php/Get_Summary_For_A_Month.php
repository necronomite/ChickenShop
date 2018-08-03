<?php 

include 'DB_connector.php';


// $ddate = $_POST['date'];
$ddate = "2018-07-01";
$date = new DateTime($ddate);
$year = $date->format("Y");
$month = $date->format("m");

echo "Month: $month <br>";
echo '<br> First day'.date('Y-m-01', strtotime($ddate));
echo '<br> Last day'.date('Y-m-t', strtotime($ddate)); 


function getDatesFromRange($start, $end){
    $dates = array($start);
    while(end($dates) < $end){
        $dates[] = date('Y-m-d', strtotime(end($dates).' +1 day'));
    }
    return $dates;
}

$start = date('Y-m-01', strtotime($ddate));
$end = date('Y-m-t', strtotime($ddate));
$dates = getDatesFromRange($start, $end);

$total_debts = 00.00;
$total_expenses = 00.00;

$debt_result = mysqli_fetch_assoc(mysqli_query($conn,"SELECT sum(d.amount) as total_debts
										             FROM debts d
										             WHERE d.record_date BETWEEN '$start' AND '$end'"));
$total_debts += $debt_result['total_debts'];

$exp_result = mysqli_fetch_assoc(mysqli_query($conn,"SELECT sum(e.amount) as total_expenses
										             FROM expenses e
										             WHERE e.record_date BETWEEN '$start' AND '$end'"));
$total_expenses += $exp_result['total_expenses'];



$total_sales = 00.00;
$sales = array();
foreach ($dates as $d) {
	$date = $d;
	$get_daily_sales = "
						SELECT
						    '$date' AS date, sum(a.cost) as sales
						FROM (SELECT i.id, i.name, sum(s.quantity) as quantity, sum(s.chicken_head) as head, sum(cost) as cost
						    	FROM
							        (SELECT p.item_id, c.name, p.quantity, p.rate, p.chicken_head, round(p.quantity*p.rate , 2) as cost 
							        FROM customers c, purchases p, transactions t
							        WHERE c.id = t.customer_id AND t.id = p.transaction_id AND t.transaction_date = '$date') as s,items i 
							    WHERE s.item_id = i.id
							    Group By s.item_id) a
						";
	$result = mysqli_fetch_assoc(mysqli_query($conn, $get_daily_sales));
	if(empty($result['sales'])){
		$result['sales'] = '00.00';
	}

	$total_sales += (float) $result['sales'];

	$sales[''.$date] = $result['sales'];
}
$details = array();

$details['total_sales'] = number_format($total_sales, 2);
$details['total_debts'] = number_format($total_debts, 2);
$details['total_coh'] = 0;
$details['total_expenses'] = number_format($total_expenses, 2);
$details['total_profit'] = 0;


$data = array();
$data['individual_sales'] = $sales;
$data['sales_details'] = $details;

echo "<pre>";
print_r($data);


echo json_encode($data);


?>