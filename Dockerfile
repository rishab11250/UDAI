# Stage 1: Build the React Frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY vite.config.js ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY src ./src
COPY public ./public
COPY index.html ./

# Build the frontend (outputs to /dist)
RUN npm run build

# Stage 2: Setup the Production Server
FROM node:18-alpine AS runner

WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/

# Install ONLY production dependencies for backend
cd server && npm install --production

# Copy backend source code
COPY server ./server

# Copy built frontend from Stage 1
COPY --from=builder /app/dist ./dist

# Create a directory for the database to ensure volume mounting works smoothly
RUN mkdir -p /app/server/data

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server/server.js"]
