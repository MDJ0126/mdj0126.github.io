require 'fileutils'
require 'webrick'

project_root = File.expand_path(__dir__)
resume_root = File.join(project_root, 'Resume')
portfolio_root = File.join(project_root, 'Portfolio')
local_site = File.join(project_root, '.local-site')

def source_files(project_root, resume_root, portfolio_root)
  root_files = %w[_config.yml index.html 403.html 404.html robots.txt].map { |name| File.join(project_root, name) }
  nested_files = [resume_root, portfolio_root].flat_map do |root|
    Dir.glob(File.join(root, '**', '*'), File::FNM_DOTMATCH).select do |path|
      normalized = path.tr('\\', '/')
      File.file?(path) && !normalized.include?('/.jekyll-cache/') && !normalized.include?('/.sass-cache/') && !normalized.end_with?('/.jekyll-metadata')
    end
  end
  root_files.concat(nested_files).select { |path| File.file?(path) }
end

def snapshot(project_root, resume_root, portfolio_root)
  source_files(project_root, resume_root, portfolio_root).to_h do |path|
    stat = File.stat(path)
    [path, [stat.mtime.to_f, stat.size]]
  end
end

def build_site(project_root, resume_root, portfolio_root, local_site)
  puts "\nChange detected. Rebuilding local site..."
  resume_destination = File.join(local_site, 'Resume')
  success = system('bundle', 'exec', 'jekyll', 'build', '--config', File.join(project_root, '_config.yml'), '--destination', resume_destination)
  unless success
    warn 'Jekyll build failed. Waiting for the next change.'
    return false
  end

  FileUtils.mkdir_p(File.join(local_site, 'Portfolio'))
  FileUtils.cp(File.join(project_root, 'index.html'), File.join(local_site, 'index.html'))
  FileUtils.cp(File.join(project_root, '403.html'), File.join(local_site, '403.html'))
  FileUtils.cp(File.join(project_root, '404.html'), File.join(local_site, '404.html'))
  FileUtils.cp(File.join(project_root, 'robots.txt'), File.join(local_site, 'robots.txt'))
  FileUtils.cp(File.join(resume_root, 'assets', 'img', 'common', 'favicon.ico'), File.join(local_site, 'favicon.ico'))
  FileUtils.rm_rf(File.join(local_site, 'Portfolio'))
  FileUtils.cp_r(portfolio_root, File.join(local_site, 'Portfolio'))
  puts 'Local site updated. Refresh the browser to see the changes.'
  true
end

FileUtils.mkdir_p(local_site)
exit 1 unless build_site(project_root, resume_root, portfolio_root, local_site)

server = WEBrick::HTTPServer.new(
  Port: 4000,
  DocumentRoot: local_site,
  BindAddress: '127.0.0.1',
  AccessLog: [],
  Logger: WEBrick::Log.new($stderr, WEBrick::Log::WARN)
)

stop_server = proc { server.shutdown }
trap('INT', &stop_server)
trap('TERM', &stop_server)

watcher = Thread.new do
  previous = snapshot(project_root, resume_root, portfolio_root)
  loop do
    sleep 0.5
    current = snapshot(project_root, resume_root, portfolio_root)
    next if current == previous

    sleep 0.3
    build_site(project_root, resume_root, portfolio_root, local_site)
    previous = snapshot(project_root, resume_root, portfolio_root)
  rescue StandardError => e
    warn "Watcher error: #{e.message}"
  end
end

puts 'Watching source files at http://127.0.0.1:4000/ (Ctrl+C to stop)'
server.start
watcher.kill
watcher.join
