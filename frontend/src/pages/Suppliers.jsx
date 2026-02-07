import { useState, useEffect } from "react";
import { getSuppliers, getSupplier, createSupplier } from "../services/api";
import Modal from "../components/Modal";
import "./Suppliers.css";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    contact_person: "",
    phone: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewSupplier(supplierId) {
    try {
      const data = await getSupplier(supplierId);
      setSelectedSupplier(data);
      setShowDetailModal(true);
    } catch (err) {
      alert("Failed to load supplier details")
      console.log(err)
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      await createSupplier(formData);
      setShowAddModal(false);
      setFormData({
        name: "",
        email: "",
        country: "",
        contact_person: "",
        phone: "",
      });
      loadSuppliers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading suppliers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button className="btn btn-primary" onClick={loadSuppliers}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="suppliers-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers</h1>
          <p className="page-subtitle">
            Manage your sustainable suppliers network
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Supplier
          </button>
        </div>
      </div>

      {suppliers.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <h3>No suppliers yet</h3>
          <p>Add your first supplier to get started</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            Add Supplier
          </button>
        </div>
      ) : (
        <div className="suppliers-grid">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="supplier-card"
              onClick={() => handleViewSupplier(supplier.id)}
            >
              <div className="supplier-avatar">
                {supplier.name.charAt(0).toUpperCase()}
              </div>
              <div className="supplier-info">
                <h3 className="supplier-name">{supplier.name}</h3>
                <p className="supplier-email">{supplier.email}</p>
                <div className="supplier-meta">
                  <span className="meta-item">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {supplier.country}
                  </span>
                  <span className="meta-item">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {supplier.contact_person}
                  </span>
                </div>
              </div>
              <div className="supplier-arrow">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Supplier"
      >
        <form onSubmit={handleSubmit}>
          {formError && <div className="form-error">{formError}</div>}

          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter company name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="contact@company.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Country *</label>
              <input
                type="text"
                name="country"
                className="form-input"
                placeholder="Country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Person *</label>
            <input
              type="text"
              name="contact_person"
              className="form-input"
              placeholder="Full name"
              value={formData.contact_person}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Supplier"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title=""
        size="large"
      >
        {selectedSupplier && (
          <div className="supplier-detail">
            <button
              className="back-button"
              onClick={() => setShowDetailModal(false)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="detail-header">
              <div className="detail-avatar">
                {selectedSupplier.name.charAt(0).toUpperCase()}
              </div>
              <div className="detail-info">
                <h2>{selectedSupplier.name}</h2>
                <p>{selectedSupplier.email}</p>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Country</span>
                <span className="detail-value">{selectedSupplier.country}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Contact Person</span>
                <span className="detail-value">
                  {selectedSupplier.contact_person}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{selectedSupplier.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Member Since</span>
                <span className="detail-value">
                  {new Date(selectedSupplier.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="detail-products">
              <h3>Products ({selectedSupplier.products?.length || 0})</h3>
              {selectedSupplier.products?.length > 0 ? (
                <div className="products-list">
                  {selectedSupplier.products.map((product) => (
                    <div key={product.id} className="product-item">
                      <div className="product-item-info">
                        <span className="product-item-name">
                          {product.name}
                        </span>
                        <span className="product-item-category">
                          {product.category}
                        </span>
                      </div>
                      <div className="product-item-meta">
                        <span className="product-item-price">
                          ${product.price.toFixed(2)}
                        </span>
                        <span
                          className={`badge badge-${getCertBadgeColor(product.certification_status)}`}
                        >
                          {product.certification_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-products">
                  No products from this supplier yet
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function getCertBadgeColor(status) {
  switch (status) {
    case "Certified":
      return "success";
    case "Pending":
      return "warning";
    case "Not Certified":
      return "danger";
    default:
      return "info";
  }
}

export default Suppliers;
