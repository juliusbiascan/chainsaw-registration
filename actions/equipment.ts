"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { EquipmentSchema } from "@/schemas/equipment";
import { createEquipment, updateEquipment, deleteEquipment, getEquipmentById, canProcessEquipment } from "@/data/equipment";
import { sendApplicationAcceptedEmail, sendInspectionPassedEmail, sendEquipmentOTPEmail } from "@/lib/mail";
import { generateEquipmentOTPToken } from '@/lib/tokens';

export const createEquipmentAction = async (values: z.infer<typeof EquipmentSchema>) => {
  // Validate input
  const validatedFields = EquipmentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    // Owner Information
    ownerFirstName,
    ownerMiddleName,
    ownerLastName,
    ownerAddress,
    ownerContactNumber,
    ownerEmail,
    ownerPreferContactMethod,
    ownerIdUrl,
    // Chainsaw Information
    brand,
    model,
    serialNumber,
    guidBarLength,
    horsePower,
    fuelType,
    dateAcquired,
    stencilOfSerialNo,
    otherInfo,
    intendedUse,
    isNew,
    // Document Requirements
    registrationApplicationUrl,
    officialReceiptUrl,
    spaUrl,
    stencilSerialNumberPictureUrl,
    chainsawPictureUrl,
    // Renewal Registration Requirements
    previousCertificateOfRegistrationNumber,
    renewalRegistrationApplicationUrl,
    renewalPreviousCertificateOfRegistrationUrl,
    // Additional Requirements
    forestTenureAgreementUrl,
    businessPermitUrl,
    certificateOfRegistrationUrl,
    lguBusinessPermitUrl,
    woodProcessingPermitUrl,
    governmentCertificationUrl,
    // Data Privacy Consent
    dataPrivacyConsent,
    // Application Status and Processing
    initialApplicationStatus,
    initialApplicationRemarks,
    inspectionResult,
    inspectionRemarks,
    orNumber,
    orDate,
    expiryDate
  } = validatedFields.data;

  try {
    const result = await createEquipment({
      // Owner Information
      ownerFirstName,
      ownerMiddleName,
      ownerLastName,
      ownerAddress,
      ownerContactNumber,
      ownerEmail,
      ownerPreferContactMethod,
      ownerIdUrl,
      // Chainsaw Information
      brand,
      model,
      serialNumber,
      guidBarLength,
      horsePower,
      fuelType,
      dateAcquired,
      stencilOfSerialNo,
      otherInfo,
      intendedUse,
      isNew,
      // Document Requirements
      registrationApplicationUrl,
      officialReceiptUrl,
      spaUrl,
      stencilSerialNumberPictureUrl,
      chainsawPictureUrl,
      // Renewal Registration Requirements
      previousCertificateOfRegistrationNumber,
      renewalRegistrationApplicationUrl,
      renewalPreviousCertificateOfRegistrationUrl,
      // Additional Requirements
      forestTenureAgreementUrl,
      businessPermitUrl,
      certificateOfRegistrationUrl,
      lguBusinessPermitUrl,
      woodProcessingPermitUrl,
      governmentCertificationUrl,
      // Data Privacy Consent
      dataPrivacyConsent: dataPrivacyConsent ?? false,
      // Application Status and Processing
      initialApplicationStatus,
      initialApplicationRemarks,
      inspectionResult,
      inspectionRemarks,
      orNumber,
      orDate,
      expiryDate
    });

    if (result.success) {
      revalidatePath("/dashboard/equipments");

      // Send OTP verification for public registrations
      try {
        if (ownerEmail && dataPrivacyConsent === true) {
          // This indicates it's a public registration that needs email verification
          const verificationToken = await generateEquipmentOTPToken(ownerEmail);
          const ownerName = `${ownerFirstName} ${ownerLastName}`.trim();
          await sendEquipmentOTPEmail(
            verificationToken.email,
            verificationToken.token,
            ownerName
          );
          return { success: "Registration submitted successfully! Please check your email for the OTP to verify your address and complete the registration." };
        }
      } catch (emailError) {
        console.error("Error sending OTP email:", emailError);
        // Don't fail the registration if email fails
      }

      return { success: result.message };
    } else {
      return { error: result.message };
    }
  } catch (error) {
    console.error("Equipment creation error:", error);
    return { error: "Something went wrong!" };
  }
};

export const updateEquipmentAction = async (
  id: string,
  values: z.infer<typeof EquipmentSchema>
) => {
  // Validate input
  const validatedFields = EquipmentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    // Owner Information
    ownerFirstName,
    ownerMiddleName,
    ownerLastName,
    ownerAddress,
    ownerContactNumber,
    ownerEmail,
    ownerPreferContactMethod,
    ownerIdUrl,
    // Chainsaw Information
    brand,
    model,
    serialNumber,
    guidBarLength,
    horsePower,
    fuelType,
    dateAcquired,
    stencilOfSerialNo,
    otherInfo,
    intendedUse,
    isNew,
    // Document Requirements
    registrationApplicationUrl,
    officialReceiptUrl,
    spaUrl,
    stencilSerialNumberPictureUrl,
    chainsawPictureUrl,
    // Additional Requirements
    forestTenureAgreementUrl,
    businessPermitUrl,
    certificateOfRegistrationUrl,
    lguBusinessPermitUrl,
    woodProcessingPermitUrl,
    governmentCertificationUrl,
    // Data Privacy Consent
    dataPrivacyConsent,
    // Application Status and Processing
    initialApplicationStatus,
    initialApplicationRemarks,
    inspectionResult,
    inspectionRemarks,
    orNumber,
    orDate,
    expiryDate
  } = validatedFields.data;

  try {
    // Check if equipment exists
    const existingEquipment = await getEquipmentById(id);

    if (!existingEquipment.success) {
      return { error: "Equipment not found!" };
    }

    const currentEquipment = existingEquipment.equipment;
    if (!currentEquipment) {
      return { error: "Equipment data not found!" };
    }

    // Check for status changes to determine if emails should be sent
    const statusChanged = {
      initialApplicationStatus: currentEquipment.initialApplicationStatus !== initialApplicationStatus,
      inspectionResult: currentEquipment.inspectionResult !== inspectionResult
    };

    // Check if equipment can be processed (email verification for public registrations)
    const processingCheck = await canProcessEquipment(id);
    if (!processingCheck.success) {
      return { error: processingCheck.message };
    }

    if (!processingCheck.canProcess) {
      return { error: "Email verification required before processing this equipment registration." };
    }

    const result = await updateEquipment(id, {
      // Owner Information
      ownerFirstName,
      ownerMiddleName,
      ownerLastName,
      ownerAddress,
      ownerContactNumber,
      ownerEmail,
      ownerPreferContactMethod,
      ownerIdUrl,
      // Chainsaw Information
      brand,
      model,
      serialNumber,
      guidBarLength,
      horsePower,
      fuelType,
      dateAcquired,
      stencilOfSerialNo,
      otherInfo,
      intendedUse,
      isNew,
      // Document Requirements
      registrationApplicationUrl,
      officialReceiptUrl,
      spaUrl,
      stencilSerialNumberPictureUrl,
      chainsawPictureUrl,
      // Additional Requirements
      forestTenureAgreementUrl,
      businessPermitUrl,
      certificateOfRegistrationUrl,
      lguBusinessPermitUrl,
      woodProcessingPermitUrl,
      governmentCertificationUrl,
      // Data Privacy Consent
      dataPrivacyConsent: dataPrivacyConsent ?? false,
      // Application Status and Processing
      initialApplicationStatus,
      initialApplicationRemarks,
      inspectionResult,
      inspectionRemarks,
      orNumber,
      orDate,
      expiryDate
    });

    if (result.success) {
      revalidatePath("/dashboard/equipments");
      revalidatePath(`/dashboard/equipments/${id}`);

      // Send emails only when specific status changes occur
      try {
        const ownerName = `${ownerFirstName} ${ownerLastName}`.trim();

        // Send email when initial application status changes to ACCEPTED
        if (statusChanged.initialApplicationStatus && initialApplicationStatus === "ACCEPTED" && ownerEmail) {
          await sendApplicationAcceptedEmail(
            ownerEmail,
            ownerName,
            id,
            brand,
            model,
            serialNumber,
            initialApplicationRemarks
          );
        }

        // Send email when inspection result changes to PASSED
        if (statusChanged.inspectionResult && inspectionResult === "PASSED" && ownerEmail) {
          await sendInspectionPassedEmail(
            ownerEmail,
            ownerName,
            id,
            brand,
            model,
            serialNumber,
            inspectionRemarks
          );
        }
      } catch (emailError) {
        console.error("Error sending status update emails:", emailError);
        // Don't fail the update if email fails
      }

      return { success: result.message };
    } else {
      return { error: result.message };
    }
  } catch (error) {
    console.error("Equipment update error:", error);
    return { error: "Something went wrong!" };
  }
};

export const deleteEquipmentAction = async (id: string) => {
  try {
    // Check if equipment exists
    const existingEquipment = await getEquipmentById(id);

    if (!existingEquipment.success) {
      return { error: "Equipment not found!" };
    }

    const result = await deleteEquipment(id);

    if (result.success) {
      revalidatePath("/dashboard/equipments");
      return { success: result.message };
    } else {
      return { error: result.message };
    }
  } catch (error) {
    console.error("Equipment deletion error:", error);
    return { error: "Something went wrong!" };
  }
};

export const bulkImportEquipmentAction = async (equipmentsData: any[]) => {
  try {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < equipmentsData.length; i++) {
      const equipmentData = equipmentsData[i];

      try {
        // Validate the equipment data
        const validatedFields = EquipmentSchema.safeParse(equipmentData);

        if (!validatedFields.success) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Invalid fields - ${validatedFields.error.message}`);
          continue;
        }

        const {
          // Owner Information
          ownerFirstName,
          ownerMiddleName,
          ownerLastName,
          ownerAddress,
          ownerContactNumber,
          ownerEmail,
          ownerPreferContactMethod,
          ownerIdUrl,
          // Chainsaw Information
          brand,
          model,
          serialNumber,
          guidBarLength,
          horsePower,
          fuelType,
          dateAcquired,
          stencilOfSerialNo,
          otherInfo,
          intendedUse,
          isNew,
          // Document Requirements
          registrationApplicationUrl,
          officialReceiptUrl,
          spaUrl,
          stencilSerialNumberPictureUrl,
          chainsawPictureUrl,
          // Renewal Registration Requirements
          previousCertificateOfRegistrationNumber,
          renewalRegistrationApplicationUrl,
          renewalPreviousCertificateOfRegistrationUrl,
          // Additional Requirements
          forestTenureAgreementUrl,
          businessPermitUrl,
          certificateOfRegistrationUrl,
          lguBusinessPermitUrl,
          woodProcessingPermitUrl,
          governmentCertificationUrl,
          // Data Privacy Consent
          dataPrivacyConsent,
          // Application Status and Processing
          initialApplicationStatus,
          initialApplicationRemarks,
          inspectionResult,
          inspectionRemarks,
          orNumber,
          orDate,
          expiryDate
        } = validatedFields.data;

        const result = await createEquipment({
          // Owner Information
          ownerFirstName,
          ownerMiddleName,
          ownerLastName,
          ownerAddress,
          ownerContactNumber,
          ownerEmail,
          ownerPreferContactMethod,
          ownerIdUrl,
          // Chainsaw Information
          brand,
          model,
          serialNumber,
          guidBarLength,
          horsePower,
          fuelType,
          dateAcquired,
          stencilOfSerialNo,
          otherInfo,
          intendedUse,
          isNew,
          // Document Requirements
          registrationApplicationUrl,
          officialReceiptUrl,
          spaUrl,
          stencilSerialNumberPictureUrl,
          chainsawPictureUrl,
          // Renewal Registration Requirements
          previousCertificateOfRegistrationNumber,
          renewalRegistrationApplicationUrl,
          renewalPreviousCertificateOfRegistrationUrl,
          // Additional Requirements
          forestTenureAgreementUrl,
          businessPermitUrl,
          certificateOfRegistrationUrl,
          lguBusinessPermitUrl,
          woodProcessingPermitUrl,
          governmentCertificationUrl,
          // Data Privacy Consent
          dataPrivacyConsent: dataPrivacyConsent ?? false,
          // Application Status and Processing
          initialApplicationStatus,
          initialApplicationRemarks,
          inspectionResult,
          inspectionRemarks,
          orNumber,
          orDate,
          expiryDate
        });

        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`Row ${i + 1}: ${result.message}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (results.success > 0) {
      revalidatePath("/dashboard/equipments");
    }

    return {
      success: results.success > 0,
      message: `Successfully imported ${results.success} equipment records. ${results.failed} records failed.`,
      details: {
        success: results.success,
        failed: results.failed,
        errors: results.errors
      }
    };
  } catch (error) {
    console.error("Bulk import error:", error);
    return {
      success: false,
      message: "Something went wrong during bulk import!",
      details: {
        success: 0,
        failed: equipmentsData.length,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
};

export const bulkDeleteEquipmentAction = async (equipmentIds: string[]) => {
  try {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < equipmentIds.length; i++) {
      const equipmentId = equipmentIds[i];

      try {
        // Check if equipment exists
        const existingEquipment = await getEquipmentById(equipmentId);

        if (!existingEquipment.success) {
          results.failed++;
          results.errors.push(`Equipment ID ${equipmentId}: Equipment not found`);
          continue;
        }

        const result = await deleteEquipment(equipmentId);

        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`Equipment ID ${equipmentId}: ${result.message}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Equipment ID ${equipmentId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (results.success > 0) {
      revalidatePath("/dashboard/equipments");
    }

    return {
      success: results.success > 0,
      message: `Successfully deleted ${results.success} equipment records. ${results.failed} records failed to delete.`,
      details: {
        success: results.success,
        failed: results.failed,
        errors: results.errors
      }
    };
  } catch (error) {
    console.error("Bulk delete error:", error);
    return {
      success: false,
      message: "Something went wrong during bulk delete!",
      details: {
        success: 0,
        failed: equipmentIds.length,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
};
