import Header from '../components/Header'
import Footer from '../components/Footer'

export default function GalleryPage() {
  return (
    <>
      <Header brand={{ type: 'logo' }} />
      <main>
        <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h3 className="section-title">Gallery</h3>
          <p>Coming soon.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
