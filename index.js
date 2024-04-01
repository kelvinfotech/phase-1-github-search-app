// js/index.js

const githubForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');

githubForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Please enter a username');
        return;
    }

    try {
        const users = await searchGitHubUsers(searchTerm);
        displayUsers(users);
    } catch (error) {
        console.error('Error searching GitHub users:', error);
    }
});

async function searchGitHubUsers(username) {
    const response = await fetch(`https://api.github.com/search/users?q=${username}`);
    if (!response.ok) {
        throw new Error('Failed to fetch GitHub users');
    }
    const data = await response.json();
    return data.items;
}

function displayUsers(users) {
    userList.innerHTML = '';
    reposList.innerHTML = '';

    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
            <img src="${user.avatar_url}" alt="Avatar" style="width: 50px; height: 50px;">
            <span>${user.login}</span>
            <button onclick="showUserRepos('${user.login}')">Show Repositories</button>
        `;
        userList.appendChild(userItem);
    });
}

async function showUserRepos(username) {
    try {
        const repos = await getUserRepos(username);
        displayRepos(repos);
    } catch (error) {
        console.error('Error fetching user repositories:', error);
    }
}

async function getUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!response.ok) {
        throw new Error('Failed to fetch user repositories');
    }
    return response.json();
}

function displayRepos(repos) {
    reposList.innerHTML = '';
    
    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.textContent = repo.full_name;
        reposList.appendChild(repoItem);
    });
}
