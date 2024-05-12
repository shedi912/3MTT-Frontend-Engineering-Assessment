import { useState, useContext, useEffect} from "react";
import { MsgAlertContext} from "../App";
import { ReloadReposContext } from "./pages/Home";
import Button from "./Button";
import {FaTimes} from 'react-icons/fa';

function NewRepository({handleShowNewReposForm}) {

  const [msgAlert, setMsgAlert] = useContext(MsgAlertContext);
  const [reloadRepos, setReloadRepos] = useContext(ReloadReposContext);
  
  
  const [repos, setRepos] = useState({ name: "", description: "", private:false});

  const [nameError, setEmailError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [formMode, setFormMode] = useState({title:'New', btnText:'Create'});


  useEffect(()=>{

    const selectedRepos = JSON.parse(localStorage.getItem('selectedRepos'));
    if (selectedRepos) {
      localStorage.removeItem('selectedRepos')//no long useful
      const reposEdit = {name:selectedRepos.name, description:selectedRepos.description, private:Boolean(selectedRepos.private)}
      
      setFormMode({title:`Edit ${reposEdit.name}`, btnText:'Update'});
      setRepos(reposEdit);

    }

  }, []);
  


  //on changing of inputs
  function handleInput(e) {
    setRepos((r) => ({...r, [e.target.name]:  e.target.name !=='private'? e.target.value: e.target.checked}))
  }

  // On form submit
  function handleSubmit(e) {
    e.preventDefault();

    //validate inputs
    if (repos.name === "") {
      setEmailError("Email is required");
      return;
    } else if (repos.description === "") {
      setDescriptionError("Description is required");
      return;
    }

    repos.private =Boolean(repos.private)

    const performOperation = async () => {

      let url = `${import.meta.env.VITE_API_NEW_REPOS_URL}/repos`;
      let method = "POST";

      //check if we are creating new repos or updating an exisiting one
      if (formMode.btnText === 'Update') {
        const suburl = localStorage.getItem('update_suburl')
        url = `${import.meta.env.VITE_API_UPDATE_REPOS_URL}/${suburl}`;
        method = "PATCH";

        localStorage.getItem('update_suburl')//no long useful
      }

      
      const res = await fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/vnd.github+json',
          'Content-type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
        },
        body: JSON.stringify(repos),
      });

      //There will be id if repository was successfully created
      if (res.status ==201) {
        setReloadRepos(!reloadRepos);
        setMsgAlert({show: true, msg: 'Operation successfully'})
      }else{
        setMsgAlert({show: true, msg: 'operation failed'})
      }
    };

    performOperation();
  }

  //Clear any validation error
  function clearError(e) {
    switch (e.target.name) {
      case "name":
        setEmailError("");
        break;
      case "description":
        setDescriptionError("");
        break;
    }
  }


  return (

    <section className="model">

      <form className="add-task login-form" onSubmit={(e) => handleSubmit(e)}>
              <div className="login-form-header flex-wrap"><h3>{formMode.title} Repository</h3>
                  <Button
                        text={<FaTimes />}
                        onClick={(e) => handleShowNewReposForm(e)}
                      />
              </div>
          
              <div className="login-input-container">
                  <div className="input-group">
                    <label htmlFor="name">Name</label>
                      <div className="input-wrap flex-wrap">
                      <input
                      type="text"
                      name="name"
                      id="name"
                      onChange={(e) => handleInput(e)}
                      onBlur={(e) => clearError(e)}
                      value={repos.name}
                      placeholder="Repository name"
                      />
                  </div>
                  <div className="form-input-error">{nameError}</div>
                  
              </div>

              <div className="input-group">
                <label htmlFor="description">Description</label>
                  <div className="input-wrap flex-wrap">
                      <input
                      type="input"
                      name="description"
                      id="description"
                      value={repos.description}
                      onChange={(e) => handleInput(e)}
                      onBlur={(e) => clearError(e)}
                      placeholder="Short text that describes this repository"
                      />
                  </div>
                  <div className="form-input-error">{descriptionError}</div>
                  
              </div>

              <div className="input-group">
                <label>Private?</label>
                  <div className="input-wrap flex-wrap" style={{border:'0', gap:'20px'}}>

                    <div className="radio-wrap" style={{flex:0}}>
                        <input type="checkbox" style={{width:'fit-content'}}
                        name="private"
                        id="option2"
                        // value={repos.private}
                        onChange={(e) => handleInput(e)}
                        checked={repos.private}
                        />
                        <label htmlFor="option2">Yes</label>
                      </div>
                  </div>
                  
              </div>

              <div className="input-wrap">
                  <input type="submit" value={formMode.btnText} />
              </div>
              </div>
          </form>

    </section>
    
    
  );
}

export default NewRepository;
