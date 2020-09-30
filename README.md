# RESTful API Server NodeJS

Simple REST API Server written in NodeJS, accepting CORS Requests and designed with MVC Pattern.

---

## Getting Started

### Run NodeJS Server in production

1. Install **PM2**: `sudo npm install pm2 -g`
2. Set the environment: `NODE_ENV=production`
3. Start the NodeJS application: `pm2 start app.js --name <APP-NAME>`
4. Save the list of started processes in order to be restarted at machine reboot: `pm2 save`

---

### Setup Apache as a Reverse Proxy for NodeJS

1. In the **ExpressJS** app set this attribute: `app.set('trust proxy', 'loopback');`
2. Go into the **Apache** configuration directory: `cd /etc/apache2/sites-available`
3. Create a new VirtualHost: `sudo touch foo.conf`
4. Edit it as follow:
    ```
    <Directory /var/www/foo>
      Require all granted
    </Directory>

    <VirtualHost *:80>
      ServerName foo.com
      ServerAlias www.foo.com
      ServerAdmin hello@foo.com
      DocumentRoot /var/www/foo
      ErrorLog ${APACHE_LOG_DIR}/foo_error.log
      CustomLog ${APACHE_LOG_DIR}/foo_access.log combined
      ProxyRequests On
      ProxyPass / http://localhost:3000/
      ProxyPassReverse / http://localhost:3000/
    </VirtualHost>
    ```
5. Enable the new site: `sudo a2ensite foo`
6. Reload Apache: `sudo service apache2 reload`

---