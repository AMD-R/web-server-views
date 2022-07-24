#!/usr/bin/env python3

from pathlib import Path, PosixPath, WindowsPath
from os.path import join, dirname
from os import PathLike


def get_html(directory: PosixPath | WindowsPath) -> list[PosixPath |
                                                         WindowsPath]:
    # Getting all the html files
    html_files = list(directory.glob('*.html'))

    # Looping into subdirectories
    for i in directory.iterdir():
        if i.is_dir():
            for j in get_html(i):
                html_files.append(j)

    return html_files


def write_ejs(html_file: PathLike, repository: PathLike) -> None:
    html_file = Path(html_file)
    parent = Path(dirname(html_file)).name
    # Reading and editing html file
    edited = ""
    with open(html_file, 'r') as f:
        for line in f:
            match line.strip():
                case "<script src=\"scripts/render_ejs.js\"></script>":
                    # Deleting Lines
                    line = ""
                case "<script src=\"scripts/ejs.min.js\"></script>":
                    # Deleting Lines
                    line = ""
                case "<base href=\"../../\">":
                    # Deleting Lines
                    line = ""
                case "<body>" if not parent == "includes":
                    line += "        <%- include('../includes/header') -%>\
                            \n"
                case "</body>" if not parent == "includes":
                    line = "        <%- include('../includes/footer') -%>\
                            \n" + line
                # https://stackoverflow.com/questions/2308944/multiple-value-checks-using-in-operator-python
                case _ if any(string in line for string in ("href", "src")):
                    # Links
                    # Getting Indexes
                    if "href" in line:
                        index = line.find("href")
                        index_left = index + len("href") + 2
                        index_right = line.find("\"", index_left)
                    else:
                        index = line.find("src")
                        index_left = index + len("src") + 2
                        index_right = line.find("\"", index_left)

                    # Getting and Formatting Link
                    link = line[index_left:index_right]
                    partition = list(line.partition(link))
                    if link.startswith(("/", "http")):
                        link = link
                    else:
                        link = "/" + link
                    partition[1] = link

                    line = "".join(partition)
            edited += line

    # Writing ejs files
    results_dir = Path(join(repository, 'views', parent))
    results_path = join(results_dir, html_file.name.replace('html', 'ejs'))
    Path.mkdir(results_dir, exist_ok=True)

    with open(results_path, 'w') as f:
        f.write(edited)


p = Path(__file__)
repository = p.parent.parent
html_dir = Path(join(repository, 'html'))
html_files = get_html(html_dir)
for html_file in html_files:
    write_ejs(html_file, repository)
