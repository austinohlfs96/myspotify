
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Error from './Error';



function Router() {
  const routes = (
    <>
      <Route path='/' element={<LandingPage/>} />,

      
      
    </>
  )
  return (
    <>
      <Routes>
        {routes}
        <Route path="/:error" element={<Error />} />
      </Routes>
    </>
  )
}

export default Router;