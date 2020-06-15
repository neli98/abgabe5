# abgabe5
# Copyright by Cornelius Zerwas

# description of the functionality
This is a client - server - database application.
The given code provides two different webpages. Both webpages show information about the busstops in Münster.
The first (and main-) page provides the opportunity to show the next busstop and the departure times of different buslines based on a given location. In fact, it provides a GET-functionality of information that is stored in a database.
The second page provides the opportunity to CREATE, UPDATE and DELETE locations on which the calculations of the first page are based. This information is stored in a database.

# installation
To execute the provided code it is necessary to install the following:
npm
body-parser 1.19.0
express 4.17.1
jquery 3.5.1
mongodb 3.5.8

To execute the code, please install npm by using “npm install” in cmd/terminal.
Now set the file path by the use of “cd” and the provided folder “Abgabe5”. After installation of npm, the other named packages and your mongodb database, execute “npm start”. Now the pages are available and ready to be used. Therefore, use http://localhost:3000 in your web browser.
