import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Legal.css'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="legal-page container">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: March 21, 2026</p>

        <section className="legal-section">
          <h2>1. Overview</h2>
          <p>RiceWerkz ("we", "us", "our") is committed to protecting your privacy. This policy explains what information is collected when you use our Site and how it is used. We do not sell your personal data.</p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          <p>We collect limited information necessary to operate the Site:</p>
          <ul>
            <li><strong>Member data</strong> — Names, vehicle information, mod lists, and specs submitted by members are stored to power member profile pages.</li>
            <li><strong>Uploaded images</strong> — Photos uploaded by members are stored on our media platform.</li>
            <li><strong>Usage data</strong> — Anonymous analytics data such as page views and general traffic patterns are collected automatically.</li>
          </ul>
          <p>We do not collect names, email addresses, or personal information from general visitors.</p>
        </section>

        <section className="legal-section">
          <h2>3. Third-Party Services</h2>
          <p>We use the following third-party services to operate the Site:</p>

          <h3>Supabase</h3>
          <p>We use <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">Supabase</a> as our database provider to store member vehicle data including specs and mod lists. No sensitive personal information is stored. Supabase data is stored on secured cloud infrastructure. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase's Privacy Policy</a>.</p>

          <h3>Cloudinary</h3>
          <p>Uploaded photos are hosted and delivered through <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer">Cloudinary</a>, a cloud media management service. Images uploaded to the Site are stored on Cloudinary's servers and may be publicly accessible via URL. See <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer">Cloudinary's Privacy Policy</a>.</p>

          <h3>Vercel Analytics</h3>
          <p>We use <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer">Vercel Analytics</a> to collect anonymous, privacy-friendly usage statistics including page views and traffic sources. Vercel Analytics does not use cookies and does not track individual users or collect personally identifiable information. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel's Privacy Policy</a>.</p>
        </section>

        <section className="legal-section">
          <h2>4. Cookies</h2>
          <p>The Site uses minimal cookies strictly for functionality — specifically to remember member authentication state for the member tools. No advertising or tracking cookies are used.</p>
        </section>

        <section className="legal-section">
          <h2>5. Data Security</h2>
          <p>We take reasonable measures to protect data stored on our systems. Member access is controlled via unique private keys. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section className="legal-section">
          <h2>6. Your Rights</h2>
          <p>If you are a member and would like to request deletion or correction of your data, contact us at <a href="mailto:Ricewerkz@gmail.com">Ricewerkz@gmail.com</a> and we will handle your request promptly.</p>
        </section>

        <section className="legal-section">
          <h2>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page will reflect any changes. Continued use of the Site after updates constitutes acceptance of the revised policy.</p>
        </section>

        <section className="legal-section">
          <h2>8. Contact</h2>
          <p>For any privacy-related questions, reach us at <a href="mailto:Ricewerkz@gmail.com">Ricewerkz@gmail.com</a>.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
