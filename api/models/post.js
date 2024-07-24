const db = require('../database/connect');

class Post {

    constructor({ post_id, user_id, title, content }) {
        this.id = post_id;
        this.user_id = user_id
        this.title = title;
        this.content = content;
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM post");
        return response.rows.map(p => new Post(p));
    }

    static async getOneById(id, user_id) {
        const response = await db.query("SELECT * FROM post WHERE post_id = $1 AND user_id = $2", [id, user_id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate post.")
        }
        return new Post(response.rows[0]);
    }

    static async create(user_id, data) {
        const { title, content } = data;
        let response = await db.query("INSERT INTO post (user_id, title, content) VALUES ($1, $2, $3) RETURNING post_id, user_id;",
            [user_id, title, content]);
        const { post_id, user_id: response_user_id } = response.rows[0]
        const newPost = await Post.getOneById(post_id, response_user_id);
        return newPost;
    }

    async destroy() {
        let response = await db.query("DELETE FROM post WHERE post_id = $1 RETURNING *;", [this.id]);
        return new Post(response.rows[0]);
    }

}

module.exports = Post;