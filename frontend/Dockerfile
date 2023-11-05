# First stage: Install dependencies
FROM node:18.17-alpine as deps

WORKDIR /app

COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn ./.yarn/
RUN yarn install

# Second stage: Build the application
FROM node:18.17-alpine as builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn ./.yarn/

RUN yarn build

# Production image, copy all the files and run next
FROM node:18.17-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/build ./build
COPY --from=builder /app/.yarn/ ./.yarn/

CMD ["yarn", "dlx", "serve",  "-s", "build"]