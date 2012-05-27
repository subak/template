# -*- coding: utf-8; -*-

require "pp"
require "bundler"
Bundler.require :default

DIR = File.dirname(File.expand_path __FILE__)

SRCS = FileList["lib/*.coffee", "spec/suites/*.coffee"]
OBJS = SRCS.ext "js"

desc "all"
task:compile => OBJS do
  puts "compile done"
end

rule ".js" => ".coffee" do |t|
  File.open t.name, "w" do |fp|
    fp.puts CoffeeScript.compile(File.read(t.source), bare: true)
  end
end

namespace:server do
  desc "start"
  task:start => ["compile"] do
    sh <<COM
java -jar "spec/support/JsTestDriver.jar" \
     --port 9876 \
     --browserTimeout 20000 \
     --config "spec/support/jsTestDriver.conf" \
     --basePath "#{DIR}"
COM
  end
end

namespace:test do
  desc "start"
  task:start => ["compile"] do
    sh <<COM
java -jar "spec/support/JsTestDriver.jar" \
     --config "spec/support/jsTestDriver.conf" \
     --basePath "#{DIR}" \
     --tests all \
     --reset
COM
  end
end

