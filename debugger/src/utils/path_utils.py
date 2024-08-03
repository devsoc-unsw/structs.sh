import os
from typing import IO


def create_abs_file_path(file_name: str):
    return os.path.dirname(os.path.abspath(__file__)) + "/" + file_name
