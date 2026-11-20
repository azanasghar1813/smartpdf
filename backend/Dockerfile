FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

RUN npm install --workspace=backend --workspace=shared

COPY backend ./backend
COPY shared ./shared

RUN npm run build --workspace=backend

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm install --omit=dev --workspace=backend

COPY --from=builder /app/backend/dist ./backend/dist

EXPOSE 5000

# Starts the cluster entrypoint, which dynamically forks workers if CLUSTER_MODE=true,
# or cleanly runs a single-instance server if CLUSTER_MODE=false
CMD ["node", "backend/dist/cluster.js"]
