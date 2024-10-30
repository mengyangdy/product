import { ChangeEvent } from "react";

function App() {
  function onChange(event:ChangeEvent<HTMLInputElement>){
  console.log("🚀 ~ file: App.tsx:5 ~ onChange ~ event~", event)

  }

  return <input type="text" defaultValue={'my'} onChange={onChange} />

}

export default App;
