FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
#COPY cuisine-connect/package.json cuisine-connect/yarn.lock* cuisine-connect/package-lock.json* cuisine-connect/pnpm-lock.yaml* ./
COPY cuisine-connect/*.json* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile ; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY ./cuisine-connect/hooks ./hooks
COPY ./cuisine-connect/lib ./lib
COPY ./cuisine-connect/prisma ./prisma
COPY ./cuisine-connect/public ./public
COPY ./cuisine-connect/src ./src
COPY ./cuisine-connect/next.config.js .
COPY ./cuisine-connect/tsconfig.json .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

# Start Next.js in development mode based on the preferred package manager
#CMD \
#  if [ -f yarn.lock ]; then yarn dev; \
#  elif [ -f package-lock.json ]; then npm run dev; \
#  elif [ -f pnpm-lock.yaml ]; then pnpm dev; \
#  else yarn dev; \
#  fi
