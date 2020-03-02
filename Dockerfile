FROM node:10

RUN mkdir -p /usr/src/app/awaks-server
# Specify working directory
WORKDIR /usr/src/app/awaks-server

# Copy only the package.json
COPY package*.json /usr/src/app/awaks-server/

# Install dependencies
RUN npm install

# If dependencies are installed, copy the rest of the project
COPY . /usr/src/app/awaks-server
# Expose app port
EXPOSE 8080

# Start the application
CMD ["yarn", "dev"]


 # -------------------
 # --- Nginx setup ---
 # -------------------

# Use stable version of Nginx
FROM nginx:stable

# Remove old default nginx conf
RUN rm /etc/nginx/conf.d/default.conf

# Copy Nginx configuration into the real server
COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
