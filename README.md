# Love You Forms

## A JavaScript cloud app to manage form submissions for one site or 1,000

## Featuring

* Firebase Database & Node.js Cloud Functions

* Google Sheets Sync

* Email Notifications & Spam Filter

## Quick Start - Dev

1. Clone repository

2. $ cd functions

3. $ npm install

4. $ git submodule init

5. $ git submodule update

6. View the code:

  * **Main file** is index.js - when executed outside of Firebase cloud, makes use of the development version of the loveyouforms package from the following directory...

  * **loveyouforms development version of package** /functions/dev/loveyouforms-package/

  * **Starter database** /database/

  * **Environment variables** /env/

7. **Quick Start is not yet complete** -more documentation coming soon so you can develop locally or deploy to the Firebase platform.

## Quick Start - Prod

1. Clone repository

2. $ cd functions

3. npm install

4. View the code:

  * **Main file** is index.js - when executed witin the Firebase cloud, makes use of the production version of the loveyouforms package from the following directory...

  * **loveyouforms production version of package** /functions/node_modules/loveyouforms/

  * **Starter database** /database/

  * **Environment variables** /env/

5. **Quick Start is not yet complete** -more documentation coming soon so you can develop locally or deploy to the Firebase platform.