export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface TeamCardProps {
  member: TeamMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  const { name, role, image, social } = member;

  // Check if at least one social link exists
  const hasSocialLinks = social.facebook || social.twitter || social.instagram;

  return (
    <div className="col-lg-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} className="w-100" alt={name} />
      <div className="p-3 text-center">
        <h4 className="mb-0">{name}</h4>
        <p className="mb-2">{role}</p>
        {hasSocialLinks && (
          <div className="social-icons">
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bg-white id-color bg-hover-2 text-hover-white fa-brands fa-facebook-f"></i>
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bg-white id-color bg-hover-2 text-hover-white fa-brands fa-x-twitter"></i>
              </a>
            )}
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bg-white id-color bg-hover-2 text-hover-white fa-brands fa-instagram"></i>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
