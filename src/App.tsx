import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./providers/react-query-provider";
import { RouterProvider } from "react-router";
import { MainRouter } from "./routes/mainRoutes";
// import DMSContainer from "./module/document-management";

function App() {
  return (
    <ReactQueryProvider>
      <RouterProvider router={MainRouter} />
      <Toaster
        position="bottom-left"
        duration={3000}
        closeButton
        // toastOptions={{
        //   style: {
        //     background: "#008eb0",
        //     color: "white",
        //     border: "none",
        //   },
        //   classNames: {
        //     closeButton: "bg-white text-[#008eb0] hover:bg-gray-100",
        //   },
        // }}
      />
    </ReactQueryProvider>
  );
}

export default App;
