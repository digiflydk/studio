# Release Playbook: Draft → Preview → Publish

Formål: En standardiseret og sikker proces for at implementere design- og indholdsændringer fra CMS til live-sitet.

## 1. Draft (Udkast)

- **Hvad**: Alle ændringer i CMS foretages i "Draft" mode.
- **Hvor**: `/cms/design`, `/cms/pages/*`
- **Effekt**: Ingen live-effekt. Ændringer er kun synlige for CMS-brugeren.

## 2. Preview (Forhåndsvisning)

- **Hvad**: Når et sæt ændringer er klar til gennemsyn, gemmes de.
- **Hvor**: "Gem" knappen i CMS.
- **Effekt**:
    - Ændringer gemmes til `settings/general` i Firestore.
    - Live-preview opdateres øjeblikkeligt (via `design:updated` event).
    - Teammedlemmer kan nu se ændringerne på staging/preview-URL'en.

## 3. Publish (Udgivelse)

- **Hvad**: Når en forhåndsvisning er godkendt, bliver den en officiel "Publish".
- **Hvordan**:
    1.  **Tag screenshots**: Tag før/efter billeder jf. `qa-checklist.md` og gem dem i `/qa/baseline/DF-XXX/`.
    2.  **Commit**: Lav et commit med en klar besked, der refererer til opgavenummeret (f.eks. "DF-245: Add release playbook docs").
    3.  **Footer-version**: Inkludér den nye version (f.eks. `1.0.194 • DF-245`) i commit-beskeden.
    4.  **Changelog**: Tilføj en kort note til den interne changelog, der beskriver ændringen.
- **Effekt**: Ændringen er nu en del af main-branchen og klar til deployment.

---

### Versionering

- **Format**: `Major.Minor.Patch • Opgave-ID` (f.eks. `1.0.194 • DF-245`).
- **Major**: Store, breaking changes i applikationskoden.
- **Minor**: Nye features eller større ændringer i UI/CMS.
- **Patch**: Små rettelser, justeringer og dokumentation.
- **Opgave-ID**: Altid reference til det specifikke DF-nummer.

### Rollback (≤1 minut)

Hvis en udgivelse forårsager et kritisk problem, kan den rulles tilbage øjeblikkeligt:
1.  Gå til Firestore-konsollen → `settings/general`.
2.  Se dokumentets historik.
3.  Vælg den sidste velfungerende version og gendan den.
4.  Dette opdaterer live-sitet med det samme. Der kræves intet nyt deployment.