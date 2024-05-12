# Github Profile

A Web App that uses GitHub API manage the GitHub repositories that belongs to a user

## Features

- Create new repository
- View existing repository
- update a repository
- delete a repository

## Installation
Since is an online app, to run locally, 
1. clone the repository
2. run: 'npm install' from command line to install all dependencies. 

## Configuration
1. setup your github account
2. create a .env file and passed in the below settings
VITE_API_BASE_URL = 'https://api.github.com/users'
VITE_API_NEW_REPOS_URL = 'https://api.github.com/user'
VITE_API_UPDATE_REPOS_URL = 'https://api.github.com/repos'
VITE_GITHUB_TOKEN = 'your access token generated from github', it must have read and write privilege
3. Run: 'npm run dev' from the command to startup the local server

## Usage
1. To create new repository, click add repos; provide repos name, description and indicate whether private or not the click create
2. To view, delete or update a repos, you must first select the particular repos before clicking any of the buttons.


## License

[Specify the license for your app]

## Acknowledgements

[List any acknowledgements or references]

