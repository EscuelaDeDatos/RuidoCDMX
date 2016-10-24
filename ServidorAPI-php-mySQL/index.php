<?php 
	if($_GET['arduino_id']){
		$servername = "localhost";
		$username = "userDB";
		$password = "passDB";
		$dbname = "DBname";
		$conn = new mysqli($servername, $username, $password, $dbname);
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$sql = "INSERT INTO arduino_yun (arduino_id,valor) VALUES ('".$_GET['arduino_id']."','".$_GET['valor']."')";

		if ($conn->query($sql) === TRUE) {
			echo "Dato agregado";
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
		$conn->close();
	}
?>