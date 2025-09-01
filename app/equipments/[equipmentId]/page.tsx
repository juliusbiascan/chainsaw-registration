import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Settings,
  Ruler,
  Zap,
  Fuel,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  FileCheck
} from "lucide-react";
import { formatFuelType, formatUseType, formatDate, formatDateTime } from "@/lib/format";
import { calculateEquipmentStatus, getStatusBadgeVariant, getStatusLabel } from "@/lib/utils";

export const metadata = {
  title: 'Equipment Details',
  description: 'View detailed equipment information'
};

type PageProps = { params: Promise<{ equipmentId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const data = await db.equipment.findUnique({
    where: { id: params.equipmentId }
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-primary/20 bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">Equipment Not Found</h2>
            <p className="text-muted-foreground text-center text-sm">The equipment you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate validity based on whether it's new or renewal
  let validUntil: Date;
  if (data.isNew) {
    // For new equipment: use dateAcquired + 2 years
    validUntil = new Date(data.dateAcquired);
    validUntil.setFullYear(validUntil.getFullYear() + 2);
  } else {
    // For renewal equipment: use createdAt + 2 years
    validUntil = new Date(data.createdAt);
    validUntil.setFullYear(validUntil.getFullYear() + 2);
  }
  const isExpired = validUntil < new Date();
  const daysUntilExpiry = Math.ceil((validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Use centralized status calculation
  const status = calculateEquipmentStatus(data.isNew, data.dateAcquired, data.createdAt);

  const getStatusBadge = () => {
    const variant = getStatusBadgeVariant(status);
    const label = getStatusLabel(status);

    if (isExpired) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Expired</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="secondary" className="gap-1 text-orange-600 bg-orange-50 border-orange-200"><AlertTriangle className="w-3 h-3" />Expiring Soon</Badge>;
    } else {
      return <Badge variant={variant} className="gap-1">{label}</Badge>;
    }
  };

  const getApplicationStatusBadge = () => {
    if (!data.initialApplicationStatus) return null;

    switch (data.initialApplicationStatus) {
      case 'ACCEPTED':
        return <Badge variant="default" className="gap-1 bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3" />Accepted</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Rejected</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
      default:
        return null;
    }
  };

  const getInspectionResultBadge = () => {
    if (!data.inspectionResult) return null;

    switch (data.inspectionResult) {
      case 'PASSED':
        return <Badge variant="default" className="gap-1 bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3" />Passed</Badge>;
      case 'FAILED':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Failed</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
      default:
        return null;
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 w-full transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 bg-card rounded-xl shadow-sm border">
          <div className="relative">
            <img
              src="/logo.jpg"
              alt="DENR Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl shadow-md"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">DENR</span>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">Equipment Details</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Complete information about this equipment</p>
          </div>
          <div className="ml-auto">
            {getStatusBadge()}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Equipment Details Card */}
            <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      {data.brand} {data.model}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      Serial No: <span className="font-mono font-medium">{data.serialNumber}</span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">Registration Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusBadge()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Ruler className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Guide Bar Length</p>
                      <p className="font-semibold">{data.guidBarLength ? `${data.guidBarLength}"` : 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Horse Power</p>
                      <p className="font-semibold">{data.horsePower ? `${data.horsePower} HP` : 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Fuel className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold">{formatFuelType(data.fuelType)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Intended Use</p>
                      <p className="font-semibold">{formatUseType(data.intendedUse)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Additional Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Stencil of Serial No</label>
                      <p className="font-medium">{data.stencilOfSerialNo}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Date Acquired</label>
                      <p className="font-medium">{formatDate(data.dateAcquired)}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm text-muted-foreground">Other Information</label>
                      <p className="font-medium break-words whitespace-pre-wrap">{data.otherInfo}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Equipment Type</label>
                      <p className="font-medium">{data.isNew ? "New Equipment" : "Renewal Registration"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Data Privacy Consent</label>
                      <p className="font-medium">{data.dataPrivacyConsent ? "Consented" : "Not Consented"}</p>
                    </div>
                  </div>
                </div>

                {/* Validity Information */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">Validity Information</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Registration Type:</span>
                      <span className="ml-2 font-medium">{data.isNew ? "New Equipment" : "Renewal Registration"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valid Until:</span>
                      <span className="ml-2 font-medium">{formatDate(validUntil)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 font-medium">
                        {isExpired
                          ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                          : `${daysUntilExpiry} days remaining`}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Validity Period:</span>
                      <span className="ml-2 font-medium">
                        {data.isNew
                          ? "2 years from date acquired"
                          : "2 years from registration date"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Status and Processing */}
            {(data.initialApplicationStatus || data.inspectionResult || data.orNumber || data.orDate || data.expiryDate) && (
              <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Application Status & Processing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.initialApplicationStatus && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Initial Application Status</label>
                        <div className="flex items-center gap-2">
                          {getApplicationStatusBadge()}
                        </div>
                        {data.initialApplicationRemarks && (
                          <p className="text-sm text-muted-foreground mt-1">{data.initialApplicationRemarks}</p>
                        )}
                      </div>
                    )}

                    {data.inspectionResult && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Inspection Result</label>
                        <div className="flex items-center gap-2">
                          {getInspectionResultBadge()}
                        </div>
                        {data.inspectionRemarks && (
                          <p className="text-sm text-muted-foreground mt-1">{data.inspectionRemarks}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {(data.orNumber || data.orDate || data.expiryDate) && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {data.orNumber && (
                          <div>
                            <label className="text-sm text-muted-foreground">OR Number</label>
                            <p className="font-medium">{data.orNumber}</p>
                          </div>
                        )}
                        {data.orDate && (
                          <div>
                            <label className="text-sm text-muted-foreground">OR Date</label>
                            <p className="font-medium">{formatDate(data.orDate)}</p>
                          </div>
                        )}
                        {data.expiryDate && (
                          <div>
                            <label className="text-sm text-muted-foreground">Expiry Date</label>
                            <p className="font-medium">{formatDate(data.expiryDate)}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Document Requirements */}
            {(data.registrationApplicationUrl || data.officialReceiptUrl || data.spaUrl || data.stencilSerialNumberPictureUrl || data.chainsawPictureUrl) && (
              <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Document Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.registrationApplicationUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Registration Application
                        </label>
                        <a
                          href={data.registrationApplicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.officialReceiptUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Official Receipt
                        </label>
                        <a
                          href={data.officialReceiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.spaUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          SPA (Special Power of Attorney)
                        </label>
                        <a
                          href={data.spaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.stencilSerialNumberPictureUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Stencil Serial Number Picture
                        </label>
                        <a
                          href={data.stencilSerialNumberPictureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.chainsawPictureUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Chainsaw Picture
                        </label>
                        <a
                          href={data.chainsawPictureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Renewal Registration Requirements */}
            {(data.previousCertificateOfRegistrationNumber || data.renewalRegistrationApplicationUrl || data.renewalPreviousCertificateOfRegistrationUrl) && (
              <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Renewal Registration Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.previousCertificateOfRegistrationNumber && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Previous Certificate Number</label>
                        <p className="font-medium">{data.previousCertificateOfRegistrationNumber}</p>
                      </div>
                    )}

                    {data.renewalRegistrationApplicationUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Renewal Registration Application
                        </label>
                        <a
                          href={data.renewalRegistrationApplicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.renewalPreviousCertificateOfRegistrationUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Previous Certificate of Registration
                        </label>
                        <a
                          href={data.renewalPreviousCertificateOfRegistrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Requirements */}
            {(data.forestTenureAgreementUrl || data.businessPermitUrl || data.certificateOfRegistrationUrl || data.lguBusinessPermitUrl || data.woodProcessingPermitUrl || data.governmentCertificationUrl) && (
              <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Additional Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.forestTenureAgreementUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Forest Tenure Agreement
                        </label>
                        <a
                          href={data.forestTenureAgreementUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.businessPermitUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Business Permit
                        </label>
                        <a
                          href={data.businessPermitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.certificateOfRegistrationUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Certificate of Registration
                        </label>
                        <a
                          href={data.certificateOfRegistrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.lguBusinessPermitUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          LGU Business Permit
                        </label>
                        <a
                          href={data.lguBusinessPermitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.woodProcessingPermitUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Wood Processing Permit
                        </label>
                        <a
                          href={data.woodProcessingPermitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}

                    {data.governmentCertificationUrl && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Government Certification
                        </label>
                        <a
                          href={data.governmentCertificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Owner Information */}
          <div className="space-y-6">
            {/* Owner Details Card */}
            <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Owner Name */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <p className="font-semibold text-lg">
                    {data.ownerFirstName} {data.ownerMiddleName} {data.ownerLastName}
                  </p>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </h4>
                  <p className="text-sm bg-muted/30 p-3 rounded-lg">{data.ownerAddress}</p>
                </div>

                {data.ownerContactNumber && (
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact Number
                    </label>
                    <p className="font-medium">{data.ownerContactNumber}</p>
                  </div>
                )}

                {data.ownerEmail && (
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <p className="font-medium">{data.ownerEmail}</p>
                  </div>
                )}

                {data.ownerPreferContactMethod && (
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Preferred Contact Method</label>
                    <p className="font-medium">{data.ownerPreferContactMethod}</p>
                  </div>
                )}

                {data.ownerIdUrl && (
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      ID Document
                    </label>
                    <a
                      href={data.ownerIdUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      View ID Document
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Record Information Card */}
            <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Record Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Date Registered</label>
                  <p className="font-medium text-sm">
                    {formatDateTime(data.createdAt)}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Last Updated</label>
                  <p className="font-medium text-sm">
                    {formatDateTime(data.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
