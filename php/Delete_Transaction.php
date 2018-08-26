<?php 

include 'DB_connector.php';


$transaction_id = $_POST['transaction_id'];

/// DELETE THE COPY IN TRANSACTIONS table
mysqli_query($conn," DELETE FROM transactions WHERE id = $transaction_id ;");

header('Content-Type: application/json');
echo json_encode('success');




?>