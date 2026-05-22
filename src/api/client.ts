const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

export function apiUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${API_URL}${normalizedPath}`;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const token = localStorage.getItem("token");
	const res = await fetch(apiUrl(path), {
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...init?.headers,
		},
		...init,
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(text || `HTTP ${res.status}`);
	}
	if (res.status === 204) return undefined as T;
	return res.json() as Promise<T>;
}

export default apiFetch;
