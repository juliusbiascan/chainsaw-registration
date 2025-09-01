# Project Documentation

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Authentication:** NextAuth.js
- **Database ORM:** Prisma
- **UI Components:** Custom components, shadcn/ui
- **Package Manager:** pnpm

## How to Build and Run

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Environment Variables
Create a `.env` file in the root directory. Example:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```
Adjust values as needed for your environment.

### 3. Setup Prisma
- Generate Prisma Client:
  ```bash
  pnpm prisma generate
  ```
- Run Migrations:
  ```bash
  pnpm prisma migrate dev --name init
  ```
- (Optional) Seed the database:
  ```bash
  pnpm prisma db seed
  ```

### 4. Start the Development Server
```bash
pnpm dev
```

## Additional Notes
- SSL certificates for local development are in `certificates/`.
- UI components are in `components/`.
- Prisma schema is in `prisma/schema.prisma`.

For more details, see individual README sections or source files.
