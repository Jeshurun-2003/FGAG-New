import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const DonatePage = () => {
  const { settings = {} } = useOutletContext() || {};
  const { addToast } = useToast();
  const [copiedKey, setCopiedKey] = useState(null);

  const accName = settings.donate_account_name || 'ASSEMBLY OF GOD KOLLIDAM';
  const accNumber = settings.donate_account_number || '0796053000004801';
  const ifsc = settings.donate_ifsc || 'SIBL0000796';
  const micr = settings.donate_micr || '609059002';
  const swift = settings.donate_swift || 'SOININ55XXX';

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
        description="Support the Kingdom work through your faithful giving and offerings at Friends Garden AG Church, Kollidam."
      />

      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="badge px-3 py-2 rounded-pill text-uppercase mb-3" style={{ backgroundColor: 'rgba(56, 161, 219, 0.15)', color: '#0a3d62', fontWeight: 600 }}>
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

      <div className="row justify-content-center">
        <motion.div
          className="col-md-9 col-lg-8"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card bg-white border-0 shadow rounded-4 overflow-hidden hover-lift">
            <div className="card-header py-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #072a44 0%, #0a3d62 100%)' }}>
              <h4 className="mb-0 text-white fw-bold d-flex align-items-center justify-content-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <i className="bi bi-bank text-info"></i> Bank Transfer Details
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
                      <th className="bg-light text-secondary py-3 px-3">Account Number</th>
                      <td className="fw-bold fs-5 text-primary py-3 px-3 d-flex justify-content-between align-items-center">
                        <span>{accNumber}</span>
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
                        <span>{ifsc}</span>
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
                    <tr>
                      <th className="bg-light text-secondary py-3 px-3">MICR Code</th>
                      <td className="fw-semibold py-3 px-3">{micr}</td>
                    </tr>
                    <tr>
                      <th className="bg-light text-secondary py-3 px-3">SWIFT Code</th>
                      <td className="fw-semibold py-3 px-3">{swift}</td>
                    </tr>
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

          <div className="text-center mt-4">
            <p className="paragraph text-muted">
              Need assistance with your offering?{' '}
              <Link to="/contact" className="fw-bold text-primary text-decoration-none">
                Contact our office &rarr;
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DonatePage;
