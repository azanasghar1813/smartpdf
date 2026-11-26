# Multi-stage Dockerfile to build SimplePDF frontend static & prerendered SEO bundle
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/

RUN npm ci --workspace=frontend --workspace=shared --include-workspace-root

COPY . .

ARG VITE_SITE_URL=https://simplepdf.me
ARG VITE_GA_MEASUREMENT_ID=
ARG VITE_GSC_VERIFICATION=
ARG VITE_GOOGLE_ADSENSE_CLIENT_ID=

ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
ENV VITE_GSC_VERIFICATION=$VITE_GSC_VERIFICATION
ENV VITE_GOOGLE_ADSENSE_CLIENT_ID=$VITE_GOOGLE_ADSENSE_CLIENT_ID

RUN npm run build --workspace=frontend && npm run build:seo

FROM alpine:3.20 AS export
WORKDIR /out
COPY --from=builder /app/frontend/dist ./dist
CMD ["sh", "-c", "cp -r /out/dist/* /shared-dist/ && echo 'Frontend dist synced'"]
