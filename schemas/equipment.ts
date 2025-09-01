import * as z from "zod";

export const FuelType = z.enum(["GAS", "DIESEL", "ELECTRIC", "OTHER"]);
export const UseType = z.enum([
  "WOOD_PROCESSING",
  "TREE_CUTTING_PRIVATE_PLANTATION",
  "GOVT_LEGAL_PURPOSES",
  "OFFICIAL_TREE_CUTTING_BARANGAY",
  "OTHER"
]);

export const ApplicationStatus = z.enum(["ACCEPTED", "REJECTED", "PENDING"]);
export const InspectionResult = z.enum(["PASSED", "FAILED", "PENDING"]);

export const EquipmentSchema = z.object({
  // Owner Information
  ownerFirstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }).max(50, {
    message: "First name must not exceed 50 characters."
  }).trim(),
  ownerMiddleName: z.string().min(1, {
    message: "Middle initial is required.",
  }).max(10, {
    message: "Middle initial must not exceed 10 characters."
  }).trim(),
  ownerLastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }).max(50, {
    message: "Last name must not exceed 50 characters."
  }).trim(),
  ownerAddress: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }).max(200, {
    message: "Address must not exceed 200 characters."
  }).trim(),
  ownerContactNumber: z.string().min(1, {
    message: "Contact number is required.",
  }).max(20, {
    message: "Contact number must not exceed 20 characters."
  }).trim(),
  ownerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }).min(1, {
    message: "Email address is required.",
  }),
  ownerPreferContactMethod: z.enum(["EMAIL", "PHONE"], {
    message: "Please select a preferred contact method.",
  }),
  ownerIdUrl: z.string().optional(),

  // Chainsaw Information
  brand: z.string().min(2, {
    message: "Chainsaw brand must be at least 2 characters.",
  }).max(100, {
    message: "Chainsaw brand must not exceed 100 characters."
  }).trim(),
  model: z.string().min(2, {
    message: "Chainsaw model must be at least 2 characters.",
  }).max(100, {
    message: "Chainsaw model must not exceed 100 characters."
  }).trim(),
  serialNumber: z.string().min(1, {
    message: "Chainsaw serial number is required.",
  }).max(100, {
    message: "Serial number must not exceed 100 characters."
  }).trim(),
  guidBarLength: z.number().positive({
    message: "Guide bar length must be a positive number.",
  }).optional(),
  horsePower: z.number().positive({
    message: "Horse power must be a positive number.",
  }).optional(),
  fuelType: FuelType,
  dateAcquired: z.date({
    message: "Date of acquisition is required.",
  }),
  stencilOfSerialNo: z.string().min(1, {
    message: "Stencil of serial number is required.",
  }).max(100, {
    message: "Stencil of serial number must not exceed 100 characters."
  }).trim(),
  otherInfo: z.string().min(1, {
    message: "Other information is required.",
  }).max(500, {
    message: "Other information must not exceed 500 characters."
  }).trim(),
  intendedUse: UseType,
  isNew: z.boolean(),

  // Document Requirements
  registrationApplicationUrl: z.string().optional(),
  officialReceiptUrl: z.string().optional(),
  spaUrl: z.string().optional(),
  stencilSerialNumberPictureUrl: z.string().optional(),
  chainsawPictureUrl: z.string().optional(),

  // Renewal Registration Requirements
  previousCertificateOfRegistrationNumber: z.string().optional(),
  renewalRegistrationApplicationUrl: z.string().optional(),
  renewalPreviousCertificateOfRegistrationUrl: z.string().optional(),

  // Additional Requirements
  forestTenureAgreementUrl: z.string().optional(),
  businessPermitUrl: z.string().optional(),
  certificateOfRegistrationUrl: z.string().optional(),
  lguBusinessPermitUrl: z.string().optional(),
  woodProcessingPermitUrl: z.string().optional(),
  governmentCertificationUrl: z.string().optional(),

  // Data Privacy Consent
  dataPrivacyConsent: z.boolean().optional(),

  // Email Verification
  emailVerified: z.boolean().optional(),

  // Application Status and Processing
  initialApplicationStatus: ApplicationStatus.optional(),
  initialApplicationRemarks: z.string().max(1000, {
    message: "Application remarks must not exceed 1000 characters."
  }).optional(),
  inspectionResult: InspectionResult.optional(),
  inspectionRemarks: z.string().max(1000, {
    message: "Inspection remarks must not exceed 1000 characters."
  }).optional(),
  orNumber: z.string().max(50, {
    message: "OR number must not exceed 50 characters."
  }).optional(),
  orDate: z.date().optional(),
  expiryDate: z.date().optional(),
});

export const EquipmentUpdateSchema = EquipmentSchema.partial().extend({
  id: z.string().min(1, {
    message: "Equipment ID is required.",
  }),
});
