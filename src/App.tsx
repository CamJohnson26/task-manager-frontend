import './App.css'
import {useHelloWorldApi} from "./taskManagerApi/useHelloWorldApi.ts";

function App() {
  const {data, loading} = useHelloWorldApi()

  return (
    <>
      {data}
      {loading && <div>Loading...</div>}
    </>
  )
}

export default App
