# Part of Speech Activity

In English language, words can be categorized according to their syntactic functions, which is known as "Part of Speech". Examples of part of speech: (noun, verb, adjective, adverb,...)

This application helps the students practice categorizing a
set of words according to their part of speech.

## Overview
- The application fetch a list of random selected words from rest api. 
- Shows the student one word each time and below the word there are four buttons respresenting for options of part of
speech (noun, adverb, adjective, or verb).
- After finish the activity a result display is shown with the student rank with the ability to try the activity again.

## Getting started
To run the application the repository contains two folders :
- Server-side 
    - express.js with TypeScript REST Api 
        1. Go to Server-side folder using `cd Server-side`.
        2. Run `npm install` to install dependances.
        3. Run `npm start` to start the server on port 8080 by default (to change the port go to `.env` file and change it). 

- Client-side 
    - React application 
        1. Go to Server-side folder using `cd Client-side\part-of-speech-client\`
        2. Run `npm install` to install dependances.
        3. Run `npm start` to start the application on port 3000 by default.
    - To change the domain of the REST api go to `.env` inside `part-of-speech-client` folder and change it.

## Deployment
- You can check the application on: 
    >https://part-of-speech-v1.herokuapp.com/
         
   