function getRandomPosition(max) {
    return Math.floor(Math.random() * max);
}

function getRandomPosition2(max) {
    const screenWidth = window.innerWidth;
    return Math.floor(((Math.random() * max) % screenWidth / 2) + screenWidth / 2);
}

function getRandomSize() {
    return Math.floor(Math.random() * 40) + 20; // Sizes between 20px and 60px
}

function getRandomRotation() {
    return Math.random() * 2 - 1; // Random rotation factor
}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const names = [
        // "Software developer", "Equal experts", "Thoughtworks"
    ];

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    names.forEach(name => {
        const nameElement = document.createElement("div");
        nameElement.classList.add("name");
        nameElement.textContent = name;

        const size = getRandomSize();
        nameElement.style.fontSize = `${size}px`;
        nameElement.style.top = `${getRandomPosition(screenHeight - size)}px`;
        nameElement.style.left = `${getRandomPosition2(screenWidth - size)}px`;
        nameElement.style.setProperty('--random-rotation', getRandomRotation());

        body.appendChild(nameElement);
    });
});

const graphql = JSON.stringify({
    query: "\n    query recentAcSubmissions($username: String!, $limit: Int!) {\n  recentAcSubmissionList(username: $username, limit: $limit) {\n    id\n    title\n    titleSlug\n    timestamp\n  }\n}\n    ",
    variables: {"username": "swapnillothe", "limit": 15}
})
const requestOptions = {
    method: "POST",
    mode: 'no-cors',
    headers: {'content-type': 'application/json'},
    body: graphql
};

fetch("https://leetcode.com/graphql/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

fetch('https://cat-fact.herokuapp.com/facts/')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

console.log('coming 1 ')
