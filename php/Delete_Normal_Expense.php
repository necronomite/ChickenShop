<?php 

include 'DB_connector.php';

$expense_id = $_POST['expense_id'];

// DELETE THE COPY IN EXPENSES
mysqli_query($conn," DELETE FROM expenses WHERE id = '$expense_id' ;");

header('Content-Type: application/json');
echo json_encode('success');




?>