# Kompletny Playbook: Od Pomysłu do Scale

## Uniwersalny framework budowy aplikacji - 7 faz od idei do monetyzacji i dalszego rozwoju

---

## Spis treści

- [Przegląd 7 Faz](#przegląd-7-faz)
- [FAZA 1: DISCOVERY](#faza-1-discovery)
- [FAZA 2: WALIDACJA](#faza-2-walidacja)
- [FAZA 3: DEFINICJA PRODUKTU](#faza-3-definicja-produktu)
- [FAZA 4: BUDOWA](#faza-4-budowa)
- [FAZA 5: LAUNCH](#faza-5-launch)
- [FAZA 6: MONETYZACJA](#faza-6-monetyzacja)
- [FAZA 7: GROWTH & SCALE](#faza-7-growth--scale)

---

## Przegląd 7 Faz

```
FAZA 1: DISCOVERY (2-4 tygodnie)
   └── Zbieranie sygnałów → Analiza problemów → Mapowanie możliwości

FAZA 2: WALIDACJA (4-8 tygodni)
   └── Problem validation → Solution validation → Demand validation

FAZA 3: DEFINICJA PRODUKTU (3 dni - 1 tydzień)
   └── Scope MVP → User stories → Tech decisions

FAZA 4: BUDOWA (6-8 tygodni)
   └── Setup → Core features → Polish → Testing

FAZA 5: LAUNCH (2-4 tygodnie)
   └── Pre-launch → Launch day → Post-launch

FAZA 6: MONETYZACJA (ongoing)
   └── Model selection → Pricing → Payment integration → Optimization

FAZA 7: GROWTH & SCALE (ongoing)
   └── Retention → Acquisition → Expansion → Team/Systems
```

---

# FAZA 1: DISCOVERY

**Cel fazy:** Zebrać 20-50 konkretnych sygnałów problemów i wybrać 3-5 najlepszych do walidacji.

**Czas trwania:** 2-4 tygodnie

**Metryka sukcesu:** Masz udokumentowane minimum 30 sygnałów z różnych źródeł i wybrałeś top 3 problemy do walidacji.

---

## 1.1 Zbieranie Sygnałów

### Czym jest sygnał?
Konkretna wypowiedź/obserwacja wskazująca na problem, frustrację lub niespełnioną potrzebę.

**Dobry sygnał:**
- "Spędzam 3h dziennie na ręcznym kopiowaniu danych z PDF do Excela"
- "Muszę używać 4 różnych narzędzi żeby przygotować jeden raport"
- "Płacę 200$ miesięcznie za narzędzie, którego używam tylko w 20%"

**Zły sygnał:**
- "Byłoby fajnie mieć lepsze narzędzie"
- "Myślę że ludzie potrzebują..."
- "Kiedyś słyszałem że..."

---

### A. Scraping i Monitorowanie Online

#### 1. Reddit - Aktywne społeczności

**Narzędzia:**
- Apify Reddit Scraper (https://apify.com/trudax/reddit-scraper)
- Google Alerts dla fraz: "frustrated with" + [twoja nisza]
- F5Bot (https://f5bot.com) - powiadomienia o słowach kluczowych na Reddit

**Checklist:**

- [ ] Zidentyfikuj 10-15 relevantnych subredditów dla twojej niszy
- [ ] Skonfiguruj Apify Reddit Scraper z następującymi parametrami:
  - Sortowanie: "top" (ostatnie 30 dni)
  - Minimalna liczba upvotes: 10
  - Wyszukiwane frazy: "hate that", "frustrated", "wish there was", "why is there no"
- [ ] Ustaw scraping na 2x w tygodniu (poniedziałek, czwartek)
- [ ] Skonfiguruj F5Bot dla 5-10 kluczowych fraz związanych z twoją niszą
- [ ] Codziennie przeglądaj wyniki (max 30 min)
- [ ] Zapisuj sygnały w arkuszu (szablon poniżej)

**Subreddity do monitorowania (przykłady według niszy):**

B2B/SaaS:
- r/SaaS
- r/startups
- r/EntrepreneurRideAlong
- r/smallbusiness
- r/marketing

Produktywność:
- r/productivity
- r/gtd
- r/Notion
- r/ObsidianMD

Dev tools:
- r/webdev
- r/programming
- r/javascript

**Szablon frazy wyszukiwania Apify:**
```
(hate|frustrated|annoying|wish|"why is there no"|"looking for"|"does anyone know") AND (tool|software|app|solution|way to)
```

**Red flags:**
- Brak aktywności w subredditach (< 10 postów dziennie)
- Sygnały starsze niż 6 miesięcy
- Tylko skargi bez context'u jak bardzo problem boli

---

#### 2. Twitter/X - Real-time frustrations

**Narzędzia:**
- Twitter Advanced Search (https://twitter.com/search-advanced)
- Apify Twitter Scraper
- TweetDeck (organizacja strumieni)

**Checklist:**

- [ ] Utwórz listę 20-30 influencerów w twojej niszy
- [ ] Skonfiguruj Twitter Advanced Search z frazami:
  - "I hate that"
  - "frustrated with"
  - "why doesn't"
  - "there should be"
- [ ] Ustaw filtry: tylko posty z >10 likes w ostatnich 30 dniach
- [ ] Codziennie spędzaj 20 min na przeglądaniu wyników (najlepiej rano)
- [ ] Zapisuj sygnały do arkusza
- [ ] Śledź replies - często tam są najlepsze insights

**Advanced Search Query (przykład):**
```
("I hate that" OR "frustrated with" OR "why doesn't")
(tool OR software OR app OR platform)
min_faves:10
lang:en
```

---

#### 3. Online Communities & Forums

**Źródła:**
- Indie Hackers (https://indiehackers.com)
- Product Hunt discussions
- Hacker News "Ask HN" i "Show HN"
- Niszowe fora (np. dla marketingu: GrowthHackers)
- Discord serwery (np. dla devs: Reactiflux, TypeScript Community)
- Slack communities

**Checklist:**

- [ ] Dołącz do 5-7 aktywnych community związanych z twoją niszą
- [ ] Skonfiguruj powiadomienia dla kanałów #help, #frustrations, #feedback
- [ ] 3x w tygodniu przeglądaj dyskusje (15-20 min sesja)
- [ ] Używaj wbudowanego search z frazami typu "pain", "problem", "annoying"
- [ ] Zapisuj najciekawsze wątki z kontekstem

**Indie Hackers - frazy do wyszukiwania:**
```
- "struggling with"
- "looking for"
- "any recommendations for"
- "tried everything"
```

**Hacker News - jak szukać:**
- Wejdź na https://hn.algolia.com
- Szukaj w Comments, sortuj po dacie
- Frazy: "I wish", "frustrated", "no good solution"

---

#### 4. Review Sites - Frustracje z istniejącymi narzędziami

**Narzędzia:**
- Apify dla G2/Capterra/Trustpilot
- Manual scraping (copy-paste do arkusza)

**Źródła:**
- G2.com (szczególnie 1-3 star reviews)
- Capterra
- Trustpilot
- Product Hunt (komentarze)
- Chrome Web Store reviews
- App Store / Google Play (dla mobile)

**Checklist:**

- [ ] Zidentyfikuj 10-15 głównych narzędzi w twojej kategorii
- [ ] Dla każdego narzędzia:
  - [ ] Przeczytaj 20-30 najgorszych review (1-2 star)
  - [ ] Przeczytaj 10-15 średnich review (3 star) - często tu są najlepsze insights
  - [ ] Zwróć uwagę na powtarzające się skargi
- [ ] Kategoryzuj problemy
- [ ] Policz częstotliwość każdego problemu

**Co szukać w review:**
- "Lacks feature X"
- "Too complicated to..."
- "Support is terrible"
- "Too expensive for..."
- "Wish it had..."

**Szablon kategoryzacji:**

| Problem | Częstotliwość | Severity (1-5) | Narzędzie |
|---------|---------------|----------------|-----------|
| Brak integracji z X | 12 | 4 | Tool A, Tool B |
| Za drogi dla małych firm | 8 | 5 | Tool C |
| UI zbyt skomplikowany | 15 | 3 | Tool A, Tool D |

---

#### 5. Google Trends & Keyword Research

**Narzędzia:**
- Google Trends (https://trends.google.com)
- AnswerThePublic (https://answerthepublic.com)
- AlsoAsked (https://alsoasked.com)
- Google Keyword Planner (bezpłatny w Google Ads)
- Ahrefs Keywords Explorer (paid, ale potężny)

**Checklist:**

- [ ] Google Trends:
  - [ ] Sprawdź trend dla 5-10 głównych kategorii w twojej niszy
  - [ ] Porównaj alternatywne rozwiązania (rosnące vs malejące)
  - [ ] Sprawdź sezonowość (czy problem jest ciągły czy sezonowy?)
  - [ ] Export danych do CSV i zapisz
- [ ] AnswerThePublic:
  - [ ] Wpisz główny keyword (np. "project management")
  - [ ] Przeglądnij sekcję "questions" - to są prawdziwe pytania ludzi
  - [ ] Zapisz top 20 najczęstszych pytań
- [ ] AlsoAsked:
  - [ ] Sprawdź co ludzie pytają w kontekście twojego głównego keyword
  - [ ] Zapisz strukturę pytań (często pokazuje user journey)
- [ ] Google Keyword Planner:
  - [ ] Sprawdź volume dla fraz typu "[narzędzie] alternative"
  - [ ] Wysokie volume = niezadowolenie z obecnych rozwiązań

**Metryki do śledzenia:**

| Keyword | Volume (miesięcznie) | Trend (12m) | Competition |
|---------|---------------------|-------------|-------------|
| "project management tool" | 10K | +15% | High |
| "Asana alternative" | 2.5K | +45% | Medium |
| "simple task manager" | 8K | +5% | Low |

---

### B. Bezpośrednie Rozmowy

#### 6. Customer Development Interviews

**Cel:** Porozmawiać z 15-30 ludźmi z target audience.

**Checklist przygotowania:**

- [ ] Zdefiniuj profil idealnej osoby do rozmowy:
  - [ ] Rola (np. "marketing manager w firmie 10-50 osób")
  - [ ] Branża
  - [ ] Konkretny use case
- [ ] Przygotuj listę 30-50 potencjalnych rozmówców
- [ ] Stwórz szablon outreach (email/LinkedIn)
- [ ] Przygotuj interview guide (patrz niżej)
- [ ] Ustaw cel: 15 przeprowadzonych rozmów

**Gdzie znaleźć rozmówców:**
- LinkedIn (cold outreach)
- Twitter (odpowiedz na czyjeś skargi, zaproś do rozmowy)
- Twoja sieć kontaktów
- Community (poproś moderatora o pomoc)
- Reddit (można pisać DM jeśli ktoś zgłasza problem)

**Template outreach email:**
```
Temat: Quick question about [ich problem]

Cześć [Imię],

Zauważyłem że [wspomniałeś o problemie X / używasz narzędzia Y /
piszesz o frustracji związanej z Z].

Prowadzę research na temat [kategoria problemu] i chciałbym
zrozumieć jak ludzie jak ty sobie z tym radzą.

Czy miałbyś/miałabyś 20 minut na quick call w przyszłym tygodniu?
W zamian za twój czas mogę zaoferować [gift card $20 / early access
do narzędzia jak będę je budował / darmowy audit procesu X].

Daj znać jak wygląda twój kalendarz!

[Twoje imię]
```

**Interview Guide (20-30 minut):**

**ZASADA #1:** Pytaj o przeszłość i konkretne sytuacje, NIE o opinie czy przyszłość.

**Dobre pytania:**
- "Opowiedz mi o ostatnim razie kiedy [problem się pojawił]"
- "Jak sobie z tym poradziłeś?"
- "Ile czasu ci to zajęło?"
- "Jakie narzędzia użyłeś?"
- "Czy zapłaciłeś za jakieś rozwiązanie?"

**Złe pytania:**
- "Czy kupiłbyś narzędzie które..."
- "Co myślisz o pomyśle..."
- "Czy uważasz że..."

**Struktura interview:**

1. **Intro (2 min)**
   - [ ] Przedstaw się
   - [ ] Wyjaśnij cel (research, nie sprzedaż!)
   - [ ] Zapytaj o pozwolenie na nagranie
   - [ ] Uspokój: "nie ma złych odpowiedzi"

2. **Context (5 min)**
   - [ ] "Opowiedz mi o swojej roli i codziennych zadaniach"
   - [ ] "Jakie narzędzia używasz na co dzień?"
   - [ ] "Jak wygląda typowy dzień w twojej pracy?"

3. **Problem Discovery (10-15 min)**
   - [ ] "Opowiedz mi o ostatnim razie kiedy [miałeś problem X]"
   - [ ] "Co dokładnie poszło nie tak?"
   - [ ] "Co wtedy zrobiłeś?"
   - [ ] "Jak długo to trwało?"
   - [ ] "Jak często to się zdarza?"
   - [ ] **FOLLOW-UP:** "Opowiedz mi więcej o..." (wykop głębiej!)

4. **Current Solutions (5-7 min)**
   - [ ] "Jakie rozwiązania próbowałeś?"
   - [ ] "Za co płacisz obecnie?"
   - [ ] "Co ci się podoba w obecnym rozwiązaniu?"
   - [ ] "Co cię frustruje?"
   - [ ] "Ile czasu/pieniędzy tracisz przez ten problem miesięcznie?"

5. **Closing (2-3 min)**
   - [ ] "Czy jest coś o czym nie rozmawialiśmy a co jest ważne?"
   - [ ] "Czy znasz innych ludzi którzy mają podobny problem?" (prośba o referral)
   - [ ] "Czy mogę się odezwać za tydzień-dwa jak będę miał więcej pytań?"
   - [ ] Podziękuj i prześlij obiecany incentive

**Metryki sukcesu:**
- Przeprowadziłeś 15+ rozmów
- Masz 10+ dosłownych cytatów opisujących ból
- 60%+ rozmówców opisuje problem jako "severe" (4-5/5)
- 40%+ płaci już za jakieś rozwiązanie (nawet niedoskonałe)

**Red flags:**
- Ludzie mówią "to by było fajne" ale nie potrafią podać konkretnego przykładu kiedy problem wystąpił
- Nikt nie płaci za obecne rozwiązania
- Problem występuje rzadko ("raz na kilka miesięcy")
- Każda osoba opisuje INNY problem (brak powtarzalności)

---

### C. Analiza Konkurencji i Rynku

#### 8. Competitor Teardown

**Narzędzia:**
- SimilarWeb (traffic estimates)
- BuiltWith (tech stack)
- SEMrush / Ahrefs (SEO analysis)
- Product Hunt (user feedback)

**Checklist:**

- [ ] Zidentyfikuj 10-15 bezpośrednich konkurentów
- [ ] Dla każdego konkurenta zbierz:
  - [ ] Pricing (zapisz screenshoty - często się zmienia)
  - [ ] Feature set (lista wszystkich features)
  - [ ] Traffic estimate (SimilarWeb)
  - [ ] Top 10 SEO keywords (Ahrefs)
  - [ ] Social proof (ile customers, case studies)
  - [ ] Gdy powstał (domain age)
- [ ] Stwórz Competitive Matrix

**Szablon Competitive Matrix:**

| Competitor | Pricing | Key Features | Traffic/mo | Founded | Gap (co im brakuje) |
|------------|---------|--------------|------------|---------|---------------------|
| Tool A | $49/mo | A, B, C | 50K | 2019 | No integration with X |
| Tool B | $29/mo | B, C, D | 120K | 2015 | Complicated UI |
| Tool C | Free+$99 | C, D, E | 200K | 2020 | No feature F |

---

## 1.2 Analiza Problemów

**Cel:** Z 30-50 sygnałów wybrać 3-5 najbardziej obiecujących problemów do walidacji.

### A. Scoring Framework - PICK

**Używamy frameworka PICK:**
- **P**ain (Ból) - jak bardzo to boli?
- **I**ncidence (Częstotliwość) - jak często występuje?
- **C**ost (Koszt) - ile to kosztuje ludzi (czas/pieniądze)?
- **K**it (Zestaw rozwiązań) - jakie są obecne rozwiązania?

**Pain (Ból):**
- 1 = Nice to have, lekka irytacja
- 2 = Denerwujące ale da się żyć
- 3 = Istotny problem, często o nim myślę
- 4 = Poważny problem, aktywnie szukam rozwiązań
- 5 = Krytyczny, blokuje mi pracę

**Incidence (Częstotliwość):**
- 1 = Raz na rok lub rzadziej
- 2 = Kilka razy w roku
- 3 = Miesięcznie
- 4 = Tygodniowo
- 5 = Codziennie/wielokrotnie dziennie

**Cost (Koszt):**
- 1 = <30 min czasu/miesiąc lub <$10
- 2 = 1-2h czasu/miesiąc lub $10-50
- 3 = 5-10h czasu/miesiąc lub $50-200
- 4 = 20-40h czasu/miesiąc lub $200-500
- 5 = >40h czasu/miesiąc lub >$500

**Kit (Obecne rozwiązania):**
- 1 = Doskonałe rozwiązania, wszyscy zadowoleni
- 2 = Dobre rozwiązania, są liderzy rynkowi
- 3 = Średnie rozwiązania, ludzie narzekają ale korzystają
- 4 = Słabe rozwiązania, ludzie używają workarounds
- 5 = Brak rozwiązań lub tylko manual/hacky workarounds

**Scoring:**
```
PICK Score = (Pain × 3) + (Incidence × 2) + (Cost × 3) + (Kit × 2)

Max możliwy: 50 punktów
Min możliwy: 10 punktów
```

---

### B. TAM/SAM/SOM Analysis

**TAM** (Total Addressable Market) - wszyscy którzy MOGLIBY mieć problem
**SAM** (Serviceable Addressable Market) - ci których REALISTYCZNIE możesz obsłużyć
**SOM** (Serviceable Obtainable Market) - ile możesz REALNIE zdobyć w rok 1-2

**Przykład kalkulacji SOM:**
```
Założenia:
- ARPU: $50/mo
- Nowi klienci: 20/miesiąc (po 3 miesiącach ramp-up)
- Churn: 5%/miesiąc
- Start: miesiąc 1

Po 12 miesiącach: ~150 customers
MRR: $7,500
ARR: $90,000

= SOM Year 1: ~$90K
```

---

## 1.3 Mapowanie Możliwości

### Decision Matrix

**Kryteria wyboru (każde 1-5):**

1. **Market Score** (TAM/SAM/SOM)
2. **PICK Score**
3. **Moat Score**
4. **Personal Fit** - czy to CI pasuje? Masz wiedzę/network/passion?
5. **Speed to Market** - jak szybko możesz zbudować MVP?
6. **Capital Efficiency** - czy potrzebujesz dużo kasy na start?

**Kalkulacja Final Score:**
```
Final Score = (Market × 2) + (PICK × 3) + (Moat × 2) +
              (Personal Fit × 2) + (Speed × 1.5) + (Capital × 1.5)

Max: 60 punktów
```

### Go/No-Go Decision

**Checklist - musisz odpowiedzieć TAK na każde:**

- [ ] **Problem clarity:** Potrafisz opisać problem w 2 zdaniach
- [ ] **Target user clarity:** Wiesz DOKŁADNIE kto to jest (nie "small businesses")
- [ ] **Evidence:** Masz 15+ sygnałów od real users że to PAINFUL problem
- [ ] **Market size:** SAM >$10M (lub jesteś OK z lifestyle business)
- [ ] **Willingness to pay:** Masz evidence że ludzie płacą za obecne (słabe) rozwiązania
- [ ] **Personal fit:** Score >3, masz wiedzę lub network w tej branży
- [ ] **Speed:** Możesz zbudować MVP w <3 miesiące
- [ ] **Capital:** Masz dostęp do potrzebnego kapitału (lub można bootstrapped)
- [ ] **Moat:** Masz plan na defensible advantage
- [ ] **Excitement:** Jesteś podekscytowany żeby nad tym pracować następne 2-3 lata

**Decision:**
- Jeśli >8/10 = GO (przejdź do FAZA 2)
- Jeśli 6-8/10 = MAYBE (więcej research)
- Jeśli <6/10 = NO-GO (wróć do discovery)

---

# FAZA 2: WALIDACJA

**Cel fazy:** Potwierdzić że problem jest real, rozwiązanie ma sens, i ludzie zapłacą ZANIM zbudujesz produkt.

**Czas trwania:** 4-8 tygodni

**Metryka sukcesu:**
- 30+ interviews potwierdzających problem
- 10+ ludzi testujących fake MVP / prototype
- 5+ pre-orders lub LOI (Letter of Intent)

---

## 2.1 Problem Validation

### Deep Problem Interviews (Round 2)

**Target:** 30 interviews

**Interview Guide (30 min):**

**1. Warm-up (3 min)**
- [ ] Przedstaw się
- [ ] Wyjaśnij context
- [ ] "Nie sprzedaję nic, chcę tylko zrozumieć twoje doświadczenia"
- [ ] Pozwolenie na nagranie

**2. Role & Context (5 min)**
- [ ] "Opowiedz mi o swojej roli - co robisz daily?"
- [ ] "Jakie są twoje główne KPIs/cele?"
- [ ] "Jakich narzędzi używasz na co dzień?"

**3. Problem Deep Dive (15 min)**
- [ ] "Kiedy ostatnio [problem się pojawił]? Opowiedz mi o tej sytuacji."
- [ ] "Co DOKŁADNIE się stało?"
- [ ] "Jak często to się dzieje?"
- [ ] "Ile czasu/pieniędzy to cię kosztuje?"

**4. Prioritization (5 min)**
- [ ] "Gdybyś miał listę 10 problemów w swojej pracy, gdzie ten byłby?"
- [ ] "Czy aktywnie szukasz rozwiązania TERAZ?"

**5. Budget & Decision Making (2 min)**
- [ ] "Gdyby pojawił się idealny solution, ile byłbyś skłonny zapłacić miesięcznie?"
- [ ] "Czy ty decydujesz o zakupach narzędzi czy ktoś inny?"

### Interview Data Analysis

**Metryki sukcesu (GO do następnego etapu):**
- >60% potwierdza severe problem (4-5/5)
- >70% doświadcza weekly+
- Median WTP >$30/mo (dla B2B) lub >$10/mo (dla B2C)
- >50% chętnych przetestować prototype

---

## 2.2 Solution Validation

### Typy prototypów (od najszybszych):

1. **Pitch Deck / Concept Presentation** - 1-2 dni
2. **Landing Page** - 2-5 dni
3. **Clickable Prototype** - 5-10 dni
4. **Concierge MVP** - 0 dni (robisz usługę manualnie)
5. **Wizard of Oz MVP** - 1-2 tygodnie
6. **No-Code MVP** - 2-4 tygodnie

### Landing Page Setup

**Struktura landing page:**

**HERO SECTION:**
- [ ] Headline: Problem + Rozwiązanie w 1 zdaniu
- [ ] Subheadline: Dla kogo + główny benefit
- [ ] CTA: "Join Waitlist" lub "Get Early Access"
- [ ] Visual: Screenshot/mockup produktu

**PROBLEM SECTION:**
- [ ] "Sound familiar?" + 3-4 pain points z interviews
- [ ] Użyj dosłownych cytatów z wywiadów

**SOLUTION SECTION:**
- [ ] 3-4 key features z benefitami

**HOW IT WORKS:**
- [ ] 3-step process

**SOCIAL PROOF:**
- [ ] Cytaty od early adopters

**FINAL CTA:**
- [ ] Email signup form

---

## 2.3 Demand Validation

### Pre-Sales / Letter of Intent (B2B)

**Template outreach:**
```
Cześć [Imię],

Dzięki za feedback na prototype [produkt]!

Na podstawie rozmów z tobą i 20 innymi [rola] buduję pierwszą wersję.
Launch za 4-6 tygodnie.

Oferuję 10 firmom "Founding Customer" package:
- 50% off pricing for życie
- Dedicated onboarding call
- Priority support
- Direct line do mnie

W zamian proszę o:
- Commitment do używania przez minimum 3 miesiące
- Feedback co 2 tygodnie (15min call)
- Testimonial jeśli będziesz zadowolony

Czy jesteś zainteresowany?

[Imię]
```

### Metryki Demand Validation

| Metric | B2B SaaS Target | B2C Target |
|--------|-----------------|------------|
| Landing page visitors | 500+ | 1000+ |
| Email signups (waitlist) | 100+ | 200+ |
| Conversion rate (waitlist) | >15% | >10% |
| Pre-orders / LOIs | 5+ | 50+ |
| Conversion rate (paid) | >2% | >2% |
| Committed MRR | >$500 | >$1000 |

---

# FAZA 3: DEFINICJA PRODUKTU

## 3.1 Określenie Scope MVP

### Framework MoSCoW

- **Must Have**: Bez tego produkt nie działa / nie rozwiązuje problemu
- **Should Have**: Ważne, ale można żyć bez tego w v1
- **Could Have**: Nice to have, może poczekać
- **Won't Have**: Świadomie rezygnujemy (na razie)

**Checklist:**

- [ ] Wypiszmy wszystkie pomysły na funkcjonalności (brainstorming 30-60 min)
- [ ] Kategoryzujmy każdą funkcjonalność według MoSCoW
- [ ] Weryfikujmy każde "Must Have" pytaniem: "Czy bez tego użytkownik może osiągnąć główny cel?"
- [ ] Zastosujmy regułę 80/20: Czy te 20% funkcji daje 80% wartości?
- [ ] Ustalmy deadline MVP (max 4-8 tygodni dla solo dev, 2-4 dla zespołu)

### Framework RICE (alternatywa)

- **Reach**: Ilu użytkowników dotknie? (liczba na kwartał)
- **Impact**: Jak bardzo pomoże? (3=massive, 2=high, 1=medium, 0.5=low)
- **Confidence**: Jak pewni jesteśmy? (100%=high, 80%=medium, 50%=low)
- **Effort**: Ile osobodni? (realistyczna estimacja)

**Score = (Reach × Impact × Confidence) / Effort**

---

## 3.2 User Stories

### Format User Story

```
Jako [typ użytkownika]
Chcę [wykonać akcję / osiągnąć cel]
Aby [korzyść / wartość biznesowa]

Kryteria akceptacji:
- [ ] [Konkretny, mierzalny warunek]
- [ ] [Konkretny, mierzalny warunek]
- [ ] [Konkretny, mierzalny warunek]
```

**INVEST Criteria:**
- **I**ndependent - niezależne od innych
- **N**egotiable - szczegóły można dopracować
- **V**aluable - przynosi wartość użytkownikowi
- **E**stimable - da się oszacować effort
- **S**mall - małe (max 3-5 dni pracy)
- **T**estable - da się zweryfikować czy działa

---

## 3.3 Tech Decisions

### Domyślny stack dla większości MVPs (2025):

```
Frontend: Next.js 15+ (App Router) + TypeScript + Tailwind
Backend: Next.js API routes LUB Supabase
Database: PostgreSQL (via Supabase/Vercel Postgres/Railway)
Auth: Clerk LUB Supabase Auth LUB NextAuth
Payments: Stripe
Hosting: Vercel (frontend) + Supabase/Railway (backend jeśli osobny)
```

### Build vs Buy Decision

| Funkcjonalność | Build Time | Buy Cost/mth | Strategiczna? | Decyzja |
|----------------|------------|--------------|---------------|---------|
| Auth | 2 tygodnie | $25 (Clerk) | NIE | **BUY** |
| Payments | 4 tygodnie | $0+fee (Stripe) | NIE | **BUY** |
| Email | 1 tydzień | $15 (Resend) | NIE | **BUY** |
| Core logic | 6 tygodni | - | TAK | **BUILD** |

**Rekomendowane SaaSy (2025):**

- **Auth**: Clerk ($25/mth), Supabase Auth (free tier)
- **Database**: Supabase (free → $25/mth), Convex (free → $25/mth)
- **Payments**: Stripe (2.9% + 30¢), Lemon Squeezy (5% + fees)
- **Email**: Resend (free 100/day → $20/mth)
- **Analytics**: Posthog (free tier)
- **Monitoring**: Sentry (free tier)

---

# FAZA 4: BUDOWA

## 4.1 Setup

### Repository Setup

**Struktura folderów (Next.js):**
```
/app lub /src/app          # Next.js App Router
/components                # React components
  /ui                      # shadcn/ui components
  /features                # feature-specific components
/lib                       # utilities, helpers
/hooks                     # custom React hooks
/types                     # TypeScript types
/actions                   # Server actions (Next.js)
/api lub /app/api          # API routes
/prisma lub /supabase      # Database schema
/public                    # Static assets
/tests                     # Test files
```

### Environments Setup

- **Local** - dev machine (`localhost:3000`)
- **Preview** - każdy PR (`feature-branch.vercel.app`)
- **Staging** - stabilny pre-prod (`staging.app.com`)
- **Production** - live app (`app.com`)

### CI/CD Pipeline

**GitHub Actions setup - `.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  pull_request:
    branches: [main, staging]
  push:
    branches: [main, staging]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm tsc --noEmit

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build
```

---

## 4.2 Core Features

### Typowa kolejność dla większości MVPs:
1. **Auth & Onboarding** (tydzień 1)
2. **Core feature #1** - główna wartość (tydzień 2-3)
3. **Core feature #2** - komplementarna funkcjonalność (tydzień 3-4)
4. **Payments** (jeśli paid product) (tydzień 4)
5. **Dashboard/Analytics dla użytkownika** (tydzień 5-6)
6. **Polish & bugfixing** (tydzień 7-8)

### Framework: Thin Slice

Zamiast budować 100% feature A, potem 100% feature B:
→ Zbuduj 20% A + 20% B + 20% C → ship → feedback → 40% każdego → ship

**Checklist dla każdego feature:**

- [ ] **Day 1-2: Szkielet (20%)**
  - Basic UI (może być brzydki!)
  - Happy path działa
  - Zadeplojowane na preview

- [ ] **Day 3-4: Funkcjonalność (60%)**
  - Obsługa podstawowych edge cases
  - Error states, Loading states
  - Podstawowa walidacja

- [ ] **Day 5: Polish (80%)**
  - UI dopracowany
  - Responsive
  - Testy napisane

---

## 4.3 Polish

### UX Polish Checklist

- [ ] **Loading States** - Skeleton screens, spinnery, progress bars
- [ ] **Error States** - Validation errors, API errors, 404/500 pages
- [ ] **Empty States** - CTA do dodania pierwszego itemu
- [ ] **Success Feedback** - Toast notifications, confetti
- [ ] **Responsive Design** - Test na iPhone, Android, tablet
- [ ] **Accessibility** - Alt text, labels, keyboard nav
- [ ] **Performance** - Lighthouse score > 90

---

## 4.4 Testing

### Testing Pyramid dla MVP

```
        /\
       /  \  E2E (5-10 testów)
      /____\
     /      \  Integration (10-20)
    /________\
   /          \  Unit (20-50)
  /____________\
```

**Co testować:**
- ✅ Critical path (auth, payment, core feature)
- ✅ Łatwe do zepsucia (complex logic)
- ✅ Kosztowne jeśli bug (payment, data loss)

**Co pominąć:**
- ❌ Proste UI (button renders)
- ❌ Zewnętrzne APIs (mockuj)
- ❌ Edge cases ultra-rare

---

# FAZA 5: LAUNCH

## PRE-LAUNCH (2-4 tygodnie przed)

### Landing Page Checklist

- [ ] **Hero Section**: Headline, subheadline, CTA, visual
- [ ] **Problem Statement**: 2-3 pain points
- [ ] **Solution**: 3-5 key features
- [ ] **How it Works**: 3-step process
- [ ] **Social Proof**: Testimonials, logos
- [ ] **Pricing**: 2-3 tiery
- [ ] **FAQ**: 3-5 pytań
- [ ] **Final CTA**: Email signup

### Beta Testing

**Target:** 20-50 osób (B2C) lub 5-15 (B2B)

**Questions to Ask:**
1. Co było Twoją pierwszą myślą po otworzeniu app?
2. Które funkcje są najbardziej przydatne?
3. Czego Ci brakuje?
4. Czy coś Cię zdenerwowało?
5. W skali 1-10, jak prawdopodobne, że polecisz? (NPS)

### Content Przygotowawczy

- [ ] Screenshots produktu (min. 5)
- [ ] Demo video (60-90 sekund)
- [ ] GIFy pokazujące kluczowe features
- [ ] Product Hunt assets
- [ ] Twitter thread (8-12 tweetów)
- [ ] LinkedIn post
- [ ] Email campaigns

---

## LAUNCH DAY

### Timeline (Rekomendowany)

**00:01** - Product Hunt submit
**06:00** - Sprawdź czy wszystko działa
**08:00** - Email do waitlisty, Twitter, LinkedIn
**09:00-12:00** - Reddit, Indie Hackers, HN, Facebook groups
**12:00** - Second email wave
**14:00-18:00** - Odpowiadaj na KAŻDY komentarz
**18:00-20:00** - Traction update
**20:00-00:00** - Monitor + wind down

### Gdzie Publikować

**Tier 1 (Must-Do):**
- Product Hunt
- Twitter/X
- Email List
- LinkedIn

**Tier 2 (High-Impact):**
- Hacker News (Show HN)
- Reddit (r/SideProject + niche subreddits)
- Indie Hackers

**Tier 3 (Supplementary):**
- Discord/Slack communities
- Directories (AlternativeTo, Capterra)
- Content platforms (Dev.to, Medium)

---

## POST-LAUNCH (pierwszy tydzień)

### Analiza Danych

| Metric | Target (z audience) | Target (od zera) |
|--------|---------------------|------------------|
| Visitors | 500-2,000 | 200-1,000 |
| Signups | 50-300 | 20-100 |
| Conversion rate | 5-15% | 5-15% |
| D7 retention | >30% | >30% |

### Quick Wins

- [ ] Add tooltips gdzie users są confused
- [ ] Improve error messages
- [ ] Add loading states
- [ ] Fix broken links
- [ ] Mobile responsiveness fixes

### Testimonial Collection

```
Subject: Quick favor? 🙏

Hi [Name],

I noticed you've been actively using [Product] - thank you!

Would you mind sharing what you like about it? Even one sentence would help.

I'd love to feature your feedback on our website.

Thanks,
[Your Name]
```

---

# FAZA 6: MONETYZACJA

## 6.1 Model Selection

### Przegląd Modeli

| Model | Best For | Pros | Cons |
|-------|----------|------|------|
| **SaaS Subscription** | Produkty używane regularnie | Przewidywalny MRR, wysoki LTV | Wymaga ciągłej wartości |
| **Lifetime Deal** | Nowe produkty, indie hackerzy | Szybki cash flow | Brak recurring |
| **Freemium** | Produkty networkowe | Szybka adopcja | Niski conversion (2-5%) |
| **Afiliacja** | Platformy, porównywarki | Niskie ryzyko | Niskie marże |
| **Usage-Based** | API, dev tools | Fair dla klientów | Nieprzewidywalny przychód |
| **Hybrid** | Dojrzałe produkty | Maksymalizacja segmentów | Skomplikowane |

### Decision Tree

```
SaaS z subscriptions + solo founder → LemonSqueezy
SaaS z subscriptions + team + budżet → Stripe + Quaderno (VAT)
Software sprzedawany do EU → Paddle
Digital products (kursy, ebooki) → Gumroad
Enterprise SaaS → Stripe + custom
```

---

## 6.2 Pricing

### Value-Based Pricing

1. Zidentyfikuj główne benefity produktu
2. Policz ile klient zaoszczędzi czasu/pieniędzy
3. Ustal cenę jako 10-30% zaoszczędzonej wartości

**Przykład:**
- Twoje narzędzie oszczędza 10h/tydzień
- Koszt pracy: 50 PLN/h
- Wartość miesięczna: 10h × 4 × 50 PLN = 2000 PLN
- Twoja cena: 20% = 400 PLN/miesiąc

### Zasada 3 Planów

```
┌─────────────────┬──────────────────┬─────────────────────┐
│   STARTER       │   PROFESSIONAL   │    BUSINESS         │
├─────────────────┼──────────────────┼─────────────────────┤
│ 49 PLN/mies     │  149 PLN/mies    │   399 PLN/mies      │
│                 │   (POPULAR)      │                     │
│ - Feature A     │ - All Starter +  │ - All Pro +         │
│ - Feature B     │ - Feature D      │ - Feature G         │
│ - Feature C     │ - Feature E      │ - Feature H         │
│ - Limit 1       │ - Feature F      │ - Unlimited         │
│                 │ - Limit 2        │ - Priority support  │
└─────────────────┴──────────────────┴─────────────────────┘

PRICING RATIO: 1x : 3x : 8x
```

### Psychologia Cen

- **Zaokrąglanie**: B2C użyj .99/.97, B2B zaokrąglij
- **Anchoring**: Pokaż wyższą cenę przekreśloną
- **Annual discount**: 15-20% off
- **"Most Popular"** badge na recommended plan
- **Social proof** obok planów

---

## 6.3 Payment Integration

### Porównanie Narzędzi

| Kryterium | Stripe | Paddle | LemonSqueezy | Gumroad |
|-----------|--------|--------|--------------|---------|
| Prowizja | 1.4% + 0.25€ | 5% + 0.50$ | 5% + 0.50$ | 10% |
| VAT handling | Musisz sam | ✓ Oni | ✓ Oni | ✓ Oni |
| Setup | Średni | Łatwy | Najłatwiejszy | Najłatwiejszy |

### Stripe Setup Checklist

**1. Account & Onboarding**
- [ ] Załóż konto Stripe
- [ ] Wypełnij business details
- [ ] Aktywuj payments
- [ ] Dodaj bank account

**2. Products & Pricing**
- [ ] Stwórz Products
- [ ] Dla każdego planu: Monthly + Annual price
- [ ] Skonfiguruj trial period

**3. Checkout**
- [ ] Stripe Checkout lub Payment Links
- [ ] success_url i cancel_url
- [ ] Customer Portal

**4. Webhooks**
- [ ] `checkout.session.completed`
- [ ] `customer.subscription.updated`
- [ ] `customer.subscription.deleted`
- [ ] `invoice.payment_failed`

**5. Testing**
- [ ] Test card: 4242 4242 4242 4242
- [ ] Test failed payment: 4000 0000 0000 0341

---

## 6.4 Optimization

### Churn Reduction

**Voluntary Churn Prevention:**
1. **Onboarding Excellence** - Day 1-7 email sequence
2. **Engagement Monitoring** - Re-engage inactive users
3. **Exit Intent Survey** - "Too expensive?" → offer downgrade
4. **Winback Campaign** - Day 7, Month 1, Month 3 emails

**Involuntary Churn Prevention (Dunning):**
```
Day 1: Payment fails → Email + auto retry
Day 3: Retry #2 → Stronger email
Day 5: Retry #3 → Final notice
Day 7: Subscription cancelled
Day 14: Winback email
```

---

# FAZA 7: GROWTH & SCALE

## 7.1 Retention

### Retention Metrics

```
Day 1 Retention: 60-70% (target)
Day 7 Retention: 40-50%
Day 30 Retention: 30-40%
Day 90 Retention: 20-30%
```

### Strategie Retention

**1. Product-Led (Habit Formation)**
- Trigger → Action → Variable Reward → Investment
- Gamification: Progress bars, streaks, achievements

**2. Communication-Led**
- Week 1: Onboarding emails (Day 1, 2, 3, 5, 7)
- Week 2-4: Weekly activity summary
- Month 2+: Best practices, case studies

**3. Community-Led**
- Slack/Discord community
- User-generated content
- Events (webinars, workshops)

**4. Customer Success (dla >$50k MRR)**
- Onboarding calls
- Quarterly business reviews
- Proactive check-ins

---

## 7.2 Acquisition

### Channels by Stage

**$0-10k MRR: Do Things That Don't Scale**
- Personal outreach (10 DMs/day)
- Content + SEO (2 posts/week)
- Product Hunt launch
- Manual PR

**$10k-50k MRR: Find Your Channel**
- Test 3-5 channels (Bullseye Framework)
- Measure CAC, LTV, payback
- Double down on best

**$50k-200k MRR: Scale Your Channel**
- 80% effort in proven channel
- 20% experiments

**$200k+ MRR: Multi-Channel**
- 3-5 channels parallel
- Dedicated teams
- Brand building

### CAC & LTV

```
CAC = (Marketing + Sales Spend) / New Customers
LTV = (ARPU × Gross Margin) / Churn Rate

Healthy: LTV/CAC > 3:1
Payback Period < 12 months
```

---

## 7.3 Expansion

### Feature Expansion (RICE Framework)

```
RICE Score = (Reach × Impact × Confidence) / Effort

Build when:
✓ Requested by >10% paying customers
✓ Increases retention
✓ Upsell opportunity
✓ Competitive parity
```

### Market Expansion

**Vertical** → Nowe branże
**Geographic** → US/UK → EU → LATAM/Asia
**Segment** → SMB → Mid-Market → Enterprise

---

## 7.4 Team & Systems

### Hiring Timeline

```
$0-10k MRR: Solo
$10k-30k MRR: First hire (dev or marketer)
$30k-100k MRR: Small team (3-5)
$100k-300k MRR: Specialized (5-10)
$300k-1M MRR: Departments (10-30)
```

### Automation Priority

1. **Customer Support** → Chatbots, knowledge base
2. **Onboarding** → Email sequences, in-app tours
3. **Marketing** → Email automation, social scheduling
4. **Sales** → CRM automation, lead scoring
5. **Analytics** → Automated dashboards
6. **DevOps** → CI/CD, error monitoring

### Tools Stack (typical SaaS)

**Development:** GitHub, Vercel, Supabase, Sentry
**Marketing:** ConvertKit, Buffer, Ahrefs
**Sales:** HubSpot, Calendly, Stripe
**Support:** Intercom, Notion
**Analytics:** Mixpanel, Metabase

---

## 7.5 Key Metrics Dashboard

### North Star Metric

Jedna metryka która najlepiej reprezentuje value delivered:
- Slack: Daily Active Users
- Airbnb: Nights Booked
- Netflix: Hours Watched

### AARRR Pirate Metrics

```
Acquisition → How users find you
Activation → First good experience
Retention → Users come back
Referral → Users tell others
Revenue → Monetization
```

### Success Criteria po 12 miesiącach

- MRR: $10k-50k (bootstrapped) lub $50k-200k (funded)
- Churn: <5% monthly
- LTV/CAC: >3:1
- 1-2 proven acquisition channels
- Team: 2-5 osób
- NPS: >40
- D30 Retention: >30%

---

## Podsumowanie

### Quick Start Checklist

**FAZA 1-2 (Discovery + Walidacja):**
- [ ] Zbierz 30+ sygnałów problemów
- [ ] Przeprowadź 30+ interviews
- [ ] Wybierz 1 problem do rozwiązania
- [ ] Zbuduj landing page + prototype
- [ ] Zdobądź 5+ pre-orders/LOI

**FAZA 3-4 (Definicja + Budowa):**
- [ ] MoSCoW prioritization (max 5-7 Must Have features)
- [ ] User stories z kryteriami akceptacji
- [ ] Tech stack decision
- [ ] MVP w 6-8 tygodni
- [ ] Testy dla critical paths

**FAZA 5 (Launch):**
- [ ] Beta testing (20-50 osób)
- [ ] Content przygotowawczy
- [ ] Product Hunt + social media + communities
- [ ] Zbierz 10+ testimoniali

**FAZA 6-7 (Monetyzacja + Growth):**
- [ ] 3 plany cenowe (value-based)
- [ ] Payment integration (Stripe/LemonSqueezy)
- [ ] Onboarding emails
- [ ] Find 1-2 acquisition channels
- [ ] Track: MRR, churn, LTV/CAC

---

**Powodzenia w budowaniu Twojego biznesu! 🚀**

---

*Ostatnia aktualizacja: 2025-12-11*
