import { Database, Users, MessageSquare, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Grupy FB', value: 105, icon: Users, color: 'blue' },
  { label: 'Subreddity', value: 154, icon: MessageSquare, color: 'orange' },
  { label: 'Problemy zebrane', value: 4003, icon: Database, color: 'green' },
  { label: 'Segmenty badawcze', value: 8, icon: TrendingUp, color: 'purple' },
]

const segments = [
  { name: 'AI/Automatyzacja', groups: 15, problems: 523 },
  { name: 'E-commerce/Dropshipping', groups: 18, problems: 612 },
  { name: 'Marketing/Growth', groups: 22, problems: 489 },
  { name: 'Freelance/Zlecenia', groups: 12, problems: 398 },
  { name: 'SaaS/Startupy', groups: 14, problems: 445 },
  { name: 'Finanse/Księgowość', groups: 10, problems: 356 },
  { name: 'Content/Social Media', groups: 8, problems: 612 },
  { name: 'Dev/No-code', groups: 6, problems: 568 },
]

export default function Phase1Page() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold mb-4">Faza 1: Zbieranie Danych</h1>
        <p className="text-gray-400 max-w-3xl">
          Systematyczne zbieranie problemów użytkowników z polskich grup na Facebooku
          i anglojęzycznych subredditów. Każda grupa/subreddit przeanalizowana przez AI
          w celu ekstrakcji konkretnych, rozwiązywalnych problemów.
        </p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`p-6 rounded-xl bg-gray-900 border border-gray-800`}
          >
            <div className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center mb-4`}>
              <Icon className={`text-${color}-400`} size={24} />
            </div>
            <div className="text-3xl font-bold">{value.toLocaleString()}</div>
            <div className="text-gray-500">{label}</div>
          </div>
        ))}
      </section>

      {/* Process */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Proces Zbierania</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <div className="text-4xl mb-4">1</div>
            <h3 className="font-semibold text-lg mb-2">Selekcja źródeł</h3>
            <p className="text-gray-400 text-sm">
              Ręczna kuracja 105 polskich grup FB i 154 subredditów
              o tematyce biznesowej, tech i freelance.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <div className="text-4xl mb-4">2</div>
            <h3 className="font-semibold text-lg mb-2">Scraping + AI</h3>
            <p className="text-gray-400 text-sm">
              Automatyczne zbieranie postów i komentarzy.
              AI analizuje każdy post pod kątem problemów do rozwiązania.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <div className="text-4xl mb-4">3</div>
            <h3 className="font-semibold text-lg mb-2">Raporty strukturalne</h3>
            <p className="text-gray-400 text-sm">
              Dla każdej grupy AI generuje raport z listą problemów,
              ich intensywnością i sygnałem zakupowym.
            </p>
          </div>
        </div>
      </section>

      {/* Segments */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">8 Segmentów Badawczych</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {segments.map((segment) => (
            <div
              key={segment.name}
              className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <h3 className="font-medium mb-2">{segment.name}</h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{segment.groups} źródeł</span>
                <span>{segment.problems} problemów</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Output */}
      <section className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <h2 className="text-xl font-semibold mb-4">Output Fazy 1</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <strong>4003</strong> surowych problemów z 259 źródeł
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <strong>1026</strong> problemów po filtracji (intensywność ≥3, sygnał ≥3)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Raporty AI dla każdego źródła w formacie JSON
          </li>
        </ul>
      </section>
    </div>
  )
}
