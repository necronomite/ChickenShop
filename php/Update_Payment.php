<?php 

include 'DB_connector.php';

// old details
$old_record_date = $_POST['old_date'];
$old_amount = $_POST['old_amount']; 

$customer_id = $_POST['customer_id'];

// new details
$new_record_date = $_POST['new_date'];
$new_amount = $_POST['new_amount']; 






// Updating  ...............
	
	// Updating both RECORD_DATE and AMOUNT field
	if( 
		( $old_record_date != $new_record_date)  &&
		( $old_amount != $new_amount)            
	  ){
		mysqli_query($conn, " UPDATE payments p 
							  SET p.record_date = '$new_record_date', p.amount = $new_amount 
			                  WHERE p.customer_id = $customer_id AND p.record_date = '$old_record_date' AND p.amount = $old_amount; ");
	   }
	//Updating either one of the changed fields
	else{
		if ($old_record_date != $new_record_date) {
			mysqli_query($conn, " UPDATE payments p SET p.record_date = '$new_record_date' 
				                  WHERE p.customer_id = $customer_id AND p.record_date = '$old_record_date' AND p.amount = $old_amount; ");
		}
		elseif ($old_amount != $new_amount) {
			mysqli_query($conn, " UPDATE payments p SET p.amount = $new_amount 
				                  WHERE p.customer_id = $customer_id AND p.record_date = '$old_record_date' AND p.amount = $old_amount; ");
		}
	}


header('Content-Type: application/json');
echo json_encode('success');




?>