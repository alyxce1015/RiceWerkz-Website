import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PartsPage() {
  return (
    <>
      <Header brand={{ type: 'logo' }} />
      <main>
        <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h3 className="section-title">All Parts</h3>
          <p>In progress — this will be a browseable parts shop for all member cars.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
