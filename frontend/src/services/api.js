const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getAnalytics() {
  return fetchAPI("/analytics/summary");
}

export async function getSuppliers() {
  return fetchAPI("/suppliers/");
}

export async function getSupplier(id) {
  return fetchAPI(`/suppliers/${id}`);
}

export async function createSupplier(supplierData) {
  return fetchAPI("/suppliers/", {
    method: "POST",
    body: JSON.stringify(supplierData),
  });
}

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) {
    params.append("category", filters.category);
  }
  if (filters.certification_status) {
    params.append("certification_status", filters.certification_status);
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/products/?${queryString}` : "/products/";

  return fetchAPI(endpoint);
}

export async function createProduct(productData) {
  return fetchAPI("/products/", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(id, productData) {
  return fetchAPI(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(id) {
  return fetchAPI(`/products/${id}`, {
    method: "DELETE",
  });
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
    `"₹${product.price}"`,
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
