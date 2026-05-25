"use client";

import Script from "next/script";

// Replace with your Tidio public key from: https://www.tidio.com/panel/settings/developer
const TIDIO_PUBLIC_KEY = "glcpav6lc8bcnpmrybovycxqvku4eymt";

export default function TidioChat() {
  return (
    <Script
      src={`//code.tidio.co/${TIDIO_PUBLIC_KEY}.js`}
      strategy="lazyOnload"
    />
  );
}
