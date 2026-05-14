# Store Transfer 2026-05-14

Phase 1 workspace for the Bjerrehuus migration.

- `source/`: restored client-transfer store exports once available.
- `target-before/`: May 2 target-store backup exports before import.
- `target-after/`: May 2 target-store exports after import.
- `screenshots/`: manual screenshots for settings Shopify does not clone cleanly.
- `import-logs/`: dry-run and apply logs from migration scripts.
- `migration-manifest.json`: local fallback manifest built from repo/docs/chat history.
- `url-replacement-map.json`: generated asset URL audit and replacement checklist.

All import scripts are dry-run by default. Mutating actions require `--apply`.
