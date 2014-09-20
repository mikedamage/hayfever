Hayfever for Chrome
==================================================

by Mike Green [mike.is.green@gmail.com][1]

This is a rebuild of my marginally popular Chrome extension, Hayfever. It incorporates new stuff I've learned about buildiing JavaScript applications in the years since the original was built.

Building
--------------------------------------------------

Hayfever isn't currently available in any form besides this repo's source code, but you're more than welcome to clone it, as long as you don't mind the fact that it doesn't do anything yet. Building the project requires Node and Ruby.

```sh
# We need Gulp installed globally:
[sudo] npm install -g gulp
[sudo] bundle install
npm install
gulp
```

After that you'll have a `build` directory containing a plugin that can be loaded into Chrome in developer mode.

[1]: mailto:mike.is.green@gmail.com
