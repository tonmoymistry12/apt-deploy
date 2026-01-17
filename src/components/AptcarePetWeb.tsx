import { BrowserRouter as Router } from "react-router-dom";
//import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import ComponentsContainer from "./ComponentsContainer";


export default function aptcarePetWeb () {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
      setIsBrowser(true);
    }, []);
  
    if (!isBrowser) {
      return null; // Render nothing until the browser loads
    }
    return (
     
        <div >
          <Router>
            <ComponentsContainer />
          </Router>
        </div>
      
    );
  
}
