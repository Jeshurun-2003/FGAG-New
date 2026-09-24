import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';

const DonatePage = () => {
  const { settings = {} } = useOutletContext() || {};

  const accName = settings.donate_account_name || 'ASSEMBLY OF GOD KOLLIDAM';
  const accNumber = settings.donate_account_number || '0796053000004801';
  const ifsc = settings.donate_ifsc || 'SIBL0000796';
  const micr = settings.donate_micr || '609059002';
  const swift = settings.donate_swift || 'SOININ55XXX';

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 heading_2 mb-3 fw-bold">Sow Into the Kingdom Work</h1>
        <p className="lead paragraph fs-3 mb-2">Join us in building God's Kingdom through your generous giving.</p>
        <p className="paragraph fs-5 fst-italic mx-auto text-secondary" style={{ maxWidth: '750px' }}>
          “So let each one give as he purposes in his heart, not grudgingly or of necessity; for God loves a cheerful giver.”
          <br />
          <span className="fw-normal">— 2 Corinthians 9:7</span>
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-8">
          <div className="card bg-white border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header py-3 text-white text-center" style={{ backgroundColor: '#0a3d62' }}>
              <h4 className="mb-0 text-white fw-bold">
                <i className="bi bi-bank me-2"></i> Bank Transfer Details
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
                      <td className="fw-bold fs-5 text-primary py-3 px-3">{accNumber}</td>
                    </tr>
                    <tr>
                      <th className="bg-light text-secondary py-3 px-3">IFSC Code</th>
                      <td className="fw-semibold py-3 px-3">{ifsc}</td>
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

              <div className="text-center mt-4 pt-2">
                <p className="fst-italic text-success fw-medium mb-0">
                  <i className="bi bi-check2-circle me-1"></i> Every contribution makes an eternal difference. Thank you and God bless you abundantly!
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="paragraph text-muted">
              Need assistance with your offering?{' '}
              <Link to="/contact" className="fw-bold text-primary text-decoration-none">
                Contact our office
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
