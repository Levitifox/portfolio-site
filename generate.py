import os
import pathlib
import shutil
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))

template_path = pathlib.Path("template.html")
resources_path = pathlib.Path("resources")
pages_path = pathlib.Path("pages")
output_path = pathlib.Path("output")

if output_path.exists():
    shutil.rmtree(output_path)
output_path.mkdir()

def procces_resource(path):
    print(f"Proccesing resource {path}", file=sys.stderr)
    if (resources_path / path).is_dir():
        if path != pathlib.Path():
            (output_path / path).mkdir()
        for child_path in (resources_path / path).iterdir():
            child = child_path.relative_to(resources_path / path)
            procces_resource(path / child)
    else:
        shutil.copyfile(resources_path / path, output_path / path)

procces_resource(pathlib.Path())

def procces_page(path):
    print(f"Proccesing page {path}", file=sys.stderr)
    if (pages_path / path).is_dir():
        if path != pathlib.Path():
            (output_path / path).mkdir()
        for child_path in (pages_path / path).iterdir():
            child = child_path.relative_to(pages_path / path)
            procces_page(path / child)
    else:
        if path.name.endswith(".html"):
            with (template_path.open("r") as template_file,
                  (pages_path / path).open("r") as page_file,
                  (output_path / path).open("w") as output_file):
                template_text = template_file.read()
                page_text = page_file.read()

                title_text = ""
                content_text = ""
                in_title = False
                while page_text:
                    if page_text.startswith("{{root}}"):
                        assert not in_title
                        content_text += "../" * (len(path.parts) - 1)
                        page_text = page_text.removeprefix("{{root}}")
                    elif page_text.startswith("<gen:title>"):
                        assert not in_title
                        in_title = True
                        page_text = page_text.removeprefix("<gen:title>")
                    elif page_text.startswith("</gen:title>"):
                        assert in_title
                        in_title = False
                        page_text = page_text.removeprefix("</gen:title>")
                        if page_text.startswith("\n"):
                            page_text = page_text.removeprefix("\n")
                    else:
                        if in_title:
                            title_text += page_text[0]
                        else:
                            content_text += page_text[0]
                        page_text = page_text[1:]

                output_text = ""
                while template_text:
                    if template_text.startswith("{{root}}"):
                        output_text += "../" * (len(path.parts) - 1)
                        template_text = template_text.removeprefix("{{root}}")
                    elif template_text.startswith("{{title}}"):
                        output_text += title_text
                        template_text = template_text.removeprefix("{{title}}")
                    elif template_text.startswith("{{content}}"):
                        output_text += content_text
                        template_text = template_text.removeprefix("{{content}}")
                    else:
                        output_text += template_text[0]
                        template_text = template_text[1:]

                output_file.write(output_text)
        else:
            shutil.copyfile(pages_path / path, output_path / path)

procces_page(pathlib.Path())
