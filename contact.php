<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    // Change these values to your email and phone number's email address
    $to = "bnbrck@gmail.com";
    $phoneNumber = "3606073110"; // Recipient's phone number

    $subject = "New Message from Contact Form";
    $body = "Name: $name\nEmail: $email\nMessage: $message";

    // Send email to your email address
    mail($to, $subject, $body);

    // Send email to your phone number's email address (for SMS)
    mail($phoneNumber, $subject, $body);

    // Redirect back to the contact page with a success message
    header("Location: contact.html?status=success");
    exit();
}
?>