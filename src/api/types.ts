export interface TutorSummarySubject {
	id: string;
	canonicalName: string;
	icon: string;
}

export interface TutorSummary {
	id: string;
	name: string;
	university: string;
	subjects: TutorSummarySubject[];
	hourlyRate: number;
	active: boolean;
	photoUrl: string;
}

export interface TutorProfileSubject {
	id?: string;
	name?: string;
	canonicalName?: string;
	description?: string;
	icon?: string | null;
}

export interface TeacherProfileSubject {
	id: string;
	canonicalName: string;
	icon: string | null;
}

export interface UpdateTutorProfileSubject {
	id: string;
}

export interface ScheduleDto {
	days: string;
	hours: string;
}

export interface PlanDto {
	name: string;
	description: string;
	price: string;
	unit: string;
	badge: string;
	featured: boolean;
}

export interface MethodologyFeatureDto {
	label: string;
	value: boolean;
}

export interface MethodologyDto {
	intro: string;
	features: MethodologyFeatureDto[];
}

export interface TutorProfile {
	id: string;
	name: string;
	subjectSpecialty: string;
	university: string;
	location: string;
	modalidad: string;
	rating: number;
	reviewsCount: number;
	bio: string;
	photoUrl: string;
	active: boolean;
	hourlyRate: number;
	phoneNumber: string;
	subjects: TutorProfileSubject[];
	methodology: MethodologyDto;
	schedules: ScheduleDto[];
	schedulesNote: string;
	plans: PlanDto[];
}

export interface University {
	id: string;
	name: string;
	logo: string;
}

export interface Career {
	id: string;
	name: string;
	universityId: string;
}

export interface CatalogSubject {
	id: string;
	name: string;
	icon: string;
}

export interface CatalogData {
	universities: University[];
	careers: Career[];
	subjects: CatalogSubject[];
}

export interface AuthResponse {
	token: string;
	userId: string;
	name: string;
	email: string;
	role: "STUDENT" | "TEACHER";
}

export interface ContactRequest {
	id: string;
	studentName: string;
	studentPhone: string; // E.164, normalized by backend, e.g. +5491134567890
	university?: string;
	career?: string;
	subject?: string;
	status: "PENDING" | "ATTENDED";
	createdAt: string; // ISO 8601 UTC
}

export type MissingForActivationField =
	| "bio"
	| "subjects"
	| "schedules"
	| "hourlyRate";

export interface TutorProfileResponse extends Omit<TutorProfile, "subjects"> {
	subjects: TeacherProfileSubject[];
	missingForActivation: MissingForActivationField[];
}

export interface UpdateTutorProfileRequest {
	name: string;
	subjectSpecialty: string;
	university: string;
	location: string;
	modalidad: string;
	bio: string;
	photoUrl: string;
	hourlyRate: number;
	phoneNumber: string;
	subjects: UpdateTutorProfileSubject[];
	methodology: MethodologyDto;
	schedules: ScheduleDto[];
	schedulesNote: string;
	plans: PlanDto[];
}
