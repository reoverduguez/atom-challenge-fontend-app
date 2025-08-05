# Atom Challenge Angular App Solution

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.6.  
The UI was built using [Angular Material](https://material.angular.dev/components/categories) components.  
Code quality and consistent formatting are enforced using **Prettier** and **ESLint**.

User-friendliness and accessibility were prioritized throughout the development process of this app. As well as robust and consistent error handling to ensure a smooth and reliable user experience.

## Features
- Authentication using Firebase
- Task management with protected routes
- HTTP interceptor for handling tokens
- Modular and scalable folder structure
- State management with NgRx
- Clean Material UI interface

## Deploy to Firebase Hosting
1. Build the production version of the app:
```bash
npm run build:prod
```
This generates the dist/ directory that Firebase Hosting uses to serve the site.

2. Deploy to Firebase
```bash
npm run deploy
```

The app is currently live at:
[https://atom-challenge-bdff6.firebaseapp.com](https://atom-challenge-bdff6.firebaseapp.com)

## Testing
Robust tests for written for all components using Karma and Jasmine. You can run tests with
```bash
npm run test
```
