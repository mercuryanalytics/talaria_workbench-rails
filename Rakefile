require "bundler/gem_tasks"

namespace :gulp do
  desc "Build assets with Gulp"
  task :build do
    system "gulp scripts"
  end
end

task :build => "gulp:build"
