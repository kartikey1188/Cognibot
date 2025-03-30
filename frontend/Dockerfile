FROM node:20-alpine

WORKDIR /frontend

COPY package.json yarn.lock ./

# Clean install including dev dependencies
RUN yarn install --frozen-lockfile --production=false

COPY . .

# Add build step for production
RUN yarn build

EXPOSE 5173

# Use production server instead of dev server
CMD ["yarn", "preview", "--host", "--port", "5173"]