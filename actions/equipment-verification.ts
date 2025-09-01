"use server";

import { db } from "@/lib/db";
import { getEquipmentVerificationTokenByToken } from "@/data/equipment-verification-token";

export const verifyEquipmentEmail = async (token: string) => {
  const existingToken = await getEquipmentVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // Find equipment with this email that hasn't been verified yet
  const equipment = await db.equipment.findFirst({
    where: {
      ownerEmail: existingToken.email,
      emailVerified: false
    }
  });

  if (!equipment) {
    return { error: "No equipment registration found for this email or email already verified!" };
  }

  // Update the equipment to mark email as verified
  await db.equipment.update({
    where: { id: equipment.id },
    data: { emailVerified: true }
  });

  // Delete the verification token
  await db.equipmentVerificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Email verified successfully! Your equipment registration is now complete." };
};
