# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.18.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Next.js/Prisma"

# Next.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=10.0.0
RUN npm install -g pnpm@$PNPM_VERSION

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install node modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Generate Prisma Client
COPY prisma .
RUN npx prisma generate

# Copy application code
COPY . .

# Build application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && apt-get install --no-install-recommends -y openssl && rm -rf /var/lib/apt/lists /var/cache/apt/archives

RUN apt-get update -y && apt-get install -y ca-certificates fuse3 sqlite3

# Copy built application
COPY --from=build /app /app

COPY --from=flyio/litefs:0.5.11 /usr/local/bin/litefs /usr/local/bin/litefs

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENTRYPOINT litefs mount
