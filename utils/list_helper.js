const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  let max = 0
  const reducer = (mostLiked, blog) => {
    if (blog.likes > max) {
      mostLiked = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
      max = blog.likes
    }
    return mostLiked
  }
  return blogs.length === 0
    ? 0
    :  blogs.length === 1
      ? {
        title: blogs[0].title,
        author: blogs[0].author,
        likes: blogs[0].likes
      }
      : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
  const blogCount = lodash.countBy(blogs, blogs => blogs.author)
  const auth = lodash.maxBy(lodash.keys(blogCount), x => blogCount[x])
  return blogs.length === 0
    ? 0
    : {
      author: auth,
      blogs: blogCount[auth]
    }
}

const mostLikes = (blogs) => {
  const reducer = (arr, blogs) => {
    arr[blogs.author] = (arr[blogs.author] || 0) + blogs.likes
    return arr
  }
  const reduced = blogs.reduce(reducer, {})
  const auth = lodash.maxBy(lodash.keys(reduced), x => reduced[x])
  return blogs.length === 0
    ? 0
    : {
      author: auth,
      likes: reduced[auth]
    }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
