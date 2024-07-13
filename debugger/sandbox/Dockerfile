FROM debian

# =x= Packages =x=
RUN apt-get update && apt-get install -y \
    gcc gdb python3 python3-pip python3.11-venv htop \
    && apt-get clean

ARG group_name="nekogroup"
ARG user_name="neko"

RUN groupadd -r ${group_name} && useradd -r -g ${group_name} ${user_name}
RUN mkdir /home/${user_name} && chown -R ${user_name}:${group_name} /home/${user_name}
USER ${user_name}
WORKDIR /home/${user_name}

RUN python3 -m venv .venv
RUN .venv/bin/pip install --upgrade pip \
    && .venv/bin/pip install pycparser urllib3 requests python-socketio
ENV PATH=".venv/bin:$PATH"

COPY gdb_scripts src/gdb_scripts
COPY constants.py src/constants.py
COPY utils.py src/utils.py

ENV PYTHONPATH="/home/neko/.venv/lib/python3.11/site-packages:/home/neko/"
