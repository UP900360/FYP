# steps for application

Step 1: do npm i

Step 2: npm start

First of all I would like to say that this has proven a very challenging work for me and thanks
for the help and support you have shown throught the course. So the way my application works is
that when you do npm start it will create a database using sqlite. You will then need to press choose
file and then press the upload file button. When you do this for the first time nothing will happen since
there is nothing to compare it to, so you then will have to manually choose a file again and press the upload
file button again. After you have done this a similarity report will appear by show the similarity percentage
between all files. After that everytime you upload a new file it will show the file name and similarity percentage
each time. The files uploaded have a unique id assigned to their filname and path  that is stored in the sqlite
database in a table called uploadefiles. So the basic use is : upload a file and then shows the similarity percentage
with all the other files and a similarity report.
