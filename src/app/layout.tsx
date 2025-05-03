import './globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>CaféHaine</title>
        <meta name="title" content="CaféHaine" />
        <meta name="description" content="I make stuff with code." />

        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* TODO: Re-add icon */}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cafehaine.eu/" />
        <meta property="og:title" content="CaféHaine" />
        <meta property="og:description" content="I make stuff with code." />
        <meta property="og:image" content="preview.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cafehaine.eu/" />
        <meta property="twitter:title" content="CaféHaine" />
        <meta property="twitter:description" content="I make stuff with code." />
        <meta property="twitter:image" content="preview.png" />

        {/* Mastodon verification */}
        <link rel="me" href="https://pouet.chapril.org/@cafehaine" />

      </head>
      <body>
        <noscript>
          <p style={{"color": "white"}}>Javascript isn&apos;t required, but allows a lot more features to work :)</p>
        </noscript>
        {children}
      </body>
    </html>
  )
}
