import { createContext, useContext } from "react"

const countContext=createContext(111)

function App (){
  return <div>
    <countContext.Provider value={222}>
      <Bbb></Bbb>
    </countContext.Provider>
  </div>
}

function Bbb(){
  return <div><Ccc></Ccc></div>
}

function Ccc(){
  const count=useContext(countContext)
  return <h2>context的值是{count}</h2>
}

export default App