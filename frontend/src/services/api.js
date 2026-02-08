import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.detail || error.message || "Request failed";
    return Promise.reject(new Error(message));
  },
);

export async function getAnalytics() {
  return api.get("/analytics/summary");
}

export async function getSuppliers() {
  return api.get("/suppliers/");
}

export async function getSupplier(id) {
  return api.get(`/suppliers/${id}`);
}

export async function createSupplier(supplierData) {
  return api.post("/suppliers/", supplierData);
}

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) {
    params.append("category", filters.category);
  }
  if (filters.certification_status) {
    params.append("certification_status", filters.certification_status);
  }

  return api.get("/products/", { params });
}

export async function createProduct(productData) {
  return api.post("/products/", productData);
}

export async function updateProduct(id, productData) {
  return api.put(`/products/${id}`, productData);
}

export async function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}

export function exportProductsToCSV(products) {
  const headers = [
    "ID",
    "Name",
    "Category",
    "Price",
    "Stock",
    "Unit",
    "Certification Status",
    "Certification Expiry Date",
    "Supplier Name",
    "Supplier Email",
    "Created At",
  ];

  const rows = products.map((product) => [
    product.id,
    `"${product.name}"`,
    product.category,
    `"$${product.price}"`,
    product.stock_quantity,
    `"${product.unit || ""}"`,
    product.certification_status,
    product.certification_expiry_date
      ? new Date(product.certification_expiry_date).toLocaleDateString()
      : "",
    `"${product.supplier?.name || ""}"`,
    `"${product.supplier?.email || ""}"`,
    new Date(product.created_at).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `greentrade_products_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const CATEGORIES = ["Organic Food", "Handmade", "Sustainable Goods"];

export const CERTIFICATION_STATUSES = ["Certified", "Pending", "Not Certified"];
