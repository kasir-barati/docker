# Wait for at least one log file to appear before starting tail
while [ -z "$(find logs -type f -name '*.log' 2>/dev/null)" ]; do
  sleep 1
done

# Tail all existing and future log files in all subdirectories
# The 'tail' command will follow files as they are created
tail -F logs/*/*.log