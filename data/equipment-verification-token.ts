import { db } from "@/lib/db";

export const getEquipmentVerificationTokenByToken = async (
  token: string
) => {
  try {
    const equipmentVerificationToken = await db.equipmentVerificationToken.findUnique({
      where: { token }
    });

    return equipmentVerificationToken;
  } catch {
    return null;
  }
}

export const getEquipmentVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const equipmentVerificationToken = await db.equipmentVerificationToken.findFirst({
      where: { email }
    });

    return equipmentVerificationToken;
  } catch {
    return null;
  }
}
