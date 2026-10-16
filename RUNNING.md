# Running the site locally

Two ways to preview the site on your machine. The native setup is the lighter one (about 270 MB) and is what the commands below assume. Docker needs no system packages but costs about 1 GB.

Tested on Ubuntu 24.04 with Ruby 3.2.3.

## Native (Ruby + Bundler)

### One-time setup

Install the system packages:

```bash
sudo apt update && sudo apt install --no-install-recommends \
  ruby-dev ruby-bundler imagemagick nodejs jupyter-nbconvert
```

- `ruby-dev` and `ruby-bundler` install and compile the gems.
- `imagemagick` generates the responsive WebP images (`imagemagick.enabled` in `_config.yml`).
- `nodejs` is the JavaScript runtime used to minify scripts.
- `jupyter-nbconvert` renders the notebook embedded in the Jupyter blog post.

Then install the gems into the repo, from the repo root:

```bash
bundle config set --local path vendor/bundle
bundle install
```

Gems land in `vendor/bundle/`, so no `sudo` is needed. `vendor/`, `.bundle/` and `Gemfile.lock` are all gitignored.

### Run

```bash
bundle exec jekyll serve --livereload
```

Open <http://localhost:4000>. The site rebuilds and the browser refreshes when you save a file. Press `Ctrl+C` to stop.

Changes to `_config.yml` are not picked up automatically, so stop and start the server after editing it.

### Other useful commands

```bash
# Use another port if 4000 is taken
bundle exec jekyll serve --livereload --port 4001

# One-off production build into _site/
JEKYLL_ENV=production bundle exec jekyll build

# Wipe the build output and caches
bundle exec jekyll clean

# After editing the Gemfile
bundle install
```

### Known issues

- **`ERROR adding frame: Invalid frame dimensions` for `LunarLander-*.webp`.** Ubuntu's ImageMagick 6 cannot write an animated WebP from `assets/img/LunarLander.gif`. The error is local only; the page falls back to the original GIF and the deployed site is not affected.
- **`Address already in use`.** Another server is still running on port 4000. Stop it, or pass `--port`.

### Uninstall

```bash
rm -rf vendor .bundle Gemfile.lock _site .jekyll-cache
sudo apt remove ruby-dev ruby-bundler imagemagick nodejs jupyter-nbconvert
sudo apt autoremove
```

## Docker

```bash
docker compose pull   # download the prebuilt image
docker compose up     # site at http://localhost:8080
docker compose down   # stop and free the port
```

Pull before the first `up`. Without a pulled image, Compose builds one from the `Dockerfile`, which copies `Gemfile.lock`. That file is gitignored, so the build fails on a fresh clone.

The container runs as root, so `_site/`, `.jekyll-cache/` and `Gemfile.lock` end up root-owned. Remove them with `sudo rm -rf` before switching to the native setup.

## Before committing

Format with Prettier:

```bash
npm ci
npx prettier . --write
```

This needs npm, which the native setup above does not install (`nodejs` from apt ships without it). Install it with `sudo apt install npm` or through [nvm](https://github.com/nvm-sh/nvm).
