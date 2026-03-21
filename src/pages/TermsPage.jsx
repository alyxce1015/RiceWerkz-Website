import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Legal.css'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="legal-page container">
        <h1>Terms of Use</h1>
        <p className="legal-updated">Last updated: March 21, 2026</p>

        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the RiceWerkz website ("Site"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Site.</p>
        </section>

        <section className="legal-section">
          <h2>2. Intellectual Property</h2>
          <p>All content on this Site — including text, images, graphics, logos, and media — is the property of RiceWerkz and is protected under applicable copyright laws. You may not reproduce, distribute, modify, or use any content without express written permission from RiceWerkz.</p>
        </section>

        <section className="legal-section">
          <h2>3. User Content</h2>
          <p>Members who upload photos or submit content to the Site grant RiceWerkz a non-exclusive, royalty-free license to display and use that content in connection with the Site. You are responsible for ensuring you have the rights to any content you submit.</p>
        </section>

        <section className="legal-section">
          <h2>4. Prohibited Use</h2>
          <p>You agree not to use the Site to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Upload harmful, offensive, or infringing content</li>
            <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
            <li>Scrape, copy, or redistribute content without permission</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Disclaimer of Warranties</h2>
          <p>The Site is provided "as is" without warranties of any kind. RiceWerkz makes no guarantees regarding the accuracy, availability, or reliability of any content on the Site.</p>
        </section>

        <section className="legal-section">
          <h2>6. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, RiceWerkz shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Site.</p>
        </section>

        <section className="legal-section">
          <h2>7. Changes to Terms</h2>
          <p>RiceWerkz reserves the right to update these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the updated Terms.</p>
        </section>

        <section className="legal-section">
          <h2>8. Contact</h2>
          <p>For questions regarding these Terms, contact us at <a href="mailto:Ricewerkz@gmail.com">Ricewerkz@gmail.com</a>.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
