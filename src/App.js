
import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import loadable from "./util/loadable";

const MainScreen = loadable(() => import("./screen/mainScreen"));

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={MainScreen} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
