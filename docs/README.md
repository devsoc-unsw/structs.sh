# Welcome to Structs.sh Documentation

- Install [uv](https://docs.astral.sh/uv/getting-started/installation/).
- Run `uv run mkdocs serve`, and visit the URL from the command output.

Note: you will need to change the port using the `-a, --dev-addr` option if there are any
conflicts with the ports of the other running services. An example is shown below

    ```bash
    › uv run mkdocs serve -a localhost:8080

    INFO    -  Building documentation...
    INFO    -  [macros] - No default module `main` found
    INFO    -  [macros] - Config variables: ['extra', 'config', 'environment', 'plugin', 'git', 'repo_clone_url', 'github_team_url',
               'email', 'macros', 'filters', 'filters_builtin']
    INFO    -  [macros] - Config macros: ['context', 'macros_info', 'now', 'fix_url']
    INFO    -  [macros] - Config filters: ['pretty', 'relative_url']
    INFO    -  Cleaning site directory
    INFO    -  Documentation built in 0.17 seconds
    INFO    -  [17:32:26] Watching paths for changes: 'docs', 'mkdocs.yml'
    INFO    -  [17:32:26] Serving on http://localhost:8080/
    ```
