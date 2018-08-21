<?php 

include 'DB_connector.php';


$supplier_id = $_POST['old_supplier_id'];
$date = $_POST['old_date'];

/// DELETE THE COPY IN SUPPLIES_LOGS
mysqli_query($conn," DELETE FROM supplies_logs WHERE log_date = '$date' AND supplier_id = $supplier_id ;");

header('Content-Type: application/json');
echo json_encode('success');




?>