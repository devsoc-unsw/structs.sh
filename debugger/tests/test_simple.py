from testcontainers.core.container import DockerContainer
from testcontainers.core.waiting_utils import wait_for_logs
from testcontainers.core.image import DockerImage

import pytest

from contextlib import contextmanager


@contextmanager
def socket_server():
    with DockerImage(path="../Dockerfile.prod") as image:
        yield DockerContainer(image=str(image))


def test_simple(subtests: pytest.Subtests) -> None:
    pass

