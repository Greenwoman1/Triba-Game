import "./App.css";
import Home from "./components/home/Home";

function App() {
  const styles= {
    background:{
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "-999",
      pointerEvents: "none"
    }
  };
  return (
      <div className="App">
        <img src={require('./assets/background.jpg')} style={styles.background} />
        <Home></Home>
      </div>
  );
}

export default App;
