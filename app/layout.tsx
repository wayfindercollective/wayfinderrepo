import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./../styles/brand-theme.css";
import { inter, orbitron, plexMono } from "./fonts";
import Starfield from "./components/Starfield";
import GlobalFlickerEffect from "./components/GlobalFlickerEffect";
import IntercomButton from "./components/IntercomButton";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Join the Void",
  description: "A Cyber-Monk Dojo for Real-World Charisma",
  metadataBase: new URL("https://thevoidunderground.com"),
  alternates: {
    canonical: "https://thevoidunderground.com",
  },
  openGraph: {
    title: "Join the Void",
    description: "A Cyber-Monk Dojo for Real-World Charisma",
    url: "https://thevoidunderground.com",
    siteName: "Void Underground",
    images: [
      {
        url: "https://thevoidunderground.com/PreviewLogo.jpg",
        width: 1200,
        height: 630,
        alt: "Void Underground Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Void",
    description: "A Cyber-Monk Dojo for Real-World Charisma",
    images: ["https://thevoidunderground.com/PreviewLogo.jpg"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${plexMono.variable}`}>
        <head>
        {/* Referrer for cart */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var sURL=document.referrer; if(sURL.indexOf('https://thevoidunderground.com')!=0&&sURL!='')sessionStorage.setItem('source', sURL);
              var saQry={};location.search.substr(1).split('&').forEach(function(item) {saQry[item.split('=')[0]]=item.split('=')[1];})
              if(saQry['ADID']!=''&&typeof saQry['ADID']!==undefined)sessionStorage.setItem('ADID', saQry['ADID']);
              if(saQry['AFID']!=''&&typeof saQry['AFID']!==undefined)sessionStorage.setItem('AFID', saQry['AFID']);
              if(saQry['CID']!=''&&typeof saQry['CID']!==undefined)sessionStorage.setItem('CID', saQry['CID']);
              if(saQry['l']!=''&&typeof saQry['l']!==undefined)sessionStorage.setItem('l', saQry['l']);
              if(saQry['SID']!=''&&typeof saQry['SID']!==undefined)sessionStorage.setItem('SID', saQry['SID']);
              if(saQry['t']!=''&&typeof saQry['l']!==undefined)sessionStorage.setItem('t', saQry['t']);
            `,
          }}
        />
        <script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
          crossOrigin="anonymous"
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              $(document).ready(function () {
                $('a').each(function () {
                  var url = $(this).attr('href');
                  var host = $(this).prop('href', url).prop('hostname');
                  if (
                    host != 'www.facebook.com' &&
                    host != 'www.instragram.com' &&
                    host != 'www.youtube.com' &&
                    /^http/.test(url)
                  ) {
                    var query_params = url.indexOf('?') != -1;
                    var l = sessionStorage.getItem('l');
                    if (l != null) {
                      url += '&l=' + l;
                    }
                    var s = sessionStorage.getItem('source');
                    if (s != null) {
                      s = s.replace('https://', '');
                      s = s.replace('http://', '');
                      s = s.replace('/', '');
                      url += '&source=' + s;
                    }
                    var a = sessionStorage.getItem('AFID');
                    if (a != null) {
                      url += '&AFID=' + a;
                    }
                    var c = sessionStorage.getItem('CID');
                    if (c != null) {
                      url += '&CID=' + c;
                    }
                    var sid = sessionStorage.getItem('SID');
                    if (sid != null) {
                      url += '&SID=' + sid;
                    }
                    var t = sessionStorage.getItem('t');
                    if (t != null) {
                      url += '&t=' + t;
                    }
                    $(this).attr('href', query_params ? url : url.replace(/&/, '?'));
                  }
                });
              });
            `,
          }}
        />
      </head>

      <body className="antialiased relative">
        <GlobalFlickerEffect />
        <Starfield />
        {children}
        <IntercomButton />
        <Analytics />
      </body>
    </html>
  );
}
