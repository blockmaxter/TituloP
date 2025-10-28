"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
// Import the functions you need from the SDKs you need
var app_1 = require("firebase/app");
var analytics_1 = require("firebase/analytics");
var firestore_1 = require("firebase/firestore");
var auth_1 = require("firebase/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAXA9BLlrQ5L88E2yFlGRYUyj404Npz074",
    authDomain: "titulo-26999.firebaseapp.com",
    projectId: "titulo-26999",
    storageBucket: "titulo-26999.firebasestorage.app",
    messagingSenderId: "456678500203",
    appId: "1:456678500203:web:e788c386920b84155e8e2e",
    measurementId: "G-TMGEBM8PY9"
};
// Initialize Firebase
var app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(app);
exports.auth = (0, auth_1.getAuth)(app);
exports.default = app;
var analytics = (0, analytics_1.getAnalytics)(app);
