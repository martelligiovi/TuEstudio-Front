import apiFetch from "./client";
import type { TeacherProfileSubject } from "./types";

interface SubjectSearchResult {
	id: string;
	canonicalName?: string;
	name?: string;
	icon: string | null;
}

export async function searchSubjects(
	q: string,
): Promise<TeacherProfileSubject[]> {
	const params = new URLSearchParams({ q });
	const subjects = await apiFetch<SubjectSearchResult[]>(
		`/api/subjects?${params.toString()}`,
	);

	return subjects
		.map((subject) => ({
			id: subject.id,
			canonicalName: subject.canonicalName ?? subject.name ?? "",
			icon: subject.icon,
		}))
		.filter((subject) => subject.canonicalName.length > 0);
}
