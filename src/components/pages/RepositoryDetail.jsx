    import { useState, useEffect} from "react";
    import { Link } from "react-router-dom";
    

function RepositoryDetail(){
    document.title = "Repository Detail";
    const repos = JSON.parse(localStorage.getItem('selectedRepos'));
    localStorage.removeItem('selectedRepos')//no long useful

    return(
        
        <div className="container">
               
            <h1 style={{marginBottom:'30px', paddingLeft:'10px', borderLeft: '5px solid var(--primary)'}}>{repos.name} Details</h1>
            <section className="repos-wrap" style={{backgroundColor:'#fff', padding:'30px'}}>
                <article className="img-wrap">
                    <img src={repos.owner.avatar_url} alt={repos.owner.login} />
                    <div>
                        <h3>{repos.owner.login}</h3>
                        <p>{repos.size} of size</p>
                        <div className="status">
                            {repos.private? <p style={{backgroundColor:'red'}}>Private</p>: 
                            <p style={{backgroundColor:'green'}}>Public</p>}
                        </div>
                        
                    </div>
                </article>
                <div>
                   <p className={{padding:'5px 0'}}>Repository was created on {new Date(repos.created_at).toLocaleDateString('en-GB')} </p> 
                </div>
                <div className="repo-statics">
                    <Link to={repos.html_url} rel="noreferrer" >View Repo</Link>
                    <ul>
                        <li>{repos.stargazers_count.toLocaleString()} stars</li>
                        <li>{repos.watchers_count.toLocaleString()} watchers</li>
                        <li>{repos.forks_count.toLocaleString()} forks</li>
                    </ul>
                </div>

                <div className="language">
                    {repos.language && <p className="add-bg">{repos.language}</p>
                    }
                    <ul>
                        {repos.topics.map((topic, i) => (
                            <li key={i} className="add-bg">{topic}</li>
                        ))}
                    </ul>

                    <p>{repos.open_issues} issues</p>
                </div>
                
            </section>
           
        </div>
    )
}

export default RepositoryDetail;