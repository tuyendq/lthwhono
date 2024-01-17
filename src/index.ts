import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { basicAuth } from 'hono/basic-auth'

type BLOG = {
  id: number,
  title: string,
  content: string
}

const blogs: BLOG[] = []

const app = new Hono()

app.use('/api/*', cors())
app.use('/api/*', basicAuth({
  username: 'tuyen',
  password: '12345'
}))
app.use('/static/*', serveStatic({ root: './'}))
app.get('/', serveStatic({ path: './index.html'}))
// app.get('/favicon.ico', serveStatic({ path: './favicon.ico'}))
app.get('/favicon.ico', serveStatic({ path: './favicon.ico'}))

app.get('/hello', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/blogs', (c) => c.json(blogs))
app.get('/api/blogs/:id', (c) => {
  const { id } = c.req.param()
  const blog = blogs.filter(data => data.id === parseInt(id))
  return c.json(blog)
})

app.post('/api/blogs', async (c) => {
  const body = await c.req.parseBody() as unknown as BLOG;
  if (!body) return c.json({ status: 401, message: "The request payload is required."})
  const newBlog = {
    id: blogs.length + 1,
    title: body.title,
    content: body.content
}
blogs.push(newBlog)
return c.json({ data: newBlog})
})


export default app
