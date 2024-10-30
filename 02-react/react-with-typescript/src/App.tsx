interface ApProps{
  name:string
  content:React.ReactElement
}

function Aaa(props:ApProps){
  return <div>aaa,{props.name}</div>
}

function App() {
  return <div><Aaa name='my' content={<button>click</button>}></Aaa></div>;
}

export default App;
