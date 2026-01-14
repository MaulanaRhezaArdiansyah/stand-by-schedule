FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port for health check
EXPOSE 10000

# Start the scheduler
CMD ["bun", "run", "src/server/index.ts"]
