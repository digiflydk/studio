# Mapping Matrix — CMS → settings/general → UI

Formål: Entydig sporbarhed fra CMS-felt til lagring i `settings/general` og videre til UI (CSS-variabler/komponenter).

| CMS modul | CMS felt | settings/general key | UI-komponent(er) | CSS-variabel | Bemærkning |
|---|---|---|---|---|---|
| cms/design | Primær farve | brandPrimary | Buttons, Links, Badges | --brand-primary | Fallback for btn.primary.bg |
| cms/design | Sekundær farve | brandSecondary | Tekster/ikoner | --brand-secondary |  |
| cms/design | Link farve | linkColor | Anchor, Nav | --link-color |  |
| cms/design | Font familie | fontFamily | Global layout | --font-family |  |
| cms/design | Typografi skala | fontScale | Global typo | --font-scale | multiplicativ |
| cms/design | Spacing base | spacingBase | Grid/sections | --spacing-base | 4–16 |

| cms/pages/header | Højde | header.height | Header, Layout, Hero | --header-height | Styrer hero offset (auto) |
| cms/pages/header | Baggrund | header.bg | Header | --header-bg |  |
| cms/pages/header | Border synlig | header.border.enabled | Header | — | Gate for width/color |
| cms/pages/header | Border tykkelse | header.border.width | Header | --header-border-width | Kræver enabled |
| cms/pages/header | Border farve | header.border.color | Header | --header-border-color |  |
| cms/pages/header | Logo max højde | header.logo.maxHeight | Header Logo | --logo-max-height |  |
| cms/pages/header | Logo skalering | header.logo.aspect | Header Logo | — | contain/cover |
| cms/pages/header | Sticky | header.sticky | Header | — |  |

| cms/pages/footer | Baggrund | footer.bg | Footer | --footer-bg |  |
| cms/pages/footer | Tekstfarve | footer.textColor | Footer | --footer-text |  |
| cms/pages/footer | Border synlig | footer.border.enabled | Footer | — | Gate |
| cms/pages/footer | Border tykkelse | footer.border.width | Footer | --footer-border-width |  |
| cms/pages/footer | Border farve | footer.border.color | Footer | --footer-border-color |  |

| cms/pages/home | Hero offset mode | hero.offsetMode | Hero/Layout | --hero-offset-mode | auto/fixed |
| cms/pages/home | Hero fixed offset | hero.fixedOffset | Hero/Layout | --hero-fixed-offset | bruges ved fixed |
| cms/pages/home | Hero baggrund | hero.bg | Hero | --hero-bg |  |
| cms/pages/home | Hero titel | hero.title | Hero | — | tekst |
| cms/pages/home | Hero undertekst | hero.subtitle | Hero | — | tekst |
| cms/pages/home | CTA tekst | hero.cta.text | Hero Button | — | label |
| cms/pages/home | CTA variant | hero.cta.variant | Hero Button | — | primary/secondary/... |

| cms/design | Knap design | button.design | Button | --btn-shape | pill/default |
| cms/design | Knap radius | button.radius | Button | --btn-radius |  |
| cms/design | Knap tekst str. | button.textSize | Button | --btn-text-size | sm/md/lg |
| cms/design | Knap primær bg | button.primary.bg | Button | --btn-primary-bg | fallback brandPrimary |
| cms/design | Knap primær tekst | button.primary.text | Button | --btn-primary-text |  |
