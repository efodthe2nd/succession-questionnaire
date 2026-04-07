"use client";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "CLARITY_PROJECT_ID";

export default function Analytics() {
  useEffect(() => {
    if (GA_ID && GA_ID !== "G-XXXXXXXXXX") {
      const gaScript = document.createElement("script");
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      gaScript.async = true;
      document.head.appendChild(gaScript);
      const gaInline = document.createElement("script");
      gaInline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { page_path: window.location.pathname });
      `;
      document.head.appendChild(gaInline);
    }
    if (CLARITY_ID && CLARITY_ID !== "CLARITY_PROJECT_ID") {
      const clarityScript = document.createElement("script");
      clarityScript.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `;
      document.head.appendChild(clarityScript);
    }
  }, []);
  return null;
}