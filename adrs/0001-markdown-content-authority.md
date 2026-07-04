# ADR-0001: Markdown Files Are the Documentation Content Authority

- Status: Accepted
- Date: 2026-07-04
- Decision owners: Mobazha documentation maintainers
- Affected surfaces: docs.mobazha.org, machine indexes, translations, contribution workflow
- Supersedes: Inline TypeScript page content
- Superseded by: None

## Context

The first public documentation phase stored page metadata and structured
content in one TypeScript module. That made deterministic publishing possible,
but long documents, translations, policy reviews, and community contributions
were difficult to inspect as ordinary documents. Application code and content
authority were also unnecessarily coupled.

## Decision

Markdown files under `content/<language>/` are the authoritative page content.
YAML frontmatter carries lifecycle, audience, source, review, translation, and
version metadata. The file path defines the stable page slug.

Navigation lives in `content/navigation.json`. The committed application
registry, search index, Agent context, source manifest, sitemap, and discovery
files are generated outputs. They must not be edited as independent sources.

## Alternatives considered

- Keep TypeScript content: type-safe but poor for document review and community editing.
- Load Markdown from the filesystem at runtime: simple locally but incompatible with the desired Cloudflare deployment boundary.
- Adopt a database CMS: improves editing UI but introduces a central service and weakens repository review and reproducibility.
- Use MDX at runtime: flexible, but allows executable presentation concerns into policy content and increases the trust surface.

## Consequences

- Contributors edit standard Markdown and review readable diffs.
- The build fails when generated artifacts are stale or content metadata is incomplete.
- Runtime deployment remains filesystem-independent because generated JSON is bundled with the application.
- The constrained Markdown parser intentionally supports the page structures currently rendered; new syntax requires an explicit parser and renderer change.
- Generated files remain committed so public changes can be audited in one revision.

## Validation

`npm run generate:content` rebuilds the registry and public artifacts.
`npm run validate:content` compares Markdown-derived output with committed
generated files and validates navigation, translations, links, metadata, and
denied-content markers.

## Supersession conditions

Replace this decision only when another content system preserves anonymous
public access, repository-native review, deterministic builds, translation
authority, machine discovery, Cloudflare deployment, and offline validation.
