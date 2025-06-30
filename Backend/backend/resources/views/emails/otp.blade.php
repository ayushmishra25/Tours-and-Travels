<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset OTP - Sahyog Force</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Hello,</h2>
    <p>We received a request to reset your password. Please use the One-Time Password (OTP) below to proceed:</p>
    
    <p style="font-size: 18px;">
        <strong>Your OTP:</strong> <span style="color: #2c3e50; font-weight: bold;">{{ $otp }}</span>
    </p>

    <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>

    <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>

    <br>
    <p>Thank you,<br>
    <strong>Sahyog Force Team</strong></p>
</body>
</html>
