FROM oven/bun:1.0.0

WORKDIR /app
COPY . .

RUN bun install

CMD ["bun", "run", "src/index.ts"]
