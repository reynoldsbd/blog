This repo contains the source for my blog.

Commits to master are automatically built and deployed to the webserver hosting
the blog. See ./.github/workflows/build-and-deploy.yml for details.

To build and deploy manually:

```
hugo -D -b https://reynoldsbd.net/
rsync -rt --delete ./public/ corellia:/usr/local/www/blog
```
