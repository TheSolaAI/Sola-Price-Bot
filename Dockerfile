
FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Copy the rest of the app files
COPY . .

# Expose a port (optional, not required for Discord bots)
EXPOSE 3000

CMD ["npm", "start"]
