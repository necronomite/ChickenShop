<?php 

include 'DB_connector.php';

//details
$record_date = $_POST['date'];
$amount = $_POST['amount']; 
$customer_id = $_POST['customer_id'];

// DELETE THE COPY IN PAYMENTS table
mysqli_query($conn," DELETE FROM payments 
				     WHERE customer_id = $customer_id AND record_date = '$record_date' AND amount = $amount;");

header('Content-Type: application/json');
echo json_encode('success');




?>