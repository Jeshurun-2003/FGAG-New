import React from 'react';
import { useOutletContext } from 'react-router-dom';

const AboutPage = () => {
  const { settings = {} } = useOutletContext() || {};

  const verse = settings.about_verse || '“Upon this rock I will build my church...” — Matthew 16:18';
  const story = settings.about_story || "Friends Garden A.G Church is more than just a building — it’s a family of believers united in Christ. Rooted in God's Word and guided by the Holy Spirit, our church exists to glorify God, preach the Gospel, and serve the world with love and compassion. We are a welcoming community where faith grows, lives are transformed, and Jesus is the center of everything we do. Whether you're seeking hope, healing, or a place to belong, you are welcome here.\n\nAt Friends Garden AG Church, we believe the church is not just a place you go — it’s a family you belong to. We are a vibrant, Spirit-led community that seeks to reflect the love of Christ in all we do.\n\nOur foundation is built on the unchanging truth of God's Word. We believe the Bible is alive and powerful, guiding us in every step of life. Through prayer, worship, and discipleship, we grow together in faith and purpose. We exist not only to worship but to serve. Our church is active in outreach, missions, and community care. From helping the needy to encouraging the brokenhearted, we believe faith must be lived out with compassion and love.";
  const pastorBio = settings.pastor_bio || "Pastor Amal M. Augustine is a servant leader, fully committed to the Lord’s calling. He is blessed with his wife Jasmine Shalini and two daughters — Joy Malar and Doris Mahima.\n\nHe holds a B.Th from Madras A.G. Bible College, Saidapet, Chennai, and a M.A.B.S from Hindustan Bible Institute, Purasaiwakkam, Chennai. With nearly 20 years of full-time ministry experience, he has served in multiple regions and has led Friends Garden A.G. Church for over 6 years.";
  const pastorFamilyImg = settings.pastor_family_image || "/images/Pastor's_Family_Pic.jpg";

  return (
    <div className="container py-4">
      {/* Bible Verse Header */}
      <div className="text-center my-4">
        <blockquote className="blockquote fst-italic">
          <p className="fs-4 text-secondary mb-1">“Upon this rock I will build my church...”</p>
          <footer className="blockquote-footer pb-2">Matthew 16:18</footer>
        </blockquote>
      </div>

      {/* Church Name and Image */}
      <div className="row mb-5 section-bg p-4 p-md-5 rounded-4 shadow-sm align-items-center">
        <div className="col-12">
          <h2 className="fw-bold heading_2 border-bottom pb-3 mb-4">
            Friends Garden AG Church
          </h2>
          <img
            src="/images/Church_img.jpg"
            alt="Friends Garden AG Church Building"
            className="img-fluid rounded-4 float-md-end ms-md-4 mb-3 shadow-sm"
            style={{ maxWidth: '420px', width: '100%', maxHeight: '280px', objectFit: 'cover' }}
          />
          <div className="paragraph text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.9' }}>
            {story}
          </div>
        </div>
      </div>

      {/* About Our Senior Pastor */}
      <section className="my-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold display-6 heading text-uppercase">About Our Senior Pastor</h2>
          <p className="text-muted">A glimpse into the heart and vision of our spiritual leader</p>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="row g-0 align-items-center">
            <div className="col-md-5 d-flex justify-content-center align-items-center bg-light p-4">
              <img
                src={pastorFamilyImg}
                alt="Pastor Amal and Family"
                className="img-fluid rounded-4 shadow-sm"
                style={{ maxHeight: '380px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className="col-md-7 p-4 p-md-5">
              <h3 className="fw-bold mb-3 heading_2">Pastor Amal M. Augustine</h3>
              <div className="paragraph text-muted mb-4" style={{ whiteSpace: 'pre-line' }}>
                {pastorBio}
              </div>
              <h5 className="heading fw-bold mb-2">His Vision is to:</h5>
              <ul className="text-muted paragraph ps-4 mb-4">
                <li>Reveal the heart of the Heavenly Father to those who don’t know Him</li>
                <li>Raise spiritually strong sons and daughters to impact the world with faith</li>
              </ul>
              <p className="paragraph text-muted mb-0">
                Pastor Amal is a passionate preacher, worship leader, and gifted writer—devoted to building lives and glorifying God through every aspect of his ministry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="row align-items-center mb-5 section-bg p-4 p-md-5 rounded-4 shadow-sm g-4">
        <div className="col-md-6">
          <h3 className="heading_2 mb-4">
            <i className="bi bi-bullseye text-primary me-2"></i> Our Mission & Vision
          </h3>
          <ul className="paragraph mb-0 fs-5 ps-4">
            <li className="mb-2">Go Into All the World and Share the Gospel</li>
            <li className="mb-2">Loving the Least, the Lost, and the Forgotten</li>
            <li className="mb-2">Raising Missionaries From Church</li>
            <li className="mb-2">Spread Jesus's Name to Every Tribe, Every Tongue, Every Nation</li>
          </ul>
        </div>
        <div className="col-md-6 text-center p-3">
          <img
            src="/images/mission_vision.png"
            alt="Mission and Vision Banner"
            className="img-fluid rounded-4 shadow-sm"
            style={{ maxHeight: '320px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Church History */}
      <div className="mb-5 section-bg p-4 p-md-5 rounded-4 shadow-sm">
        <h3 className="heading_2 mb-3">
          <i className="bi bi-clock-history text-primary me-2"></i> Our Church History
        </h3>
        <p className="paragraph text-secondary mt-3" style={{ lineHeight: '1.9' }}>
          <strong>Friends Garden A.G Church</strong> is part of Assemblies of God India. We began in 2019, and our church is located in <strong>Kollidam, Mayiladuthurai District</strong>. Today, we are blessed to have more than 25 families as part of our growing church community.
          <br /><br />
          Right after we started, we faced a big challenge — the <strong>COVID-19 pandemic</strong>. The church was closed for almost one and a half years, but even during that time, people stayed faithful to the fellowship. <strong>By God’s grace</strong>, we continued to grow, little by little.
          <br /><br />
          In the beginning, we faced opposition and were unable to rent a hall. But the Lord miraculously provided our own land, just outside the town. Now, those who have their own transportation are able to attend church regularly.
          We have various ministries to help people grow in the Lord and to fulfill God’s Great Commission, including house prayers, daily online prayer meetings, and fellowship groups for women, men, children, and youth.
          <br /><br />
          By God's grace, we are growing steadily — in love, in the Word, in faith, in fellowship, in our knowledge of the Lord, and in number. All praise be to God!
        </p>
        <blockquote className="blockquote fst-italic mt-4 text-center">
          <p className="mb-1">“Give thanks to the LORD, for He is good; His love endures forever.”</p>
          <footer className="blockquote-footer">Psalm 107:1</footer>
        </blockquote>
      </div>

      {/* Our Beliefs */}
      <div className="mb-5 bg-white p-4 p-md-5 rounded-4 shadow-sm border">
        <h3 className="heading_2 pb-3 border-bottom">
          <i className="bi bi-book text-primary me-2"></i> Our Beliefs
        </h3>
        <ul className="paragraph mt-3 ps-4 fs-5">
          <li className="mb-2">We believe in the Trinity – Father, Son, and Holy Spirit.</li>
          <li className="mb-2">Salvation through Jesus Christ alone.</li>
          <li className="mb-2">The Bible is the inspired and authoritative Word of God.</li>
          <li className="mb-2">We are called to love God and love people unconditionally.</li>
          <li className="mb-2">Prayer, worship, and fellowship are vital to our daily faith journey.</li>
        </ul>
      </div>

      {/* Final Verse */}
      <div className="text-center my-5">
        <blockquote className="blockquote fst-italic">
          <p className="fs-4 heading mb-1">“Let all that you do be done in love.”</p>
          <footer className="blockquote-footer">1 Corinthians 16:14</footer>
        </blockquote>
      </div>
    </div>
  );
};

export default AboutPage;
