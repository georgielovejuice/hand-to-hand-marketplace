# Old Code Archive

This folder contains legacy code from the original backend implementation. These files have been replaced by the refactored architecture in the `src/` directory.

## Contents

- **api_methods.js** - Old API endpoint implementations
- **backendCredentials.js** - Old credentials configuration
- **database.js** - Legacy MongoDB driver (replaced by Mongoose in `src/config/database.js`)
- **s3Client.js** - Legacy AWS S3 client configuration
- **test-s3-uploads.js** - Old S3 upload testing script
- **middleware/** - Legacy middleware (replaced by `src/middleware/`)
  - auth.js - Old authentication middleware
- **routes/** - Legacy route definitions (replaced by `src/routes/`)
  - auth.js, chat.js, myItems.js, profile.js, resource.js, uploads.js
- **scripts/** - Migration and setup scripts
  - migrate_images_to_s3.js - Image migration utility
  - setup-indexes.js - Database index setup

## Reference

These files are kept for reference only. The current implementation uses the refactored code structure in `src/` with:
- Controllers (`src/controllers/`)
- Services (`src/services/`)
- Repositories (`src/repositories/`)
- Mongoose Models (`src/models/`)
- New Middleware (`src/middleware/`)
- New Routes (`src/routes/`)

Do not use any code from this folder in production - it's for reference only.
