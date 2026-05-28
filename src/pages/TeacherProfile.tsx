import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import {
	getProfile,
	updateProfile,
	uploadProfilePhoto,
	UnknownSubjectIdsError,
} from "../api/teacher";
import { searchSubjects } from "../api/subjects";
import { useAuth } from "../auth/AuthContext";
import type {
	TutorProfileResponse,
	UpdateTutorProfileRequest,
	TeacherProfileSubject,
	ScheduleDto,
	PlanDto,
	MethodologyDto,
	MethodologyFeatureDto,
	MissingForActivationField,
} from "../api/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVATION_LABELS: Record<MissingForActivationField, string> = {
	bio: "Biografía",
	subjects: "Al menos una materia",
	schedules: "Al menos un horario",
	hourlyRate: "Tarifa por hora mayor a 0",
};

const PROFILE_PHOTO_MAX_BYTES = 2 * 1024 * 1024;
const PROFILE_PHOTO_ALLOWED_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
]);
const PROFILE_PHOTO_ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function getProfilePhotoValidationError(file: File): string | null {
	if (file.size > PROFILE_PHOTO_MAX_BYTES) {
		return "La imagen no puede superar los 2 MB.";
	}

	const lowerName = file.name.toLowerCase();
	const hasAllowedType = PROFILE_PHOTO_ALLOWED_TYPES.has(file.type);
	const hasAllowedExtension = PROFILE_PHOTO_ALLOWED_EXTENSIONS.some((ext) =>
		lowerName.endsWith(ext),
	);

	if (file.type) {
		if (!hasAllowedType || !hasAllowedExtension) {
			return "Usá una imagen JPG, PNG o WEBP.";
		}
	} else if (!hasAllowedExtension) {
		return "Usá una imagen JPG, PNG o WEBP.";
	}

	return null;
}

function isFullProfileResponse(
	response: TutorProfileResponse | { photoUrl: string },
): response is TutorProfileResponse {
	return "missingForActivation" in response;
}

// ─── Form state model ─────────────────────────────────────────────────────────

interface FormState {
	name: string;
	subjectSpecialty: string;
	university: string;
	location: string;
	modalidad: string;
	bio: string;
	photoUrl: string;
	hourlyRate: string;
	phoneNumber: string;
	selectedSubjects: TeacherProfileSubject[];
	methodology: MethodologyDto;
	schedules: ScheduleDto[];
	schedulesNote: string;
	plans: PlanDto[];
}

function normalizeProfileSubjects(
	subjects: TutorProfileResponse["subjects"],
): TeacherProfileSubject[] {
	return subjects.filter((subject) => subject.id && subject.canonicalName);
}

function profileToForm(p: TutorProfileResponse): FormState {
	return {
		name: p.name ?? "",
		subjectSpecialty: p.subjectSpecialty ?? "",
		university: p.university ?? "",
		location: p.location ?? "",
		modalidad: p.modalidad ?? "",
		bio: p.bio ?? "",
		photoUrl: p.photoUrl ?? "",
		hourlyRate: p.hourlyRate != null ? String(p.hourlyRate) : "",
		phoneNumber: p.phoneNumber ?? "",
		selectedSubjects: normalizeProfileSubjects(p.subjects ?? []),
		methodology: p.methodology ?? { intro: "", features: [] },
		schedules: p.schedules ?? [],
		schedulesNote: p.schedulesNote ?? "",
		plans: p.plans ?? [],
	};
}

function formToPayload(f: FormState): UpdateTutorProfileRequest {
	return {
		name: f.name.trim(),
		subjectSpecialty: f.subjectSpecialty.trim(),
		university: f.university.trim(),
		location: f.location.trim(),
		modalidad: f.modalidad.trim(),
		bio: f.bio.trim(),
		photoUrl: f.photoUrl.trim(),
		hourlyRate: Number(f.hourlyRate) || 0,
		phoneNumber: f.phoneNumber.trim(),
		subjects: f.selectedSubjects.map((s) => ({ id: s.id })),
		methodology: {
			intro: f.methodology.intro.trim(),
			features: f.methodology.features,
		},
		schedules: f.schedules,
		schedulesNote: f.schedulesNote.trim(),
		plans: f.plans,
	};
}

// ─── Field primitives ─────────────────────────────────────────────────────────

interface FieldProps {
	label: string;
	htmlFor: string;
	hint?: string;
	children: React.ReactNode;
}

function Field({ label, htmlFor, hint, children }: FieldProps) {
	return (
		<div className="flex flex-col gap-2">
			<label
				htmlFor={htmlFor}
				className="font-sans text-caption text-ink font-medium"
			>
				{label}
			</label>
			{children}
			{hint && <p className="font-sans text-caption text-muted">{hint}</p>}
		</div>
	);
}

const inputClass =
	"h-[44px] px-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-sm text-ink transition-all placeholder:text-muted/50";

const textareaClass =
	"min-h-[120px] p-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-sm text-ink transition-all placeholder:text-muted/50 resize-y";

interface SectionProps {
	title: string;
	description?: string;
	children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
	return (
		<section className="bg-surface-card rounded-lg border border-hairline p-xl flex flex-col gap-5">
			<div>
				<h2 className="font-serif text-display-sm text-ink">{title}</h2>
				{description && (
					<p className="font-sans text-body-sm text-muted mt-1">
						{description}
					</p>
				)}
			</div>
			<div className="flex flex-col gap-4">{children}</div>
		</section>
	);
}

interface RemoveButtonProps {
	onClick: () => void;
	label: string;
}

function RemoveButton({ onClick, label }: RemoveButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className="shrink-0 h-9 w-9 rounded-md border border-hairline bg-canvas text-muted hover:text-error hover:border-error/40 transition-colors flex items-center justify-center"
		>
			<span className="material-symbols-outlined text-[18px]">delete</span>
		</button>
	);
}

interface AddButtonProps {
	onClick: () => void;
	label: string;
}

function AddButton({ onClick, label }: AddButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="self-start inline-flex items-center gap-1.5 h-[36px] px-3 rounded-md border border-dashed border-hairline text-muted hover:text-primary hover:border-primary/40 font-sans text-button transition-colors"
		>
			<span className="material-symbols-outlined text-[18px]">add</span>
			{label}
		</button>
	);
}

// ─── Activation banner ────────────────────────────────────────────────────────

interface ActivationBannerProps {
	active: boolean;
	missing: MissingForActivationField[];
}

function ActivationBanner({ active, missing }: ActivationBannerProps) {
	if (active) {
		return (
			<div className="rounded-lg border border-success/30 bg-success/5 p-4 flex items-start gap-3">
				<span className="material-symbols-outlined text-success text-[22px] shrink-0">
					check_circle
				</span>
				<div>
					<p className="font-sans text-body-md text-ink font-medium">
						Tu perfil está activo
					</p>
					<p className="font-sans text-body-sm text-muted mt-0.5">
						Los alumnos pueden encontrarte en las búsquedas y enviarte
						solicitudes.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-accent-amber/40 bg-accent-amber/5 p-4 flex items-start gap-3">
			<span className="material-symbols-outlined text-accent-amber text-[22px] shrink-0">
				info
			</span>
			<div>
				<p className="font-sans text-body-md text-ink font-medium">
					Tu perfil todavía no está publicado
				</p>
				<p className="font-sans text-body-sm text-muted mt-0.5 mb-2">
					Completá lo que falta para que los alumnos puedan encontrarte:
				</p>
				<ul className="flex flex-col gap-1">
					{missing.map((m) => (
						<li
							key={m}
							className="flex items-center gap-2 font-sans text-body-sm text-ink"
						>
							<span className="material-symbols-outlined text-accent-amber text-[16px]">
								radio_button_unchecked
							</span>
							{ACTIVATION_LABELS[m]}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

// ─── TeacherProfile page ──────────────────────────────────────────────────────

export default function TeacherProfile() {
	const { session } = useAuth();
	const [profile, setProfile] = useState<TutorProfileResponse | null>(null);
	const [form, setForm] = useState<FormState | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const [toastKind, setToastKind] = useState<"error" | "success">("error");
	const [photoUploading, setPhotoUploading] = useState(false);
	const [photoError, setPhotoError] = useState<string | null>(null);
	const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(
		null,
	);
	const [subjectQuery, setSubjectQuery] = useState("");
	const [subjectResults, setSubjectResults] = useState<TeacherProfileSubject[]>(
		[],
	);
	const [subjectSearching, setSubjectSearching] = useState(false);

	useEffect(() => {
		let alive = true;
		getProfile()
			.then((p) => {
				if (!alive) return;
				setProfile(p);
				setForm(profileToForm(p));
				setLoadError(null);
			})
			.catch(() => {
				if (!alive) return;
				setLoadError("No pudimos cargar tu perfil. Probá de nuevo.");
			})
			.finally(() => {
				if (alive) setLoading(false);
			});
		return () => {
			alive = false;
		};
	}, []);

	const hasForm = form !== null;

	useEffect(() => {
		const q = subjectQuery.trim();
		if (!hasForm || q.length === 0) return;

		let alive = true;
		const timer = window.setTimeout(() => {
			searchSubjects(q)
				.then((subjects) => {
					if (!alive) return;
					setSubjectResults(subjects);
				})
				.catch(() => {
					if (!alive) return;
					setSubjectResults([]);
				})
				.finally(() => {
					if (alive) setSubjectSearching(false);
				});
		}, 300);

		return () => {
			alive = false;
			window.clearTimeout(timer);
		};
	}, [subjectQuery, hasForm]);

	useEffect(() => {
		if (!toastMessage) return;
		const timer = window.setTimeout(() => setToastMessage(null), 4500);
		return () => window.clearTimeout(timer);
	}, [toastMessage]);

	useEffect(() => {
		if (!selectedPhotoPreview) return;
		return () => window.URL.revokeObjectURL(selectedPhotoPreview);
	}, [selectedPhotoPreview]);

	const availableSubjectResults = useMemo(() => {
		if (!form) return [];
		const selectedIds = new Set(form.selectedSubjects.map((s) => s.id));
		return subjectResults.filter((s) => !selectedIds.has(s.id));
	}, [form, subjectResults]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form) return;
		setSaving(true);
		setSaveError(null);
		setSaveSuccess(false);
		try {
			const updated = await updateProfile(formToPayload(form));
			setProfile(updated);
			setForm(profileToForm(updated));
			setSaveSuccess(true);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (err) {
			if (err instanceof UnknownSubjectIdsError) {
				setToastKind("error");
				setToastMessage(
					"Algunas materias ya no están disponibles. Refrescá la página.",
				);
				return;
			}

			const msg = err instanceof Error && err.message ? err.message : "";
			setSaveError(
				msg.includes("400")
					? "Revisá los datos: hay campos que no cumplen con el formato."
					: "No pudimos guardar tu perfil. Probá de nuevo.",
			);
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-canvas">
				<Header />
				<main className="max-w-content mx-auto px-6 py-8 flex justify-center">
					<span className="material-symbols-outlined text-[48px] text-muted animate-spin">
						progress_activity
					</span>
				</main>
			</div>
		);
	}

	if (loadError || !profile || !form) {
		return (
			<div className="min-h-screen bg-canvas">
				<Header />
				<main className="max-w-content mx-auto px-6 py-16 flex flex-col items-center gap-4 text-center">
					<span className="material-symbols-outlined text-error text-[48px]">
						error_outline
					</span>
					<p className="font-sans text-body-md text-error">{loadError}</p>
					<button
						onClick={() => window.location.reload()}
						className="h-[40px] px-5 rounded-md bg-primary text-on-primary font-sans text-button hover:bg-primary-active transition-colors"
					>
						Reintentar
					</button>
				</main>
			</div>
		);
	}

	const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
		setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

	const handleSubjectQueryChange = (value: string) => {
		setSubjectQuery(value);
		if (value.trim().length === 0) {
			setSubjectResults([]);
			setSubjectSearching(false);
			return;
		}
		setSubjectSearching(true);
	};

	const handleProfilePhotoChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const input = e.currentTarget;
		const file = input.files?.[0];
		if (!file) return;

		setPhotoError(null);
		setSaveSuccess(false);

		const validationError = getProfilePhotoValidationError(file);
		if (validationError) {
			setPhotoError(validationError);
			input.value = "";
			return;
		}

		setSelectedPhotoPreview(window.URL.createObjectURL(file));
		setPhotoUploading(true);

		try {
			const updated = await uploadProfilePhoto(file);
			if (isFullProfileResponse(updated)) {
				setProfile(updated);
			}
			update("photoUrl", updated.photoUrl);
			setSelectedPhotoPreview(null);
			setToastKind("success");
			setToastMessage("Foto de perfil actualizada.");
		} catch {
			setSelectedPhotoPreview(null);
			setPhotoError("No pudimos subir la foto. Probá de nuevo.");
		} finally {
			setPhotoUploading(false);
			input.value = "";
		}
	};

	// ── Subjects helpers ────────────
	const addSubject = (subject: TeacherProfileSubject) => {
		if (form.selectedSubjects.some((s) => s.id === subject.id)) return;
		update("selectedSubjects", [...form.selectedSubjects, subject]);
		setSubjectQuery("");
		setSubjectResults([]);
	};
	const removeSubject = (subjectId: string) =>
		update(
			"selectedSubjects",
			form.selectedSubjects.filter((s) => s.id !== subjectId),
		);

	// ── Schedules helpers ──────────
	const addSchedule = () =>
		update("schedules", [...form.schedules, { days: "", hours: "" }]);
	const removeSchedule = (i: number) =>
		update(
			"schedules",
			form.schedules.filter((_, idx) => idx !== i),
		);
	const updateSchedule = (i: number, patch: Partial<ScheduleDto>) =>
		update(
			"schedules",
			form.schedules.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
		);

	// ── Methodology features helpers ──
	const addFeature = () =>
		update("methodology", {
			...form.methodology,
			features: [...form.methodology.features, { label: "", value: true }],
		});
	const removeFeature = (i: number) =>
		update("methodology", {
			...form.methodology,
			features: form.methodology.features.filter((_, idx) => idx !== i),
		});
	const updateFeature = (i: number, patch: Partial<MethodologyFeatureDto>) =>
		update("methodology", {
			...form.methodology,
			features: form.methodology.features.map((f, idx) =>
				idx === i ? { ...f, ...patch } : f,
			),
		});

	// ── Plans helpers ──────────
	const addPlan = () =>
		update("plans", [
			...form.plans,
			{
				name: "",
				description: "",
				price: "",
				unit: "",
				badge: "",
				featured: false,
			},
		]);
	const removePlan = (i: number) =>
		update(
			"plans",
			form.plans.filter((_, idx) => idx !== i),
		);
	const updatePlan = (i: number, patch: Partial<PlanDto>) =>
		update(
			"plans",
			form.plans.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
		);

	const profilePhotoPreview = selectedPhotoPreview || form.photoUrl;

	return (
		<div className="min-h-screen bg-canvas">
			<Header />
			{toastMessage && (
				<div
					className={`fixed right-4 top-4 z-50 max-w-sm rounded-lg border bg-surface-card p-4 shadow-lg ${
						toastKind === "success" ? "border-success/30" : "border-error/30"
					}`}
				>
					<div className="flex items-start gap-3">
						<span
							className={`material-symbols-outlined text-[20px] ${
								toastKind === "success" ? "text-success" : "text-error"
							}`}
						>
							{toastKind === "success" ? "check_circle" : "error_outline"}
						</span>
						<p className="font-sans text-body-sm text-ink">{toastMessage}</p>
					</div>
				</div>
			)}

			<main className="max-w-3xl mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-6">
					<Link
						to="/dashboard"
						className="inline-flex items-center gap-1 text-muted hover:text-primary font-sans text-body-sm mb-4 transition-colors"
					>
						<span className="material-symbols-outlined text-[18px]">
							arrow_back
						</span>
						Volver al dashboard
					</Link>
					<h1 className="font-serif text-display-md text-ink mb-1">
						Mi perfil
					</h1>
					<p className="font-sans text-body-md text-muted">
						Así te verán los alumnos cuando aparezcas en las búsquedas.
					</p>
				</div>

				{/* Activation status */}
				<div className="mb-6">
					<ActivationBanner
						active={profile.active}
						missing={profile.missingForActivation}
					/>
				</div>

				{/* Save feedback */}
				{saveSuccess && (
					<div className="mb-6 rounded-lg border border-success/30 bg-success/5 p-4 flex items-center gap-3">
						<span className="material-symbols-outlined text-success text-[20px]">
							check_circle
						</span>
						<p className="font-sans text-body-sm text-ink">
							Cambios guardados correctamente.
						</p>
					</div>
				)}
				{saveError && (
					<div className="mb-6 rounded-lg border border-error/30 bg-error/5 p-4 flex items-center gap-3">
						<span className="material-symbols-outlined text-error text-[20px]">
							error_outline
						</span>
						<p className="font-sans text-body-sm text-error">{saveError}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					{/* ── Personal data ─────────────────────────────── */}
					<Section
						title="Datos personales"
						description="Información básica que verán los alumnos."
					>
						<Field label="Nombre completo" htmlFor="name">
							<input
								id="name"
								type="text"
								required
								value={form.name}
								onChange={(e) => update("name", e.target.value)}
								className={inputClass}
							/>
						</Field>
						<Field
							label="Especialidad"
							htmlFor="subjectSpecialty"
							hint="Ej: Matemática, Física, Programación"
						>
							<input
								id="subjectSpecialty"
								type="text"
								value={form.subjectSpecialty}
								onChange={(e) => update("subjectSpecialty", e.target.value)}
								className={inputClass}
							/>
						</Field>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Field label="Universidad" htmlFor="university">
								<input
									id="university"
									type="text"
									value={form.university}
									onChange={(e) => update("university", e.target.value)}
									className={inputClass}
								/>
							</Field>
							<Field label="Ubicación" htmlFor="location">
								<input
									id="location"
									type="text"
									value={form.location}
									onChange={(e) => update("location", e.target.value)}
									className={inputClass}
								/>
							</Field>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Field
								label="Modalidad"
								htmlFor="modalidad"
								hint="Ej: Presencial, Online, Mixta"
							>
								<input
									id="modalidad"
									type="text"
									value={form.modalidad}
									onChange={(e) => update("modalidad", e.target.value)}
									className={inputClass}
								/>
							</Field>
							<Field
								label="Teléfono"
								htmlFor="phoneNumber"
								hint="Formato internacional, ej: +5491134567890"
							>
								<input
									id="phoneNumber"
									type="tel"
									value={form.phoneNumber}
									onChange={(e) => update("phoneNumber", e.target.value)}
									className={inputClass}
								/>
							</Field>
						</div>
						<Field
							label="Foto de perfil"
							htmlFor="profilePhoto"
							hint="Formatos permitidos: JPG, PNG o WEBP. Tamaño máximo: 2 MB."
						>
							<div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-hairline bg-canvas/60 p-4">
								<div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-hairline bg-surface-subtle flex items-center justify-center">
									{profilePhotoPreview ? (
										<img
											src={profilePhotoPreview}
											alt="Vista previa de la foto de perfil"
											className="h-full w-full object-cover"
										/>
									) : (
										<span className="material-symbols-outlined text-muted text-[40px]">
											person
										</span>
									)}
								</div>
								<div className="flex min-w-0 flex-1 flex-col gap-2">
									<input
										id="profilePhoto"
										type="file"
										accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
										onChange={handleProfilePhotoChange}
										disabled={photoUploading || saving}
										className={`${inputClass} h-auto py-2 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:font-sans file:text-button file:text-on-primary hover:file:bg-primary-active disabled:opacity-60`}
									/>
									{photoUploading && (
										<p className="font-sans text-caption text-muted">
											Subiendo foto...
										</p>
									)}
									{photoError && (
										<p className="font-sans text-caption text-error">
											{photoError}
										</p>
									)}
								</div>
							</div>
						</Field>
					</Section>

					{/* ── Bio ────────────────────────────────────────── */}
					<Section
						title="Sobre vos"
						description="Contales a los alumnos quién sos y cómo enseñás."
					>
						<Field label="Biografía" htmlFor="bio">
							<textarea
								id="bio"
								value={form.bio}
								onChange={(e) => update("bio", e.target.value)}
								placeholder="Ej: Profesora de matemática con 10 años de experiencia..."
								className={textareaClass}
							/>
						</Field>
					</Section>

					{/* ── Subjects ───────────────────────────────────── */}
					<Section
						title="Materias"
						description="Buscá materias del catálogo y agregalas a tu perfil."
					>
						<div className="flex flex-wrap gap-2">
							{form.selectedSubjects.length === 0 ? (
								<p className="font-sans text-body-sm text-muted italic">
									Todavía no agregaste materias.
								</p>
							) : (
								form.selectedSubjects.map((subject) => (
									<span
										key={subject.id}
										className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 font-sans text-body-sm text-ink"
									>
										{subject.canonicalName}
										<button
											type="button"
											onClick={() => removeSubject(subject.id)}
											aria-label={`Quitar ${subject.canonicalName}`}
											className="text-muted hover:text-error transition-colors"
										>
											x
										</button>
									</span>
								))
							)}
						</div>

						<Field
							label="Buscar materia"
							htmlFor="subjectSearch"
							hint="Solo podés seleccionar materias existentes en el catálogo."
						>
							<div className="relative">
								<input
									id="subjectSearch"
									type="text"
									value={subjectQuery}
									onChange={(e) => handleSubjectQueryChange(e.target.value)}
									placeholder="Ej: Álgebra"
									className={`${inputClass} w-full`}
								/>
								{subjectSearching && (
									<span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-muted animate-spin">
										progress_activity
									</span>
								)}
								{availableSubjectResults.length > 0 && (
									<div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-hairline bg-surface-card shadow-lg">
										{availableSubjectResults.map((subject) => (
											<button
												key={subject.id}
												type="button"
												onClick={() => addSubject(subject)}
												className="block w-full px-3 py-2 text-left font-sans text-body-sm text-ink hover:bg-primary/5 transition-colors"
											>
												{subject.canonicalName}
											</button>
										))}
									</div>
								)}
							</div>
						</Field>
						{subjectQuery.trim().length > 0 &&
							!subjectSearching &&
							subjectResults.length === 0 && (
								<p className="font-sans text-body-sm text-muted">
									Esta materia no está en el catálogo. Pedile al admin que la dé
									de alta.
								</p>
							)}
					</Section>

					{/* ── Schedules ──────────────────────────────────── */}
					<Section
						title="Horarios"
						description="Cuándo solés tener disponibilidad."
					>
						{form.schedules.length === 0 && (
							<p className="font-sans text-body-sm text-muted italic">
								Todavía no agregaste horarios.
							</p>
						)}
						{form.schedules.map((s, i) => (
							<div
								key={i}
								className="flex gap-3 items-start p-4 rounded-md bg-canvas border border-hairline"
							>
								<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
									<input
										type="text"
										placeholder="Días (ej: Lunes a Viernes)"
										value={s.days}
										onChange={(e) =>
											updateSchedule(i, { days: e.target.value })
										}
										className={inputClass}
									/>
									<input
										type="text"
										placeholder="Horas (ej: 18-22)"
										value={s.hours}
										onChange={(e) =>
											updateSchedule(i, { hours: e.target.value })
										}
										className={inputClass}
									/>
								</div>
								<RemoveButton
									onClick={() => removeSchedule(i)}
									label={`Eliminar horario ${i + 1}`}
								/>
							</div>
						))}
						<AddButton onClick={addSchedule} label="Agregar horario" />
						<Field
							label="Nota sobre horarios"
							htmlFor="schedulesNote"
							hint="Algo opcional que aclare la disponibilidad."
						>
							<input
								id="schedulesNote"
								type="text"
								value={form.schedulesNote}
								onChange={(e) => update("schedulesNote", e.target.value)}
								placeholder="Ej: Flexibilidad para coordinar otros horarios."
								className={inputClass}
							/>
						</Field>
					</Section>

					{/* ── Methodology ────────────────────────────────── */}
					<Section title="Metodología" description="Cómo es una clase con vos.">
						<Field label="Introducción" htmlFor="methodologyIntro">
							<textarea
								id="methodologyIntro"
								value={form.methodology.intro}
								onChange={(e) =>
									update("methodology", {
										...form.methodology,
										intro: e.target.value,
									})
								}
								placeholder="Ej: Clases activas con foco en resolución de ejercicios..."
								className={textareaClass}
							/>
						</Field>
						<div className="flex flex-col gap-3">
							<p className="font-sans text-caption text-ink font-medium">
								Características
							</p>
							{form.methodology.features.length === 0 && (
								<p className="font-sans text-body-sm text-muted italic">
									Todavía no agregaste características.
								</p>
							)}
							{form.methodology.features.map((f, i) => (
								<div
									key={i}
									className="flex gap-3 items-center p-3 rounded-md bg-canvas border border-hairline"
								>
									<input
										type="text"
										placeholder="Etiqueta (ej: Material de estudio incluido)"
										value={f.label}
										onChange={(e) =>
											updateFeature(i, { label: e.target.value })
										}
										className={`${inputClass} flex-1`}
									/>
									<label className="flex items-center gap-2 cursor-pointer select-none">
										<input
											type="checkbox"
											checked={f.value}
											onChange={(e) =>
												updateFeature(i, { value: e.target.checked })
											}
											className="w-4 h-4 accent-primary"
										/>
										<span className="font-sans text-body-sm text-ink">Sí</span>
									</label>
									<RemoveButton
										onClick={() => removeFeature(i)}
										label={`Eliminar característica ${i + 1}`}
									/>
								</div>
							))}
							<AddButton onClick={addFeature} label="Agregar característica" />
						</div>
					</Section>

					{/* ── Plans & rate ───────────────────────────────── */}
					<Section
						title="Planes y tarifa"
						description="Cuánto cobrás y qué paquetes ofrecés."
					>
						<Field
							label="Tarifa por hora (ARS)"
							htmlFor="hourlyRate"
							hint="Tarifa base. Debe ser mayor a 0 para que tu perfil se publique."
						>
							<input
								id="hourlyRate"
								type="number"
								min="0"
								step="100"
								value={form.hourlyRate}
								onChange={(e) => update("hourlyRate", e.target.value)}
								className={inputClass}
							/>
						</Field>
						<div className="flex flex-col gap-3">
							<p className="font-sans text-caption text-ink font-medium">
								Planes
							</p>
							{form.plans.length === 0 && (
								<p className="font-sans text-body-sm text-muted italic">
									Todavía no agregaste planes.
								</p>
							)}
							{form.plans.map((p, i) => (
								<div
									key={i}
									className="flex gap-3 items-start p-4 rounded-md bg-canvas border border-hairline"
								>
									<div className="flex-1 flex flex-col gap-3">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<input
												type="text"
												placeholder="Nombre (ej: 4 clases mensuales)"
												value={p.name}
												onChange={(e) =>
													updatePlan(i, { name: e.target.value })
												}
												className={inputClass}
											/>
											<input
												type="text"
												placeholder="Badge (ej: Más popular, opcional)"
												value={p.badge}
												onChange={(e) =>
													updatePlan(i, { badge: e.target.value })
												}
												className={inputClass}
											/>
										</div>
										<input
											type="text"
											placeholder="Descripción"
											value={p.description}
											onChange={(e) =>
												updatePlan(i, { description: e.target.value })
											}
											className={inputClass}
										/>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<input
												type="text"
												placeholder="Precio (ej: $12000)"
												value={p.price}
												onChange={(e) =>
													updatePlan(i, { price: e.target.value })
												}
												className={inputClass}
											/>
											<input
												type="text"
												placeholder="Unidad (ej: por mes)"
												value={p.unit}
												onChange={(e) =>
													updatePlan(i, { unit: e.target.value })
												}
												className={inputClass}
											/>
										</div>
										<label className="flex items-center gap-2 cursor-pointer select-none">
											<input
												type="checkbox"
												checked={p.featured}
												onChange={(e) =>
													updatePlan(i, { featured: e.target.checked })
												}
												className="w-4 h-4 accent-primary"
											/>
											<span className="font-sans text-body-sm text-ink">
												Destacar este plan
											</span>
										</label>
									</div>
									<RemoveButton
										onClick={() => removePlan(i)}
										label={`Eliminar plan ${i + 1}`}
									/>
								</div>
							))}
							<AddButton onClick={addPlan} label="Agregar plan" />
						</div>
					</Section>

					{/* ── Submit ─────────────────────────────────────── */}
					<div className="flex items-center justify-between gap-4 pt-2">
						{session && (
							<Link
								to={`/tutor/${session.userId}`}
								className="font-sans text-button text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
							>
								<span className="material-symbols-outlined text-[18px]">
									visibility
								</span>
								Ver perfil público
							</Link>
						)}
						<button
							type="submit"
							disabled={saving || photoUploading}
							className="h-[48px] px-6 rounded-md bg-primary text-on-primary font-sans text-button hover:bg-primary-active transition-colors disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
						>
							{saving
								? "Guardando..."
								: photoUploading
									? "Subiendo foto..."
									: "Guardar cambios"}
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}
