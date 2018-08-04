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