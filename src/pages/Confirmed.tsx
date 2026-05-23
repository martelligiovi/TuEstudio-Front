import { useState } from "react";
import { Link } from "react-router-dom";

export default function Confirmed() {
	const [leadId] = useState(
		() => "#TE-" + Math.floor(1000 + Math.random() * 9000) + "-X",
	);

	return (
		<div className="bg-canvas text-on-background antialiased min-h-screen flex flex-col font-sans">
			<main className="flex-grow flex items-center justify-center py-section px-lg">
				<div className="max-w-2xl w-full flex flex-col items-center text-center">
					{/* Success icon */}
					<div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-xl border border-hairline">
						<span
							className="material-symbols-outlined text-display-md text-primary"
							style={{ fontVariationSettings: "'FILL' 1" }}
						>
							check_circle
						</span>
					</div>

					<h1 className="font-serif text-display-lg text-on-surface mb-md">
						¡Solicitud Enviada con Éxito!
					</h1>
					<p className="font-sans text-body-md text-on-surface-variant max-w-lg mx-auto mb-section">
						Tu mensaje fue procesado y el profesor recibirá una notificación
						inmediata.
					</p>

					{/* Summary card */}
					<div className="w-full bg-surface-card border border-hairline rounded-xl p-xxl text-left mb-section">
						<h2 className="font-sans text-title-md text-on-surface mb-lg border-b border-hairline pb-sm">
							Detalles de la Solicitud
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
							<div>
								<p className="font-sans text-caption-uppercase text-muted uppercase tracking-wider mb-xxs">
									Lead ID
								</p>
								<p className="font-sans text-body-md text-on-surface">
									{leadId}
								</p>
							</div>
							<div>
								<p className="font-sans text-caption-uppercase text-muted uppercase tracking-wider mb-xxs">
									Profesor
								</p>
								<p className="font-sans text-body-md text-on-surface">
									Carlos Mendoza
								</p>
							</div>
							<div>
								<p className="font-sans text-caption-uppercase text-muted uppercase tracking-wider mb-xxs">
									Materia
								</p>
								<p className="font-sans text-body-md text-on-surface">
									Matemáticas Avanzadas
								</p>
							</div>
							<div>
								<p className="font-sans text-caption-uppercase text-muted uppercase tracking-wider mb-xxs">
									Estado
								</p>
								<div className="inline-flex items-center bg-surface px-sm py-xxs rounded-full border border-hairline">
									<span className="w-2 h-2 rounded-full bg-warning mr-xs" />
									<span className="font-sans text-caption text-on-surface">
										Pendiente de contacto
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="w-full max-w-md mx-auto flex flex-col items-center">
						<p className="font-sans text-body-md text-on-surface-variant mb-xl text-center">
							Serás redirigido a WhatsApp para comenzar la conversación con el
							contexto preparado.
						</p>
						<a
							href="https://wa.me/?text=Hola%2C+te+escribo+desde+TuEstudio"
							target="_blank"
							rel="noopener noreferrer"
							className="w-full bg-primary hover:bg-primary-active text-on-primary font-sans text-button py-md px-lg rounded flex items-center justify-center transition-colors mb-lg"
						>
							<span className="material-symbols-outlined mr-xs">chat</span>
							Contactar al profe via WhatsApp
						</a>
						<div className="flex gap-md w-full">
							<Link
								to="/search"
								className="flex-1 bg-surface-cream-strong hover:bg-surface-variant border border-hairline text-on-surface font-sans text-button py-sm px-md rounded text-center transition-colors"
							>
								Seguir buscando
							</Link>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-surface-dark w-full py-12">
				<div className="grid grid-cols-4 gap-12 max-w-content mx-auto px-8">
					<div className="col-span-4 md:col-span-1 mb-8 md:mb-0">
						<div className="font-serif text-xl font-bold text-on-dark mb-4">
							TuEstudio
						</div>
						<p className="font-sans text-body-sm text-on-dark-soft">
							© 2024 TuEstudio.
						</p>
					</div>
					<div className="col-span-4 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
						{[
							"About Us",
							"Privacy Policy",
							"Terms of Service",
							"Contact Support",
						].map((item) => (
							<a
								key={item}
								href="#"
								className="font-sans text-body-sm text-on-dark-soft hover:text-coral transition-colors block"
							>
								{item}
							</a>
						))}
					</div>
				</div>
			</footer>
		</div>
	);
}
