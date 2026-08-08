import subprocess
import sys

def typecheck():
    sys.exit(subprocess.call(["mypy", "."]))

def isort_check():
    sys.exit(subprocess.call(["isort", "--check-only", "."]))

def check():
    commands = [
        ["mypy", "."],
        ["isort", "--check-only", "."],
    ]

    failed = False

    for cmd in commands:
        result = subprocess.call(cmd)
        if result != 0:
            failed = True

    sys.exit(1 if failed else 0)