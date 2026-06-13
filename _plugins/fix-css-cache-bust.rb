# Fix for the `bust_css_cache` filter shipped by the jekyll-cache-bust gem.
#
# The gem hashes the directory `assets/_sass` to derive the cache-busting
# `?v=` query on main.css. This site keeps its Sass sources in `_sass/`
# (plus the entry point `assets/css/main.scss`), so the gem reads a
# non-existent directory, hashes an empty string, and always emits the
# MD5 of "" (d41d8cd98f00b204e9800998ecf8427e). The query never changes,
# so browsers serve a stale main.css after every style change.
#
# This local plugin re-registers `bust_css_cache` to hash the actual Sass
# sources that compile into main.css, so the `?v=` hash changes whenever
# any style does. Loaded after the gem, so this definition wins.
module Jekyll
  module FixedCssCacheBust
    require "digest/md5"

    # Directories / globs whose contents determine the compiled main.css.
    SASS_SOURCES = ["_sass/**/*.scss", "assets/css/main.scss"].freeze

    def bust_css_cache(file_name)
      contents = SASS_SOURCES.flat_map { |glob| Dir[glob] }
                             .reject { |f| File.directory?(f) }
                             .sort
                             .map { |f| File.read(f) }
                             .join
      "#{file_name}?v=#{Digest::MD5.hexdigest(contents)}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::FixedCssCacheBust)
