<?php
// Persian Voice Cloning AI Web App - Main Entry
// Simple router for single-page app

if (isset($_GET['api'])) {
    // API endpoints will be added here later
    header('Content-Type: application/json');
    echo json_encode(['status' => 'API endpoint coming soon']);
    exit;
}

?><!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>کلون صدای فارسی با هوش مصنوعی</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app"></div>
    <script src="app.js"></script>
</body>
</html>