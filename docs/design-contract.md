# Design Contract — settings/general (single source of truth)

Formål: Én entydig definition af alle CMS-felter (design + pages) og hvordan de lagres i `settings/general`, samt præcist hvordan UI bruger dem. Ingen skjulte regler.

## Globale designfelter (fra CMS/design)
| Key (settings/general) | Type | Default | Validering | UI-brug | CSS-var | Live update | Note |
|---|---|---:|---|---|---|---|---|
| brandPrimary | string (hex) | #6B46C1 | valid hex | Primær brandfarve | --brand-primary | Ja | Bruges til knapper/links/hover |
| brandSecondary | string (hex) | #111827 | valid hex | Sekundær farve | --brand-secondary | Ja | Tekst/ikoner |
| textColor | string (hex) | #111827 | valid hex | Basis tekst | --text-color | Ja |  |
| linkColor | string (hex) | #2563EB | valid hex | Links | --link-color | Ja |  |
| fontFamily | string | system-ui | non-empty | Global font | --font-family | Ja |  |
| fontScale | number | 1.0 | 0.85–1.25 | Typo skala | --font-scale | Ja | multiplicativ skala |
| spacingBase | number (px) | 8 | 4–16 | Basisspacing | --spacing-base | Ja |  |

## Header (fra cms/pages/header)
| Key (settings/general) | Type | Default | Validering | UI-brug | CSS-var | Live update | Note |
|---|---|---:|---|---|---|---|---|
| header.enabled | boolean | true | — | Viser/skjuler header | — | Ja |  |
| header.height | number (px) | 80 | 56–128 | Header højde | --header-height | Ja | Styrer også hero offset |
| header.bg | string (hex) | #FFFFFF | valid hex | Header baggrund | --header-bg | Ja |  |
| header.border.enabled | boolean | false | — | Viser border | — | Ja |  |
| header.border.width | number (px) | 1 | 0–4 | Border tykkelse | --header-border-width | Ja | kræver enabled |
| header.border.color | string (hex) | #E5E7EB | valid hex | Border farve | --header-border-color | Ja |  |
| header.logo.maxHeight | number (px) | 32 | 16–64 | Logo maks-højde | --logo-max-height | Ja |  |
| header.logo.aspect | enum: contain|cover | contain | — | Logo skalering | — | Ja | CSS object-fit |
| header.sticky | boolean | true | — | Sticky adfærd | — | Ja |  |

## Footer (fra cms/pages/footer)
| Key | Type | Default | Validering | UI-brug | CSS-var | Live update | Note |
|---|---|---:|---|---|---|---|---|
| footer.enabled | boolean | true | — | Viser/skjuler footer | — | Ja |  |
| footer.bg | string (hex) | #111827 | valid hex | Footer baggrund | --footer-bg | Ja |  |
| footer.textColor | string (hex) | #D1D5DB | valid hex | Footer tekst | --footer-text | Ja |  |
| footer.border.enabled | boolean | false | — | Viser border | — | Ja |  |
| footer.border.width | number (px) | 1 | 0–4 | Border tykkelse | --footer-border-width | Ja |  |
| footer.border.color | string (hex) | #1F2937 | valid hex | Border farve | --footer-border-color | Ja |  |

## Home/Hero (fra cms/pages/home)
| Key | Type | Default | Validering | UI-brug | CSS-var | Live update | Note |
|---|---|---:|---|---|---|---|---|
| hero.offsetMode | enum: auto, fixed | auto | — | Hero top-offset | --hero-offset-mode | Ja | auto = følger header.height |
| hero.fixedOffset | number (px) | 0 | 0–256 | Fast offset hvis fixed | --hero-fixed-offset | Ja |  |
| hero.bg | string (hex or url) | #F9FAFB | valid hex/url | Hero baggrund | --hero-bg | Ja |  |
| hero.title | string | "" | ≤120 chars | Overskrift | — | Ja |  |
| hero.subtitle | string | "" | ≤200 chars | Undertekst | — | Ja |  |
| hero.cta.text | string | "" | ≤40 chars | CTA label | — | Ja |  |
| hero.cta.variant | enum: primary, secondary, outline, destructive | primary | — | Knap-stil | — | Ja | binder til brand vars |

## Buttons (fra CMS/design og sektioner)
| Key | Type | Default | Validering | UI-brug | CSS-var | Live update | Note |
|---|---|---:|---|---|---|---|---|
| button.design | enum: pill, default | default | — | Border-radius mv. | --btn-shape | Ja |  |
| button.radius | number (px) | 8 | 0–32 | Corner radius | --btn-radius | Ja |  |
| button.textSize | enum: sm, md, lg | md | — | Font size | --btn-text-size | Ja | skalerer med fontScale |
| button.primary.bg | string (hex) | uses brandPrimary | valid hex | Primær baggrund | --btn-primary-bg | Ja | fallback = brandPrimary |
| button.primary.text | string (hex) | #FFFFFF | valid hex | Primær tekst | --btn-primary-text | Ja |  |

## Failsafe & Prioritet
- **Ugyldig farve** → fald tilbage til default uden UI-brud.  
- **hero.offsetMode=auto** → hero top-padding = `header.height`.  
- **border.width > 0 men border.enabled=false** → ingen border (enabled vinder).  
- **Tomt logo** → brug site-navn som tekst, vertikalt centreret.

## Live-opdatering (design:updated)
- Ændringer i `settings/general` skal kunne ses i Preview inden for få sekunder uden reload på: farver, højde, offsets, knapper.  
- Indhold (title/subtitle/cta) må også opdatere live, men det er “soft” krav (ingen layout hop).
