---

layout:     post
title:      "PSI installation Guide"
date:       2017-04-24
author:     "Gitai"
categories:
    - Uzuki
tags:
    - 记录

---

>这其实是个外包，大概 $50

* Ubuntu 14.04 x64


Install Apache2 + MySQL5.2 + PHP5.x env

```
# sudo tasksel install lamp-server
```

Clone repo in `/var/www/html`

```
# git clone https://git.oschina.net/crm8000/PSI.git
```

```
/var/www/html$ tree
.
├── index.php
├── info.php
├── phpmyadmin -> /usr/share/phpmyadmin/
└── psi -> /usr/share/PSI/

2 directories, 2 files
```

<!--more-->

Url rewrite at `/etc/apache2/sites-enabled/000-default.conf`

```conf
<VirtualHost *:80>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.
        #ServerName www.example.com

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        <Directory "/var/www/html">
                AllowOverride all
                #Options Indexes FollowSymLinks
                Options FollowSymLinks INCLUDES IncludesNOEXEC
                
                Order allow,deny
                Allow from all
                DirectoryIndex index.php
                AddOutputFilter Includes .php

                #ErrorDocument 404 /errorhtml/error.html
                #ErrorDocument 403 /errorhtml/error.html
        </Directory>

        # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined

        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf
</VirtualHost>
```

Restart Apache

```
sudo service apache2 restart
```

brower here: http://107.180.102.3/psi
username: admin
password: admin