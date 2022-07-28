let form = document.querySelector("form");
let userContainer = document.querySelector(".user-container");
let inputField = document.querySelector("input");

async function getUser(username) {
  let user = {};
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (response.ok) {
    const data = await response.json();
    user["avatar"] = data.avatar_url;
    user["name"] = data.name;
    user["bio"] = data.bio;
    user["location"] = data.location;
    user["repos"] = data.public_repos;
    user["followers"] = data.followers;
    user["following"] = data.following;
    user["created"] = data.created_at;

    const repos = await fetch(`https://api.github.com/users/${username}/repos`);
    const reposData = await repos.json();
    user["repos_list"] = reposData;

    createUserCard(user);
  }else if (response.status === 403) {
    alert("search rate limit exceeded");
  }
}

function createUserCard(user) {
  const card = `
    <div class="user-card">
      <div>
        <img src="${user.avatar}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${user.name}</h2>
        ${user.bio ? `<p id="bio">${user.bio}</p>` : ""}
        ${user.location ? `<p>${user.location}</p>` : ""}
        <div class="user-stats">
          <ul>
            <li id="github-repos"><i class="fa-brands fa-github-alt"></i>${
              user.repos
            }</li>
            <li><i class="fa-solid fa-heart" background-color="red"></i>${
              user.followers
            }</li>
            <li><i class="fa-solid fa-comment"></i>${user.following}</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  userContainer.innerHTML = card;
  userContainer.addEventListener("click", () => {
    window.open("https:github.com/" + inputField.value, "_blank");
  });
  document.getElementById("github-repos").addEventListener("click", () => {
    window.open(`https://github.com/${inputField.value}?tab=repositories`, "_blank");
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = inputField.value;
  getUser(username);
});

inputField.addEventListener("keyup", (event) => {
  const username = inputField.value;
  getUser(username);
});
