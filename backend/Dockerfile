FROM node:18-alpine

# Install LibreOffice and dependencies
RUN apk add --no-cache \
    libreoffice \
    libreoffice-base \
    qpdf \
    ttf-dejavu \
    fontconfig

# Set up work directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 5000
CMD ["node", "server.js"]