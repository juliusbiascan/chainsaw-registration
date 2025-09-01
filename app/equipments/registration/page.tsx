'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import EquipmentForm from "@/features/equipments/components/equipment-form";
import { ConsentModal } from "@/components/modal/consent-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageContainer from '@/components/layout/page-container';

const RegistrationPage = () => {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  const equipment = null;
  const pageTitle = 'Chainsaw Registration';

  useEffect(() => {
    // Show consent modal when page loads
    setShowConsentModal(true);
  }, []);

  const handleConsentConfirm = () => {
    setHasConsented(true);
    setShowConsentModal(false);
  };

  const handleConsentClose = () => {
    // If user closes without consenting, redirect back
    window.history.back();
  };

  return (
    <>

      {!hasConsented ? (
        // Loading/Consent state
        <div className="h-full bg-background font-sans antialiased">
          <div className="h-full max-w-2xl mx-auto py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-green-600"></div>
              <p className="mt-4 text-muted-foreground text-sm sm:text-base">Loading...</p>
            </div>
          </div>
        </div>
      ) : (
        // Main registration form
        <PageContainer scrollable>
          <div className='flex-1'>

            <div className="bg-background font-sans antialiased">
              <div className="max-w-4xl mx-auto py-3 sm:py-4 md:py-8 lg:py-16 px-2 sm:px-3 md:px-6">
                {/* Header with Logo */}
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                  <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32">
                      <Image
                        src="/logo.jpg"
                        alt="DENR Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-foreground leading-tight px-2">
                      Department of Environment and Natural Resources
                    </h1>
                    <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-semibold text-green-600">
                      CENRO ALAMINOS
                    </h2>
                    <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-medium text-muted-foreground">
                      Chainsaw Registration System
                    </h3>
                  </div>
                </div>

                {/* Registration Form */}
                <Card className="shadow-lg border-2 border-green-100">
                  <CardHeader className="bg-green-50 border-b border-green-200 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                    <CardTitle className="text-center text-base sm:text-lg md:text-xl font-bold text-green-800">
                      {pageTitle}
                    </CardTitle>
                    <p className="text-center text-xs sm:text-sm text-green-700 mt-2">
                      Please fill out all required information accurately
                    </p>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 md:p-6">
                    {/* Important Note */}
                    <div className="mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-amber-800 mb-1 sm:mb-2">Important Note:</h4>
                          <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
                            Please review your information and upload your supporting documents before submitting your application. Once submitted the Application, this form can no longer be updated. Please make sure you can be reached through the contact number you provided. A personnel from the Cenros Office will call you for verification of your Application.
                          </p>
                        </div>
                      </div>
                    </div>

                    <EquipmentForm isPublicRegistration={true} initialData={equipment} pageTitle={pageTitle} />
                  </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm text-muted-foreground px-2">
                  <p>© 2025 CENRO ALAMINOS. All rights reserved.</p>
                  <p className="mt-1">This system complies with Republic Act No. 10173 (Data Privacy Act of 2012)</p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      )}

      {/* Consent Modal - always rendered but only shown when showConsentModal is true */}
      <ConsentModal
        isOpen={showConsentModal}
        onClose={handleConsentClose}
        onConfirm={handleConsentConfirm}
      />
    </>
  );
}

export default RegistrationPage;