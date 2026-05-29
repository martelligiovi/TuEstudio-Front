const DEFAULT_TITLE = "TuEstudio — Encontrá tu tutor académico";
const DEFAULT_DESCRIPTION =
	"Encontrá profesores particulares y tutores académicos en TuEstudio.";

function escapeHtml(value) {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function absoluteUrl(value, requestUrl) {
	if (!value) return "";
	try {
		return new URL(value, requestUrl).toString();
	} catch {
		return "";
	}
}

function getApiBase(env) {
	return (env.API_URL || env.VITE_API_URL || "").replace(/\/$/, "");
}

async function fetchTutor(env, requestUrl, id) {
	const apiBase = getApiBase(env);
	const apiUrl = apiBase
		? `${apiBase}/api/tutors/${encodeURIComponent(id)}`
		: new URL(`/api/tutors/${encodeURIComponent(id)}`, requestUrl).toString();

	const response = await fetch(apiUrl, {
		headers: { Accept: "application/json" },
	});

	if (!response.ok) return null;
	return response.json();
}

function buildSocialTags({ title, description, image, url }) {
	const safeTitle = escapeHtml(title || DEFAULT_TITLE);
	const safeDescription = escapeHtml(description || DEFAULT_DESCRIPTION);
	const safeImage = escapeHtml(image);
	const safeUrl = escapeHtml(url);

	return `
<meta name="description" content="${safeDescription}" />
<meta property="og:type" content="profile" />
<meta property="og:site_name" content="TuEstudio" />
<meta property="og:title" content="${safeTitle}" />
<meta property="og:description" content="${safeDescription}" />
<meta property="og:url" content="${safeUrl}" />
${safeImage ? `<meta property="og:image" content="${safeImage}" />` : ""}
${safeImage ? `<meta property="og:image:alt" content="${safeTitle}" />` : ""}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${safeTitle}" />
<meta name="twitter:description" content="${safeDescription}" />
${safeImage ? `<meta name="twitter:image" content="${safeImage}" />` : ""}`;
}

function injectSocialTags(html, socialTags, title) {
	const withoutStaticSocialTags = html
		.replace(/\s*<meta\s+name="description"[^>]*>\s*/gi, "\n")
		.replace(/\s*<meta\s+property="og:[^"]+"[^>]*>\s*/gi, "\n")
		.replace(/\s*<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, "\n");
	const withTitle = withoutStaticSocialTags.replace(
		/<title>.*?<\/title>/i,
		`<title>${escapeHtml(title || DEFAULT_TITLE)}</title>`,
	);

	return withTitle.replace("</head>", `${socialTags}\n  </head>`);
}

export async function onRequestGet({ request, env, params }) {
	const requestUrl = new URL(request.url);
	const id = params.id;
	const indexUrl = new URL("/index.html", request.url);
	const indexResponse = await env.ASSETS.fetch(new Request(indexUrl, request));
	let html = await indexResponse.text();

	let tutor = null;
	try {
		tutor = await fetchTutor(env, request.url, id);
	} catch {
		tutor = null;
	}

	const title = tutor?.name
		? `${tutor.name} — Profesor en TuEstudio`
		: DEFAULT_TITLE;
	const description = tutor?.subjectSpecialty
		? `Clases de ${tutor.subjectSpecialty} con ${tutor.name}.`
		: DEFAULT_DESCRIPTION;
	const image = absoluteUrl(tutor?.photoUrl, request.url);
	const canonicalUrl = `${requestUrl.origin}${requestUrl.pathname}`;

	html = injectSocialTags(
		html,
		buildSocialTags({ title, description, image, url: canonicalUrl }),
		title,
	);

	return new Response(html, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "public, max-age=300",
		},
	});
}
