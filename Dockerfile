FROM node:18-alpine AS base

##### DEPENDENCIES

FROM base AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./prisma/

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
 if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
 elif [ -f package-lock.json ]; then npm ci; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### BUILDER

FROM base AS builder

ENV DATABASE_URL=postgres://postgres:postgres@0.0.0.0:5432/postgres
ENV ANALYZE=false
ENV DISABLE_PWA=true

ENV S3_UPLOAD_KEY=secret
ENV S3_UPLOAD_SECRET=secret

ARG S3_UPLOAD_BUCKET
ENV S3_UPLOAD_BUCKET=$S3_UPLOAD_BUCKET
ARG S3_UPLOAD_HOSTNAME
ENV S3_UPLOAD_HOSTNAME=$S3_UPLOAD_HOSTNAME
ARG S3_UPLOAD_ENDPOINT_URL
ENV S3_UPLOAD_ENDPOINT_URL=$S3_UPLOAD_ENDPOINT_URL
ENV S3_UPLOAD_REGION=ru-central
ARG NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS
ENV NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS=$NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS

ENV OPENAI_API_KEY=sk-secret

ENV UPSTASH_REDIS_REST_URL=http://localhost:6379
ENV UPSTASH_REDIS_REST_TOKEN=default

ENV NEXTAUTH_SECRET=secret
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000

ENV MIREA_CLIENT_ID=default
ENV MIREA_CLIENT_SECRET=default

ENV GOOGLE_CLIENT_ID=default
ENV GOOGLE_CLIENT_SECRET=default

ENV GITHUB_CLIENT_ID=default
ENV GITHUB_CLIENT_SECRET=default

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN \
 if [ -f yarn.lock ]; then yarn build; \
 elif [ -f package-lock.json ]; then npm run build; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm run build; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### RUNNER

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# TODO: Remove this line after fix
# https://github.com/vercel/next.js/issues/48077
# https://github.com/vercel/next.js/issues/48173
COPY --from=builder /app/node_modules/next/dist/compiled/jest-worker ./node_modules/next/dist/compiled/jest-worker

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "production"]
