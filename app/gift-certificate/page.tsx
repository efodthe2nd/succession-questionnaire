'use client'

export default function GiftCertificatePage() {
  const giftPdfUrl = '/Succession Story Gift.pdf'
  const holidayPdfUrl = '/Succession Story Holiday Gift.pdf'

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Header */}
      <header className="py-6 px-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            Succession <span className="text-taupe">Story</span>
          </h1>
          <a
            href="/"
            className="text-charcoal/70 hover:text-charcoal transition-colors"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Gift Certificates
          </h2>
          <p className="text-charcoal/70 mb-12 max-w-xl mx-auto">
            Download your printable gift certificate below. Share it with someone special when the moment feels right.
          </p>

          {/* Standard Gift Certificate */}
          <section className="mb-16">
            <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-6">
              Gift Certificate
            </h3>

            {/* PDF Viewer */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <iframe
                src={giftPdfUrl}
                className="w-full h-[600px] md:h-[800px]"
                title="Succession Story Gift Certificate"
              />
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(giftPdfUrl, 'Succession Story Gift Certificate.pdf')}
              className="inline-flex items-center gap-2 bg-charcoal text-ivory font-medium px-8 py-4 rounded-full text-lg hover:bg-opacity-90 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Gift Certificate
            </button>
          </section>

          {/* Divider */}
          <div className="border-t border-taupe/30 my-12"></div>

          {/* Holiday Gift Certificate */}
          <section className="mb-12">
            <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-6">
              Holiday Gift
            </h3>

            {/* PDF Viewer */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <iframe
                src={holidayPdfUrl}
                className="w-full h-[600px] md:h-[800px]"
                title="Succession Story Holiday Gift Certificate"
              />
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(holidayPdfUrl, 'Succession Story Holiday Gift Certificate.pdf')}
              className="inline-flex items-center gap-2 bg-charcoal text-ivory font-medium px-8 py-4 rounded-full text-lg hover:bg-opacity-90 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Holiday Gift Certificate
            </button>
          </section>

          <p className="mt-6 text-sm text-charcoal/50">
            Need help? Contact us at{' '}
            <a
              href="mailto:successionstory.now@gmail.com"
              className="text-taupe hover:underline"
            >
              successionstory.now@gmail.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 bg-charcoal text-center">
        <p className="text-ivory/70 text-sm">
          Succession Story - Your legacy, written for you.
        </p>
      </footer>
    </div>
  )
}
