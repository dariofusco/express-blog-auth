const path = require("path");
const fs = require("fs");
let posts = require("../db/posts.json");

const index = (req, res) => {

    let html = '<ul>';
    posts.forEach(post => {
        html += `<li>
                    <div>
                        <a href="${post.slug}"><h1>${post.title}</h1></a>
                        <img width="200" src=${`/${post.image}`} />
                        <p><strong>Ingredienti</strong>: ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(', ')}</p>
                    </div>
                </li>`
    });
    html += '</ul>';
    res.send(html);

}

const show = (req, res) => {

    const slugPost = req.params.slug;
    const jsonPost = posts.find(post => post.slug === slugPost);

    //res.json(jsonPost);

    if (jsonPost) {
        res.json({
            ...jsonPost,
            image_url: `http://${req.headers.host}/${jsonPost.image}`
        });
    } else {
        res.status(404).json("Not Found");
    }

}

const updatePosts = (newPost) => {
    const filePath = path.join(__dirname, '../db/posts.json');
    fs.writeFileSync(filePath, JSON.stringify(newPost));
    posts = newPost;
}

const createSlug = (title) => {
    const baseSlug = title.replaceAll(' ', '-').toLowerCase().replaceAll('/', '');
    const slugs = posts.map(post => post.slug);
    let counter = 1;
    let slug = baseSlug;
    while (slugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}

const create = (req, res) => {

    const { title, content, tags } = req.body;

    const slug = createSlug(title);

    const newPost = {
        title,
        slug,
        content,
        image: req.file.filename,
        tags
    }

    updatePosts([...posts, newPost]);

    res.format({
        html: () => {
            res.redirect(`/${newPost.slug}`);
        },
        json: () => {
            res.json(newPost);
        }
    });

}

const deleteImage = (fileName) => {
    const filePath = path.join(__dirname, '../public', fileName);
    fs.unlinkSync(filePath);
}

const destroy = (req, res) => {

    const { slug } = req.params;
    const postToDelete = posts.find(post => post.slug === slug);

    deleteImage(postToDelete.image);
    updatePosts(posts.filter(post => post.slug !== postToDelete.slug));

    res.send(`Post con slug ${slug} eliminato con successo.`);
}

const download = (req, res) => {

    const slugPost = req.params.slug;
    const selectedPost = posts.find(post => post.slug === slugPost);
    res.download(`${__dirname}/../public/${selectedPost.image}`);
}

module.exports = {
    index,
    show,
    create,
    download,
    destroy
}