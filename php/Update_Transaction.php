<?php 

include 'DB_connector.php';

// Editing is for the transaction details only
// editable fields:
// 					Cname
// 					amount
// 					invoice
// 					items:
// 						name
// 						heads
// 						kilograms
// 						rate

$transaction_id = $_POST['transaction_id'];
$date = $_POST['date'];
$new_cname = $_POST['name'];
$new_amount_paid = $_POST['amount'];
$new_invoice_id = $_POST['invoice_id'];
$new_items = json_decode($_POST['items']);


// $date = '2018-07-20';
// $cname = 'Bestie';
// $amount_paid = '000.00';
// $invoice_id = '201770005';
// $items = [ //item_id, kg, rate, chicken_head
// 			[1, 5, 60.00, 0],
// 			[2, 3, 100.00, 0],
// 			[3, 1, 100.00, 1],
// 		 ];





// Get transaction's original details
$original_transaction =  mysqli_fetch_array(mysqli_query($conn, "SELECT *  FROM transactions t WHERE t.id = $transaction_id "));
$transaction_id = $original_transaction['id'];
$orig_invoice = $original_transaction['invoice_id'];
$orig_customer_id = $original_transaction['customer_id'];
$orig_amount_paid = $original_transaction['amount_paid'];





// Updating Customer ID ...............
	//Checks if customer exists in DB, retrieves customer's id
	$c_match = mysqli_num_rows(mysqli_query($conn, "SELECT *  FROM customers c WHERE c.name = '$new_cname'"));
	if (!$c_match) { //If customer doesn't exists, add it to DB
		mysqli_query($conn, "INSERT INTO customers (id, name) VALUES ('', '$new_cname')");
	}
	// Get customer's ID
	$c_match = mysqli_fetch_array(mysqli_query($conn, "SELECT c.id  FROM customers c WHERE c.name = '$new_cname'"));
	$new_c_id = $c_match['id'];


	if( $orig_customer_id != $new_c_id ){
		mysqli_query($conn, "UPDATE `transactions` SET `customer_id` = $new_c_id WHERE `transactions`.`id` = $transaction_id;");
	}

// Updating amount paid field
	if( $orig_amount_paid != $new_amount_paid ){
		mysqli_query($conn, "UPDATE `transactions` SET `amount_paid` = $new_amount_paid WHERE `transactions`.`id` = $transaction_id;");
	}

// Updating invoice paid field
	if( $orig_invoice != $new_invoice_id ){
		mysqli_query($conn, "UPDATE `transactions` SET `invoice_id` = '$new_invoice_id' WHERE `transactions`.`id` = $transaction_id;");
	}




// Updating  each item in the Purchases Table if they are changed
if (count($new_items)>0) {

	// For UPDATING AND ADDING ITEMS
	foreach($new_items as $item) {
		$new_item_id = $item['0'];
		$new_quantity = $item['1'];
		$new_rate = $item['2'];
		$new_chicken_head = $item['3'];

		// check if item is in purchases
		$item_exists = mysqli_fetch_array(mysqli_query($conn, "SELECT count(*) as count FROM purchases p WHERE p.transaction_id = $transaction_id AND p.item_id =  $new_item_id "));
		
		// If item exists in purchases, update fields accordingly
		if($item_exists['count'] == 1){
			$item_query = mysqli_query($conn, "SELECT * FROM purchases p WHERE p.transaction_id = $transaction_id AND p.item_id =  $new_item_id ");
			// look for the original details of each item
			$purchase_match =  mysqli_fetch_array($item_query);
				$original_quantity = $purchase_match['quantity'];
				$original_rate = $purchase_match['rate'];
				$original_chicken_head = $purchase_match['chicken_head'];

			// Update item's quantity
			if( $original_quantity != $new_quantity ){
				mysqli_query($conn, "UPDATE `purchases` SET `quantity` = $new_quantity WHERE `purchases`.`transaction_id` = $transaction_id AND `purchases`.`item_id` = $new_item_id ;");
			}

			// Update item's rate
			if( $original_rate != $new_rate ){
				mysqli_query($conn, "UPDATE `purchases` SET `rate` = $new_rate WHERE `purchases`.`transaction_id` = $transaction_id AND `purchases`.`item_id` = $new_item_id ;");
			}

			// Update item's chicken_head
			if( $original_chicken_head != $new_chicken_head ){
				mysqli_query($conn, "UPDATE `purchases` SET `chicken_head` = $new_chicken_head WHERE `purchases`.`transaction_id` = $transaction_id AND `purchases`.`item_id` = $new_item_id ;");
			}
		}
		// else, if it's a new item, add it in purchases table
		else if ($item_exists['count'] == 0){
			mysqli_query($conn, "INSERT INTO purchases (transaction_id, item_id, quantity, rate, chicken_head) VALUES ( $transaction_id, $new_item_id, $new_quantity, $new_rate, $new_chicken_head );");
		}
	}//END OF FORLOOP FOR UPDATING AND ADDING ITEMS




	// For Deleting Items
		$inDB_items_exists = mysqli_fetch_array(mysqli_query($conn, "SELECT count(*) as count FROM purchases p WHERE p.transaction_id = $transaction_id ;"));

		$delete_queries = '';
			if($inDB_items_exists['count'] != 0){
				$inDB_items = mysqli_query($conn, "SELECT * FROM purchases p WHERE p.transaction_id = $transaction_id");
				while ($item_row = mysqli_fetch_assoc($inDB_items)) {
					$inDB_item_id = $item_row['item_id'];
					$found = 0;
					foreach($new_items as $item) {
						$new_item_id = $item['0'];
					
						if( $inDB_item_id == $new_item_id ){ 
								$found = 1;
								break;
						}
					}

					if($found == 0){
						$delete_queries .= " DELETE FROM `purchases` WHERE `purchases`.`item_id`= $inDB_item_id AND `purchases`.`transaction_id` = $transaction_id; ";
					}
				}
			}
		// END of block for Deleting Items
		// run all queries for deleting
		mysqli_multi_query($conn,$delete_queries);

}


// print_r($items[1]);
header('Content-Type: application/json');
echo json_encode('success');




?>