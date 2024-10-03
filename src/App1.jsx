import React, { useEffect, useState, useError, useRef } from './nano-react-core/React.js';
function Foo() {
  const [renderList, setRendList] = useState([1,2,3])
  const [count, setCount] = useState(10);
  const [str, setStr] = useState('x');
  const ref = useRef(11)
  const ref1 = useRef(12)
  console.log(ref, ref1)
  ref.current = {"s": str}
  ref1.current = {"s=b": str}
  console.log(ref, ref1)
  useError((res)=>{console.log(res)})
  useEffect(() => {
    console.log('Foo str updating', str);

    return () => {
      console.log('cleanup effects');
    };
  }, [str]);

  useEffect(() => {
    console.log('Foo first Rendering');
    return () => {
      console.log('无依赖不会被执行');
    };
  }, []);

  const handleClick = () => {
    setCount(count=>count+1);
    setStr((prev) => prev + 'x');
    setRendList(pre=>[...pre, pre.length+1])
  };
  const handleClickDe =()=>{
    renderList.splice(1,1)
    setRendList(pre=>[...renderList])
  }
  return (
    <div>
      FOO:{count}
      {/* Str:{str} */}
      <button onClick={handleClick}>Click</button>
      <button onClick={handleClickDe}>ClickDe</button>
      {renderList.map((item,index)=><div key={index}>{item}</div>)}
    </div>
  );
}

function App() {
  
  return (
    <div>
      {/* <div> {[1,2,3].map((item,index)=> <div> {item} </div>)} </div> */}
      <Foo></Foo>
    </div>
  );
}
export default App;
