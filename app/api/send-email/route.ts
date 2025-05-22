import { NextRequest, NextResponse } from 'next/server';
import Mailjet from 'node-mailjet';

// Initialize Mailjet with API key and secret
// In production, you should use environment variables
// You'll need to sign up for Mailjet and get API credentials
const MAILJET_API_KEY = process.env.MAILJET_API_KEY || 'YOUR_MAILJET_API_KEY';
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET || 'YOUR_MAILJET_API_SECRET';

// Log API credentials for debugging (remove in production)
console.log('Mailjet API Key:', MAILJET_API_KEY.substring(0, 5) + '...');
console.log('Mailjet API Secret:', MAILJET_API_SECRET.substring(0, 5) + '...');

// Create Mailjet client
const mailjet = new Mailjet({
  apiKey: MAILJET_API_KEY,
  apiSecret: MAILJET_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, message, invoiceData } = body;

    if (!to || !subject || !invoiceData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Your Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 0 0 5px 5px;
          }
          .invoice-details {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .invoice-table th, .invoice-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          .invoice-table th {
            background-color: #f8f9fa;
          }
          .total-row {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          .button {
            display: inline-block;
            background-color: #D5FC51;
            color: #2A2A2A;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
          }
          .message-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-radius: 5px 5px 0 0; border-bottom: 3px solid #D5FC51;">
            <div style="margin-bottom: 20px;">
              <span style="display: inline-block; width: 50px; height: 50px; background-color: #D5FC51; border-radius: 50%; text-align: center; line-height: 50px; font-size: 24px; font-weight: bold; color: #2A2A2A;">F</span>
            </div>
            <h1 style="margin: 0 0 10px 0; color: #2A2A2A; font-size: 28px;">Invoice #${invoiceData.invoiceNumber}</h1>
            <p style="margin: 0; color: #666; font-size: 16px;">Thank you for choosing FitnessHub!</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #888;">Invoice Date: ${invoiceData.date}</p>
          </div>
          <div class="content" style="padding: 30px; background-color: white; border: 1px solid #eee; border-top: none; border-radius: 0 0 5px 5px;">
            <!-- Message from sender (if any) -->
            ${message ? `<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 25px; border-left: 4px solid #D5FC51;">${message}</div>` : ''}

            <!-- FULL INVOICE IMAGE - No need to click anything -->
            <div style="margin-bottom: 30px;">
              <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; border: 1px solid #eee; border-bottom: none;">
                <h2 style="margin: 0; font-size: 20px; color: #2A2A2A;">COMPLETE INVOICE</h2>
                <p style="margin: 5px 0 0 0; color: #666;">Your full invoice is displayed below</p>
              </div>

              <!-- Complete Invoice as a single visual unit -->
              <div style="border: 1px solid #eee; border-radius: 0 0 5px 5px; background-color: white; padding: 30px;">
                <!-- Header -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                  <tr>
                    <td width="50%" style="vertical-align: top;">
                      <div style="display: flex; align-items: center;">
                        <div style="display: inline-block; width: 40px; height: 40px; background-color: #D5FC51; border-radius: 50%; text-align: center; line-height: 40px; font-size: 20px; font-weight: bold; color: #2A2A2A; margin-right: 10px;">F</div>
                        <div>
                          <h2 style="margin: 0; font-size: 20px; color: #2A2A2A;">FitnessHub</h2>
                          <p style="margin: 0; font-size: 12px; color: #666;">Your Fitness Journey Partner</p>
                        </div>
                      </div>
                    </td>
                    <td width="50%" style="vertical-align: top; text-align: right;">
                      <div style="background-color: #f8f9fa; display: inline-block; padding: 10px 15px; border-radius: 5px;">
                        <h3 style="margin: 0; font-size: 16px; color: #2A2A2A;">INVOICE</h3>
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">#${invoiceData.invoiceNumber}</p>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Date: ${invoiceData.date}</p>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Billing Info -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                  <tr>
                    <td width="48%" style="vertical-align: top; padding-right: 2%;">
                      <h4 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 1px;">Billed To</h4>
                      <p style="margin: 0 0 5px 0; font-weight: bold; color: #2A2A2A;">${invoiceData.customerName}</p>
                      <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">${invoiceData.customerEmail}</p>
                    </td>
                    <td width="48%" style="vertical-align: top; padding-left: 2%;">
                      <h4 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 1px;">Payment Information</h4>
                      <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;"><strong>Method:</strong> Credit Card (ending in ${invoiceData.cardLast4 || '****'})</p>
                      <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;"><strong>Status:</strong> <span style="color: #4CAF50;">✓ Paid</span></p>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <div style="height: 1px; background-color: #eee; margin: 20px 0;"></div>

                <!-- Invoice Items -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                  <tr style="background-color: #f8f9fa;">
                    <th style="text-align: left; padding: 12px 15px; font-size: 14px; color: #666; border-bottom: 1px solid #eee;">Description</th>
                    <th style="text-align: right; padding: 12px 15px; font-size: 14px; color: #666; border-bottom: 1px solid #eee;">Amount</th>
                  </tr>
                  <tr>
                    <td style="padding: 15px; border-bottom: 1px solid #eee;">
                      <p style="margin: 0; font-weight: bold; color: #2A2A2A;">${invoiceData.planName} Membership Plan</p>
                      <p style="margin: 5px 0 0 0; font-size: 13px; color: #999;">Monthly subscription</p>
                    </td>
                    <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-size: 15px; color: #2A2A2A;">$${invoiceData.price}</td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 12px 15px; text-align: right; font-weight: bold; color: #666;">Subtotal</td>
                    <td style="padding: 12px 15px; text-align: right; color: #2A2A2A;">$${invoiceData.price}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 15px; text-align: right; font-weight: bold; color: #666;">Tax (0%)</td>
                    <td style="padding: 12px 15px; text-align: right; color: #2A2A2A;">$0.00</td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 12px 15px; text-align: right; font-weight: bold; color: #2A2A2A;">Total</td>
                    <td style="padding: 12px 15px; text-align: right; font-weight: bold; font-size: 16px; color: #2A2A2A;">$${invoiceData.price}</td>
                  </tr>
                </table>

                <!-- Payment Status -->
                <div style="background-color: #f1f9f1; border-radius: 5px; padding: 15px; margin-bottom: 30px; display: flex; align-items: center;">
                  <div style="width: 24px; height: 24px; background-color: #4CAF50; border-radius: 50%; color: white; text-align: center; line-height: 24px; margin-right: 10px;">✓</div>
                  <div>
                    <p style="margin: 0; font-weight: bold; color: #2A2A2A;">Payment Successful</p>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">Transaction ID: TXN-${invoiceData.invoiceNumber.replace('INV-', '')}</p>
                  </div>
                </div>

                <!-- Plan Features -->
                <div style="background-color: #f8f9fa; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
                  <h4 style="margin: 0 0 15px 0; color: #2A2A2A;">Plan Features:</h4>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    ${invoiceData.features.map((feature: string, index: number) => `
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="color: #4CAF50; font-weight: bold; margin-right: 5px;">✓</span> ${feature}
                        </td>
                      </tr>
                    `).join('')}
                  </table>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Thank you for choosing FitnessHub!</p>
                </div>
              </div>
            </div>

            <!-- Optional link for desktop users who want to print -->
            <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border: 1px dashed #ddd;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                <strong>Note:</strong> The complete invoice is shown above. If you're on a desktop and want to print it, you can use this link:
              </p>
              <a href="${invoiceData.viewUrl}" target="_blank" style="color: #2A2A2A; text-decoration: underline; font-weight: bold;">Open printable version</a>
            </div>
          </div>
          <div class="footer" style="margin-top: 30px; text-align: center; padding: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">This is an automated email from FitnessHub. Please do not reply to this email.</p>
            <p style="margin: 0; color: #666; font-size: 14px;">If you have any questions, please contact our support team at <a href="mailto:support@fitnesshub.com" style="color: #2A2A2A; text-decoration: none; font-weight: bold;">support@fitnesshub.com</a></p>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #888; font-size: 12px;">© ${new Date().getFullYear()} FitnessHub. All rights reserved.</p>
              <p style="margin: 5px 0 0 0; color: #888; font-size: 12px;">123 Fitness Street, Exercise City, FT 12345</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Log the email details for debugging
    console.log('Sending email to:', to);
    console.log('From:', 'albzhubi@gmail.com');

    // Configure email using Mailjet
    const emailData = {
      Messages: [
        {
          From: {
            Email: 'albzhubi@gmail.com', // Your verified Mailjet sender email
            Name: 'FitnessHub',
          },
          To: [
            {
              Email: to,
              Name: invoiceData.customerName || to.split('@')[0],
            },
          ],
          Subject: subject,
          TextPart: `Your invoice #${invoiceData.invoiceNumber} for ${invoiceData.planName} Membership Plan is attached. Total: $${invoiceData.price}`,
          HTMLPart: htmlContent,
        },
      ],
    };

    try {
      // Send email
      const request = mailjet.post('send', { version: 'v3.1' }).request(emailData);
      const result = await request;
      console.log('Email sent successfully:', result.body);
    } catch (mailjetError) {
      console.error('Mailjet specific error:', mailjetError);
      throw new Error(`Mailjet error: ${mailjetError.message || 'Unknown error'}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);

    // More detailed error message
    let errorMessage = 'Failed to send email';
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
