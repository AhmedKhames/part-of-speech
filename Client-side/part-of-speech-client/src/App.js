
import './App.css';

function App() {
  return (
    <div className="App">

      <h1>Point of Speech</h1>
      <h2>Categorize the words according to their part of speech</h2>
      <h3>Score is 10 out of 10</h3>

      {/* card for question with answers*/}
      <div>
        <h2>The word car is </h2>
        <button>1 - Verb</button>
        <button>2 - Adverb</button>
        <button>3 - Adjective</button>
        <button>4 - noun</button>
      </div>
      <button>Next word</button><br/>
      
      
      <div>
      <label for="disk_d">You solve 2 question out of 10</label><br/>
      <meter id="disk_d" value="0.2"></meter>
      
      </div>
    
    {/* card  after finish the answering questions  */}
    <div>
    <h1>The stuent rank is 56.67</h1>
    <button>Try again</button>
    </div>



    </div>
  );
}

export default App;
