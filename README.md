# akordeon
Tak — najlepiej nie robić kolejnego „jednego HTML-a”, tylko od razu zaprojektować **porządną aplikację do nauki akordeonu**, którą potem Codex będzie budował modułami. Dla Twojego przypadku zrobiłbym ją jako **PWA działającą na komputerze i telefonie**, z możliwością późniejszego opakowania jako normalna aplikacja Windows/Android.

## Główna koncepcja

Aplikacja roboczo: **Akordeon Tutor**.

Po uruchomieniu na ekranie ma być **pełny akordeon widziany od przodu**:

**lewa strona:** 80 prawidłowo rozmieszczonych basów Stradella
**środek:** miech
**prawa strona:** klawiatura fortepianowa
**nad/pod instrumentem:** lekcja, nuty, tempo, mikrofon i informacje zwrotne.

Nie chcę, żeby basy były tylko siatką 5×16. Wizualnie powinny być **przesunięte względem siebie tak jak w prawdziwym akordeonie**.

---

# 1. Profile akordeonu

Nie kodujemy jednego instrumentu na sztywno.

W ustawieniach:

**Profil instrumentu**

* Sputnik 80 basów
* 80 basów – standard
* 72 basy
* 96 basów
* 120 basów
* własny profil

Dla Twojego Sputnika będziemy mogli później wpisać dokładny zakres klawiatury.

Każdy profil zapisuje:

```ts
AccordionProfile {
  id
  name
  bassCount
  bassSystem
  trebleKeys
  lowestTrebleNote
  highestTrebleNote
  bassLayout
  keyboardLayout
}
```

To pozwoli kiedyś dodać drugi akordeon bez przebudowy programu.

---

# 2. Prawdziwe 80 basów

Lewą rękę robimy zgodnie ze Stradellą.

Rzędy:

1. kontrabas
2. bas podstawowy
3. dur
4. moll
5. septymowy

Czyli **5 × 16 = 80 przycisków**.

Ale program musi znać nie tylko napis na guziku.

Każdy przycisk ma dane:

```ts
{
  id: "bass-Am",
  root: "A",
  type: "minor",
  notes: ["A2", "C3", "E3"],
  row: 4,
  column: 9
}
```

Dzięki temu później mikrofon może rozpoznać:

**A**
albo
**Am**
albo
**Dm**
albo
**G**

i zapalić właściwy guzik.

---

# 3. Pełna wizualizacja akordeonu

Tutaj proponuję **SVG**, a nie obrazek JPG.

Dlaczego?

Bo każdy element może być osobnym obiektem.

Na przykład:

```html
<g id="bass-Am"></g>
<g id="key-E4"></g>
<g id="bellows"></g>
```

Kiedy grasz E4:

klawisz **E** fizycznie rozświetla się na akordeonie.

Kiedy grasz Am:

podświetla się odpowiedni bas/akord.

### Stany klawisza

Normalny:

⬜

Dźwięk, który masz zagrać:

🟨

Aktualnie grany:

🟦

Poprawnie:

🟩

Źle:

🟥

To samo dla basów.

---

# 4. Mikrofon

To jest jeden z najważniejszych modułów.

Nie chcę detekcji zrobionej metodą „największa częstotliwość FFT”, bo przy akordeonie będzie często wariować.

Użyjemy:

**Web Audio API**

i dwóch rodzajów analizy.

### Prawa ręka — pojedynczy dźwięk

Algorytm typu:

**YIN pitch detection**

Rozpoznaje np.:

> E4
> 329,6 Hz
> +3 centy

Aplikacja porównuje go z wymaganym dźwiękiem.

---

# 5. Stabilizacja rozpoznawania dźwięku

Nie wolno przechodzić do kolejnej nuty po jednym odczycie mikrofonu.

System powinien zastosować:

* próg głośności,
* confidence,
* tolerancję częstotliwości,
* czas stabilizacji,
* hysteresis.

Przykład:

```text
E4
E4
E4
E4
```

przez np. 80–120 ms.

Dopiero wtedy:

> ✓ E4 poprawnie.

Zapobiegnie to przypadkowemu przeskakiwaniu lekcji.

---

# 6. Problem akordeonu — wiele dźwięków jednocześnie

To jest bardzo ważne.

Gdy zagrasz:

**Am**

mikrofon słyszy kilka dźwięków.

Zwykły pitch detector tego poprawnie nie rozwiąże.

Dlatego aplikacja powinna mieć drugi analizator:

### Polyphonic / chord detector

Wyliczamy widmo i chromagram:

```text
C  ███████
C# ░
D  ░
D# ░
E  ██████
F  ░
F# ░
G  █████
...
```

i z tego aplikacja rozpoznaje:

> Am

lub:

> Dm

lub:

> G

To wykorzystamy do lewej ręki.

---

# 7. Kalibracja mikrofonu

Pierwsze uruchomienie:

### „Skonfiguruj mikrofon”

Program prosi:

> Zagraj A4.

Potem:

> Zagraj C4.

Potem:

> Zagraj bas C.

Na tej podstawie ustala:

* poziom szumu,
* czułość,
* charakterystykę mikrofonu,
* opóźnienie,
* tolerancję.

I zapisuje ustawienia.

---

# 8. Tryb „stroik”

Osobny ekran:

### Strojenie akordeonu

Duży wskaźnik:

```text
             E4

          329.8 Hz

-50 ─────────●──────── +50

             +2 cent
```

Kolory:

🟥 za nisko
🟩 dobrze
🟥 za wysoko

Można sprawdzić każdy klawisz.

To później będzie przydatne również do Twojego Sputnika.

---

# 9. Nauka „Ona by tak chciała”

Tu aplikacja ma być znacznie lepsza od obecnej.

Nie ciąg:

```text
E4 F#4 G4...
```

tylko normalna lekcja.

U góry:

> ONA BY TAK CHCIAŁA

Pod spodem:

```text
INTRO
ZWROTKA
REFREN
ZWROTKA 2
REFREN
```

Możesz wybrać część.

---

# 10. Nuty na ekranie

Twoje nuty mają być zsynchronizowane z aplikacją.

Przykładowy ekran:

```text
          Am               Dm

♩ ♪ ♪ ♩ │ ♪ ♪ ♪ ♩ │ ...

     ↑
aktualna nuta
```

Aktualny takt zostaje powiększony.

Aktualna nuta:

🟨

Po poprawnym zagraniu:

🟩

Program przesuwa się dalej.

---

# 11. Format utworów

Nie wpisujemy nut bezpośrednio do kodu.

Każdy utwór ma własny plik.

Najlepiej obsługiwać:

### MusicXML

oraz własny JSON.

Przykład:

```json
{
  "title": "Ona by tak chciała",
  "tempo": 170,
  "timeSignature": "4/4",
  "sections": [
    {
      "name": "Intro",
      "bars": []
    }
  ]
}
```

Nuta:

```json
{
  "pitch": "E4",
  "duration": "1/8",
  "start": 0,
  "bass": "Am"
}
```

To będzie ogromna zaleta.

Potem możemy dodawać kolejne utwory bez ruszania aplikacji.

---

# 12. Import utworów

Aplikacja powinna przyjmować:

**MusicXML**
**MIDI**
**własny JSON**

i opcjonalnie:

**PDF / zdjęcie nut**

Zdjęcie nie powinno być głównym formatem aplikacji — zdjęcie jest tylko źródłem do przygotowania lekcji.

---

# 13. Nauka prawej ręki

Tryby:

### Tryb A — czekaj na mnie

Program pokazuje:

> E4

i nie idzie dalej, dopóki nie zagrasz E4.

Najlepszy dla początkującego.

### Tryb B — tempo

Metronom działa.

Musisz trafić:

> odpowiedni dźwięk
> w odpowiednim czasie.

### Tryb C — razem z utworem

Leci podkład.

Program śledzi grę.

---

# 14. Nauka lewej ręki

Osobno:

### Tylko basy

Na ekranie wielki diagram.

Przykład:

```text
Am → Dm → G → Am
```

Program podświetla:

🟨 Am

Zagrywasz Am.

Po rozpoznaniu:

🟩 Am

i następny:

🟨 Dm.

---

# 15. Obie ręce

Po nauczeniu prawej i lewej:

### „Obie ręce”

Program pokazuje jednocześnie:

```text
PRAWA
E4 F#4 G4 ...

LEWA
Am    Dm    G    Am
```

Instrument na środku pokazuje dwa miejsca.

To ma być docelowy tryb nauki.

---

# 16. Tempo nauki

Suwak:

```text
50% ─────●──────── 100%
```

Na przykład oryginał:

**170 BPM**

Ćwiczymy:

* 60 BPM
* 80 BPM
* 100 BPM
* 120 BPM
* 150 BPM
* 170 BPM

I przycisk:

### „Automatycznie zwiększ tempo”

Jeśli zagrasz np. 90% poprawnie:

> 100 BPM → 110 BPM.

---

# 17. Metronom

Pełny metronom:

* BPM
* 2/4
* 3/4
* 4/4
* akcent pierwszej miary
* regulacja głośności
* count-in

Czyli:

> 1 2 3 4

i dopiero zaczyna się ćwiczenie.

---

# 18. Odtwarzanie wzorcowe

Przycisk:

### ▶ Posłuchaj

Ale nie syntetyczne „beep beep”.

Chcę mieć **sample prawdziwego akordeonu**.

Dla każdego dźwięku próbka.

Wtedy odsłuch brzmi jak:

🪗 akordeon,

a nie syntezator komputerowy.

---

# 19. Regulacja rejestru

Możemy później dodać wizualne przełączniki rejestrów:

* Bassoon
* Clarinet
* Master
* Musette itd.

Dla nauki nie jest to niezbędne, ale architektura powinna to przewidzieć.

---

# 20. Pętla ćwiczeń

Bardzo ważna funkcja:

### „Ćwicz takty 5–8”

Wybierasz fragment.

Program zapętla:

```text
5 → 6 → 7 → 8
5 → 6 → 7 → 8
...
```

aż np.:

> 5 poprawnych wykonań.

---

# 21. Trudne miejsca

Program sam zapisuje błędy.

Przykład:

```text
Takt 17
E4 → często grasz F4

Takt 21
spóźnienie średnio 170 ms
```

Potem przycisk:

### „Ćwicz moje błędy”

I generuje krótką sesję tylko z problematycznych miejsc.

To będzie jedna z najlepszych funkcji aplikacji.

---

# 22. Wynik ćwiczenia

Po każdej próbie:

```text
ONA BY TAK CHCIAŁA – INTRO

Poprawne nuty       91%
Rytm                83%
Basy                 88%
Tempo                100 BPM
Najdłuższa seria     24 nuty

Problemy:
takt 7
takt 11
takt 12
```

---

# 23. Historia nauki

Dashboard:

```text
Dzisiaj
18 min

Ten tydzień
2 h 14 min

Ona by tak chciała
██████████░ 82%
```

A także:

> najwyższe opanowane tempo: 140 BPM

---

# 24. Tryb „wolna gra”

Nie zawsze chcesz lekcję.

Tryb:

### 🪗 Gram

Mikrofon słucha.

Na wizualizacji pokazuje na żywo wszystko, co grasz.

Prawa ręka:

> G4

Lewa:

> Am

To przy okazji świetne narzędzie do sprawdzania, jakie dźwięki naciskasz.

---

# 25. Klawiatura ekranowa

Klawisze i basy mają być także **klikalne**.

Czyli bez akordeonu można:

kliknąć C → słychać C.

Kliknąć Am → słychać Am.

Możesz poznawać układ instrumentu.

---

# 26. Nazwy nut

Przełącznik:

### system polski

```text
C D E F G A H
```

lub:

### system międzynarodowy

```text
C D E F G A B
```

To ważne, żeby później nie zrobić bałaganu B/H.

---

# 27. Tryb palców

Do każdej nuty możemy dopisać palcowanie:

```text
E4   1
F#4  2
G4   3
A4   4
```

Na klawiaturze wyświetla:

> 1
> 2
> 3
> 4

Czyli aplikacja uczy nie tylko **co**, ale też **którym palcem**.

---

# 28. Animacja miecha

Nie tylko dekoracja.

Przy lekcji utwór może zawierać:

```text
PUSH
PULL
```

A wtedy środek akordeonu pokazuje:

### ← ROZCIĄGAJ

lub:

### → ŚCISKAJ

Na późniejszym etapie możemy nawet analizować mikrofonem artykulację, ale na początku wystarczy instrukcja.

---

# 29. Interfejs główny

Widzę go mniej więcej tak:

```text
┌──────────────────────────────────────────────────────┐
│ 🪗 AKORDEON TUTOR    Ona by tak chciała      ⚙️     │
├──────────────────────────────────────────────────────┤
│ 🎤 MIC ●     E4 329.6Hz     BPM 100      92%        │
├──────────────────────────────────────────────────────┤
│                                                      │
│ BASY            MIECH              KLAWIATURA        │
│                                                      │
│ ● ● ● ●        |||||||||          ██ █ ██ █         │
│ ● ● ● ●        |||||||||          ▯▯▯▯▯▯▯▯          │
│ ● ● ● ●        |||||||||          ▯▯▯▯▯▯▯▯          │
│                                                      │
├──────────────────────────────────────────────────────┤
│          Am            Dm            G               │
│ ♩ ♪ ♪ ♩ │ ♪ ♪ ♪ ♩ │ ♩ ♪ ♪ ♩                        │
│           ▲                                          │
├──────────────────────────────────────────────────────┤
│ ◀ │ ▶ │ 🔁 │ 80 BPM ━━━━━●━━━━ │ 🎵 │ 🎤           │
└──────────────────────────────────────────────────────┘
```

---

# 30. Ekrany aplikacji

Docelowo wystarczy **7 głównych ekranów**:

1. **Start**
2. **Moje utwory**
3. **Lekcja**
4. **Wolna gra**
5. **Stroik**
6. **Postępy**
7. **Ustawienia instrumentu**

Nie robiłbym 30 różnych ekranów.

---

# 31. Technologia

Dla Codexa proponuję:

### Frontend

```text
React
TypeScript
Vite
```

### Styl

```text
CSS modules / Tailwind
```

Ja wybrałbym raczej zwykłe CSS + komponenty, żeby projekt nie był uzależniony od frameworka UI.

### Audio

```text
Web Audio API
AudioWorklet
```

Analiza mikrofonu powinna iść w **AudioWorklet**, żeby interfejs nie zacinał analizy.

### Stan

```text
Zustand
```

Lekki i wystarczający.

### Dane lokalne

```text
IndexedDB
Dexie
```

Dzięki temu aplikacja działa nawet offline.

### Nuty

```text
MusicXML
```

Renderowanie:

**OpenSheetMusicDisplay**

To nam bardzo ułatwi prawdziwy zapis nutowy.

---

# 32. Struktura projektu Codex

```text
accordion-tutor/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   │
│   ├── components/
│   │   ├── Accordion/
│   │   │   ├── Accordion.tsx
│   │   │   ├── TrebleKeyboard.tsx
│   │   │   ├── BassBoard.tsx
│   │   │   └── Bellows.tsx
│   │   │
│   │   ├── SheetMusic/
│   │   ├── Metronome/
│   │   └── Tuner/
│   │
│   ├── audio/
│   │   ├── microphone.ts
│   │   ├── pitchDetector.ts
│   │   ├── chordDetector.ts
│   │   └── audioEngine.ts
│   │
│   ├── music/
│   │   ├── notes.ts
│   │   ├── stradella.ts
│   │   ├── musicXml.ts
│   │   └── lessonEngine.ts
│   │
│   ├── songs/
│   │   └── songLoader.ts
│   │
│   ├── storage/
│   │
│   ├── pages/
│   │
│   └── types/
│
├── public/
│   ├── samples/
│   ├── songs/
│   └── instruments/
│
└── tests/
```

To jest znacznie lepsze niż wrzucenie wszystkiego do `App.tsx`.

---

# 33. Najważniejszy element: Lesson Engine

Cała nauka powinna być niezależnym modułem.

Przykład:

```ts
LessonEngine
```

otrzymuje:

```text
nutę oczekiwaną
nutę zagraną
czas zagrania
akord
tempo
```

i zwraca:

```ts
{
  pitchCorrect: true,
  timingCorrect: true,
  cents: -3,
  timingOffsetMs: 42,
  advance: true
}
```

Dzięki temu później możemy całkowicie zmienić grafikę bez ruszania logiki nauki.

---

# 34. „Ona by tak chciała”

Pierwszym prawdziwym utworem w aplikacji zrobimy właśnie ten.

Na podstawie nut, które masz, zrobimy:

```text
01 Intro
02 Zwrotka
03 Refren
...
```

I dla każdej części:

* melodia,
* rytm,
* akord,
* bas,
* palcowanie, jeśli ustalimy,
* tempo.

Twoje zdjęcie już pokazuje również progresję m.in.:

**Am – Dm – G – Am**

więc możemy ją wykorzystać przy przygotowywaniu lekcji.

---

# 35. Kolejność budowy w Codex

Nie każemy Codexowi zrobić wszystkiego naraz.

### Etap 1

Szkielet aplikacji + routing.

### Etap 2

Prawdziwy wizualny akordeon.

### Etap 3

80 basów.

### Etap 4

Klawiatura i dźwięki.

### Etap 5

Mikrofon + YIN.

### Etap 6

Podświetlanie klawisza.

### Etap 7

Lesson Engine.

### Etap 8

MusicXML.

### Etap 9

„Ona by tak chciała”.

### Etap 10

Metronom i tempo.

### Etap 11

Basy/chord recognition.

### Etap 12

Statystyki i historia.

### Etap 13

PWA/offline.

Dzięki temu po każdym etapie mamy **działającą aplikację**, a nie 5000 linii niedziałającego kodu.

---

## Co uważam za absolutnie obowiązkowe w pierwszej dobrej wersji

Pierwszy release powinien już mieć:

* prawdziwe **80 basów**,
* pełną klawiaturę,
* responsywny akordeon SVG,
* mikrofon,
* rozpoznawanie nut,
* podświetlanie klawiszy,
* tuner,
* metronom,
* naukę krok po kroku,
* normalne nuty na pięciolinii,
* fragmenty utworu,
* zwalnianie tempa,
* pętlę taktów,
* prawą rękę,
* lewą rękę,
* obie ręce,
* zapamiętywanie postępu,
* import utworów,
* tryb offline.

Dopiero wtedy można mówić, że jest to **aplikacja do nauki akordeonu**, a nie demonstracja mikrofonu.

### A do Codexa damy nie jedno zdanie, tylko specyfikację etapami.

Pierwszym zadaniem dla Codexa powinno być zbudowanie **fundamentu projektu + kompletnego interaktywnego akordeonu 80-basowego**, zanim w ogóle zaczniemy dodawać „Ona by tak chciała”. W następnym kroku mogę przygotować Ci **gotowy „MASTER PROMPT” do Codexa**, z architekturą, strukturą plików, wymaganiami, testami i checklistą „definition of done”, żeby Codex zaczął budowę bez zgadywania.
