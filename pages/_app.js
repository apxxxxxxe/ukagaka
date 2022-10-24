import Script from "next/script"
import "styles/main.scss"

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Script
				src="https://www.googletagmanager.com/gtag/js?id=G-X8CTK9HSVL"
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-X8CTK9HSVL');
        `}
			</Script>
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
