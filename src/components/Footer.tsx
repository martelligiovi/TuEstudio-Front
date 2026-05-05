export default function Footer() {
  return (
    <footer className="bg-surface-dark w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto hidden md:flex">
      <div className="font-serif text-xl text-on-dark">TuEstudio</div>
      <div className="font-sans text-body-sm text-on-dark-soft">
        © 2024 TuEstudio. A thinking partnership for students.
      </div>
      <nav className="flex items-center gap-6">
        {['About', 'Privacy', 'Terms', 'Support'].map((item) => (
          <a
            key={item}
            href="#"
            className="text-on-dark-soft font-sans text-body-sm hover:text-coral transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>
    </footer>
  )
}
