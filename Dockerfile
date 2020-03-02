# Use the lightest version of NodeJS
FROM node:10

RUN mkdir -p /usr/src/app/awaks-server
# Specify working directory
WORKDIR /usr/src/app/awaks-server

# Copy only the package.json
COPY package*.json /usr/src/app/awaks-server/

# Install dependencies
RUN yarn

# If dependencies are installed, copy the rest of the project
COPY . /usr/src/app/awaks-server
# Expose app port
EXPOSE 8080

# Start the application
CMD ["yarn", "dev"]