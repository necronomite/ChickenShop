<?php 

include 'DB_connector.php';
/*
					log_date DATE,
					supplier_id INT(100),
					---------------------
					item_id INT(100),					
					quantity DECIMAL(10, 2),
					rate DECIMAL(10, 2),
					heads INT(100)
*/
$old_supplier_id = $_POST['old_supplier_id'];
$old_date = $_POST['old_date'];

$supplier_name = $_POST['supplier'];
$new_date = $_POST['date'];
$new_products = json_decode($_POST['items']);




// FIRST, we need to update each product in the Supplies_Logs Table if it has a new value
if (count($new_products)>0) {

	// For UPDATING AND ADDING PRODUCTS
	foreach($new_products as $product) {
		$new_product_id = $product['0'];
		$new_quantity = $product['1'];
		$new_rate = $product['2'];
		$new_heads = $product['3'];

		// check if product is in supplies_logs
		$item_exists = mysqli_fetch_array(mysqli_query($conn, " SELECT count(*) as count FROM supplies_logs s WHERE s.log_date = '$old_date' AND s.supplier_id = $old_supplier_id "));
		
		// If itproducteproductm exists, update fields accordingly
		if($item_exists['count'] == 1){


			// look for the original details of each product
			$item_query = mysqli_query($conn, "SELECT * FROM supplies_logs s WHERE s.log_date = '$old_date' AND s.supplier_id = $old_supplier_id ");
			$product_match =  mysqli_fetch_array($item_query);
				$original_product_id = $product_match['item_id'];				
				$original_quantity = $product_match['quantity'];
				$original_rate = $product_match['rate'];
				$original_head = $product_match['heads'];

			// Update product's quantity
			if( $original_quantity != $new_quantity ){
				mysqli_query($conn, "UPDATE supplies_logs SET quantity = $new_quantity WHERE log_date = '$old_date' AND supplier_id = $old_supplier_id AND item_id = $original_product_id ;");
			}

			// Update product's rate
			if( $original_rate != $new_rate ){
				mysqli_query($conn, "UPDATE supplies_logs SET rate = $new_rate WHERE log_date = '$old_date' AND supplier_id = $old_supplier_id AND item_id = $original_product_id ;");
			}

			// Update product's chicken_head
			if( $original_chicken_head != $new_heads ){
				mysqli_query($conn, "UPDATE supplies_logs SET heads = $new_heads WHERE log_date = '$old_date' AND supplier_id = $old_supplier_id AND item_id = $original_product_id ;");
			}
		}
		// else, if it's a new product, add it in purchases table
		else if ($item_exists['count'] == 0){
			mysqli_query($conn, "INSERT INTO supplies_logs (log_date, supplier_id, item_id, quantity, rate, heads) VALUES ( '$old_date', $old_supplier_id, $new_quantity, $new_rate, $new_heads );");
		}
	}//END OF FORLOOP FOR UPDATING AND ADDING PRODUCTS




	// For Deleting PRODUCTS
		$inDB_products_exists = mysqli_fetch_array(mysqli_query($conn, "SELECT count(*) as count FROM supplies_logs s  WHERE s.log_date = '$old_date' AND s.supplier_id = $old_supplier_id ;"));

		$delete_queries = '';
			if($inDB_products_exists['count'] != 0){
				$inDB_products = mysqli_query($conn, "SELECT * FROM supplies_logs s  WHERE s.log_date = '$old_date' AND s.supplier_id = $old_supplier_id ;");
				while ($product_row = mysqli_fetch_assoc($inDB_products)) {
					$inDB_product_id = $product_row['item_id'];
					$found = 0;
					foreach($new_products as $product) {
						$new_product_id = $product['0'];
					
						if( $inDB_product_id == $new_product_id ){ 
								$found = 1;
								break;
						}
					}

					if($found == 0){
						$delete_queries .= " DELETE FROM supplies_logs WHERE log_date = '$old_date' AND supplier_id = $old_supplier_id AND item_id = $inDB_product_id ;";
					}
				}
			}
		// END of block for Deleting Products
		// run all queries for deleting
		mysqli_multi_query($conn,$delete_queries);

}
// else{
// 	// Since there are no item in the items list, we can safely DELETE the data of given old_supplier_id on specified old_date.
// 	// QUESTION -> But why would our user edit the name and date of a certain supply_log if they delete the products listed in it?
// }



// LAST MOVE IS TO UPDATE THE LOG_DATE AND THE SUPPLIER_ID
	$real_log_date = $old_date;
	if( $old_date != $new_date ){
		mysqli_query($conn, " UPDATE supplies_logs s SET s.log_date = '$new_date' WHERE s.log_date = '$old_date' AND s.supplier_id = '$old_supplier_id'; ");
		$real_log_date = $new_date;
	}
	// For Updating the Supplier_ID, we have to know if the supplier's name is still thesame
	// Check if cutomer is in DB
	$supplier_match = mysqli_num_rows(mysqli_query($conn, "SELECT *  FROM suppliers s WHERE s.name = '$supplier_name'"));
	if (!$supplier_match) { //If customer doesn't exists, add it to DB
		mysqli_query($conn, "INSERT INTO suppliers (id, name) VALUES ('', '$supplier_name')");
	}
	// Get suppliers's ID
	$supplier_match = mysqli_fetch_array(mysqli_query($conn, "SELECT s.id  FROM suppliers s WHERE s.name = '$supplier_name'"));
	$new_supplier_id = $supplier_match['id'];
	if( $old_supplier_id != $new_supplier_id ){
		mysqli_query($conn, " UPDATE supplies_logs s SET s.supplier_id = '$new_supplier_id' WHERE s.log_date = '$real_log_date' AND s.supplier_id = '$old_supplier_id'; ");
	}




header('Content-Type: application/json');
echo json_encode('success');




?>