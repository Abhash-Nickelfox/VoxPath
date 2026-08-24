export default function Icon({ name, className = '', ...props }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true" {...props}>
      {name}
    </span>
  )
}
