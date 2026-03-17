# Mobile App (Offline)

Cross-platform mobile app (Android + iOS) built with **React Native + Expo**.

## MVP scope (first version)

- **Library**: list/search local media items
- **Import**: add photos/videos/files from device
- **Detail**: view item metadata (title/notes/tags/rights fields) and open the file
- **Edit**: update metadata; delete item (and underlying file)
- **Settings**: app info, storage usage, optional “reset local data”

## Offline storage strategy

- **Structured data**: SQLite (items, tags, rights fields, indexes)
- **Large files**: device filesystem (store path + metadata in SQLite)

## Development (Windows friendly)

```bash
cd apps/mobile-app
npm install
npm run start
```

## iOS without a Mac

You can develop on Windows and produce iOS builds using **Expo cloud builds (EAS Build)**.
Local iOS Simulator requires macOS.

