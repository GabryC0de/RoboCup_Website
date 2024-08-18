<?php
// connecting to the database

$host = 'localhost';
$root = 'root';
$serverPass = '';
$db = 'robo_db';

$conn = new mysqli($host, $root, $serverPass, $db);

// checking the connection
if ($conn === false) {
    echo "$conn->connect_error";
    die("Connection Failed : " . $conn->connect_error);
} else {
    // populating the database
    $sql = "INSERT INTO registered_users (userName, userEmail, password) VALUES (?, ?, ?)";
    if ($statement = $conn->prepare($sql)) {
        $statement->bind_param("sss", $userName, $email, $password);

        // getting the users info
        $userName = $_POST['userName'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $statement->execute();
        
    }
    header('Location:../users/login.html');
    $statement->close();
    $conn->close();
    echo "<script>alert('Your account has been succesfully registered');</script>";
}