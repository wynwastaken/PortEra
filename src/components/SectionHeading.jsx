export default function SectionHeading({ eyebrow, title, description, centered = true }) {
  return <div className={`section-heading ${centered ? 'center' : ''}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}
