<?php
if(isset($_POST["go"])) {
    
    // ===== Reference =====
    if( isset($_POST["name"]) ) {
        $name = $_POST["name"];
    }
    if( isset($_POST["email"]) ) {
        $email = $_POST["email"];
    }
    if( isset($_POST["phone"]) ) {
        $phone = $_POST["phone"];
    } 
    if( isset($_POST["message"]) ) {
        $text = $_POST["message"];
    }

    // ===== Variables =====
    $to = "spamcheck@strogov.ru"; // E-mail на который присылать письмо
    $fromEmail = "no-reply@membrana.denyev.ru"; // E-mail от имени которого приходит письмо. Почта на домене сайта.
    $subject = "Форма обратной связи";

    if ( isset($_POST["submitCallback"]) ) {
        $subject = "Заказан обратный звонок";        
    }
    if ( isset($_POST["submitFeedback"]) ) {
        $subject = "Обращение из формы обратной связи";        
    }

    function adopt($text) {
        return '=?UTF-8?B?'.base64_encode($text).'?=';
    }

    $message  = '<html><body>';
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
    if (!empty($email)) {
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
    $message .= '</body></html>';
    $headers = "MIME-Version: 1.0" . PHP_EOL .
               "Content-Type: text/html; charset=utf-8" . PHP_EOL .
               'From: '.adopt($name).' <'.$fromEmail.'>' . PHP_EOL .
               'Reply-To: '.adopt($name).' <'.$email.'> ' . PHP_EOL;

    if (mail($to, adopt($subject), $message, $headers)) {
        $answer = '1';
    } else {
        $answer = '0';
    }
    die($answer);        
} ?>