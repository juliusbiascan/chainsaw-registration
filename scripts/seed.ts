import { PrismaClient, FuelType, UseType, ApplicationStatus, InspectionResult } from '../lib/generated/prisma'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

// Helper function to convert Excel date to JavaScript Date
const excelDateToJSDate = (excelDate: number | string): Date | null => {
  if (!excelDate) return null

  // If it's already a number (Excel date), convert it
  if (typeof excelDate === 'number') {
    const utcDays = Math.floor(excelDate - 25569)
    const utcValue = utcDays * 86400
    return new Date(utcValue * 1000)
  }

  // If it's a string, try to parse it as a date
  if (typeof excelDate === 'string') {
    const parsedDate = new Date(excelDate)
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate
    }
  }

  return null
}

// Helper function to map fuel type
const mapFuelType = (fuel: string): FuelType => {
  const fuelLower = fuel.toLowerCase()
  if (fuelLower.includes('gas')) return 'GAS'
  if (fuelLower.includes('diesel')) return 'DIESEL'
  if (fuelLower.includes('electric')) return 'ELECTRIC'
  return 'OTHER'
}

// Helper function to map intended use
const mapIntendedUse = (use: string): UseType => {
  const useLower = use.toLowerCase()
  if (useLower.includes('wood processing')) return 'WOOD_PROCESSING'
  if (useLower.includes('private plantation')) return 'TREE_CUTTING_PRIVATE_PLANTATION'
  if (useLower.includes('government') || useLower.includes('legal')) return 'GOVT_LEGAL_PURPOSES'
  if (useLower.includes('barangay')) return 'OFFICIAL_TREE_CUTTING_BARANGAY'
  if (useLower.includes('business') || useLower.includes('commercial')) return 'WOOD_PROCESSING'
  if (useLower.includes('personal')) return 'OTHER'
  return 'OTHER'
}

// Helper function to map contact preference
const mapContactPreference = (preference: string): string => {
  const prefLower = preference.toLowerCase()
  if (prefLower.includes('email')) return 'EMAIL'
  if (prefLower.includes('phone')) return 'PHONE'
  return 'EMAIL' // default
}

// Helper function to map application status
const mapApplicationStatus = (status: string): ApplicationStatus | null => {
  if (!status) return null
  const statusLower = status.toLowerCase()
  if (statusLower.includes('accepted')) return 'ACCEPTED'
  if (statusLower.includes('rejected')) return 'REJECTED'
  if (statusLower.includes('pending')) return 'PENDING'
  return null
}

// Helper function to map inspection result
const mapInspectionResult = (result: string): InspectionResult | null => {
  if (!result) return null
  const resultLower = result.toLowerCase()
  if (resultLower.includes('passed')) return 'PASSED'
  if (resultLower.includes('failed')) return 'FAILED'
  if (resultLower.includes('pending')) return 'PENDING'
  return null
}

const seed = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...')

    await prisma.equipment.deleteMany()

    // Read the Excel file
    console.log('Reading Excel file...')
    const workbook = XLSX.readFile('documents/chainsaw-registration-alaminos.xlsx')
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    console.log(`Found ${data.length} records in Excel file`)

    // Process each record
    for (let i = 0; i < data.length; i++) {
      const record = data[i] as any

      try {
        // Skip records without essential data
        if (!record['First Name'] || !record['Last Name'] || !record['Chainsaw Brand'] || !record['Chainsaw Model']) {
          console.log(`Skipping record ${i + 1}: Missing essential data`)
          continue
        }

        // Parse dates
        const dateAcquired = excelDateToJSDate(record['Date of Acquisition']) || new Date()

        // Parse timestamp for createdAt
        const createdAt = excelDateToJSDate(record['Timestamp']) || new Date()

        // Parse OR date
        const orDate = excelDateToJSDate(record['OR Date'])

        // Parse expiry date
        const expiryDate = excelDateToJSDate(record['Expiry Date'])

        // Create equipment record
        const equipment = await prisma.equipment.create({
          data: {
            // Owner Information
            ownerFirstName: record['First Name']?.toString() || '',
            ownerMiddleName: record['Middle Initial']?.toString() || '',
            ownerLastName: record['Last Name']?.toString() || '',
            ownerAddress: record['Address'] || '',
            ownerContactNumber: record['Contact No.']?.toString() || '',
            ownerEmail: record['Email Address'] || '',
            ownerPreferContactMethod: mapContactPreference(record['Preferred Contacting Method'] || ''),
            ownerIdUrl: '', // Not available in Excel

            // Equipment Information
            brand: record['Chainsaw Brand'] || '',
            model: record['Chainsaw Model']?.toString() || '',
            serialNumber: record['Chainsaw Serial No.']?.toString() || '',
            guidBarLength: record['Guide Bar Length (inches)'] ? parseFloat(record['Guide Bar Length (inches)']) : null,
            horsePower: record['Horse Power'] ? parseFloat(record['Horse Power']) : null,
            fuelType: mapFuelType(record['Fuel '] || ''),
            dateAcquired,
            stencilOfSerialNo: record['Stencil of Serial No.']?.toString() || '',
            otherInfo: record['Other Info of the Chainsaw (Description, Color, etc.)'] || '',
            intendedUse: mapIntendedUse(record['Intended Use of the Chainsaw'] || ''),
            isNew: record['New Chainsaw or renewal of registration?']?.toLowerCase().includes('new chainsaw') || false,
            createdAt,
            updatedAt: createdAt,

            // Document Requirements
            registrationApplicationUrl: record['Signed Chainsaw Registration Application'] || null,
            officialReceiptUrl: record['Official Receipt of the Chainsaw'] || null,
            spaUrl: record['SPA (if the applicant is not the owner of the chainsaw)'] || null,
            stencilSerialNumberPictureUrl: record['Stencil Serial Number of Chainsaw (Picture)'] || null,
            chainsawPictureUrl: record['Picture of the Chainsaw'] || null,

            // Renewal Registration Requirements
            previousCertificateOfRegistrationNumber: record['Previous Certificate of Registration Number'] || null,
            renewalRegistrationApplicationUrl: record['Signed Chainsaw Registration Application - Renewal'] || null,
            renewalPreviousCertificateOfRegistrationUrl: record['Previous Certificate of Registration '] || null,

            // Additional Requirements
            forestTenureAgreementUrl: record['Forest Tenure Agreement (if Tenural Instrument Holder)'] || null,
            businessPermitUrl: record['Business Permit (If Business owner)'] || null,
            certificateOfRegistrationUrl: record['For Private Tree Plantation Owner - Certificate of Registration'] || null,
            lguBusinessPermitUrl: record['Business Permit from LGU or affidavit that the chainsaw is needed if applicants/profession/work and will be used for legal purpose'] || null,
            woodProcessingPermitUrl: record['For Wood Processor - Wood processing plant permit'] || null,
            governmentCertificationUrl: record['For government and GOCC - Certification from the Head of Office or his/her authorized representative that chainsaws are owned/possessed by the office and use for legal purposes (specify)'] || null,

            // Data Privacy Consent
            dataPrivacyConsent: record['Data Privacy Act Consent:']?.toLowerCase().includes('agree') || false,

            // Application Status and Processing
            initialApplicationStatus: mapApplicationStatus(record['Initial Application Status']),
            initialApplicationRemarks: record['Initial Application Remarks'] || null,
            inspectionResult: mapInspectionResult(record['Inspection Result']),
            inspectionRemarks: record['Inspection Remarks'] || null,
            orNumber: record['OR No']?.toString() || null,
            orDate,
            expiryDate,
          }
        })

        console.log(`Created equipment: ${equipment.brand} ${equipment.model} - ${equipment.ownerFirstName} ${equipment.ownerLastName}`)
      } catch (error) {
        console.error(`Error processing record ${i + 1}:`, error)
        console.error('Record data:', record)
      }
    }

    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
