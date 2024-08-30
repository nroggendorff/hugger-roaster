# Dockerfile

# Use an official Node.js runtime as the base image
FROM node:18

USER 1000

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY --chown=1000 package.json package-lock.json ./

# Install dependencies
RUN npm install

VOLUME /data

# Copy the rest of the application files to the container
COPY --chown=1000 . .
RUN chmod +x entrypoint.sh

# Build the Next.js application for production
# RUN npm run build

# Expose the application port (assuming your app runs on port 3000)
EXPOSE 3000

RUN npx prisma generate

# Start the application
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]