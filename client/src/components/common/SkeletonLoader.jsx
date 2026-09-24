import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, i) => (
        <div className="col-md-4" key={i}>
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3 h-100">
            <div className="skeleton-box rounded-3 mb-3" style={{ height: '180px' }} />
            <div className="skeleton-box rounded w-75 mb-2" style={{ height: '22px' }} />
            <div className="skeleton-box rounded w-100 mb-2" style={{ height: '14px' }} />
            <div className="skeleton-box rounded w-50" style={{ height: '14px' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const GallerySkeleton = ({ count = 8 }) => {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {Array.from({ length: count }).map((_, i) => (
        <div className="col" key={i}>
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-2">
            <div className="skeleton-box rounded-3" style={{ height: '220px' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="py-3">
                  <div className="skeleton-box rounded w-75" style={{ height: '16px' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="container py-5 my-4">
      <div className="skeleton-box rounded-3 w-50 mx-auto mb-3" style={{ height: '36px' }} />
      <div className="skeleton-box rounded w-25 mx-auto mb-5" style={{ height: '18px' }} />
      <div className="row g-4">
        <div className="col-md-4">
          <div className="skeleton-box rounded-4" style={{ height: '240px' }} />
        </div>
        <div className="col-md-4">
          <div className="skeleton-box rounded-4" style={{ height: '240px' }} />
        </div>
        <div className="col-md-4">
          <div className="skeleton-box rounded-4" style={{ height: '240px' }} />
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
