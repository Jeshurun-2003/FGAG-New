import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { donationsService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const defaultPurposes = [
  {
    id: 1,
    title: 'Tithes & Offerings',
    description: 'Faithful general support for worship ministry, spiritual pastoral care, and daily church operations.'
  },
  {
    id: 2,
    title: 'Building & Sanctuary Fund',
    description: 'Contributions toward sanctuary maintenance, sound infrastructure, and church campus enhancement.'
  },
  {
    id: 3,
    title: 'Missions & Rural Outreach',
    description: 'Spreading the Gospel in rural villages, supporting field missionaries, and church planting.'
  },
  {
    id: 4,
    title: 'Community Care & Charity',
    description: 'Aiding widows, underprivileged families, children’s education support, and emergency medical relief.'
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const DonatePage = () => {
  const { settings = {} } = useOutletContext() || {};
  const { addToast } = useToast();
  const [copiedKey, setCopiedKey] = useState(null);
  const [purposes, setPurposes] = useState(defaultPurposes);
  const [loadingPurposes, setLoadingPurposes] = useState(true);

  // Settings with robust fallbacks preserving all existing database configurations
  const accName = settings.donate_account_name || 'ASSEMBLY OF GOD KOLLIDAM';
  const accNumber = settings.donate_account_number || '0796053000004801';
  const ifsc = settings.donate_ifsc || 'SIBL0000796';
  const bankName = settings.donate_bank_name || 'South Indian Bank';
  const branch = settings.donate_branch || 'Kollidam Branch';
  const upiId = settings.donate_upi_id || 'kollidamag@upi';
  const qrCode = settings.donate_qr_code || '';
  const micr = settings.donate_micr || '609059002';
  const swift = settings.donate_swift || 'SOININ55XXX';

  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        setLoadingPurposes(true);
        const res = await donationsService.getPurposes(false);
        if (res.data && res.data.success && res.data.purposes && res.data.purposes.length > 0) {
          setPurposes(res.data.purposes);
        }
      } catch (err) {
        console.warn('Using default donation causes list.', err);
      } finally {
        setLoadingPurposes(false);
      }
    };

    fetchPurposes();
  }, []);

  const copyToClipboard = (text, label, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast(`${label} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="container py-5">
      <SEO
        title="Donate & Tithes"
        description="Support the Kingdom work through your faithful giving, tithes, and offerings at Friends Garden AG Church, Kollidam."
      />

      {/* Header Banner */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span
          className="badge px-3 py-2 rounded-pill text-uppercase mb-3"
          style={{ backgroundColor: 'rgba(56, 161, 219, 0.15)', color: '#0a3d62', fontWeight: 600 }}
        >
          Kingdom Stewardship
        </span>
        <h1 className="display-5 heading_2 mb-3 fw-bold">Sow Into the Kingdom Work</h1>
        <div className="section-divider">
          <i className="bi bi-diamond-fill section-divider-icon"></i>
        </div>
        <p className="lead paragraph fs-4 mb-2">Join us in building God's Kingdom through your generous giving.</p>
        <p className="paragraph fs-5 fst-italic mx-auto text-secondary mt-3" style={{ maxWidth: '780px' }}>
          “So let each one give as he purposes in his heart, not grudgingly or of necessity; for God loves a cheerful giver.”
          <br />
          <span className="fw-normal text-primary">— 2 Corinthians 9:7</span>
        </p>
      </motion.div>

      {/* Giving Causes / Purposes Section */}
      <div className="mb-5">
        <div className="text-center mb-4">
          <span className="section-eyebrow">Where Your Offering Goes</span>
          <h2 className="heading fw-bold fs-3 text-dark">Church Giving Causes</h2>
          <p className="text-muted small mx-auto" style={{ maxWidth: '580px' }}>
            You may designate your transfer toward any of these ministry areas when giving.
          </p>
        </div>

        <div className="row g-3 justify-content-center">
          {purposes.map((p, idx) => (
            <div className="col-12 col-md-6 col-lg-3" key={p.id || idx}>
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 border-top border-4 border-primary hover-lift text-center">
                <div
                  className="d-inline-flex p-3 rounded-circle mb-3 mx-auto"
                  style={{ backgroundColor: 'rgba(56, 161, 219, 0.12)', color: '#0A3D62' }}
                >
                  <i className="bi bi-heart-fill fs-4 text-primary"></i>
                </div>
                <h5 className="fw-bold mb-2 text-dark" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {p.title}
                </h5>
                <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Methods Row: UPI / QR Code + Bank Details */}
      <div className="row g-4 justify-content-center mb-5">
        {/* Instant UPI & QR Code Column */}
        {Boolean(upiId || qrCode) && (
          <motion.div
            className="col-12 col-lg-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="card bg-white border-0 shadow rounded-4 overflow-hidden h-100 hover-lift d-flex flex-column text-center">
              <div
                className="card-header py-4 text-white"
                style={{ background: 'linear-gradient(135deg, #0A3D62 0%, #07253D 100%)' }}
              >
                <h4 className="mb-0 text-white fw-bold d-flex align-items-center justify-content-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <i className="bi bi-qr-code text-info"></i> Instant UPI Transfer
                </h4>
              </div>

              <div className="card-body p-4 p-md-5 d-flex flex-column align-items-center justify-content-center flex-grow-1">
                {qrCode ? (
                  <div className="p-3 bg-white border rounded-4 shadow-sm mb-3 d-inline-block" style={{ maxWidth: '240px' }}>
                    <img
                      src={qrCode}
                      alt="FGAG Church UPI QR Code"
                      className="img-fluid rounded-3"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                ) : (
                  <div className="p-4 rounded-circle bg-light border mb-3">
                    <i className="bi bi-qr-code-scan display-4 text-primary"></i>
                  </div>
                )}

                <span className="small text-muted text-uppercase fw-semibold mb-1">Official UPI VPA</span>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3 bg-light p-2 px-3 rounded-pill border">
                  <span className="fw-bold font-monospace text-primary fs-6">{upiId}</span>
                  <button
                    className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2"
                    onClick={() => copyToClipboard(upiId, 'UPI ID', 'upi')}
                    title="Copy UPI ID"
                  >
                    <i className={`bi ${copiedKey === 'upi' ? 'bi-check2' : 'bi-clipboard'} me-1`}></i>
                    <span className="small">{copiedKey === 'upi' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="small text-secondary mb-0" style={{ maxWidth: '320px' }}>
                  Scan with any UPI application (Google Pay, PhonePe, Paytm, BHIM, Amazon Pay) on your mobile device.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bank Transfer Details Column */}
        <motion.div
          className={Boolean(upiId || qrCode) ? 'col-12 col-lg-7' : 'col-12 col-md-9 col-lg-8'}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="card bg-white border-0 shadow rounded-4 overflow-hidden h-100 hover-lift">
            <div
              className="card-header py-4 text-white text-center"
              style={{ background: 'linear-gradient(135deg, #072a44 0%, #0a3d62 100%)' }}
            >
              <h4 className="mb-0 text-white fw-bold d-flex align-items-center justify-content-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <i className="bi bi-bank text-info"></i> Direct Bank Transfer (NEFT / RTGS / IMPS)
              </h4>
            </div>

            <div className="card-body p-4 p-md-5">
              <div className="table-responsive">
                <table className="table table-hover table-bordered mb-0 align-middle">
                  <tbody>
                    <tr>
                      <th className="bg-light text-secondary py-3 px-3" style={{ width: '38%' }}>
                        Account Name
                      </th>
                      <td className="fw-semibold py-3 px-3">{accName}</td>
                    </tr>
                    <tr>
                      <th className="bg-light text-secondary py-3 px-3">Bank Name</th>
                      <td className="fw-semibold py-3 px-3">{bankName}</td>
                    </tr>
                    <tr>
                      <th className="bg-light text-secondary py-3 px-3">Branch</th>
                      <td className="fw-semibold py-3 px-3">{branch}</td>
                    </tr>
                    <tr>
                      <th className="bg-light text-secondary py-3 px-3">Account Number</th>
                      <td className="fw-bold fs-5 text-primary py-3 px-3 d-flex justify-content-between align-items-center">
                        <span className="font-monospace">{accNumber}</span>
                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={() => copyToClipboard(accNumber, 'Account Number', 'acc')}
                          title="Copy account number"
                        >
                          <i className={`bi ${copiedKey === 'acc' ? 'bi-check2' : 'bi-clipboard'} me-1`}></i>
                          {copiedKey === 'acc' ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-light text-secondary py-3 px-3">IFSC Code</th>
                      <td className="fw-semibold py-3 px-3 d-flex justify-content-between align-items-center">
                        <span className="font-monospace">{ifsc}</span>
                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={() => copyToClipboard(ifsc, 'IFSC Code', 'ifsc')}
                          title="Copy IFSC code"
                        >
                          <i className={`bi ${copiedKey === 'ifsc' ? 'bi-check2' : 'bi-clipboard'} me-1`}></i>
                          {copiedKey === 'ifsc' ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                    {micr && (
                      <tr>
                        <th className="bg-light text-secondary py-3 px-3">MICR Code</th>
                        <td className="fw-semibold py-3 px-3 font-monospace">{micr}</td>
                      </tr>
                    )}
                    {swift && (
                      <tr>
                        <th className="bg-light text-secondary py-3 px-3">SWIFT Code</th>
                        <td className="fw-semibold py-3 px-3 font-monospace">{swift}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-4 pt-3">
                <p className="fst-italic text-success fw-medium mb-0 fs-5">
                  <i className="bi bi-check2-circle me-2"></i> Every contribution makes an eternal difference. Thank you and God bless you abundantly!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-center mt-4">
        <p className="paragraph text-muted">
          Need assistance or receipt for your offering?{' '}
          <Link to="/contact" className="fw-bold text-primary text-decoration-none">
            Contact our church office &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DonatePage;
