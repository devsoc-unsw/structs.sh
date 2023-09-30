FROM ubuntu

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y; apt-get install -y build-essential gdb curl git libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev

# Install python3 to run the backend server
RUN curl https://pyenv.run | bash

ENV HOME="/root"
ENV PYENV_ROOT="${HOME}/.pyenv"
ENV PATH="${PYENV_ROOT}/bin:${PATH}"
# The following env var is needed to allow gdb to run our Python packages
# installed from requirements.txt
ENV PYTHONPATH="/root/.pyenv/versions/3.11.3/lib/python3.11/site-packages:${PYTHONPATH}"

ENV PYTHON_VERSION=3.11.3

# The following env var is needed to allow gdb to run our Python packages
# installed from requirements.txt
ENV PYTHONPATH="${PYENV_ROOT}/versions/${PYTHON_VERSION}/lib/python3.11/site-packages:${PYTHONPATH}"

RUN pyenv install ${PYTHON_VERSION}
RUN pyenv global ${PYTHON_VERSION}

COPY requirements.txt .
RUN pyenv exec pip3 install -r requirements.txt

WORKDIR /app

COPY . .

EXPOSE 8000

# `python3 -u` option to prevent buffering output of print statements
# in the python server. Print to docker logs immediately. For easier
# debugging.
CMD ["pyenv", "exec", "python3", "-u", "src/server.py"]
