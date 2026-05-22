import apiFetch, { apiUrl } from "./client";
import type { AuthResponse } from "./types";

export function login(email: string, password: string): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
}

export function register(
	name: string,
	email: string,
	password: string,
	role: "STUDENT" | "TEACHER",
): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/api/auth/register", {
		method: "POST",
		body: JSON.stringify({ name, email, password, role }),
	});
}

export function initiateOAuth(
	provider: "google",
	role: "STUDENT" | "TEACHER",
): void {
	window.location.href = apiUrl(
		`/api/auth/social/initiate?provider=${provider}&flow=register&role=${role}`,
	);
}

export function initiateOAuthLogin(provider: "google"): void {
	window.location.href = apiUrl(
		`/api/auth/social/initiate?provider=${provider}&flow=login`,
	);
}
