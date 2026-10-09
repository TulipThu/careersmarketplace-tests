# Careers Marketplace Tests

Playwright end-to-end tests for the [UNOPS Careers Marketplace](https://careers.unops.org/).

This repository is a **child project** of the [unops_hr_qa](https://github.com/TulipThu/unops_hr_qa) parent repository. The parent repo groups multiple HR QA test suites as Git submodules so teams can own and maintain their suites independently.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)

## Setup

1. **Clone this repo** (standalone):

   ```bash
   git clone https://github.com/TulipThu/careersmarketplace-tests.git
   cd careersmarketplace-tests
   ```

   Or **clone via the parent repo** (recommended if you work across multiple QA suites):

   ```bash
   git clone --recurse-submodules https://github.com/TulipThu/unops_hr_qa.git
   cd unops_hr_qa/careersmarketplace-tests
   ```

2. **Install dependencies:**

   ```bash
   npm ci
   npx playwright install
   ```

3. **Configure credentials** — copy the example env file and fill in test account details:

   ```bash
   cp .env.example .env
   ```

   Generate an encrypted password (do not commit `.env`):

   ```bash
   node scripts/encrypt-password.js "your-password"
   ```

   Copy the output values into `.env`.

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless, Chromium) |
| `npm run test:headed` | Run tests in a visible browser |
| `npm run report` | Open the HTML test report |
| `npm run typecheck` | TypeScript type checking |

Run a single suite:

```bash
npx playwright test tests/home
npx playwright test tests/login
npx playwright test tests/marketplace
npx playwright test tests/profile
```

## Project Structure

```
careersmarketplace-tests/
├── tests/
│   ├── helpers/       # Shared test utilities (auth, navigation, etc.)
│   ├── home/          # Home page tests
│   ├── login/         # Login flow tests
│   ├── marketplace/   # Marketplace search & open positions
│   └── profile/       # Profile edit, tabs, password reset, delete account
├── lib/               # Credential decryption helpers
├── scripts/           # Password encryption & migration utilities
└── playwright.config.ts
```

## Contributing to This Child Repo

This repo is maintained independently. Changes here do **not** require changes to the parent repo unless you want to pin a new commit reference.

### Workflow

1. **Fork** [careersmarketplace-tests](https://github.com/TulipThu/careersmarketplace-tests) (or get write access from a maintainer).
2. **Create a branch** from `main`:

   ```bash
   git checkout -b feature/my-test-improvement
   ```

3. **Make your changes**, run tests locally, and commit.
4. **Open a Pull Request** against `main` in this repo.
5. After merge, **update the parent repo** so it points to the new commit (see [Updating the parent reference](#updating-the-parent-reference)).

### Guidelines

- Do not commit `.env` or real credentials.
- Keep tests focused and use helpers in `tests/helpers/` for shared logic.
- Run `npm run typecheck` before opening a PR.

### Updating the Parent Reference

After your changes are merged here, a maintainer (or you, if you have access) updates the submodule pointer in the parent repo:

```bash
cd unops_hr_qa/careersmarketplace-tests
git pull origin main
cd ..
git add careersmarketplace-tests
git commit -m "Update careersmarketplace-tests submodule"
git push origin main
```

## Relationship to the Parent Repo

| Repo | Role | URL |
|------|------|-----|
| **Parent** | Umbrella repo; lists all QA submodules | [unops_hr_qa](https://github.com/TulipThu/unops_hr_qa) |
| **Child (this repo)** | Careers Marketplace Playwright tests | [careersmarketplace-tests](https://github.com/TulipThu/careersmarketplace-tests) |

See the [parent README](https://github.com/TulipThu/unops_hr_qa#readme) for instructions on adding your own test suite as a submodule.

## CI

GitHub Actions runs Playwright tests on push and pull request to `main`. See [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml).
