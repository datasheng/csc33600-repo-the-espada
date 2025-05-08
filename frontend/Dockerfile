# Use a Node.js base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Ensure node user owns the working directory
RUN chown -R node:node /app

# Switch to node user
USER node

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY --chown=node:node . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
