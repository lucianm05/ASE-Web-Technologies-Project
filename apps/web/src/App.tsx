import { env } from "config";

function App() {
  console.log(env.API_URL);

  return (
    <div className="App">
      <h1>Web is online on port {env.WEB_PORT}</h1>
    </div>
  );
}

export default App;
