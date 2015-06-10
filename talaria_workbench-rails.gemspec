# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'talaria_workbench/rails/version'

Gem::Specification.new do |spec|
  spec.name          = "talaria_workbench-rails"
  spec.version       = TalariaWorkbench::Rails::VERSION
  spec.authors       = ["Scott Brickner"]
  spec.email         = ["scottb@brickner.net"]

  spec.summary       = %q{Data access API for the Mercury Analytics Workbench.}
  # spec.description   = %q{TODO: Write a longer description or delete this line.}
  spec.homepage      = "http://mercuryanalytics.com/"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.8"
  spec.add_development_dependency "rake", "~> 10.0"
end
