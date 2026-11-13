"""Bounded, process-local throttling for public authentication mutations."""
import hashlib
import math
import time
from collections import OrderedDict, deque

from fastapi import HTTPException, Request


class AuthAttemptLimiter:
    def __init__(self, limit: int = 20, window: float = 60, max_keys: int = 4096):
        self.limit = limit
        self.window = window
        self.max_keys = max_keys
        self.buckets = OrderedDict()

    def clear(self) -> None:
        self.buckets.clear()

    def check(self, key: str, *, limit: int | None = None) -> None:
        now = time.monotonic()
        bucket = self.buckets.pop(key, deque())
        while bucket and bucket[0] <= now - self.window:
            bucket.popleft()
        self.buckets[key] = bucket
        while len(self.buckets) > self.max_keys:
            self.buckets.popitem(last=False)
        if len(bucket) >= (limit if limit is not None else self.limit):
            raise HTTPException(429, "Слишком много попыток. Повторите позже", headers={"Retry-After": str(max(1, math.ceil(self.window - now + bucket[0])))})
        bucket.append(now)


auth_attempts = AuthAttemptLimiter()


async def limit_auth_attempts(request: Request) -> None:
    """Throttle per client and per account/link, without storing raw credentials."""
    client = request.client.host if request.client else "unknown"
    route = request.scope.get("route")
    path = getattr(route, "path", request.url.path)
    auth_attempts.check("client:" + client, limit=100)
    try:
        body = await request.json()
    except (ValueError, UnicodeError):
        body = {}
    actor = (body.get("username") or body.get("email")) if isinstance(body, dict) else None
    actor = actor if isinstance(actor, str) else request.path_params.get("token") or request.cookies.get("twofa_token") or client
    digest = hashlib.sha256(actor.strip().casefold().encode()).hexdigest()
    auth_attempts.check(f"account:{path}:{digest}")
