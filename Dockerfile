# syntax=docker/dockerfile:1
# Imagen de producción de "Vales de riego" (Next.js standalone, Node 22).
# Migraciones: servicio one-shot `migrate` del compose (misma imagen, ver deploy/README.md).

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Instala exactamente la versión de pnpm fijada en package.json ("packageManager").
RUN corepack install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build && pnpm build:scripts

FROM node:22-bookworm-slim AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
RUN groupadd --system --gid 1001 app && useradd --system --uid 1001 --gid app app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
# Scripts de operación (empaquetados con esbuild; argon2 sale del node_modules del standalone)
COPY --from=build --chown=app:app /app/dist-scripts ./scripts
COPY --from=build --chown=app:app /app/drizzle ./drizzle
USER app
EXPOSE 3000
CMD ["node", "server.js"]
