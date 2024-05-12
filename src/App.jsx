import { useState, createContext } from "react"
import { Routes, Route} from "react-router-dom"
import Header from "./components/Header.jsx"
import Home from "./components/pages/Home.jsx"
import RepositoryDetail from "./components/pages/RepositoryDetail.jsx"
import NotFound404 from "./components/pages/NotFound404.jsx"
import Footer from "./components/Footer.jsx"
import AlertBox from "./components/AlertBox.jsx"

export const MsgAlertContext = createContext();

function App() {

  const [msgAlert, setMsgAlert] = useState({});

  //Toggle alert box
  function closeAlert(){
    setMsgAlert({show: false, msg:''});
}

  return (
  
    <MsgAlertContext.Provider value={[msgAlert, setMsgAlert]}>
      {msgAlert?.show && <AlertBox msg={msgAlert?.msg} onClick={closeAlert} />}
    
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/repository/details/" element={<RepositoryDetail />} exact />
          <Route path="*" element={<NotFound404 />} exact />
        </Routes>
      </main>
      <Footer />
    </MsgAlertContext.Provider>
  )
}

export default App
