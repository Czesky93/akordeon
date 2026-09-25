:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --panel-strong: #eef3ff;
  --text: #1c2432;
  --muted: #5d6b82;
  --primary: #4f64ff;
  --primary-soft: rgba(79, 100, 255, 0.12);
  --border: #dfe7f5;
  --shadow: 0 20px 40px rgba(46, 63, 92, 0.12);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  background: linear-gradient(180deg, #edf4ff 0%, var(--bg) 100%);
  color: var(--text);
}

.page-shell {
  max-width: 900px;
  margin: 0 auto;
  padding: 72px 24px 96px;
}

.hero {
  text-align: center;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 0.76rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--primary);
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: clamp(2.3rem, 4vw, 4rem);
  line-height: 1.1;
}

.subtitle {
  margin: 16px auto 0;
  max-width: 620px;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.accordion-item {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.accordion-item:hover {
  transform: translateY(-1px);
}

.accordion-trigger {
  width: 100%;
  background: transparent;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  text-align: left;
  padding: 22px 24px;
  font: inherit;
  color: var(--text);
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
}

.accordion-trigger:focus-visible {
  outline: 3px solid rgba(79, 100, 255, 0.25);
  outline-offset: -3px;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 1.5rem;
  transition: transform 0.25s ease;
}

.accordion-item.is-open .icon {
  transform: rotate(45deg);
}

.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.28s ease;
}

.accordion-content p {
  margin: 0;
  overflow: hidden;
  color: var(--muted);
  line-height: 1.7;
  padding: 0 24px 0;
  font-size: 0.98rem;
}

.accordion-item.is-open .accordion-content {
  grid-template-rows: 1fr;
}

.accordion-item.is-open .accordion-content p {
  padding: 0 24px 22px;
}

@media (max-width: 640px) {
  .page-shell {
    padding-top: 48px;
  }

  .accordion-trigger {
    padding: 18px 18px;
    font-size: 0.96rem;
  }

  .accordion-content p {
    padding-left: 18px;
    padding-right: 18px;
  }

  .accordion-item.is-open .accordion-content p {
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 18px;
  }
}
