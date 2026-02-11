# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema (needed before install because of postinstall script)
COPY prisma ./prisma

# Install dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile && \
    yarn cache clean --force

# Generate Prisma Client (explicit generation after install)
RUN npx prisma generate

# Copy source code
COPY . .

# Build application
RUN yarn run nest:build

# ================================
# Stage 2: Production
# ================================
FROM node:20-alpine AS production

# Set environment to production
ENV NODE_ENV=production

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && \
    yarn cache clean --force

# Copy built application from builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copy Prisma generated client
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Switch to non-root user
USER nestjs

# Expose application port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/main"]
