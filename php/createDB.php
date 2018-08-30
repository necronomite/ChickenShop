<?php 
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "chicken";

function populateTables($servername, $username, $password, $dbname){
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	echo "<br>Filling in tables.....<br>";


	// Values for Items
			$filler = "INSERT INTO items (id, name) VALUES 
										('', 'Chicken'),
										('', 'Liver'),
										('', 'Gizzard'),
										('', 'Intestine'),
										('', 'Large'),
										('', 'Provent'),
										('', 'Spleen'),
										('', 'Head'),
										('', 'Feet'),
										('', 'Crops'),
										('', 'Blood'),
										('', 'Fats'),
										('', 'Breast'),
										('', 'Neck')
										;";
	

	//Values for Suppliers
		$filler .= "INSERT INTO suppliers (id, name) VALUES ('', 'Ronel'), ('', 'Magnolia'), ('', 'Vita'), ('', 'Gama');";
	

	// Values for tables Customers
	    $filler .= "INSERT INTO customers (id, name) VALUES 
	    						('', 'Sanny Servidad'),
								('', 'Ninfa Saligumba'),
								('', 'Bebeng'),
								('', 'Meatshop'),
								('', 'Gina'),
								('', 'Alog'),
								('', 'Nono'),
								('', 'Anthony Lanit'),
								('', 'Nonoy'),
								('', 'Fe'),
								('', 'Melbertos'),
								('', 'Malou'),
								('', 'Alicia'),
								('', 'Mylene'),
								('', 'Cheche'),
								('', 'Victor'),
								('', 'Nelson'),
								('', 'Jambam'),
								('', 'Francis'),
								('', 'Romar'),
								('', 'RJL'),
								('', 'marjorie'),
								('', 'MARJORIE'),
								('', 'Linda'),
								('', 'Aragrace'),
								('', 'Nono Lamila'),
								('', 'Beth Penuela'),
								('', 'Nicole'),
								('', 'Kagawad'),
								('', 'Agnes'),
								('', 'Dyna'),
								('', 'Cash'),
								('', 'Lito');";


	// Values for Transactions
		$filler .= "INSERT INTO transactions (id, invoice_id, customer_id, amount_paid, transaction_date) VALUES 
												('','20187001', 1, 100.00,'2018-08-28' ),
												('','20187002', 2, 100.00,'2018-08-28' ),
												('','20187003', 3, 100.00,'2018-08-28' ),
												('','20187004', 3, 100.00,'2018-08-28' ),
												('','20187005', 4, 100.00,'2018-08-28' ),
												('','20187006', 5, 100.00,'2018-08-28' ),
												('','20187007', 6, 100.00,'2018-08-28' ),
												('','20187008', 7, 100.00,'2018-08-28' ),
												('','20187009', 8, 100.00,'2018-08-28' ),
												('','20187010', 9, 100.00,'2018-08-28' ),
												('','20187011', 10, 100.00,'2018-08-28' );";

		
	


	// Values for Purchases
			$filler .= "INSERT INTO purchases (transaction_id, item_id, quantity, rate, chicken_head) VALUES 
												( 1, 1, 1.00, 125.00, 1),	
												( 1, 2, 1.00, 130.00, 0), 
												( 1, 3, 1.00, 115.00, 0),  
												( 1, 4, 1.00, 65.00, 0),
												( 1, 5, 1.00, 65.00, 0),
												( 1, 6, 1.00, 65.00, 0),
												( 1, 7, 1.00, 65.00, 0),
												( 2, 1, 1.00, 125.00, 1),
												( 3, 1, 1.00, 125.00, 1),
												( 3, 2, 1.00, 130.00, 0),
												( 3, 3, 1.00, 115.00, 0),
												( 4, 4, 1.00, 65.00, 0),
												( 4, 5, 1.00, 65.00, 0),
												( 4, 6, 1.00, 65.00, 0),  
												( 4, 7, 1.00, 65.00, 0),  
												( 4, 8, 1.00, 65.00, 0),  
												( 4, 10, 1.00, 65.00, 0),

												( 5, 4, 1.00, 65.00, 0),
												( 5, 5, 1.00, 65.00, 0),
												( 5, 6, 1.00, 65.00, 0),  
												( 5, 7, 1.00, 65.00, 0),  
												( 5, 8, 1.00, 65.00, 0),  
												( 5, 10, 1.00, 65.00, 0),

												( 6, 4, 1.00, 65.00, 0),
												( 6, 5, 1.00, 65.00, 0),
												( 6, 6, 1.00, 65.00, 0),  
												( 6, 7, 1.00, 65.00, 0),  
												( 6, 8, 1.00, 65.00, 0),  
												( 6, 10, 1.00, 65.00, 0),

												( 7, 4, 1.00, 65.00, 0),
												( 7, 5, 1.00, 65.00, 0),
												( 7, 6, 1.00, 65.00, 0),  
												( 7, 7, 1.00, 65.00, 0),  
												( 7, 8, 1.00, 65.00, 0),  
												( 7, 10, 1.00, 65.00, 0),

												( 8, 4, 1.00, 65.00, 0),
												( 8, 5, 1.00, 65.00, 0),
												( 8, 6, 1.00, 65.00, 0),  
												( 8, 7, 1.00, 65.00, 0),  
												( 8, 8, 1.00, 65.00, 0),  
												( 8, 10, 1.00, 65.00, 0),      
												( 8, 9, 3.00, 65.00, 0);";
	// Values for Supplies Logs
		$filler .= "INSERT INTO supplies_logs (log_date, supplier_id, item_id, quantity, rate, heads) VALUES 
												( '2018-08-28', 1, 2, 5.00, 65.00, 0),
												( '2018-08-28', 1, 8, 15.00, 40.00, 0),
												( '2018-08-28', 1, 9, 15.00, 60.00, 0),
												( '2018-08-28', 2, 4, 4.00, 65.00, 0),
												( '2018-08-28', 2, 6, 2.00, 40.00, 0),
												( '2018-08-28', 2, 9, 20.00, 60.00, 0);";

	// Values for Debts
			$filler .= "INSERT INTO debts (record_date, customer_id, amount) VALUES 
												('2018-04-26', 1, 5000.00),
												('2018-07-19', 1, 1000.00),
												('2018-04-28', 2, 00.00),
												('2018-04-29', 2, 7000.00);";
	// Values for Payments
			$filler .= "INSERT INTO payments (record_date, customer_id, amount) VALUES 
												('2018-04-26', 2, 5000.00),
												('2018-07-19', 1, 1000.00);";

	// Values for Expenses
			$filler .= "INSERT INTO expenses (id, record_date, source, amount) VALUES 
											 ( '', '2018-08-28', 'Fuel', 300.00),
											 ( '', '2018-08-28', 'Salary', 2000.00),
											 ( '', '2018-08-28', 'Salary1', 2000.00),
											 ( '', '2018-08-28', 'Salary2', 2000.00),
											 ( '', '2018-08-28', 'Salary3', 2000.00),
											 ( '', '2018-08-28', 'Coffee', 100.00)
											 ;";



	if (mysqli_multi_query($conn,$filler)){
	    echo "Tables were filled in successfully.";
	} else {
	    echo "Error filling in table: " . $conn->error;
	}
}

function createTables($servername, $username, $password, $dbname){
	
    echo "Creating tables now... <br/>";
    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 
		// sql to create table
	$sql = "CREATE TABLE customers (
				id 	 INT(100) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
				name VARCHAR(100) NOT NULL
				);
				CREATE TABLE items (   -- this table holds the selling prices
					id 	 INT(100) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
					name VARCHAR(100) NOT NULL
				);
				CREATE TABLE suppliers (
					id 	 INT(100) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
					name VARCHAR(100) NOT NULL
				);
				CREATE TABLE transactions (
					id 					INT(100) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
					invoice_id          VARCHAR(50),
					customer_id 		INT(100) NOT NULL,
					amount_paid 		DECIMAL(10,2) NOT NULL,
					transaction_date 	DATE
				);
				CREATE TABLE purchases (
					transaction_id INT(100),
					item_id INT(100),					
					quantity DECIMAL(10, 2),
					rate DECIMAL(10, 2),
					chicken_head INT(50)
				);
				CREATE TABLE supplies_logs (
					log_date DATE,
					supplier_id INT(100),
					item_id INT(100),					
					quantity DECIMAL(10, 2),
					rate DECIMAL(10, 2),
					heads INT(100)
				);
				CREATE TABLE debts (
					record_date DATE,
					customer_id INT(100),					
					amount DECIMAL(10, 2)
				);
				CREATE TABLE payments (
					record_date DATE,
					customer_id INT(100),					
					amount DECIMAL(10, 2)
				);
				CREATE TABLE expenses (
					id 		INT(100) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
					record_date DATE,
					source VARCHAR(100),					
					amount DECIMAL(10, 2)
				);
		";

	if (mysqli_multi_query($conn,$sql)){
	    echo "Tables were created successfully.";
	    populateTables($servername, $username, $password, $dbname);
	} else {
	    echo "Error creating table: " . $conn->error;
	}

	
}



// Create connection
$conn = mysqli_connect($servername, $username, $password);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
// Drop Database if already exists
$sql = "DROP DATABASE ".$dbname;
if (mysqli_query($conn, $sql)) {
    echo "Database " . $dbname . " was successfully dropped. <br>";
} else {
    echo 'Error dropping database: ' . $conn->connect_error . "<br>";
}

// Create database
$sql = "CREATE DATABASE ".$dbname;
if (mysqli_query($conn, $sql)) {
    echo "Database " . $dbname . " was created successfully. <br/>";
    createTables($servername, $username, $password, $dbname);
} else {
	    echo "Error creating database: " . mysqli_error($conn);
}


 ?>