"use server";

import { db } from "@/lib/db";
import { getEquipmentVerificationTokenByToken } from "@/data/equipment-verification-token";

export const verifyEquipmentOTP = async (email: string, otp: string) => {
  const existingToken = await getEquipmentVerificationTokenByToken(otp);

  if (!existingToken) {
    return { error: "Invalid OTP!" };
  }

  if (existingToken.email !== email) {
    return { error: "OTP does not match the email address!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "OTP has expired! Please request a new one." };
  }

  // Find equipment with this email that hasn't been verified yet
  const equipment = await db.equipment.findFirst({
    where: {
      ownerEmail: existingToken.email,
      emailVerified: false
    }
  });

  if (!equipment) {
    return { error: "No equipment registration found for this email!" };
  }

  // Update equipment to mark email as verified
  await db.equipment.update({
    where: { id: equipment.id },
    data: { emailVerified: true }
  });

  // Delete the verification token
  await db.equipmentVerificationToken.delete({
    where: { id: existingToken.id }
  });

  // Send registration confirmation email after successful OTP verification
  try {
    const { sendRegistrationConfirmationEmail } = await import('@/lib/mail');
    const ownerName = `${equipment.ownerFirstName} ${equipment.ownerLastName}`.trim();

    await sendRegistrationConfirmationEmail(
      equipment.ownerEmail,
      ownerName,
      equipment.id,
      equipment.brand,
      equipment.model,
      equipment.serialNumber
    );
  } catch (error) {
    console.error("Error sending registration confirmation email:", error);
    // Don't fail the verification if email sending fails
  }

  return { success: "Email verified successfully! Your equipment registration is now complete and confirmation email has been sent." };
};

export const resendEquipmentOTP = async (email: string) => {
  try {
    // Check if there's an existing unverified equipment registration
    const equipment = await db.equipment.findFirst({
      where: {
        ownerEmail: email,
        emailVerified: false
      }
    });

    if (!equipment) {
      return { error: "No pending equipment registration found for this email!" };
    }

    // Generate new OTP
    const { generateEquipmentOTPToken } = await import('@/lib/tokens');
    const { sendEquipmentOTPEmail } = await import('@/lib/mail');

    const verificationToken = await generateEquipmentOTPToken(email);
    const ownerName = `${equipment.ownerFirstName} ${equipment.ownerLastName}`.trim();

    await sendEquipmentOTPEmail(
      verificationToken.email,
      verificationToken.token,
      ownerName
    );

    return { success: "New OTP has been sent to your email address." };
  } catch (error) {
    console.error("Error resending OTP:", error);
    return { error: "Failed to send OTP. Please try again." };
  }
};
