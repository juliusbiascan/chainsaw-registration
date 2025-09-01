const domain = process.env.NEXT_PUBLIC_APP_URL;

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await sendEmail({
    to: email,
    subject: "DENR - Two-Factor Authentication Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p style="margin-bottom: 20px;">Your two-factor authentication code is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${token}
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This code will expire shortly. Do not share this code with anyone.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await sendEmail({
    to: email,
    subject: "DENR - Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p>A password reset was requested for your DENR account. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #006400; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This link will expire in 24 hours for security purposes.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await sendEmail({
    to: email,
    subject: "DENR - Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p>Thank you for registering with the DENR System. To complete your registration, please verify your email address.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" 
             style="background-color: #006400; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This link will expire in 24 hours for security purposes.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};

export const sendEquipmentVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/equipments/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: "DENR - Equipment Registration Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p>Thank you for registering your equipment with the DENR System. To complete your registration, please verify your email address.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" 
             style="background-color: #006400; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, you can copy and paste this link into your browser:<br>
          <a href="${confirmLink}" style="color: #006400;">${confirmLink}</a>
        </p>
        <p style="color: #666; font-size: 14px;">
          This verification link will expire in 1 hour. If you didn't register for equipment, please ignore this email.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>Department of Environment and Natural Resources<br>
          Equipment Registration System</p>
        </div>
      </div>
    `
  });
};

export const sendEquipmentOTPEmail = async (
  email: string,
  otp: string,
  ownerName: string
) => {
  await sendEmail({
    to: email,
    subject: "DENR - Equipment Registration OTP Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p>Dear ${ownerName},</p>
        <p>Thank you for registering your equipment with the DENR System. To ensure the security of your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; display: inline-block;">
            <h1 style="color: #006400; font-size: 32px; letter-spacing: 8px; margin: 0; font-family: monospace;">${otp}</h1>
          </div>
        </div>
        <p><strong>Important:</strong></p>
        <ul style="color: #666;">
          <li>This OTP is valid for 5 minutes only</li>
          <li>Do not share this OTP with anyone</li>
          <li>Your equipment registration will not be processed until email verification is complete</li>
        </ul>
        <p style="color: #666; font-size: 14px;">
          If you didn't register for equipment, please ignore this email.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>Department of Environment and Natural Resources<br>
          Equipment Registration System</p>
        </div>
      </div>
    `
  });
};

export const sendTeamInvitationEmail = async (
  email: string,
  role: string,
  labId: string,
  token?: string,
) => {
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const link = token
    ? `${domain}/auth/register?token=${token}&labId=${labId}`
    : `${domain}/teams/accept?labId=${labId}`;

  await sendEmail({
    to: email,
    subject: "DENR - Team Member Invitation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p>Greetings,</p>
        <p>You have been invited to join the DENR system as a <strong>${role.toLowerCase()}</strong>.</p>
        ${token
        ? '<p>As a new user, you will need to create an account to access the system.</p>'
        : '<p>Please click the button below to accept this invitation and join the team.</p>'
      }
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" 
             style="background-color: #006400; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block;">
            ${token ? 'Create DENR Account' : 'Accept Invitation'}
          </a>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This invitation link will expire in 24 hours and can only be used once for security purposes.
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          If you did not expect this invitation, please ignore this email.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};

export const sendRegistrationConfirmationEmail = async (
  email: string,
  ownerName: string,
  equipmentId: string,
  brand: string,
  model: string,
  serialNumber: string
) => {
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const equipmentUrl = `${domain}/equipments/${equipmentId}`;

  await sendEmail({
    to: email,
    subject: "DENR - Chainsaw Registration Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <h3 style="color: #006400; margin-bottom: 5px;">CENRO ALAMINOS</h3>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        
        <p>Dear <strong>${ownerName}</strong>,</p>
        
        <p>Thank you for submitting your chainsaw registration application to the Department of Environment and Natural Resources (DENR) - CENRO Alaminos.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #006400; margin: 20px 0;">
          <h4 style="color: #006400; margin-top: 0;">Application Status: <span style="color: #ff6b35;">PENDING REVIEW</span></h4>
          <p style="margin-bottom: 0;">Your application has been successfully received and is currently under review by our staff. You will be contacted for verification and further processing.</p>
        </div>
        
        <h4 style="color: #006400; margin-top: 30px;">Important Information:</h4>
        <ul style="color: #333;">
          <li>Please ensure your contact information is up to date</li>
          <li>Keep these equipment details for reference when visiting our office</li>
          <li>Our staff will contact you for verification and inspection scheduling</li>
          <li>Please bring all original documents during the inspection</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <h4 style="color: #006400; margin-bottom: 15px;">Equipment Details</h4>
          <div style="display: inline-block; padding: 20px; background-color: white; border: 2px solid #006400; border-radius: 8px; text-align: left;">
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400; border-bottom: 1px solid #dee2e6; width: 120px;">Brand:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #dee2e6;">${brand}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400; border-bottom: 1px solid #dee2e6;">Model:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #dee2e6;">${model}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400; border-bottom: 1px solid #dee2e6;">Serial Number:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #dee2e6;">${serialNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400;">Registration ID:</td>
                <td style="padding: 8px 12px;">${equipmentId}</td>
              </tr>
            </table>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 10px;">
            Present these equipment details to DENR staff for application verification
          </p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #856404; margin-top: 0;">Next Steps:</h4>
          <ol style="color: #856404; margin-bottom: 0;">
            <li>Wait for our staff to contact you for verification</li>
            <li>Prepare all original documents for inspection</li>
            <li>Schedule and attend the chainsaw inspection</li>
            <li>Pay the required fees upon approval</li>
            <li>Receive your official registration certificate</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${equipmentUrl}" 
             style="background-color: #006400; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block;">
            View Application Details
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p><strong>Contact Information:</strong></p>
          <p>CENRO Alaminos<br>
          Department of Environment and Natural Resources<br>
          Email: cenro.alaminos@denr.gov.ph<br>
          Phone: 09852390811</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR Chainsaw Registration System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};

export const sendApplicationAcceptedEmail = async (
  email: string,
  ownerName: string,
  equipmentId: string,
  brand: string,
  model: string,
  serialNumber: string,
  remarks?: string
) => {
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const equipmentUrl = `${domain}/equipments/${equipmentId}`;

  await sendEmail({
    to: email,
    subject: "DENR - Application Accepted - Chainsaw Registration",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <h3 style="color: #006400; margin-bottom: 5px;">CENRO ALAMINOS</h3>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        
        <p>Dear <strong>${ownerName}</strong>,</p>
        
        <p>Greetings! We are pleased to inform you that your chainsaw registration application has been <strong>ACCEPTED</strong> for further processing.</p>
        
        <div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h4 style="color: #155724; margin-top: 0;">Application Status: <span style="color: #28a745;">ACCEPTED</span></h4>
          <p style="margin-bottom: 0;">Your application has been reviewed and approved for the next stage of processing. Please proceed with the inspection phase.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <h4 style="color: #006400; margin-bottom: 15px;">Equipment Details</h4>
          <div style="display: inline-block; padding: 20px; background-color: white; border: 2px solid #006400; border-radius: 8px; text-align: left;">
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400; border-bottom: 1px solid #dee2e6; width: 120px;">Brand:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #dee2e6;">${brand}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400; border-bottom: 1px solid #dee2e6;">Model:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #dee2e6;">${model}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400; border-bottom: 1px solid #dee2e6;">Serial Number:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #dee2e6;">${serialNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400;">Registration ID:</td>
                <td style="padding: 8px 12px;">${equipmentId}</td>
              </tr>
            </table>
          </div>
        </div>
        
        ${remarks ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #006400; margin: 20px 0;">
          <h4 style="color: #006400; margin-top: 0;">Remarks:</h4>
          <p style="margin-bottom: 0;">${remarks}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #856404; margin-top: 0;">Next Steps:</h4>
          <ol style="color: #856404; margin-bottom: 0;">
            <li>Wait for our staff to contact you to schedule the inspection</li>
            <li>Prepare your chainsaw and all original documents for inspection</li>
            <li>Attend the scheduled inspection at our office</li>
            <li>Pay the required fees upon successful inspection</li>
            <li>Receive your official registration certificate</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${equipmentUrl}" 
             style="background-color: #006400; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block;">
            View Application Details
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p><strong>Contact Information:</strong></p>
          <p>CENRO Alaminos<br>
          Department of Environment and Natural Resources<br>
          Email: cenro.alaminos@denr.gov.ph<br>
          Phone: 09852390811</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR Chainsaw Registration System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};

export const sendInspectionPassedEmail = async (
  email: string,
  ownerName: string,
  equipmentId: string,
  brand: string,
  model: string,
  serialNumber: string,
  remarks?: string
) => {
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const equipmentUrl = `${domain}/equipments/${equipmentId}`;

  await sendEmail({
    to: email,
    subject: "DENR - Inspection Passed - Chainsaw Registration",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <h3 style="color: #006400; margin-bottom: 5px;">CENRO ALAMINOS</h3>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        
        <p>Dear <strong>${ownerName}</strong>,</p>
        
        <p>Greetings! We are pleased to inform you that your chainsaw has <strong>PASSED</strong> the inspection and is ready for final registration.</p>
        
        <div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h4 style="color: #155724; margin-top: 0;">Inspection Result: <span style="color: #28a745;">PASSED</span></h4>
          <p style="margin-bottom: 0;">Your chainsaw has successfully passed all inspection requirements and is approved for registration.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <h4 style="color: #006400; margin-bottom: 15px;">Equipment Details</h4>
          <div style="display: inline-block; padding: 20px; background-color: white; border: 2px solid #006400; border-radius: 8px; text-align: left;">
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400; border-bottom: 1px solid #dee2e6; width: 120px;">Brand:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #dee2e6;">${brand}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400; border-bottom: 1px solid #dee2e6;">Model:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #dee2e6;">${model}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400; border-bottom: 1px solid #dee2e6;">Serial Number:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #dee2e6;">${serialNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #006400;">Registration ID:</td>
                <td style="padding: 8px 12px;">${equipmentId}</td>
              </tr>
            </table>
          </div>
        </div>
        
        ${remarks ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #006400; margin: 20px 0;">
          <h4 style="color: #006400; margin-top: 0;">Inspection Remarks:</h4>
          <p style="margin-bottom: 0;">${remarks}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #856404; margin-top: 0;">Next Steps:</h4>
          <ol style="color: #856404; margin-bottom: 0;">
            <li>Pay the required registration fees at our office</li>
            <li>Present your payment receipt to complete the registration</li>
            <li>Receive your official chainsaw registration certificate</li>
            <li>Keep your certificate safe and present it when required</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${equipmentUrl}" 
             style="background-color: #006400; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block;">
            View Application Details
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p><strong>Contact Information:</strong></p>
          <p>CENRO Alaminos<br>
          Department of Environment and Natural Resources<br>
          Email: cenro.alaminos@denr.gov.ph<br>
          Phone: 09852390811</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR Chainsaw Registration System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};
