FROM node:24-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

# The SQLite database lives in /app/data (mounted as a volume by docker-compose.yml).
RUN mkdir -p data && chown node:node data
USER node

EXPOSE 3000
CMD ["node", "src/server.js"]
