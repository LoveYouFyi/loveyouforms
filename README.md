# LoveYouForms - Node.js Application

## A RESTful JavaScript cloud app to manage form submissions for one site or 1,000

### Features
* Google Sheets Sync
* Email Notifications
* Spam Filter with Akismet
* Deployed to cloud Firebase, makes use of Firestore database

### This repo is the app-wrapper, find the primary codebase at ❤️ **<a href="https://github.com/LoveYouFyi/loveyouforms-package">loveyouforms-package</a>** ❤️

# Quick Start - To view the Node Package Code

Purpose of this quick-start is to get the codebase onto your local environment for viewing purposes only. These steps presently do not include setting up a local development environment.

## Option #1 - Without Git
**If you do not have access to Git and want to view the node package code:**

Go to **<a href="https://github.com/LoveYouFyi/loveyouforms-package">loveyouforms-package</a>** where you can view the code directly on Github.com or download as a zip file.

## Option #2 - Using Git

1. Clone or download this repository

2. $ cd functions/

3. $ git submodule init

4. $ git submodule update

5. View the code:

  * **Main file** is /functions/index.js - when executed outside of Firebase cloud, makes use of the development version of the loveyouforms package from the following directory...

  * **loveyouforms development version of package** /functions/dev/loveyouforms-package/

  * **Starter database** /functions/database/

  * **Environment variables** /functions/env/

6. **Quick Start is not yet complete** -more documentation coming soon so you can develop locally or deploy to the Firebase platform.
