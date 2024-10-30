import { useEffect, useRef, useState } from "react";

function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T;
    value?: T;
  }
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { defaultValue, value: propsValue } = props || {};

  const isFirstRender = useRef(true);

  const [stateValue, setStateValue] = useState<T>(() => {
    if (propsValue !== undefined) {
      return propsValue!;
    } else if (defaultValue !== undefined) {
      return defaultValue!;
    } else {
      return defaultStateValue;
    }
  });

  useEffect(()=>{
    if(propsvalue === undefined && !isFirstRender.current){
      setStateValue(propsvalue!)
    }
    isFirstRender.current=false
  },[propsvalue])

  const mergeValue=propsvalue ===undefined ?stateValue :propsvalue

  return [mergeValue,setStateValue]
}
