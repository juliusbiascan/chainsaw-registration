
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ModeToggle } from '@/components/layout/ThemeToggle/theme-toggle';
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {

  const router = useRouter();

  return (

    <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-lime-200 dark:border-lime-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo.jpg"
                  alt="DENR Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <h1 className="text-xl font-bold text-lime-900 dark:text-lime-100">DENR Chainsaw Registry</h1>
              </div>
              <ModeToggle />
            </div>
            <Button className="bg-lime-600 dark:bg-lime-600 text-lime-50 dark:text-lime-50 hover:bg-lime-700 dark:hover:bg-lime-700" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center mt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <Card className="mb-8 bg-white dark:bg-slate-900 border border-lime-200 dark:border-lime-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold text-lime-900 dark:text-lime-100 text-center">Chainsaw Registration Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-lime-700 dark:text-lime-300 text-center mb-4 leading-relaxed">
                Register your chainsaw for legal use, compliance, and responsible forest management. Powered by the Department of Environment and Natural Resources (DENR).
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
                <Button size="lg" className="bg-lime-600 dark:bg-lime-600 text-lime-50 dark:text-lime-50 hover:bg-lime-700 dark:hover:bg-lime-700" asChild>
                  <Link href="/equipments/registration">Start Registration</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-lime-300 dark:border-lime-600 text-lime-700 dark:text-lime-300 hover:bg-lime-50 dark:hover:bg-lime-800" asChild>
                  <a href="mailto:cenroalaminos@denr.gov.ph">Contact DENR</a>
                </Button>
              </div>
              <p className="text-sm text-lime-600 dark:text-lime-400 text-center">For inquiries: cenroalaminos@denr.gov.ph | 09852390811</p>
            </CardContent>
          </Card>

          {/* Requirements Accordion */}
          <Accordion type="multiple" className="mb-8">
            <AccordionItem value="requirements">
              <AccordionTrigger className="text-lime-900 dark:text-lime-100">General Requirements</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-lime-700 dark:text-lime-300">
                  <li>Duly accomplished application form</li>
                  <li>Detailed chainsaw info (brand, model, engine capacity, serial number, etc.)</li>
                  <li>Purpose, location, owner, date of purchase, dealer</li>
                  <li>Sales invoice, deed of sale, official receipt</li>
                  <li>Registration fee (Php 500 + Documentary stamp Php 30)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tenurial">
              <AccordionTrigger className="text-lime-900 dark:text-lime-100">Additional for Tenurial Instrument Holders</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-lime-700 dark:text-lime-300">
                  <li>Copy of the tenurial instrument</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="farmers">
              <AccordionTrigger className="text-lime-900 dark:text-lime-100">Additional for Orchard/Fruit Tree Farmers</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-lime-700 dark:text-lime-300">
                  <li>Certificate of tree plantation ownership</li>
                  <li>Certification from Barangay Captain (applicant is orchard/tree farmer)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="processors">
              <AccordionTrigger className="text-lime-900 dark:text-lime-100">Additional for Licensed Wood Processors</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-lime-700 dark:text-lime-300">
                  <li>Copy of approved Wood Processing Plant Permit</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="agencies">
              <AccordionTrigger className="text-lime-900 dark:text-lime-100">Additional for Government Agencies/GOCCs</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-lime-700 dark:text-lime-300">
                  <li>Certification from Head of Office/authorized rep (chainsaw is for legal use)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="business">
              <AccordionTrigger className="text-lime-900 dark:text-lime-100">Additional for Business/Legal Purpose</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-lime-700 dark:text-lime-300">
                  <li>Business Permit from LGU or Affidavit (chainsaw needed for work/legal purpose)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-white dark:bg-slate-900 border border-lime-200 dark:border-lime-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lime-900 dark:text-lime-100">Who Should Register?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-6 text-lime-700 dark:text-lime-300 text-sm">
                  <li>Tenurial instrument holders</li>
                  <li>Orchard/fruit tree farmers</li>
                  <li>Industrial tree farmers</li>
                  <li>Licensed wood processors</li>
                  <li>Government agencies/GOCCs</li>
                  <li>Anyone needing chainsaw for legal purpose</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-900 border border-lime-200 dark:border-lime-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lime-900 dark:text-lime-100">Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-6 text-lime-700 dark:text-lime-300 text-sm">
                  <li>Only chainsaws bought from legitimate business owners with DENR Permit to Sell are accepted</li>
                  <li>Applications are filed online via <a href="https://denr1.gov.ph" className="text-lime-900 dark:text-lime-100 underline hover:text-lime-700 dark:hover:text-lime-300" target="_blank" rel="noopener noreferrer">denr1.gov.ph</a></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-white mt-12 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Department of Environment and Natural Resources - Chainsaw Registry Prototype
          </p>
        </div>
      </footer>
    </div>
  );
}
