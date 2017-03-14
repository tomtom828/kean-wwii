# Kean WWII Digital Library
A Freelance Web Development project to help the Kean University history department with their WWII archives.
Please view the website at [www.worldwariiscrapbook.com](http://www.worldwariiscrapbook.com).
The archives are a collection of letters from WWII soldiers written to a Kean librarian during the war.

This project was a continuation of the code developed by a [Kean Student](https://github.com/joseph-galindo/digital-library-kean), where PHP was replaced with NodeJS, the UI was re-done, and more pages and functionality were added.


## Functionality
On the backend, the app uses the `Express` server for `NodeJS` as well as `MySQL` to interact with a database of archive names, author information, and location cooridinates.

On the frontend, the app uses `Handlebars` for templating and `Bootstrap` as a styling framework. The app also uses `jQuery` and `AJAX` for a more responsive user experience.

The scanned copies of the archives, soldier photographs, and text transcripts of the archives are hosted on `Amazon S3`.

The application also uses the `Google Maps API` to plot each soldier's movement during WWII.


## Cloning down the repo
If you wish to clone the website down and run it on localhost...
  1. Ensure that you have MySQL and NodeJS set up on your laptop.
  2. Once you are set up, `cd` into this repo and run `npm install`.
  3. Then seed the database using MySQL Workbench.
      * The schema is found in `models/db.sql`.
      * Also double check that the localhost connnection is correct in `models/dbInfo.json`.
  4. Run the server with `node server.js`.
  5. Navigate to `localhost:8080` in your browser.


## Future Kean Developers!
Feel free to fork this repo.
Then refer to the documentation stored in keanwwiiscrapbook@gmail.com account.
The account's Google Drive will contain a document with instructions on how to add yourself as a corraborator.