FROM node:16.19.1-alpine AS builder

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:16.19.1-alpine

ENV NODE_ENV production

USER node

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm ci --production

COPY --from=builder /app/dist ./dist

CMD npm run start:prod

EXPOSE 3000