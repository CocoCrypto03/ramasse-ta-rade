# syntax=docker/dockerfile:1
#
# Image de test de Ramasse ta rade. La construction lance le lint puis le
# build : si l'image se construit, le code compile.
#
#   docker compose up --build     → http://localhost:3000

# Debian (glibc) plutôt qu'Alpine : le package-lock ne contient les binaires
# natifs de sharp que pour glibc.
FROM node:22.12.0-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# --- Dépendances (couche mise en cache tant que le lockfile ne change pas)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# --- Lint + build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run lint && npm run build

# --- Image finale : uniquement la sortie standalone de Next.js
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DEMO_STORE_DIR=/app/stockage
RUN mkdir stockage && chown node:node stockage
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
