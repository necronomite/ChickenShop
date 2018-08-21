<?php 

include 'DB_connector.php';


$old_supplier_id = $_POST['old_supplier_id'];
$old_date = $_POST['old_date'];

$new_supplier_name = $_POST['supplier'];
$new_date = $_POST['date'];
$new_products = json_decode($_POST['items']);


// DELETE THE COPY IN SUPPLIES_LOGS
mysqli_query($conn," DELETE FROM supplies_logs WHERE log_date = '$old_date' AND supplier_id = $old_supplier_id ;");

// INSERT EVERYTHING IN SUPPLIES_LOGS
foreach($new_products as $product) {


		// Get new product's ID
			$new_product_name = $product['0'];
			// check if product is in items table
				$product_exists = mysqli_fetch_array(mysqli_query($conn, " SELECT count(*) as count FROM items i WHERE i.name = '$new_product_name' ;"));
				// If product doesn't exist, add it in items table
				if($product_exists['count'] == 0){
					mysqli_query($conn, "INSERT INTO items (id, name) VALUES ('', '$new_product_name')");
				}
				$get_product_id = mysqli_fetch_array(mysqli_query($conn, " SELECT id FROM items i WHERE i.name = '$new_product_name' ;"));
		
		$new_product_id = $get_product_id['id'];
		$new_quantity = $product['1'];
		$new_rate = $product['2'];
		$new_heads = $product['3'];

		// Check if new_supplier name exists in supplier's table
			$supplier_exists = mysqli_fetch_array(mysqli_query($conn, " SELECT count(*) as count FROM suppliers s WHERE s.name = '$new_supplier_name' ;"));
			// If supplier doesn't exist, add it in suppliers table
			if($supplier_exists['count'] == 0){
				mysqli_query($conn, "INSERT INTO suppliers (id, name) VALUES ('', '$new_supplier_name')");
			}
			$get_new_supplier_id = mysqli_fetch_array(mysqli_query($conn, " SELECT id FROM suppliers s WHERE s.name = '$new_supplier_name' ;"));

		$new_supplier_id = $get_new_supplier_id['id'];

		// INSERTING SUPPLY DATA
		mysqli_query($conn, "INSERT INTO supplies_logs (log_date, supplier_id, item_id, quantity, rate, heads) VALUES ( '$new_date', $new_supplier_id, $new_product_id, $new_quantity, $new_rate, $new_heads );");
}


header('Content-Type: application/json');
echo json_encode('success');




?>