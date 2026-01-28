export interface TeamMember {
  id: number;
  name: string;
  role: string | null;
  image: string | null;
  bio?: string | null;
  social_facebook?: string | null;
  social_twitter?: string | null;
  social_instagram?: string | null;
  social_linkedin?: string | null;
}

export interface TeamCardProps {
  member: TeamMember;
}

// Helper to check if social link is valid (not empty, null, or just "#")
function isValidSocialLink(link?: string | null): boolean {
  return !!link && link.trim() !== "" && link.trim() !== "#";
}

export default function TeamCard({ member }: TeamCardProps) {
  const { name, role, image, social_facebook, social_twitter, social_instagram, social_linkedin } = member;

  // Check if at least one valid social link exists
  const hasSocialLinks =
    isValidSocialLink(social_facebook) ||
    isValidSocialLink(social_twitter) ||
    isValidSocialLink(social_instagram) ||
    isValidSocialLink(social_linkedin);

  return (
    <div className="col-lg-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image || "/images/team/placeholder.webp"} className="w-100" alt={name} />
      <div className="p-3 text-center">
        <h4 className="mb-0">{name}</h4>
        <p className="mb-2">{role}</p>
        {hasSocialLinks && (
          <div className="social-icons">
            {isValidSocialLink(social_facebook) && (
              <a
                href={social_facebook!}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bg-white id-color bg-hover-2 text-hover-white fa-brands fa-facebook-f"></i>
              </a>
            )}
            {isValidSocialLink(social_twitter) && (
              <a
                href={social_twitter!}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bg-white id-color bg-hover-2 text-hover-white fa-brands fa-x-twitter"></i>
              </a>
            )}
            {isValidSocialLink(social_instagram) && (
              <a
                href={social_instagram!}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bg-white id-color bg-hover-2 text-hover-white fa-brands fa-instagram"></i>
              </a>
            )}
            {isValidSocialLink(social_linkedin) && (
              <a
                href={social_linkedin!}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bg-white id-color bg-hover-2 text-hover-white fa-brands fa-linkedin-in"></i>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
