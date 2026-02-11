# NepaliBizzBusiness

A NestJS-based business service for Nepali Biz platform.

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 18.0.0
- **Yarn**: >= 1.22.0
- **Docker**: Latest version (for database)
- **Docker Compose**: Latest version

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NepaliBizzBusiness
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Set Up Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

**Important**: Update the `.env` file with your local configuration. The default values should work for local development with Docker.

### 4. Start the Database

Start the PostgreSQL database using Docker Compose:

```bash
docker compose up nepali-biz-business-db -d
```

Wait for the database to be ready (usually takes 10-15 seconds).

### 5. Run Database Migrations

Apply the database schema:

```bash
yarn prisma:migrate
```

### 6. Test Database Connection

**Before pushing any code**, verify your database connection:

```bash
yarn test:db
```

This will run comprehensive tests to ensure:

- ✅ Environment variables are configured
- ✅ Database connection is working
- ✅ Migrations are applied
- ✅ Tables are accessible
- ✅ Read/write operations work

### 7. Start the Development Server

```bash
yarn dev
```

The API will be available at `http://localhost:3001/api`

## 🗄️ Database Setup

### Using Docker (Recommended)

The project includes a Docker Compose configuration for PostgreSQL:

```bash
# Start database only
docker compose up nepali-biz-business-db -d

# Stop database
docker compose down

# View database logs
docker compose logs nepali-biz-business-db -f

# Reset database (WARNING: Deletes all data)
docker compose down -v
docker compose up nepali-biz-business-db -d
yarn prisma:migrate
```

### Prisma Commands

```bash
# Generate Prisma Client
yarn prisma:generate

# Create a new migration
yarn prisma:migrate

# Deploy migrations (production)
yarn prisma:migrate:deploy

# Open Prisma Studio (Database GUI)
yarn prisma:studio

# Seed database
yarn prisma:seed
```

## 💻 Development

### Running the Application

```bash
# Development mode with hot reload
yarn dev

# Debug mode
yarn start:debug

# Production mode
yarn start:prod
```

### Code Quality

```bash
# Run linter
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:cov
```

### Git Hooks

This project uses Husky for Git hooks:

- **Pre-commit**: Runs linting and formatting on staged files
- **Commit-msg**: Validates commit messages using Commitlint

## 📜 Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `yarn dev`             | Start development server with hot reload |
| `yarn start:dev`       | Start with environment validation        |
| `yarn start:debug`     | Start in debug mode                      |
| `yarn start:prod`      | Start in production mode                 |
| `yarn lint`            | Run ESLint                               |
| `yarn lint:fix`        | Fix ESLint issues                        |
| `yarn format`          | Format code with Prettier                |
| `yarn test`            | Run unit tests                           |
| `yarn test:watch`      | Run tests in watch mode                  |
| `yarn test:cov`        | Run tests with coverage                  |
| `yarn test:e2e`        | Run end-to-end tests                     |
| `yarn test:db`         | Test database connection                 |
| `yarn prisma:generate` | Generate Prisma Client                   |
| `yarn prisma:migrate`  | Run database migrations                  |
| `yarn prisma:studio`   | Open Prisma Studio                       |
| `yarn prisma:seed`     | Seed database                            |

## 📁 Project Structure

```
NepaliBizzBusiness/
├── prisma/                 # Database schema and migrations
│   ├── migrations/        # Migration files
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts           # Database seeding script
├── scripts/               # Utility scripts
│   └── test-db-connection.ts  # Database connection test
├── src/
│   ├── common/           # Shared utilities and decorators
│   ├── config/           # Configuration files
│   ├── database/         # Database module and services
│   ├── modules/          # Feature modules
│   │   └── health/      # Health check endpoint
│   ├── app.module.ts    # Root application module
│   └── main.ts          # Application entry point
├── .env                  # Environment variables (not in git)
├── .env.example         # Environment variables template
├── docker-compose.yml   # Docker services configuration
└── package.json         # Project dependencies and scripts
```

## 🌍 Environment Variables

See `.env.example` for all available environment variables with detailed comments.

### Key Variables

- `NODE_ENV`: Application environment (development/production/test)
- `PORT`: Application port (default: 3001)
- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGIN`: Allowed CORS origins
- `SWAGGER_ENABLED`: Enable/disable API documentation

## 👥 Team Collaboration

### Before Pushing Code

**Always run these checks before pushing:**

```bash
# 1. Test database connection
yarn test:db

# 2. Run linter
yarn lint

# 3. Run tests
yarn test

# 4. Ensure migrations are up to date
yarn prisma:migrate
```

## 🏥 Health Check

The application includes a health check endpoint:

```
GET http://localhost:3001/api/health
```

This endpoint checks:

- Application status
- Database connectivity
