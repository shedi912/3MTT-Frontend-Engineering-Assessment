import { useState, useEffect, useContext, createContext} from "react"
import { useNavigate} from "react-router-dom";
import { FaFile, FaList, FaTrash, FaSearch, FaEdit } from "react-icons/fa";
import Table from "../Table";
import { MsgAlertContext } from "../../App";

import NewRepository from "../NewRepository";

let totalRepos = 0;
export const ReloadReposContext = createContext();
function Home(){
    const [repos, setRepos] = useState([]);
    const [user, setUser]  = useState('shedi912');
    const [search, setSearch] = useState(false);
    const [reloadRepos, setReloadRepos] = useState(false); //help to reload repos when a repos is added or updated

    const [totalRepos, setTotalRepos] = useState(repos.length);
    const [currentPage, setCurrentPage] = useState(1); //usually 1
    const recordsPerPage =5;

    const npage = Math.ceil(totalRepos / recordsPerPage);
    const numbers = [...Array(npage +1).keys()].slice(1);

    const [msgAlert, setMsgAlert] = useContext(MsgAlertContext);
    const [selectedRow, setSelectedRow] = useState(0); //store id of the selected repo
    const [showNewReposForm, setShowNewReposForm] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {

        const getRepos = async () => {

            //Get total repos this user have created
            //I shall use it for creating pagination
            let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${user}`);
            let data = await res.json();
            setTotalRepos(data.public_repos);

            //Get repositories
            res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/${user}/repos?page=${currentPage}&per_page=${recordsPerPage}&sort=updated`,
                 {
                    method: "GET",
                });
            data = await res.json();
            setRepos(data);
        }

        getRepos();

    }, [search, currentPage, reloadRepos]); //Only run when the user click on the search button

    //To avoid making too many calls, lets only capture user input
    function handleUserChange(e){
        setUser(e.target.value);
    }

    //If user input not empty, we change search
    //state to enable fetching of data
    function handleSearch(){
        if (user) {
            setSearch(!search); //fetch results
        } 
    }

    //go back one step
    function prePage(e){
        if (repos.length >0) {
            setCurrentPage((p) => p-1);
        }
    }
    //next page
    function nextPage(e){
        e.preventDefault();
        if(currentPage < repos.length){
            setCurrentPage((p) => p+1);
        }
    }
    //go to specified page
    function changeCurrentPage(e,n){
        e.preventDefault();
        setCurrentPage(n)
    }
    
    //set selected repository id
    function handleTableRowClick(id){
        setSelectedRow(id)
    }

    //show form to add new repos
    function handleShowNewReposForm(){
        setShowNewReposForm(!showNewReposForm);
    }

    //called to store selected repo in
    //the local storage when viewing or updating
    function saveSelectedReposInLocalStorage(){
        const selectedRepo = repos.filter(repo => repo.id == selectedRow)
        localStorage.setItem('selectedRepos', JSON.stringify(selectedRepo[0]));
        return selectedRepo;
    }
    function updateRepos(){
        if(selectedRow){
            //save selected repository in local storage.
            //i don't want to make a call to github to fetch it
            const saveRepo = saveSelectedReposInLocalStorage();
            localStorage.setItem('update_suburl', `${saveRepo[0].owner.login}/${saveRepo[0].name}`)
            setShowNewReposForm(!showNewReposForm);
        }else{
            setMsgAlert({show:true, msg:'First select repository you want to update'})
        }
    }


    // handle viewing of repository details
    function viewRepositoryDetail(){
        if(!selectedRow){
            setMsgAlert({show:true, msg:'First select repository you want to view'});
            return;
        }

        //save selected repository in local storage.
        //i don't want to make a call to github to fetch it
        saveSelectedReposInLocalStorage()
        navigate(`/repository/details/`);
    }

    //Handle deleting of selected repository
    function deleteRepos(){
        if(!selectedRow){
            setMsgAlert({show:true, msg:'First select repository you want to delete'});
            return;
        }

        const performOperation = async () => {
            const selectedRepo = repos.filter(repo => repo.id == selectedRow);
            
            const url = `${import.meta.env.VITE_API_UPDATE_REPOS_URL}/${selectedRepo[0].owner.login}/${selectedRepo[0].name}`;
            const res = await fetch(url, {
              method: "DELETE",
              headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
              }
            });
      
            //if successfully, update repos without making api call
            if (res.status==204) {
                
                const newRepo = repos.filter(repo => repo.id != selectedRow);
                if (totalRepos >1) {
                    setTotalRepos((s) => s-1);
                }else{
                    setTotalRepos(0);
                }
                
                setRepos(newRepo);
                setMsgAlert({show: true, msg: 'Operation successfully'})
            }else{
                setMsgAlert({show: true, msg: 'Operation failed'})
            }
          };
      
          performOperation();
    }
    const heading = ['S/N','Repos Name', 'Description', 'Created On'];
    return(
        <>
            <div className="container">
                <div className="btn-wrap submenu">
                    <button onClick={handleShowNewReposForm}><FaFile />Add Repos</button>
                    <button onClick={updateRepos}><FaEdit />Update Repos</button>
                    <button onClick={viewRepositoryDetail}><FaList />View Repos Detail</button>
                    <button onClick={deleteRepos}><FaTrash />Delete Repos</button>
                </div>
               <section className="register-wrap">
                    <div className="register">
                        <div className="search-bar-wrap add-grid">
                            <div className="search-wrap flex-wrap">
                                
                                <input type="text" name="" 
                                id="search" 
                                onChange={(e)=>handleUserChange(e)}
                                placeholder="Search for a user" 
                                title="Enter your github username and click on the search icon"/>
                                
                                <button type="button" onClick={handleSearch}><FaSearch/></button>
                            </div>
                        </div>
                        <div className="table-wrap">
                            <h2 className="table-title" >{user}' Github Repositories</h2>
                            <div className="add-overflow-x">
                                    {repos.length >0?
                                    <Table data={repos} heading={heading} handleTableRowClick={(id)=>handleTableRowClick(id)}  
                                    selectedRow={selectedRow} />
                                    :'No data found'
                                }
                            </div>
                            
                        </div>
                        
                            <nav>
                                <ul className="pagination">
                                    <li className="page-item">
                                        <a href="#" className="page-link" onClick={(e)=>prePage(e)}>Prev</a>
                                    </li>
                                    {
                                        numbers.map((n, i) => (
                                            <li className={`page-item ${currentPage ===n ? 'active': ''}`} key={i}>
                                                <a href="#" onClick={(e)=>changeCurrentPage(e,n)}>{n}</a></li>
                                        ))
                                    }
                                    <li className="page-item">
                                        <a href="#" className="page-link" onClick={(e)=>nextPage(e)}>Next</a>
                                    </li>
                                </ul>
                            </nav>
                           
                    </div>
                </section>

                <section>
                    <ReloadReposContext.Provider value={[reloadRepos, setReloadRepos]}>
                        {showNewReposForm && <NewRepository handleShowNewReposForm={handleShowNewReposForm} />}
                    </ReloadReposContext.Provider>
                </section>
            </div> 
        </>
    )
}
export default Home;