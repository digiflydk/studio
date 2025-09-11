# QA Tjekliste for Visuelle Ændringer (Baseline)

Formål: At sikre at kernefunktionalitet og design forbliver intakt efter hver ændring (DF-opgave). Skal udføres før "Publish".

## 10-punkts Visuel Tjekliste

1.  **Header/Hero Offset**:
    - [ ] Ingen luft/mellemrum mellem header og hero-sektion. Header ligger som et overlay.
    - [ ] `scroll-margin-top` virker korrekt for anker-links (f.eks. `#services`).

2.  **Farver & Typografi**:
    - [ ] Primær- og baggrundsfarver fra CMS afspejles korrekt.
    - [*] Alle `h1-h4` og `p` tags bruger korrekt font, størrelse og vægt fra `theme.ts`.

3-  **Knapper**:
    - [ ] Knap-radius (`--btn-shape`) opdateres korrekt (Pill/Default).
    - [ ] Knap-farver (`--btn-color-primary`, `--btn-color-hover`) virker som forventet.

4.  **Sticky Header**:
    - [ ] Headeren er sticky på scroll (både desktop og mobil).
    - [ ] Baggrundsfarve/-opacitet skifter korrekt på scroll jf. CMS-indstillinger.

5.  **Live Opdatering**:
    - [ ] Ændring af en farve, font-størrelse eller knap-radius i CMS slår igennem i preview **uden reload**.

6.  **Defaults & Fallbacks**:
    - [ ] Hvis et felt slettes fra `settings/general`, falder UI tilbage til en fornuftig default-værdi (uden at crashe).

7.  **Responsivitet (Breakpoints)**:
    - [ ] Layoutet ser korrekt ud på desktop (>1024px), tablet (~768px) og mobil (<640px).
    - [ ] Ingen horisontal scrollbar på nogen skærmstørrelse.

8.  **Navigation**:
    - [ ] Desktop-navigation er synlig og klikbar.
    - [ ] Mobil-menu (hamburger) kan åbnes, lukkes, og links virker.

9.  **Billeder**:
    - [ ] Alle billeder (hero, sektioner, logo) indlæses korrekt.
    - [ ] Billeder er optimerede og forårsager ikke mærkbar layout-forskydning (CLS).

10. **Konsol-fejl**:
    - [ ] Ingen røde fejl i browserens udvikler-konsol (både client og server-side).

---

## Baseline Screenshots

For hver DF-opgave, der påvirker UI, skal følgende "før/efter" screenshots tages og gemmes i `/qa/baseline/DF-XXX/`.

**Desktop (ca. 1440px bredde):**
1.  **desktop-header-normal.png**: Toppen af siden, **uden** at have scrollet.
2.  **desktop-header-scrolled.png**: Lidt længere nede på siden, så den sticky header med "scrolled" baggrund er synlig.
3.  **desktop-hero.png**: Hele hero-sektionen.

**Mobil (ca. 390px bredde):**
4.  **mobile-header-closed.png**: Toppen af siden, med hamburger-menuen **lukket**.
5.  **mobile-header-open.png**: Toppen af siden, med mobil-menuen **åben**.
6.  **mobile-hero.png**: Hele hero-sektionen på mobil.