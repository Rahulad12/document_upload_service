import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./providers/react-query-provider";
import { RouterProvider } from "react-router";
import { MainRouter } from "./routes/mainRoutes";
import { TooltipProvider } from "./components/ui/tooltip";
// import DMSContainer from "./module/document-management";

function App() {
  return (
    <ReactQueryProvider>
      <RouterProvider router={MainRouter} />
      <TooltipProvider>
        <Toaster
          position="bottom-right"
          duration={3000}
          closeButton
          richColors
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
      </TooltipProvider>
    </ReactQueryProvider>
  );
}

export default App;
