import '../styles/MemberCarsPage.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { allMembers } from '../data/members'
import { Link } from 'react-router-dom'

export default function MemberCarsPage() {
  return (
    <>
      <Header brand={{ type: 'logo' }} />
      <main>
        <section id="members_cars" className="container members_cars">
          <h3 className="section-title">Associated Members</h3>
          <div className="member-grid">
            {allMembers.map((member, i) => (
              <div key={i} className="member">
                <h4>{member.name}</h4>
                <img src={member.coverPhoto} alt={`${member.name}'s car`} />
                <p>{member.cardLabel}</p>
                <div className="redirects-row">
                  {member.hasDetailPage && (
                    <Link className="redirect" to={`/cars/${member.id}`}>Info</Link>
                  )}
                  <a className="redirect" href={member.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
