function createPostElement (data) {
    const post = document.createElement("div");
    post.className = "post";

    const header = document.createElement("h2");
    header.textContent = data["title"];
    post.appendChild(header);

    const content = document.createElement("p");
    content.textContent = data["content"];
    post.appendChild(content);

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "delete"
    deleteButton.id = data["id"]
    deleteButton.addEventListener("click", deletePost)
    post.appendChild(deleteButton)

    return post;
}

document.getElementById("post-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            authorisation: localStorage.getItem("token")
        },
        body: JSON.stringify({
            title: form.get("title"),
            content: form.get("content")
        })
    }

    const result = await fetch("http://localhost:3000/posts", options);

    if (result.status == 201) {
        window.location.reload();
    }
})

async function loadPosts () {

    const options = {
        headers: {
            authorisation: localStorage.getItem("token")
        }
    }
    
    const response = await fetch("http://localhost:3000/posts", options);

    if (response.status == 200) {
        const posts = await response.json();
    
        console.log(posts)
        const container = document.getElementById("posts");

        posts.forEach(p => {
            const elem = createPostElement(p);
            container.appendChild(elem);
        })
    } else {
        window.location.assign("./index.html");
    }

}

loadPosts();

const deletePost = async (e) => {
    const postId = e.target.id

    const options = {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            authorisation: localStorage.getItem("token")
        }
    }
    const response = await fetch(`http://localhost:3000/posts/${postId}`, options);

    if (response.status == 204) {
        window.location.reload();
    } else if (response.status == 404) {
        console.log("Not authorised")
    }

}




const logOut = document.querySelector("nav > a")

logOut.addEventListener("click", () => {
    localStorage.removeItem("token")
})