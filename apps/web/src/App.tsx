import Alerts from "@/features/alert/Alerts";
import Drawer from "@/features/drawer/Drawer";
import Map from "@/features/map/Map";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Drawer />

        <Alerts />

        <Map />
      </div>
    </QueryClientProvider>
  );
}

export default App;
