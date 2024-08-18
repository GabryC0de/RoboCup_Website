<?php
session_start();
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
    // reading the database
    if (isset($_POST['email']) && isset($_POST['password'])) {
        function validate($data)
        {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }
    }
    // getting and validating the users info
    $email = validate($_POST['email']);
    $password = validate($_POST['password']);

    if (empty($email)) {
        echo "email was not provided";
        exit();
    } else if (empty($password)) {
        echo "password was not provided";
    }

    $sql = "SELECT * FROM registered_users WHERE userEmail = '$email' AND password = '$password'";
    $result = $conn->query($sql);



    // $executor=$statement->execute();

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) === 1) {
        $row = mysqli_fetch_assoc($result);
        if ($row['userEmail'] === $email && $row['password'] === $password) {
            $_SESSION['userEmail'] = $row['userEmail'];
            $_SESSION['userName'] = $row['userName'];
            $_SESSION['ID'] = $row['ID'];
            header('Location:../users/admin/admin.php');
            exit();
        }
    } else {
        echo "No user with those datas has been found. Try again.";
    }
}