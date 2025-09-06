import Script from 'next/script';

export default function ChatWidget() {
  return (
    <Script
      src="https://cdn.juliusbiascan.me/widget.js"
      data-organization-id="org_32HHOD2e4XydPjGSLDP35VzCavC"
      strategy="afterInteractive"
    />
  );
}