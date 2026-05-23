import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileNav from "../components/MobileNav";
import { searchTutors } from "../api/tutors";
import { getCatalog } from "../api/catalog";
import type { TutorSummary } from "../api/types";

type DropdownProps = {
	label: string;
	placeholder: string;
	options: string[];
	value: string;
	onChange: (v: string) => void;
};

function FilterDropdown({
	label,
	placeholder,
	options,
	value,
	onChange,
}: DropdownProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState(value);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setQuery(value);
	}, [value]);

	const filtered = options.filter((o) =>
		o.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div className="flex flex-col gap-3 mt-4">
			<h3 className="font-sans text-title-sm text-ink border-b border-hairline pb-2">
				{label}
			</h3>
			<div className="relative mt-1">
				<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm z-10">
					search
				</span>
				<input
					value={query}
					onFocus={() => setOpen(true)}
					onBlur={() => setTimeout(() => setOpen(false), 150)}
					onChange={(e) => setQuery(e.target.value)}
					className="bg-canvas border border-hairline rounded-md pl-9 pr-8 py-2 w-full font-sans text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
					placeholder={placeholder}
				/>
				<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
					expand_more
				</span>
				{open && filtered.length > 0 && (
					<div className="absolute top-full left-0 w-full mt-1 bg-surface-card border border-hairline rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
						<ul className="py-1">
							{filtered.map((opt) => (
								<li
									key={opt}
									onMouseDown={() => {
										onChange(opt);
										setQuery(opt);
										setOpen(false);
									}}
									className="px-3 py-2 hover:bg-surface-soft cursor-pointer font-sans text-body-sm"
								>
									{opt}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

export default function Search() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [uniFilter, setUniFilter] = useState(
		searchParams.get("universidad") || "",
	);
	const [subjectFilter, setSubjectFilter] = useState(
		searchParams.get("materia") || "",
	);
	const [careerFilter, setCareerFilter] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");

	const [tutors, setTutors] = useState<TutorSummary[]>([]);
	const [universities, setUniversities] = useState<string[]>([]);
	const [careers, setCareers] = useState<string[]>([]);
	const [subjects, setSubjects] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getCatalog()
			.then((data) => {
				setUniversities(data.universities.map((u) => u.name));
				setCareers(data.careers.map((c) => c.name));
				setSubjects(data.subjects.map((s) => s.name));
			})
			.catch(() => {});
	}, []);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setLoading(true);
			setError(null);
			searchTutors({
				universidad: uniFilter || undefined,
				materia: subjectFilter || undefined,
				carrera: careerFilter || undefined,
				minPrice: minPrice ? Number(minPrice) : undefined,
				maxPrice: maxPrice ? Number(maxPrice) : undefined,
			})
				.then(setTutors)
				.catch((err: Error) => setError(err.message))
				.finally(() => setLoading(false));
		}, 300);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [uniFilter, subjectFilter, careerFilter, minPrice, maxPrice]);

	const activeFilters = [
		uniFilter && {
			key: "uni",
			label: uniFilter,
			clear: () => setUniFilter(""),
		},
		subjectFilter && {
			key: "sub",
			label: subjectFilter,
			clear: () => setSubjectFilter(""),
		},
		careerFilter && {
			key: "car",
			label: careerFilter,
			clear: () => setCareerFilter(""),
		},
	].filter(Boolean) as { key: string; label: string; clear: () => void }[];

	function resetFilters() {
		setUniFilter("");
		setSubjectFilter("");
		setCareerFilter("");
		setMinPrice("");
		setMaxPrice("");
	}

	return (
		<div className="bg-canvas text-ink min-h-screen flex flex-col font-sans">
			<Header />

			<main className="flex-grow w-full max-w-content mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
				{/* Sidebar */}
				<aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
					<div className="mb-4">
						<h1 className="font-serif text-display-md text-ink mb-2">
							Buscar Tutores
						</h1>
						<p className="font-sans text-body-sm text-muted">
							Descubrí socios de pensamiento en todas las materias y
							universidades.
						</p>
					</div>

					{activeFilters.length > 0 && (
						<div className="flex flex-col gap-3 mb-2">
							<h3 className="font-sans text-title-sm text-ink border-b border-hairline pb-2">
								Filtros activos
							</h3>
							<div className="flex flex-wrap gap-2">
								{activeFilters.map((f) => (
									<div
										key={f.key}
										className="inline-flex items-center gap-1 bg-primary/10 text-primary-active px-2 py-1 rounded-md text-caption font-medium"
									>
										<span>{f.label}</span>
										<button
											onClick={f.clear}
											className="hover:text-primary transition-colors flex items-center"
										>
											<span className="material-symbols-outlined text-[14px]">
												close
											</span>
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					<FilterDropdown
						label="Universidad"
						placeholder="Buscar universidad..."
						options={universities}
						value={uniFilter}
						onChange={setUniFilter}
					/>
					<FilterDropdown
						label="Carrera"
						placeholder="Buscar carrera..."
						options={careers}
						value={careerFilter}
						onChange={setCareerFilter}
					/>
					<FilterDropdown
						label="Materia"
						placeholder="Buscar materia..."
						options={subjects}
						value={subjectFilter}
						onChange={setSubjectFilter}
					/>

					<div className="flex flex-col gap-3 mt-4">
						<h3 className="font-sans text-title-sm text-ink border-b border-hairline pb-2">
							Precio (por hora)
						</h3>
						<div className="flex items-center gap-2 mt-1">
							<input
								type="number"
								value={minPrice}
								onChange={(e) => setMinPrice(e.target.value)}
								placeholder="Mín"
								className="bg-canvas border border-hairline rounded-md px-3 py-2 w-full font-sans text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
							/>
							<span className="text-muted">-</span>
							<input
								type="number"
								value={maxPrice}
								onChange={(e) => setMaxPrice(e.target.value)}
								placeholder="Máx"
								className="bg-canvas border border-hairline rounded-md px-3 py-2 w-full font-sans text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
							/>
						</div>
					</div>

					<button
						onClick={resetFilters}
						className="bg-canvas text-ink border border-hairline rounded-md py-2 px-4 font-sans text-button hover:bg-surface-soft transition-colors mt-4"
					>
						Limpiar filtros
					</button>
				</aside>

				{/* Tutor grid */}
				<div className="flex-grow grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
					{loading && (
						<div className="col-span-full flex items-center justify-center py-xxl text-muted">
							<span className="material-symbols-outlined text-[48px] animate-spin">
								progress_activity
							</span>
						</div>
					)}

					{!loading && error && (
						<div className="col-span-full flex flex-col items-center justify-center py-xxl text-muted">
							<span className="material-symbols-outlined text-[48px] mb-4">
								error_outline
							</span>
							<p className="font-sans text-body-md">
								Error al cargar tutores. Verificá que el servidor esté
								corriendo.
							</p>
						</div>
					)}

					{!loading && !error && tutors.length === 0 && (
						<div className="col-span-full flex flex-col items-center justify-center py-xxl text-muted">
							<span className="material-symbols-outlined text-[48px] mb-4">
								search_off
							</span>
							<p className="font-sans text-body-md">
								No se encontraron tutores con esos filtros.
							</p>
						</div>
					)}

					{!loading &&
						!error &&
						tutors.map((tutor) => (
							<article
								key={tutor.id}
								className="bg-surface-card rounded-lg p-xl border border-hairline flex flex-col gap-4 relative overflow-hidden group hover:shadow-[0_1px_3px_rgba(20,20,19,0.08)] transition-shadow"
							>
								<div
									className={`absolute top-4 right-4 flex items-center gap-1.5 ${!tutor.active && "opacity-50"}`}
								>
									<span
										className={`w-2 h-2 rounded-full ${tutor.active ? "bg-success" : "bg-muted"}`}
									/>
									<span
										className={`font-sans text-caption ${tutor.active ? "text-success" : "text-muted"}`}
									>
										{tutor.active ? "Activo" : "Offline"}
									</span>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-16 h-16 rounded-full overflow-hidden border border-hairline shrink-0">
										<img
											src={tutor.photoUrl}
											alt={tutor.name}
											className={`w-full h-full object-cover ${!tutor.active && "grayscale-[20%]"}`}
										/>
									</div>
									<div>
										<h2 className="font-serif text-display-sm text-ink leading-tight">
											{tutor.name}
										</h2>
										<p className="font-sans text-body-sm text-muted mt-1">
											{tutor.university}
										</p>
									</div>
								</div>

								<div className="flex flex-wrap gap-2 mt-2">
									{tutor.subjects.map((subject) => (
										<span
											key={subject.id}
											className="bg-canvas border border-hairline text-ink rounded-full px-3 py-1 font-sans text-caption inline-flex items-center gap-1.5"
										>
											{subject.icon && (
												<span
													className="material-symbols-outlined text-[14px]"
													aria-hidden="true"
												>
													{subject.icon}
												</span>
											)}
											{subject.canonicalName}
										</span>
									))}
								</div>

								<div className="mt-auto pt-4 flex items-center justify-between border-t border-hairline-soft">
									<div className="flex items-center gap-2">
										<span className="font-sans text-title-sm text-ink">
											${tutor.hourlyRate}/hr
										</span>
									</div>
									<button
										onClick={() => {
											const qs = new URLSearchParams();
											if (uniFilter) qs.set("universidad", uniFilter);
											if (careerFilter) qs.set("carrera", careerFilter);
											if (subjectFilter) qs.set("materia", subjectFilter);
											const query = qs.toString();
											navigate(`/tutor/${tutor.id}${query ? `?${query}` : ""}`);
										}}
										className="text-primary hover:text-primary-active font-sans text-button flex items-center gap-1 group-hover:translate-x-1 transition-transform"
									>
										Ver perfil{" "}
										<span className="material-symbols-outlined text-[16px]">
											arrow_forward
										</span>
									</button>
								</div>
							</article>
						))}
				</div>
			</main>

			<Footer />
			<MobileNav />
		</div>
	);
}
