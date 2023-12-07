FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any necessary dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .


EXPOSE 3000


CMD ["node", "app.js"]
