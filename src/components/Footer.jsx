import { Facebook, Youtube, Linkedin, Mail } from 'lucide-react'

const fbGroups = [
  { name: 'Claude Code - Polska Społeczność', url: 'https://www.facebook.com/groups/1768175597227732/' },
  { name: 'Akademia Automatyzacji', url: 'https://www.facebook.com/groups/887930655685138/' },
  { name: 'n8n - Polska Społeczność', url: 'https://www.facebook.com/groups/1862334801191952/' },
  { name: 'Zbuduj Aplikację z AI Bez Kodowania', url: 'https://www.facebook.com/groups/1693200344557850/' },
]

const socials = [
  { icon: Youtube, url: 'https://www.youtube.com/@AkademiaAutomatyzacji', label: 'YouTube' },
  { icon: Linkedin, url: 'https://www.linkedin.com/company/akademiaautomatyzacji-com/', label: 'LinkedIn' },
  { icon: Facebook, url: 'https://www.facebook.com/AkademiaAutomatyzacji', label: 'Facebook' },
]

// Custom X (Twitter) icon
const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="mt-20 bg-black/40 backdrop-blur-sm border-t border-slate-700/50">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

          {/* Brand column */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold">
              <span className="text-[#FF6B00]">Akademia</span>
              <span className="text-white">Automatyzacji</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Uczymy, jak wykorzystać automatyzacje i AI, aby przyśpieszać procesy i oszczędzać czas.
            </p>
            <a
              href="mailto:kontakt@akademiaautomatyzacji.com"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors text-sm"
            >
              <Mail size={16} />
              kontakt@akademiaautomatyzacji.com
            </a>
          </div>

          {/* FB Groups column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Grupy Facebook
            </h4>
            <ul className="space-y-2.5">
              {fbGroups.map((group) => (
                <li key={group.url}>
                  <a
                    href={group.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-[#FF6B00] transition-colors text-sm group"
                  >
                    <Facebook size={14} className="text-slate-600 group-hover:text-[#FF6B00] transition-colors" />
                    {group.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Social Media
            </h4>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 hover:border-slate-600/50 transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
              <a
                href="https://x.com/KacperTrzepiec1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 hover:border-slate-600/50 transition-all"
              >
                <XIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/40">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Polityka prywatności</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Regulamin</a>
            </div>
            <p>© 2025 Akademia Automatyzacji. Wszelkie prawa zastrzeżone.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
