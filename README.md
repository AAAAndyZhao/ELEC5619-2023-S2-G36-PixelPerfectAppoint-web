# ELEC5619-2023-S2-G36-PerfectPixelAppoint-web

**This is the front-end code repository for Group 36's assignment of ELEC5619 UoS in USYD 2023 S2.**

## 1 Requirements

| No. | Requirement | Description | Version | Required |
| --- | --- | --- | --- | --- |
| 1 | Node.js | Node.js together with npm | 18.14.1 | Yes |
| 2 | Chromium-based browser | Chromium-based browser (e.g. Google Chrome, Microsoft Edge, Brave Browser, etc.) | browsers with native ES2015 support | Yes |
| 3 | Nginx | Used as a web container in prodution mode | 1.24.0 | Required in production mode |

## 2 Libraries Dependencies

| No. | Category | Library | Description | Version |
| --- | --- | --- | --- | --- |
| 1 | Vue | vue | Framework | 3.3.4 |
| 2 | Vue | vue-router | Router | 4.2.4 |
| 3 | Vue | vuex | State management | 4.1.0 |
| 4 | Vue | vue-axios | Axios wrapper for Vue | 3.2.6 |
| 5 | Components | element-plus | UI components | 2.3.12 |
| 6 | Components | element-plus/icons-vue | Icons | 2.1.0 |
| 7 | Components | icon-park/vue-next | Icons | 1.4.2 |
| 8 | Components | flag-icon-css | Nations flag icons | 4.1.7 |
| 9 | Utilities | axios | HTTP client | 1.5.0 |
| 10 | Utilities | country-telephone-data | Country telephone data | 0.6.1 |
| 11 | Utilities | dayjs | Date and time management | 1.11.9 |
| 12 | Utilities | moment | Date and time management | 2.29.4 |
| 13 | Utilities | validator | Validation | 13.11.0 |
| 14 | Utilities | imagesloaded | Image loading | 5.0.0 |
| 15 | Utilities | masonry-layout | Masonry layout implementation | 4.2.2 |
| 16 | Google SDK | googlemaps/js-api-loader | Google Maps JavaScript API loader | 1.2.1 |
| 17 | Build | vite | Build tool | 4.4.5 |
| 18 | Build | vitejs/plugin-vue | Vue 3 plugin for Vite | 4.2.3 |
| 19 | Build | vite-plugin-rewrite-all | Rewrite all URLs in Vite | 1.0.1 |

## 3 Installation (development mode)

1. Clone the repository to your local machine.
2. Open a terminal and navigate to the repository.
3. Run `npm install` to install the dependencies.
4. Config SERVER_HOST variable in /public/public.config.js which is the host of the server-side application. E.g., ```$PUBLIC.SERVER_HOST=http://localhost:8080```.
5. Run `npm run dev` to start the server in development mode.
6. Record the URL shown in the terminal, which should be configured in server-side application related to email functionalities (the links in emails). E.g. (by default), ```app.web.url-prefix=http://localhost:5173/``` in server ```application.properties``` file.
7. Deloy the server-side application following the Readme file in the server-side repository.
8. Open a Chromium-based browser and navigate to the URL shown in the terminal.

## 4 Installation (production mode)

1. Clone the repository to your local machine.
2. Open a terminal and navigate to the repository.
3. Run `npm install` to install the dependencies.
4. Config SERVER_HOST variable in /public/public.config.js which is the host of the server-side application. E.g., ```$PUBLIC.SERVER_HOST=http://localhost:8080```.
5. Run `npm run build` to build the project.
6. Copy the content of ```.dist``` folder to a new folder as the root directory of nginx server.
7. Create a new .conf file under nginx configuration folder. E.g., ```/etc/nginx/conf.d/ppa_web.conf``` in Linux/Unix system or ```C:\nginx\conf\ppa_web.conf``` in Windows system.
8. Wrire the following content (you can change port if you wish) in the .conf file. Note that the ```root``` should be the path of the folder created in step 6. Here is an example:

    ``` nginx
    server {
        listen 3000; 
        server_name localhost;
        root D:/Workspace/old-phone-deals-web/;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
    ```
    ``` nginx
    server {
        listen 3000;
        server_name localhost;

        # ssl config
        # listen 443 ssl;
        # ssl_certificate /etc/ssl/certs/www.pixelperfectappoint.cc_bundle.crt;
        # ssl_certificate_key /etc/ssl/private/www.pixelperfectappoint.cc.key;
        # server_name www.pixelperfectappoint.cc;

        root /home/andy/docker-space/ppa/ppa-web;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
        error_page 404 /index.html;
    }
    ```


9. Make sure this conf file is included in the .conf file in nginx.conf. (By defaul, *.conf in conf.d will be included). If not, include the .conf file, E.g., ```include /etc/nginx/conf.d/ppa_web.conf;``` in Linux/Unix system or ```include C:\nginx\conf\ppa_web.conf;``` in Windows system. Here is an exmaple:

    ``` nginx
    # ...
    http {
        include       ppa_web.conf;
        # ...
    }
    # ...
    ```
10. start nginx server. Try to access the home page of the application in a Chromium-based browser. E.g., ```http://localhost:3000```. If you can see the home page, the installation is successful. (it is normal that you cannot see the content of pages because the server-side application is not deployed yet.)
11. Record the URL shown in the terminal, which should be configured in server-side application related to email verification functionalities. E.g. (by default), ```app.web.url-prefix=http://localhost:3000/``` in server ```application.properties``` file.
12. Deloy the server-side application following the Readme file in the server-side repository.
13. Try to access the home page again. If you can see the content of the home page, the installation is successful.

## 5 Functionalities

**The functionalities section is quite similar to the functionalities and presentation layer sections in the submitted report. Just copy the report sections and screenshots**




