<?php 

include 'DB_connector.php';


$expense_id = $_POST['expense_id'];
$new_date = $_POST['date'];
$new_source = $_POST['source'];
$new_amount = $_POST['amount']; 

// $expense_id = '5';
// $new_date = '2018-04-26';
// $new_source = 'Salad';
// $new_amount = '1002';



// Get original details
$original_details =  mysqli_fetch_array(mysqli_query($conn, " SELECT *  FROM expenses e WHERE e.id = $expense_id "));
$orig_date = $original_details['record_date'];
$orig_source = $original_details['source'];
$orig_amount = $original_details['amount'];





// Updating  ...............
	
// Updating amount field
	if( $orig_amount != $new_amount){
		mysqli_query($conn, " UPDATE expenses e SET e.amount = $new_amount WHERE e.id = $expense_id; ");
	}

// Updating source field
	if( $orig_source != $new_source ){
		mysqli_query($conn, " UPDATE expenses e SET e.source = '$new_source' WHERE e.id = $expense_id; ");
	}
// Updating date field
	if( $orig_date != $new_date ){
		mysqli_query($conn, " UPDATE expenses e SET e.record_date = '$new_date' WHERE e.id = $expense_id; ");
	}


header('Content-Type: application/json');
echo json_encode('success');




?>