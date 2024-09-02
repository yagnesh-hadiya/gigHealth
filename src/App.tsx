import "./App.scss";
import Router from "./route/Router";
import { Provider } from "react-redux";
import store from "./store";
import "./scss/font.scss";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;
