/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/context/UserContext.tsx":
/*!*************************************!*\
  !*** ./lib/context/UserContext.tsx ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   UserProvider: () => (/* binding */ UserProvider),\n/* harmony export */   useUser: () => (/* binding */ useUser)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/firestore */ \"firebase/firestore\");\n/* harmony import */ var _lib_firebase__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/firebase */ \"./lib/firebase.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_auth__WEBPACK_IMPORTED_MODULE_2__, firebase_firestore__WEBPACK_IMPORTED_MODULE_3__, _lib_firebase__WEBPACK_IMPORTED_MODULE_4__]);\n([firebase_auth__WEBPACK_IMPORTED_MODULE_2__, firebase_firestore__WEBPACK_IMPORTED_MODULE_3__, _lib_firebase__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n // Make sure these are your correct imports\nconst UserContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    user: null,\n    userData: null,\n    loading: true\n});\nconst UserProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [userData, setUserData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"UserProvider.useEffect\": ()=>{\n            const unsubscribeAuth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_2__.onAuthStateChanged)(_lib_firebase__WEBPACK_IMPORTED_MODULE_4__.auth, {\n                \"UserProvider.useEffect.unsubscribeAuth\": async (currentUser)=>{\n                    if (!currentUser) {\n                        // User is logged out\n                        setUser(null);\n                        setUserData(null);\n                        setLoading(false);\n                        return;\n                    }\n                    // User is logged in\n                    setUser(currentUser);\n                    const userDoc = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.doc)(_lib_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'users', currentUser.uid);\n                    const unsubscribeUser = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.onSnapshot)(userDoc, {\n                        \"UserProvider.useEffect.unsubscribeAuth.unsubscribeUser\": (snapshot)=>{\n                            if (snapshot.exists()) {\n                                setUserData(snapshot.data() || {});\n                            } else {\n                                // If the user doc doesn't exist or was deleted\n                                setUserData(null);\n                            }\n                            setLoading(false);\n                        }\n                    }[\"UserProvider.useEffect.unsubscribeAuth.unsubscribeUser\"], {\n                        \"UserProvider.useEffect.unsubscribeAuth.unsubscribeUser\": (error)=>{\n                            console.error('Error listening to user doc:', error);\n                            setUserData({});\n                            setLoading(false);\n                        }\n                    }[\"UserProvider.useEffect.unsubscribeAuth.unsubscribeUser\"]);\n                    // Cleanup user snapshot listener when user logs out or component unmounts\n                    return ({\n                        \"UserProvider.useEffect.unsubscribeAuth\": ()=>unsubscribeUser()\n                    })[\"UserProvider.useEffect.unsubscribeAuth\"];\n                }\n            }[\"UserProvider.useEffect.unsubscribeAuth\"]);\n            // Cleanup the auth state listener on unmount\n            return ({\n                \"UserProvider.useEffect\": ()=>unsubscribeAuth()\n            })[\"UserProvider.useEffect\"];\n        }\n    }[\"UserProvider.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(UserContext.Provider, {\n        value: {\n            user,\n            userData,\n            loading\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/tobe/H2SafetyDev/h2safety-ai/lib/context/UserContext.tsx\",\n        lineNumber: 64,\n        columnNumber: 5\n    }, undefined);\n};\nconst useUser = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(UserContext);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvY29udGV4dC9Vc2VyQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFzRTtBQUNwQjtBQUNFO0FBQ1gsQ0FBQywyQ0FBMkM7QUFRckYsTUFBTVMsNEJBQWNULG9EQUFhQSxDQUFrQjtJQUNqRFUsTUFBTTtJQUNOQyxVQUFVO0lBQ1ZDLFNBQVM7QUFDWDtBQUVPLE1BQU1DLGVBQWUsQ0FBQyxFQUFFQyxRQUFRLEVBQWlDO0lBQ3RFLE1BQU0sQ0FBQ0osTUFBTUssUUFBUSxHQUFHWiwrQ0FBUUEsQ0FBTTtJQUN0QyxNQUFNLENBQUNRLFVBQVVLLFlBQVksR0FBR2IsK0NBQVFBLENBQU07SUFDOUMsTUFBTSxDQUFDUyxTQUFTSyxXQUFXLEdBQUdkLCtDQUFRQSxDQUFDO0lBRXZDRCxnREFBU0E7a0NBQUM7WUFDUixNQUFNZ0Isa0JBQWtCZCxpRUFBa0JBLENBQUNHLCtDQUFJQTswREFBRSxPQUFPWTtvQkFDdEQsSUFBSSxDQUFDQSxhQUFhO3dCQUNoQixxQkFBcUI7d0JBQ3JCSixRQUFRO3dCQUNSQyxZQUFZO3dCQUNaQyxXQUFXO3dCQUNYO29CQUNGO29CQUVBLG9CQUFvQjtvQkFDcEJGLFFBQVFJO29CQUNSLE1BQU1DLFVBQVVmLHVEQUFHQSxDQUFDRyw2Q0FBRUEsRUFBRSxTQUFTVyxZQUFZRSxHQUFHO29CQUVoRCxNQUFNQyxrQkFBa0JoQiw4REFBVUEsQ0FDaENjO2tGQUNBLENBQUNHOzRCQUNDLElBQUlBLFNBQVNDLE1BQU0sSUFBSTtnQ0FDckJSLFlBQVlPLFNBQVNFLElBQUksTUFBTSxDQUFDOzRCQUNsQyxPQUFPO2dDQUNMLCtDQUErQztnQ0FDL0NULFlBQVk7NEJBQ2Q7NEJBQ0FDLFdBQVc7d0JBQ2I7O2tGQUNBLENBQUNTOzRCQUNDQyxRQUFRRCxLQUFLLENBQUMsZ0NBQWdDQTs0QkFDOUNWLFlBQVksQ0FBQzs0QkFDYkMsV0FBVzt3QkFDYjs7b0JBR0YsMEVBQTBFO29CQUMxRTtrRUFBTyxJQUFNSzs7Z0JBQ2Y7O1lBRUEsNkNBQTZDO1lBQzdDOzBDQUFPLElBQU1KOztRQUNmO2lDQUFHLEVBQUU7SUFFTCxxQkFDRSw4REFBQ1QsWUFBWW1CLFFBQVE7UUFBQ0MsT0FBTztZQUFFbkI7WUFBTUM7WUFBVUM7UUFBUTtrQkFDcERFOzs7Ozs7QUFHUCxFQUFDO0FBRU0sTUFBTWdCLFVBQVUsSUFBTTdCLGlEQUFVQSxDQUFDUSxhQUFZIiwic291cmNlcyI6WyIvVXNlcnMvdG9iZS9IMlNhZmV0eURldi9oMnNhZmV0eS1haS9saWIvY29udGV4dC9Vc2VyQ29udGV4dC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgb25BdXRoU3RhdGVDaGFuZ2VkIH0gZnJvbSAnZmlyZWJhc2UvYXV0aCdcbmltcG9ydCB7IGRvYywgb25TbmFwc2hvdCB9IGZyb20gJ2ZpcmViYXNlL2ZpcmVzdG9yZSdcbmltcG9ydCB7IGF1dGgsIGRiIH0gZnJvbSAnQC9saWIvZmlyZWJhc2UnIC8vIE1ha2Ugc3VyZSB0aGVzZSBhcmUgeW91ciBjb3JyZWN0IGltcG9ydHNcblxuaW50ZXJmYWNlIFVzZXJDb250ZXh0VHlwZSB7XG4gIHVzZXI6IGFueTsgLy8gQWRqdXN0IHRoZSB0eXBlIGFzIG5lZWRlZFxuICB1c2VyRGF0YTogYW55OyAvLyBBZGp1c3QgdGhlIHR5cGUgYXMgbmVlZGVkXG4gIGxvYWRpbmc6IGJvb2xlYW47XG59XG5cbmNvbnN0IFVzZXJDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxVc2VyQ29udGV4dFR5cGU+KHtcbiAgdXNlcjogbnVsbCxcbiAgdXNlckRhdGE6IG51bGwsXG4gIGxvYWRpbmc6IHRydWUsXG59KVxuXG5leHBvcnQgY29uc3QgVXNlclByb3ZpZGVyID0gKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pID0+IHtcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGU8YW55PihudWxsKVxuICBjb25zdCBbdXNlckRhdGEsIHNldFVzZXJEYXRhXSA9IHVzZVN0YXRlPGFueT4obnVsbClcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHVuc3Vic2NyaWJlQXV0aCA9IG9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCBhc3luYyAoY3VycmVudFVzZXIpID0+IHtcbiAgICAgIGlmICghY3VycmVudFVzZXIpIHtcbiAgICAgICAgLy8gVXNlciBpcyBsb2dnZWQgb3V0XG4gICAgICAgIHNldFVzZXIobnVsbClcbiAgICAgICAgc2V0VXNlckRhdGEobnVsbClcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIFVzZXIgaXMgbG9nZ2VkIGluXG4gICAgICBzZXRVc2VyKGN1cnJlbnRVc2VyKVxuICAgICAgY29uc3QgdXNlckRvYyA9IGRvYyhkYiwgJ3VzZXJzJywgY3VycmVudFVzZXIudWlkKVxuXG4gICAgICBjb25zdCB1bnN1YnNjcmliZVVzZXIgPSBvblNuYXBzaG90KFxuICAgICAgICB1c2VyRG9jLFxuICAgICAgICAoc25hcHNob3QpID0+IHtcbiAgICAgICAgICBpZiAoc25hcHNob3QuZXhpc3RzKCkpIHtcbiAgICAgICAgICAgIHNldFVzZXJEYXRhKHNuYXBzaG90LmRhdGEoKSB8fCB7fSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgZG9jIGRvZXNuJ3QgZXhpc3Qgb3Igd2FzIGRlbGV0ZWRcbiAgICAgICAgICAgIHNldFVzZXJEYXRhKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGxpc3RlbmluZyB0byB1c2VyIGRvYzonLCBlcnJvcilcbiAgICAgICAgICBzZXRVc2VyRGF0YSh7fSlcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKVxuICAgICAgICB9XG4gICAgICApXG5cbiAgICAgIC8vIENsZWFudXAgdXNlciBzbmFwc2hvdCBsaXN0ZW5lciB3aGVuIHVzZXIgbG9ncyBvdXQgb3IgY29tcG9uZW50IHVubW91bnRzXG4gICAgICByZXR1cm4gKCkgPT4gdW5zdWJzY3JpYmVVc2VyKClcbiAgICB9KVxuXG4gICAgLy8gQ2xlYW51cCB0aGUgYXV0aCBzdGF0ZSBsaXN0ZW5lciBvbiB1bm1vdW50XG4gICAgcmV0dXJuICgpID0+IHVuc3Vic2NyaWJlQXV0aCgpXG4gIH0sIFtdKVxuXG4gIHJldHVybiAoXG4gICAgPFVzZXJDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHVzZXIsIHVzZXJEYXRhLCBsb2FkaW5nIH19PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvVXNlckNvbnRleHQuUHJvdmlkZXI+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVVzZXIgPSAoKSA9PiB1c2VDb250ZXh0KFVzZXJDb250ZXh0KVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJvbkF1dGhTdGF0ZUNoYW5nZWQiLCJkb2MiLCJvblNuYXBzaG90IiwiYXV0aCIsImRiIiwiVXNlckNvbnRleHQiLCJ1c2VyIiwidXNlckRhdGEiLCJsb2FkaW5nIiwiVXNlclByb3ZpZGVyIiwiY2hpbGRyZW4iLCJzZXRVc2VyIiwic2V0VXNlckRhdGEiLCJzZXRMb2FkaW5nIiwidW5zdWJzY3JpYmVBdXRoIiwiY3VycmVudFVzZXIiLCJ1c2VyRG9jIiwidWlkIiwidW5zdWJzY3JpYmVVc2VyIiwic25hcHNob3QiLCJleGlzdHMiLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZVVzZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./lib/context/UserContext.tsx\n");

/***/ }),

/***/ "./lib/firebase.ts":
/*!*************************!*\
  !*** ./lib/firebase.ts ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   app: () => (/* binding */ app),\n/* harmony export */   auth: () => (/* binding */ auth),\n/* harmony export */   db: () => (/* binding */ db)\n/* harmony export */ });\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ \"firebase/app\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/firestore */ \"firebase/firestore\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__, firebase_firestore__WEBPACK_IMPORTED_MODULE_2__]);\n([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__, firebase_firestore__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\nconst firebaseConfig = {\n    apiKey: \"AIzaSyD_3fHuwWwssFztj0lIYyOulrq4p6Yv1HQ\",\n    authDomain: \"h2safetyfocused.firebaseapp.com\",\n    projectId: \"h2safetyfocused\",\n    storageBucket: \"h2safetyfocused.appspot.com\",\n    messagingSenderId: \"435674253454\",\n    appId: \"1:435674253454:web:1f4ef81b3ee289ff6561df\"\n};\n// Initialize Firebase\nconst app = !(0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.getApps)().length ? (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(firebaseConfig) : (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.getApp)();\n// Get Auth and Firestore instances\nconst auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.getAuth)(app);\nconst db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getFirestore)(app);\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvZmlyZWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQTZEO0FBQ3RCO0FBQ1U7QUFFakQsTUFBTUssaUJBQWlCO0lBQ3JCQyxRQUFRQyx5Q0FBd0M7SUFDaERHLFlBQVlILGlDQUE0QztJQUN4REssV0FBV0wsaUJBQTJDO0lBQ3RETyxlQUFlUCw2QkFBK0M7SUFDOURTLG1CQUFtQlQsY0FBb0Q7SUFDdkVXLE9BQU9YLDJDQUF1QztBQUNoRDtBQUVBLHNCQUFzQjtBQUN0QixNQUFNYSxNQUFNLENBQUNuQixxREFBT0EsR0FBR29CLE1BQU0sR0FBR3JCLDJEQUFhQSxDQUFDSyxrQkFBa0JILG9EQUFNQTtBQUV0RSxtQ0FBbUM7QUFDNUIsTUFBTW9CLE9BQU9uQixzREFBT0EsQ0FBQ2lCLEtBQUk7QUFDekIsTUFBTUcsS0FBS25CLGdFQUFZQSxDQUFDZ0IsS0FBSTtBQUNyQiIsInNvdXJjZXMiOlsiL1VzZXJzL3RvYmUvSDJTYWZldHlEZXYvaDJzYWZldHktYWkvbGliL2ZpcmViYXNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRpYWxpemVBcHAsIGdldEFwcHMsIGdldEFwcCB9IGZyb20gJ2ZpcmViYXNlL2FwcCdcbmltcG9ydCB7IGdldEF1dGggfSBmcm9tICdmaXJlYmFzZS9hdXRoJ1xuaW1wb3J0IHsgZ2V0RmlyZXN0b3JlIH0gZnJvbSAnZmlyZWJhc2UvZmlyZXN0b3JlJ1xuXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgYXBpS2V5OiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9BUElfS0VZLFxuICBhdXRoRG9tYWluOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9BVVRIX0RPTUFJTixcbiAgcHJvamVjdElkOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9QUk9KRUNUX0lELFxuICBzdG9yYWdlQnVja2V0OiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9TVE9SQUdFX0JVQ0tFVCxcbiAgbWVzc2FnaW5nU2VuZGVySWQ6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0ZJUkVCQVNFX01FU1NBR0lOR19TRU5ERVJfSUQsXG4gIGFwcElkOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9BUFBfSURcbn1cblxuLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxuY29uc3QgYXBwID0gIWdldEFwcHMoKS5sZW5ndGggPyBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKSA6IGdldEFwcCgpXG5cbi8vIEdldCBBdXRoIGFuZCBGaXJlc3RvcmUgaW5zdGFuY2VzXG5leHBvcnQgY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKVxuZXhwb3J0IGNvbnN0IGRiID0gZ2V0RmlyZXN0b3JlKGFwcClcbmV4cG9ydCB7IGFwcCB9XG4iXSwibmFtZXMiOlsiaW5pdGlhbGl6ZUFwcCIsImdldEFwcHMiLCJnZXRBcHAiLCJnZXRBdXRoIiwiZ2V0RmlyZXN0b3JlIiwiZmlyZWJhc2VDb25maWciLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfRklSRUJBU0VfQVBJX0tFWSIsImF1dGhEb21haW4iLCJORVhUX1BVQkxJQ19GSVJFQkFTRV9BVVRIX0RPTUFJTiIsInByb2plY3RJZCIsIk5FWFRfUFVCTElDX0ZJUkVCQVNFX1BST0pFQ1RfSUQiLCJzdG9yYWdlQnVja2V0IiwiTkVYVF9QVUJMSUNfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVQiLCJtZXNzYWdpbmdTZW5kZXJJZCIsIk5FWFRfUFVCTElDX0ZJUkVCQVNFX01FU1NBR0lOR19TRU5ERVJfSUQiLCJhcHBJZCIsIk5FWFRfUFVCTElDX0ZJUkVCQVNFX0FQUF9JRCIsImFwcCIsImxlbmd0aCIsImF1dGgiLCJkYiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lib/firebase.ts\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_context_UserContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/context/UserContext */ \"./lib/context/UserContext.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_context_UserContext__WEBPACK_IMPORTED_MODULE_2__]);\n_lib_context_UserContext__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_context_UserContext__WEBPACK_IMPORTED_MODULE_2__.UserProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/tobe/H2SafetyDev/h2safety-ai/pages/_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/tobe/H2SafetyDev/h2safety-ai/pages/_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQThCO0FBRTBCO0FBRXhELFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDL0MscUJBQ0UsOERBQUNILGtFQUFZQTtrQkFDWCw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QjtBQUVBLGlFQUFlRixLQUFLQSxFQUFBIiwic291cmNlcyI6WyIvVXNlcnMvdG9iZS9IMlNhZmV0eURldi9oMnNhZmV0eS1haS9wYWdlcy9fYXBwLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcydcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCdcbmltcG9ydCB7IFVzZXJQcm92aWRlciB9IGZyb20gJ0AvbGliL2NvbnRleHQvVXNlckNvbnRleHQnXG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8VXNlclByb3ZpZGVyPlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgIDwvVXNlclByb3ZpZGVyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IE15QXBwXG4iXSwibmFtZXMiOlsiVXNlclByb3ZpZGVyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "firebase/app":
/*!*******************************!*\
  !*** external "firebase/app" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/app");;

/***/ }),

/***/ "firebase/auth":
/*!********************************!*\
  !*** external "firebase/auth" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/auth");;

/***/ }),

/***/ "firebase/firestore":
/*!*************************************!*\
  !*** external "firebase/firestore" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/firestore");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();