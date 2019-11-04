# **Instant Messenger App Tutorial**

## [Hosted Version](https://react-im-app.netlify.com/)

## _Added features post tutorial_

- Time and date of chat message submission displayed at top of chat message

## _Ideas for new features_

- Delete chat?
- Set avatar

---

## **Router**

### **Installing the React Router**

In Git terminal for the project folder type:

```git
npm install react-router-dom
```

### **Importing the router**

In index.js ad the following import line to the file:

```js
import {
  Route,
  BrowserRouter as Router
} from 'react-router-dom';
```

### **Create the route object**

Crete a routing object to be used for the ReactDOM render function.
Example from IM tutorial:

```js
const routing = (
  <Router>
    <div id='routing-container'>
      <Route
        path='/login'
        component={LoginComponent}
      ></Route>
      <Route
        path='/signup'
        component={SignupComponent}
      ></Route>
      <Route
        path='/dashboard'
        component={DashboardComponent}
      ></Route>
    </div>
  </Router>
);
```

Then add it to the render as follows:

```js
ReactDOM.render(routing, document.getElementById('root'));
```

## **Firebase**

### **Installing Firebase**

In Git terminal for the project folder type:

```git
npm install firebase@6.0.2
```

## **Material UI**

### **Installing the Material UI**

In Git terminal for the project folder type:

```git
npm install @material-ui/core
npm install @material-ui/icons
```
