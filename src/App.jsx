import { useState } from "react"
import "./styles.css"
import { ToastContainer, toast } from 'react-toastify';
//import BrowserRouter from 'react-router-dom/BrowserRouter';

export default function App() {

  const [ciUrl, setCiUrl] = useState("")
  const [apiResults, setApiResults] = useState([])

  const notify = () => toast("Fetching the info, please wait");

  function makeTheCall(threadId){
    // if(threadId.isNull)
    //   alert("It appears you have entered a wrong thread ID, please try again with a correct 7 Digit thread ID. If the issue persists, there could be an underlying error.")
    console.log(threadId)
    notify()
    let api = 'https://multilocale.azurewebsites.net/api/threadidprocessor?threadId=' + threadId.trim();
    fetch(api)
    .then(response => {
      if (!response.ok) {
      setApiResults(apiResults =>[])
      alert("It appears you have entered a wrong thread ID, please try again with a correct 7 Digit thread ID. If the issue persists, there could be an underlying error.")
      throw new Error('Network response was not ok');
      } 
      return response.json();
    })
    .then(data => {
    console.log(data);
    
    let testArray = [data["localeCode"],data["language"]];
    console.log(testArray);
    
    setApiResults(apiResults => [data["localeCode"],data["language"],data["additionalInfo"],data["threadLink"],data["welcomeMessage"]])
    

    })
    .catch(error => {
    console.error('Error:', error);
    });

  }

  function handleSubmitCiLink(e){
    e.preventDefault()
    //let threadId = 0;
    if(!ciUrl)      
        alert("Please input a value")
    else
      {let threadIdArray = ciUrl.match(/\d{7}/)   ; 
      if(!threadIdArray || threadIdArray[0].length!=7)  
        alert("There seems to be not a 7 digit Thread ID present")
      else
        makeTheCall(threadIdArray[0]);
        
      }

     
   }

  const handleCopyClick = async () => {
    try {
        await window.navigator.clipboard.writeText(apiResults[4]);
        //alert("Copied to clipboard!");
    } catch (err) {
        console.error(
            "Unable to copy to clipboard.",
            err
        );
        alert("Copy to clipboard failed.");
    }
};

  return(<>

  <div className="row">
    <h1 className="title">Q&A Multi-Locale Navigator</h1>
  </div>

  <div className="row">

    <div className="column-left">
    <div className="input-box">
  <form onSubmit={handleSubmitCiLink}>
      <input value={ciUrl} onChange={e => setCiUrl(e.target.value)} type="text" id="threadUrl" placeholder="Thread ID or CI Link" />

  <button className="btn-submit"> <p>Submit</p>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="4"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    ></path>
  </svg></button>
  <ToastContainer
position="top-center"
autoClose={4000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>

    
  </form>
  </div>
  </div>

<div className="column-right">
  <div className="output-box">
    <h1>Thread Details.</h1>
    {apiResults.length === 0 && " Please click submit to get below details "}
    {/* <h1>{apiResults}</h1> */}
    <p>Language : <br /><span className="span-text">{apiResults[1]}</span></p>
    <p>Note : <br /><span className="span-text">{apiResults[2]}</span></p>
    <p>Link to Thread : <br /><span className="span-text"> <a href={apiResults[3]} target="_blank" >Click here</a></span></p>    
    <p>Welcome message :<button className="btn-copy" onClick={handleCopyClick}>
                      Copy
                        </button>
            <br /><br /><span className="span-text">{apiResults[4]}</span>
            
    </p>
  </div>
  </div>

  </div>
  
  
  </>)


}
