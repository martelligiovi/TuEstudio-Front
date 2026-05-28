import apiFetch from "./client";
import type {
	ContactRequest,
	TutorProfileResponse,
	UpdateTutorProfileRequest,
} from "./types";

export function getContactRequests(): Promise<ContactRequest[]> {
	return apiFetch<ContactRequest[]>("/api/teacher/requests");
}

export function markAsAttended(requestId: string): Promise<ContactRequest> {
	return apiFetch<ContactRequest>(`/api/teacher/requests/${requestId}/attend`, {
		method: "PATCH",
	});
}

export function getProfile(): Promise<TutorProfileResponse> {
	return apiFetch<TutorProfileResponse>("/api/teacher/profile");
}

export function uploadProfilePhoto(photo: File): Promise<TutorProfileResponse> {
	const body = new FormData();
	body.append("file", photo);

	return apiFetch<TutorProfileResponse>("/api/teacher/profile/photo", {
		method: "PUT",
		body,
	});
}

export class UnknownSubjectIdsError extends Error {
	constructor() {
		super("Unknown subject ids");
		this.name = "UnknownSubjectIdsError";
	}
}

function isUnknownSubjectIdsResponse(err: unknown): boolean {
	const message = err instanceof Error ? err.message : String(err);
	return (
		message.includes("unknown_subject_ids") ||
		message.includes("UnknownSubjectIds") ||
		message.includes("UnknownSubjectIdsException")
	);
}

export async function updateProfile(
	payload: UpdateTutorProfileRequest,
): Promise<TutorProfileResponse> {
	try {
		return await apiFetch<TutorProfileResponse>("/api/teacher/profile", {
			method: "PUT",
			body: JSON.stringify(payload),
		});
	} catch (err) {
		if (isUnknownSubjectIdsResponse(err)) {
			throw new UnknownSubjectIdsError();
		}
		throw err;
	}
}
