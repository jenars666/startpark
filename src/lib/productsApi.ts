const PRODUCTS_API_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCTS_API_BASE_URL?.replace(/\/$/, '') || '';

export type FetchProductsParams = {
  category?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
};

export type ApiProductPayload = {
  name: string;
  description?: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  stock?: number;
  status?: 'active' | 'draft' | 'archived';
  imageUrl: string;
  imageKey: string;
  color?: string;
  tag?: string;
  sizes?: string[];
};

type ApiResponse<T> = {
  ok?: boolean;
  message?: string;
  data?: T;
};

type SignedUploadPayload = {
  fileName: string;
  contentType: string;
  adminSecret: string;
};

type SignedUploadResponse = {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
  expiresInSeconds: number;
};

function requireApiBaseUrl() {
  if (!PRODUCTS_API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_PRODUCTS_API_BASE_URL is not configured.');
  }

  return PRODUCTS_API_BASE_URL;
}

export function isProductsApiEnabled() {
  return Boolean(PRODUCTS_API_BASE_URL);
}

export async function fetchProductsFromApi(
  params: FetchProductsParams = {}
): Promise<Record<string, unknown>[]> {
  const baseUrl = requireApiBaseUrl();
  const searchParams = new URLSearchParams();

  if (params.category) searchParams.set('category', params.category);
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const url = searchParams.toString()
    ? `${baseUrl}/api/products?${searchParams.toString()}`
    : `${baseUrl}/api/products`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    signal: params.signal,
  });

  const payload = (await response.json()) as ApiResponse<Record<string, unknown>[]>;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.message || 'Failed to fetch products from API.');
  }

  return payload.data || [];
}

export async function fetchProductByIdFromApi(
  productId: string,
  signal?: AbortSignal
): Promise<Record<string, unknown>> {
  const baseUrl = requireApiBaseUrl();

  const response = await fetch(`${baseUrl}/api/products/${productId}`, {
    method: 'GET',
    cache: 'no-store',
    signal,
  });

  const payload = (await response.json()) as ApiResponse<Record<string, unknown>>;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.message || 'Failed to fetch product.');
  }

  return payload.data || {};
}

export async function getProductUploadSignedUrl({
  fileName,
  contentType,
  adminSecret,
}: SignedUploadPayload): Promise<SignedUploadResponse> {
  const baseUrl = requireApiBaseUrl();

  const response = await fetch(`${baseUrl}/api/products/upload-sign-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': adminSecret,
    },
    body: JSON.stringify({ fileName, contentType }),
  });

  const payload = (await response.json()) as ApiResponse<SignedUploadResponse>;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.message || 'Failed to generate signed upload URL.');
  }

  if (!payload.data) {
    throw new Error('Signed upload response is missing data.');
  }

  return payload.data;
}

export async function uploadFileToSignedUrl(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudflare R2.');
  }
}

export async function createProductViaApi({
  adminSecret,
  product,
}: {
  adminSecret: string;
  product: ApiProductPayload;
}): Promise<Record<string, unknown>> {
  const baseUrl = requireApiBaseUrl();

  const response = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': adminSecret,
    },
    body: JSON.stringify(product),
  });

  const payload = (await response.json()) as ApiResponse<Record<string, unknown>>;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.message || 'Failed to create product.');
  }

  return payload.data || {};
}
