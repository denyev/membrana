<?php

use PHPMailer\PHPMailer\PHPMailer;

include('libs/vendor/autoload.php');
include('libs/PHPMailer.php');

if (
    empty($_SERVER['HTTP_X_REQUESTED_WITH']) ||
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest'
) {
    header('HTTP/1.0 403 Forbidden');
    die(403);
}

// ===== Reference =====
if (isset($_POST["name"])) {
    $name = htmlentities(trim($_POST['name']), ENT_QUOTES);
}
if (isset($_POST["email"])) {
    $email = htmlentities(trim($_POST['email']), ENT_QUOTES);
} else {
    $email = "no-reply@" . $_SERVER['HTTP_HOST'];;
}
if (isset($_POST["phone"])) {
    $phone = htmlentities(trim($_POST['phone']), ENT_QUOTES);
}
if (isset($_POST["message"])) {
    $text = htmlentities(trim($_POST['message']), ENT_QUOTES);
}
if (isset($_POST["length"])) {
    $length = htmlentities(trim($_POST['length']), ENT_QUOTES);
}
if (isset($_POST["width"])) {
    $width = htmlentities(trim($_POST['width']), ENT_QUOTES);
}
if (isset($_POST["square"])) {
    $square = htmlentities(trim($_POST['square']), ENT_QUOTES);
}
if (isset($_POST["depth"])) {
    $depth = htmlentities(trim($_POST['depth']), ENT_QUOTES);
}
if (isset($_POST["baseOption"])) {
    $baseOption = htmlentities(trim($_POST['baseOption']), ENT_QUOTES);
}
if (isset($_POST["stuffOption"])) {
    $stuffOption = htmlentities(trim($_POST['stuffOption']), ENT_QUOTES);
}
if (isset($_POST["mountingOption"])) {
    $mountingOption = htmlentities(trim($_POST['mountingOption']), ENT_QUOTES);
}
if (isset($_POST["depth"])) {
    $depth = htmlentities(trim($_POST['depth']), ENT_QUOTES);
}
if (isset($_POST["title"])) {
    $title = htmlentities(trim($_POST['title']), ENT_QUOTES);
}
if ( $_FILES["file"]["name"] != "" ) {
    $attachment = chunk_split(base64_encode(file_get_contents($_FILES["file"]["tmp_name"])));
    $filename = $_FILES["file"]["name"];
    $boundary = md5(date('r', time()));
}

// ===== Variables =====
$to = "spamcheck@strogov.ru"; // E-mail на который присылать письмо
$fromEmail = "no-reply@" . $_SERVER['HTTP_HOST']; // E-mail от имени которого приходит письмо. Почта на домене сайта.
$subject = $title;
$recepient = "spamcheck@strogov.ru";
$message = '';

function adopt($text)
{
    return '=?UTF-8?B?' . base64_encode($text) . '?=';
}

$message = '<html><body>';
$message .= "<table>";
if (!empty($name)) {
    $message .= "<tr>";
    $message .= "<td>";
    $message .= "<strong> Имя: </strong>";
    $message .= "</td>";
    $message .= "<td style='padding-left:12px;'>";
    $message .= "$name";
    $message .= "</td>";
    $message .= "</tr>";
}
if (!empty($email) && ($email != $fromEmail)) {
    $message .= "<tr>";
    $message .= "<td>";
    $message .= "<strong> E-mail: </strong>";
    $message .= "</td>";
    $message .= "<td style='padding-left:12px;'>";
    $message .= "$email";
    $message .= "</td>";
    $message .= "</tr>";
}
if (!empty($phone)) {
    $message .= "<tr>";
    $message .= "<td>";
    $message .= "<strong> Телефон: </strong>";
    $message .= "</td>";
    $message .= "<td style='padding-left:12px;'>";
    $message .= "$phone";
    $message .= "</td>";
    $message .= "</tr>";
}
if (!empty($text)) {
    $message .= "<tr>";
    $message .= "<td>";
    $message .= "<strong> Сообщение: </strong>";
    $message .= "</td>";
    $message .= "<td style='padding-left:12px;'>";
    $message .= "$text";
    $message .= "</td>";
    $message .= "</tr>";
}

$message .= "</table><br><br>";

//if ($_FILES["file"]["name"] != "") {
//    $message .= "$attachment
//--_1_$boundary--";
//}

$message .= '</body></html>';
$headers = "MIME-Version: 1.0" . PHP_EOL .
    "Content-Type: text/html; charset=utf-8" . PHP_EOL .
    'From: ' . adopt($name) . ' <' . $fromEmail . '>' . PHP_EOL .
    'Reply-To: ' . adopt($name) . ' <' . $email . '> ' . PHP_EOL;

//if ($_FILES["file"]["name"] != "") {
//    $headers .= "\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"_1_$boundary\"";
//}

if ($_FILES["file"]["name"] != "") {

    $mail = new PHPMailer();
    $mail->IsHTML(true);
    $mail->From      = $fromEmail;
    $mail->FromName  = adopt($name);
    $mail->Subject   = $subject;
    $mail->Body      = $message;
    $mail->AddAddress( $recepient );

    $file_tmp  = $_FILES["file"]["tmp_name"];
    $file_name = $_FILES["file"]["name"];
    $encoding = 'base64';
    $type = 'application/octet-stream';

    $mail->AddAttachment($file_tmp, $file_name, $encoding, $type);

    $mail->Send();
} else {
    mail($to, adopt($subject), $message, $headers);
}





?>