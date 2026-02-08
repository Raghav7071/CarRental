import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        let transporter;

        // Check if real SMTP credentials are provided, otherwise use Ethereal
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        } else {
            // Create a test account for Ethereal
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log("Using Ethereal Mail for testing.");
            console.log(`User: ${testAccount.user}, Pass: ${testAccount.pass}`);
        }

        const info = await transporter.sendMail({
            from: '"Car Rental App" <no-reply@carrental.com>',
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        // Helper to see the email in browser for Ethereal
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

export default sendEmail;
