FROM node:16.3-alpine

ENV ENV=production
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# RUN npm install --production --silent && mv node_modules ../
# We want to install everything, including dev dependencies, because
# our build command runs `tsc` which is a dev dependency.
RUN npm install --include=dev --silent

COPY . .

RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
