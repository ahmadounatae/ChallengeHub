# Use official Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the project directory to the container
COPY . .

# Expose the port your backend runs on (e.g., 3000)
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
