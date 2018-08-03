<?php 

include 'DB_connector.php';


$ddate = $_POST['date'];
// $ddate = "2018-08-01";
$date = new DateTime($ddate);
$week = $date->format("W");
// echo "Weeknumber: $week <br>";


/*
Create a new DateTime object which defaults to now()
Call setISODate to change object to first day of $week of $year instead of now()
Format date as 'Y-m-d' and put in $ret['week_start']
Modify the object by adding 6 days, which will be the end of $week
Format date as 'Y-m-d' and put in $ret['week_end']
*/

function getStartAndEndDate($week, $year) {
  $dto = new DateTime();
  $ret['week_start'] = $dto->setISODate($year, $week)->format('Y-m-d');
  $ret['week_end'] = $dto->modify('+6 days')->format('Y-m-d');
  return $ret;
}

function getDatesFromRange($start, $end){
    $dates = array($start);
    while(end($dates) < $end){
        $dates[] = date('Y-m-d', strtotime(end($dates).' +1 day'));
    }
    return $dates;
}

$week_array = getStartAndEndDate($week,2018);
print_r($week_array);

$start = $week_array['week_start'];
$end = $week_array['week_end'];
$dates = getDatesFromRange($start, $end);
// echo "<pre>";
// print_r($dates);

$sales = array();
foreach ($dates as $d) {
	$date = $d;
	$get_daily_sales = "
						SELECT
						    '$date' AS date, sum(a.cost) as sales
						FROM(
								SELECT 
									i.id, 
									i.name, 
									sum(s.quantity) as quantity, 
									sum(s.chicken_head) as head, 
									sum(cost) as cost
						    	FROM(
						    		SELECT 
							        	p.item_id, 
							        	c.name, 
							        	p.quantity, 
							        	p.rate, 
							        	p.chicken_head, 
							        	round(p.quantity*p.rate , 2) as cost 
							        FROM customers c, purchases p, transactions t
							        WHERE 
							        	c.id = t.customer_id AND 
							        	t.id = p.transaction_id AND 
							        	t.transaction_date = '$date'
							    ) as s,items i 
							    WHERE 
							    	s.item_id = i.id
							    Group By 
							    	s.item_id
						) a
						";
	$result = mysqli_fetch_assoc(mysqli_query($conn, $get_daily_sales));
	if(empty($result['sales'])){
		$result['sales'] = '00.00';
	}
	$sales[] = $result;
}

echo "<pre>";
print_r($sales);


// echo json_encode($sales);


?>