# Database Connection Test Checklist

This checklist ensures your database is properly configured before pushing code to GitHub.

## ✅ Pre-Push Checklist

Run through this checklist before pushing your code:

### 1. Environment Setup

- [ ] `.env` file exists and is configured
- [ ] `DATABASE_URL` is set correctly
- [ ] Docker is running
- [ ] Database container is running (`docker ps` shows `nepali-biz-business-db`)

### 2. Database Tests

Run the database connection test:

```bash
yarn test:db
```

Expected results:

- [ ] ✅ Environment Variable Check - PASSED
- [ ] ✅ Database Connection - PASSED
- [ ] ✅ Execute Simple Query - PASSED
- [ ] ✅ Database Version Check - PASSED
- [ ] ✅ Migration Status Check - PASSED
- [ ] ✅ Table Access Check - PASSED
- [ ] ✅ Write Operation Test - PASSED

**Success Rate should be 100%**

### 3. Application Health Check

With the dev server running (`yarn dev`), test the health endpoint:

```bash
curl http://localhost:3001/api/health
```

Expected response:

- [ ] Status code: 200
- [ ] `status`: "ok"
- [ ] `database.status`: "up"

### 4. Code Quality

- [ ] Run linter: `yarn lint` (no errors)
- [ ] Run tests: `yarn test` (all passing)
- [ ] Code is formatted: `yarn format`

### 5. Git Status

- [ ] `.env` is NOT staged (should be in `.gitignore`)
- [ ] All necessary files are staged
- [ ] Commit message follows conventional commits format

## 🚨 Common Issues and Solutions

### Issue: Database Connection Failed

**Symptoms:**

- Test 2 (Database Connection) fails
- Error: "Can't reach database server"

**Solutions:**

```bash
# Check if Docker is running
docker ps

# Restart database
docker compose down
docker compose up nepali-biz-business-db -d

# Wait 10-15 seconds, then test again
sleep 15
yarn test:db
```

### Issue: Migrations Not Applied

**Symptoms:**

- Test 5 (Migration Status) fails or shows 0 migrations
- Test 6 (Table Access) fails

**Solutions:**

```bash
# Run migrations
yarn prisma:migrate

# If that fails, reset database
docker compose down -v
docker compose up nepali-biz-business-db -d
sleep 15
yarn prisma:migrate
```

### Issue: Port Already in Use

**Symptoms:**

- Application won't start
- Error: "Port 3001 is already in use"

**Solutions:**

1. Change `PORT` in `.env` to a different port (e.g., 3002)
2. Or kill the process using the port:

```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)
```

### Issue: Database Port Conflict

**Symptoms:**

- Docker container won't start
- Error: "Port 5434 is already in use"

**Solutions:**

1. Change the host port in `docker-compose.yml`:

```yaml
ports:
  - '5435:5432' # Change 5434 to 5435
```

2. Update `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/nepali_biz_business?schema=public"
```

## 📝 Team Collaboration Notes

### For New Developers

When setting up the project for the first time:

1. **Clone and Install**

   ```bash
   git clone <repo-url>
   cd NepaliBizzBusiness
   yarn install
   ```

2. **Configure Environment**

   ```bash
   cp .env.example .env
   # Review and update .env if needed
   ```

3. **Start Database**

   ```bash
   docker compose up nepali-biz-business-db -d
   sleep 15
   ```

4. **Run Migrations**

   ```bash
   yarn prisma:migrate
   ```

5. **Verify Setup**

   ```bash
   yarn test:db
   ```

6. **Start Development**
   ```bash
   yarn dev
   ```

### Before Every Push

Always run:

```bash
yarn test:db && yarn lint && yarn test
```

If all pass, you're good to push! 🚀

### Environment Variables

**NEVER commit `.env` file!**

The `.env` file contains sensitive information and local configuration. Always use `.env.example` as a template.

When adding new environment variables:

1. Add them to `.env.example` with documentation
2. Update this checklist if they affect database connectivity
3. Notify the team in your PR description

## 🎯 Quick Commands Reference

```bash
# Test database connection
yarn test:db

# Start database
docker compose up nepali-biz-business-db -d

# Stop database
docker compose down

# View database logs
docker compose logs nepali-biz-business-db -f

# Run migrations
yarn prisma:migrate

# Open database GUI
yarn prisma:studio

# Start dev server
yarn dev

# Run all pre-push checks
yarn test:db && yarn lint && yarn test
```

## ✨ Success Criteria

Your setup is complete when:

- ✅ `yarn test:db` shows 100% success rate
- ✅ Health endpoint returns status "ok"
- ✅ `yarn lint` passes with no errors
- ✅ `yarn test` passes all tests
- ✅ `yarn dev` starts without errors

**You're now ready to collaborate with the team! 🎉**
