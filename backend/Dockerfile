# Stage 1: Compile typescript source code to dist/
FROM node:16.3-alpine AS typescript-compiler

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# We want to install everything, including dev dependencies, because
# our build command runs `tsc` which is a dev dependency.
RUN npm ci --include=dev --silent

COPY . .

RUN npm run build

# Stage 2: Copy built source code and install only production dependencies, then run server
FROM node:16.3-alpine AS built-code-runner

WORKDIR /usr/src/app

ENV ENV=production
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm ci --silent

COPY --from=typescript-compiler /usr/src/app/build build

# Useful for debugging, just shows what's in WORKDIR
RUN [ "ls", "-la" ]
RUN ["du", "-h", "node_modules"]

EXPOSE 5000

CMD ["npm", "start"]
