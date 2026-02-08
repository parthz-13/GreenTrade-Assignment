import { useState, useEffect } from "react";
import {
  getProducts,
  getSuppliers,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProductsToCSV,
  CATEGORIES,
  CERTIFICATION_STATUSES,
} from "../services/api";
import Modal from "../components/Modal";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [certFilter, setCertFilter] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    supplier_id: "",
    category: "",
    price: "",
    stock_quantity: "",
    certification_status: "",
    unit: "",
    certification_expiry_date: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [categoryFilter, certFilter]);

  async function loadData() {
    try {
      setLoading(true);
      const [productsData, suppliersData] = await Promise.all([
        getProducts({
          category: categoryFilter,
          certification_status: certFilter,
        }),
        getSuppliers(),
      ]);
      setProducts(productsData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setFormData({
      name: "",
      supplier_id: "",
      category: "",
      price: "",
      stock_quantity: "",
      certification_status: "",
      unit: "",
      certification_expiry_date: "",
    });
    setFormError("");
  }

  function openAddModal() {
    resetForm();
    setShowAddModal(true);
  }

  function openEditModal(product) {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      supplier_id: product.supplier_id,
      category: product.category,
      price: product.price,
      stock_quantity: product.stock_quantity,
      certification_status: product.certification_status,
      unit: product.unit || "",
      certification_expiry_date: product.certification_expiry_date
        ? product.certification_expiry_date.split("T")[0]
        : "",
    });
    setShowEditModal(true);
  }

  function openDeleteModal(product) {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      await createProduct({
        ...formData,
        supplier_id: parseInt(formData.supplier_id),
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        certification_expiry_date:
          formData.certification_status === "Certified" &&
          formData.certification_expiry_date
            ? formData.certification_expiry_date
            : null,
      });
      setShowAddModal(false);
      loadData();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      await updateProduct(selectedProduct.id, {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        certification_status: formData.certification_status,
        unit: formData.unit,
        certification_expiry_date:
          formData.certification_status === "Certified" &&
          formData.certification_expiry_date
            ? formData.certification_expiry_date
            : null,
      });
      setShowEditModal(false);
      loadData();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setSubmitting(true);
    try {
      await deleteProduct(selectedProduct.id);
      setShowDeleteModal(false);
      loadData();
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleExport() {
    exportProductsToCSV(products);
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

  function getCategoryIcon(category) {
    switch (category) {
      case "Organic Food":
        return "🥬";
      case "Handmade":
        return "✋";
      case "Sustainable Goods":
        return "♻️";
      default:
        return "📦";
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <p>
          Might be due to cold-start because of Render's free-tier
          infrastructure. If not resolved after 30s, please reload the website.
        </p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">
            Manage your sustainable product catalog
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
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
            Add Product
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Certification</label>
          <select
            className="form-select"
            value={certFilter}
            onChange={(e) => setCertFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {CERTIFICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {(categoryFilter || certFilter) && (
          <button
            className="btn btn-icon clear-filters"
            onClick={() => {
              setCategoryFilter("");
              setCertFilter("");
            }}
            title="Clear filters"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear
          </button>
        )}

        <span className="results-count">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No products found</h3>
          <p>
            {categoryFilter || certFilter
              ? "Try changing your filters"
              : "Add your first product to get started"}
          </p>
          {!categoryFilter && !certFilter && (
            <button className="btn btn-primary" onClick={openAddModal}>
              Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="products-table-wrapper">
          <table className="table products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Supplier</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Certification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-icon">
                        {getCategoryIcon(product.category)}
                      </div>
                      <div className="product-info">
                        <span className="product-name">{product.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="supplier-name">
                      {product.supplier?.name || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td>
                    <span className="price">${product.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <span
                      className={`stock ${product.stock_quantity < 10 ? "low" : ""}`}
                    >
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${getCertBadgeColor(product.certification_status)}`}
                    >
                      {product.certification_status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-icon"
                        onClick={() => openEditModal(product)}
                        title="Edit"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="btn btn-icon delete"
                        onClick={() => openDeleteModal(product)}
                        title="Delete"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
      >
        <form onSubmit={handleAdd}>
          {formError && <div className="form-error">{formError}</div>}

          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Supplier *</label>
            <select
              name="supplier_id"
              className="form-select"
              value={formData.supplier_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Certification *</label>
              <select
                name="certification_status"
                className="form-select"
                value={formData.certification_status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select status</option>
                {CERTIFICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {formData.certification_status === "Certified" && (
              <div className="form-group">
                <label className="form-label">Expiry Date *</label>
                <input
                  type="date"
                  name="certification_expiry_date"
                  className="form-input"
                  value={formData.certification_expiry_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                name="price"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                name="stock_quantity"
                className="form-input"
                placeholder="0"
                min="0"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit *</label>
              <input
                type="text"
                name="unit"
                className="form-input"
                placeholder="kg, pcs..."
                value={formData.unit}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
      >
        <form onSubmit={handleEdit}>
          {formError && <div className="form-error">{formError}</div>}

          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Certification *</label>
              <select
                name="certification_status"
                className="form-select"
                value={formData.certification_status}
                onChange={handleInputChange}
                required
              >
                {CERTIFICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {formData.certification_status === "Certified" && (
              <div className="form-group">
                <label className="form-label">Expiry Date *</label>
                <input
                  type="date"
                  name="certification_expiry_date"
                  className="form-input"
                  value={formData.certification_expiry_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                name="price"
                className="form-input"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                name="stock_quantity"
                className="form-input"
                min="0"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit *</label>
              <input
                type="text"
                name="unit"
                className="form-input"
                placeholder="kg, pcs..."
                value={formData.unit}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Product"
        size="small"
      >
        <div className="delete-confirm">
          <div className="delete-icon">🗑️</div>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedProduct?.name}</strong>?
          </p>
          <p className="delete-warning">This action cannot be undone.</p>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Products;
