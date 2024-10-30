import { useReducer,Reducer } from "react";

interface Data{
  result:number
}

interface Action{
  type:'add'|'miuns',
  num:number
}

function reducer(state:Data,action:Action){
  switch(action.type){
    case 'add':
      return {result:state.result+action.num}
    case 'miuns':
      return {result:state.result-action.num}
  }
  return state
}

const App = () => {
  const [res,dispatch]=useReducer<Reducer<Data,Action>>(reducer,{result:0})

  return (
    <div>
      <div onClick={()=>dispatch({type:'add',num:1})}>加</div>
      <div onClick={()=>dispatch({type:'miuns',num:1})}>减</div>
      <div>{res.result}</div>
    </div>
  )
};

export default App;
