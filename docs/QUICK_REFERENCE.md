# Quick Reference - Database Testing

## 🚀 Quick Start (New Developer)

```bash
# 1. Clone and setup
git clone <repo-url> && cd NepaliBizzBusiness
yarn install
cp .env.example .env

# 2. Start database
docker compose up nepali-biz-business-db -d

# 3. Setup database
yarn prisma:migrate

# 4. Verify everything works
yarn test:db

# 5. Start developing
yarn dev
```

## ✅ Pre-Push Checklist

```bash
# Run all checks at once
yarn test:db && yarn lint && yarn test
```

If all pass → You're good to push! 🎉

## 🔧 Common Commands

| Command               | Description              |
| --------------------- | ------------------------ |
| `yarn test:db`        | Test database connection |
| `yarn dev`            | Start development server |
| `yarn lint`           | Check code quality       |
| `yarn lint:fix`       | Fix linting issues       |
| `yarn test`           | Run tests                |
| `yarn prisma:migrate` | Run migrations           |
| `yarn prisma:studio`  | Open database GUI        |

## 🐳 Docker Commands

| Command                                         | Description                    |
| ----------------------------------------------- | ------------------------------ |
| `docker compose up nepali-biz-business-db -d`   | Start database                 |
| `docker compose down`                           | Stop all services              |
| `docker compose logs nepali-biz-business-db -f` | View database logs             |
| `docker compose down -v`                        | Reset database (deletes data!) |
| `docker ps`                                     | Check running containers       |

## 🚨 Troubleshooting

### Database won't connect?

```bash
docker compose down
docker compose up nepali-biz-business-db -d
sleep 15
yarn test:db
```

### Migrations not applied?

```bash
yarn prisma:migrate
```

### Port already in use?

```bash
# Change PORT in .env
# Or kill the process:
kill -9 $(lsof -ti:3001)
```

### Fresh start?

```bash
docker compose down -v
docker compose up nepali-biz-business-db -d
sleep 15
yarn prisma:migrate
yarn test:db
```

## 📊 Expected Test Output

```
✅ PASSED: DATABASE_URL is set
✅ PASSED: Connected to database
✅ PASSED: Query executed successfully
✅ PASSED: Database version retrieved
✅ PASSED: Found 1 migration(s)
✅ PASSED: Example table is accessible
✅ PASSED: Write operations working

Success Rate: 100.0%
```

## 🔗 Useful URLs

- API: http://localhost:3001/api
- Swagger Docs: http://localhost:3001/api/docs
- Health Check: http://localhost:3001/api/health

## 📚 Documentation

- Full setup guide: `README.md`
- Detailed checklist: `docs/DATABASE_SETUP_CHECKLIST.md`
- Test summary: `docs/DATABASE_CONNECTION_TEST_SUMMARY.md`

## 💡 Pro Tips

1. **Always run `yarn test:db` before pushing**
2. **Keep `.env` file private** (never commit it)
3. **Use `docker compose logs -f` to debug database issues**
4. **Run `yarn lint:fix` to auto-fix formatting**
5. **Check health endpoint to verify app is running**

## 🎯 Success Criteria

Your setup is complete when:

- ✅ `yarn test:db` → 100% success
- ✅ `yarn lint` → No errors
- ✅ `yarn dev` → Server starts
- ✅ Health endpoint → Returns "ok"

---

**Need help?** Check the full documentation or ask the team!
