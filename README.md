# Entertainment Event Search

**Entertainment Event Search** is a single page application that allows users to search for entertainment events on Ticketmaster and display the results in a table. Once the user clicks on an event, the webpage will show the detailed information of that event, including basic information, artist/team info, venue info and upcoming events. There is also a favorites list, and users can add or remove events from the list to save events they like.

The highlight of the application is that it integrates information from different APIs and displays it in a very clear way. So instead of switching between different websites, uses can save their time and get all the information they need in a single webpage.

This project has been deployed on AWS (http://entertainment-event-search.us-west-1.elasticbeanstalk.com/)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.3.

## How to run a development server

### Backend

1. Make sure you have installed Node.js.

2. Under the project folder, run `NODE_ENV=development node server.js`. The backend will be hosted on `http://localhost:3000/`.

3. You can test the server using following links (make sure the backend works before you move to frontend):  
   `http://localhost:3000/api/autocomplete?keyword=lakers`  
   `http://localhost:3000/api/search?keyword=lakers&catagory=all&distance=10&unit=miles&lat=34.0266&lng=-118.283`  
   `http://localhost:3000/api/search?keyword=Lady+gaga&catagory=all&distance=10&unit=miles&location=las+vegas`  
   `http://localhost:3000/api/detail?id=G5eYZ4YJsDZlT`  
   `http://localhost:3000/api/music?keyword=Maroon+5&index=0`  
   `http://localhost:3000/api/image?keyword=Maroon+5`  
   `http://localhost:3000/api/venue?keyword=STAPLES+Center`  
   `http://localhost:3000/api/upcoming?keyword=STAPLES+Center`

### Frontend

1. After hosting backend, in another terminal, run `ng serve` for a dev frontend server.

2. After you see "Complile successfully", navigate to `http://localhost:4200/` to view the webpage. The app will automatically reload if you change any of the source files.

3. After you are done, use `^C` to terminate both processes.

## How to deploy on AWS

### Build the frontend

1. Create a new web server enviroment on Elastic Beanstalk. Choose the Node.js preconfigured platform.

2. After you set your domain name (for example, http://entertainment-event-search.us-west-1.elasticbeanstalk.com/), open file `environment.prod.ts`, and change the apiUrl field in the enriroment object to your domain name. Save the project.

3. Run `ng build --prod` to build the project. The build artifacts will be stored in the `dist/` directory. The `--prod` flag is for a production build.

### Upload to AWS

1. After the build is done, compress `server.js`, `package.json` and `dist/` folder into an archive named `Archive.zip`. Upload the archive to AWS and deploy it.

2. Add an environment property `NODE_ENV` with value `production` (Configuration - Software - Environment properties).

3. After the status change to "Ok", you can navigate to your domain of choice to view your event search web app.
