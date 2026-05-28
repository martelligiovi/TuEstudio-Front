import { useState } from "react";

interface TutorAvatarProps {
	photoUrl?: string | null;
	name: string;
	className?: string;
	imageClassName?: string;
}

function getDisplayPhotoUrl(photoUrl?: string | null): string {
	return photoUrl?.trim() ?? "";
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	return parts
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");
}

export default function TutorAvatar({
	photoUrl,
	name,
	className = "",
	imageClassName = "",
}: TutorAvatarProps) {
	const src = getDisplayPhotoUrl(photoUrl);
	const [failedSrc, setFailedSrc] = useState<string | null>(null);
	const shouldShowImage = src.length > 0 && failedSrc !== src;

	return (
		<div
			className={`overflow-hidden bg-surface-subtle flex items-center justify-center ${className}`}
		>
			{shouldShowImage ? (
				<img
					src={src}
					alt={name}
					referrerPolicy="no-referrer"
					onError={() => setFailedSrc(src)}
					className={`w-full h-full object-cover ${imageClassName}`}
				/>
			) : (
				<span className="font-sans text-body-md text-muted font-medium select-none">
					{getInitials(name)}
				</span>
			)}
		</div>
	);
}
