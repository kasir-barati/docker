# How `ContextVar` Works

`ContextVar` from Python's `contextvars` module is specifically designed to solve the problem you're worried about. It is **not** a regular global variable — it's a **context-aware** variable.

## TL;DR

- `ContextVar` is **not** a regular global variable — it's a context-scoped lookup key.
- Each async request gets its own isolated `Context` dictionary.
- `.set()` writes to the current request's context, `.get()` reads from it.
- Concurrent requests never overwrite each other's values.
- This is the Python equivalent of thread-local storage (`threading.local()`), but designed for async/await code.

## Regular global variable (would be broken):

```python
# ❌ This WOULD be overwritten across requests
_correlation_id = None

def set_correlation_id(value):
    global _correlation_id
    _correlation_id = value  # Every request overwrites the same variable!
```

## ContextVar (what you're using — safe):

```python
# ✅ This is safe across concurrent requests
_correlation_id_var: ContextVar[str | None] = ContextVar("correlation_id", default=None)

def set_correlation_id(value):
    _correlation_id_var.set(value)  # Sets it only in the CURRENT context
```

# The Key Concept: Execution Context

Python's `contextvars` module maintains a **context object** for each execution context. Think of it like thread-local storage, but for `async`/`await` code (where multiple coroutines can run on the **same thread**).

Here's what happens step by step:

1. **The `ContextVar` object itself (`_correlation_id_var`) is indeed a single global object** — there's only one instance of it in memory. But it's essentially a **lookup key**, not a storage container.

2. **Each async task/coroutine gets its own `Context` object** (a dictionary-like structure maintained by Python's asyncio event loop). When you call `_correlation_id_var.set(value)`, it stores the value in the **current task's context**, not in the `ContextVar` object itself.

3. **When you call `_correlation_id_var.get()`**, it looks up the value in the **current task's context**.

## Visualizing Concurrent Requests

```
Request A (correlation_id = "aaa-111")     Request B (correlation_id = "bbb-222")
─────────────────────────────────────      ─────────────────────────────────────
Context A: {_correlation_id_var: "aaa-111"}  Context B: {_correlation_id_var: "bbb-222"}

middleware: set_correlation_id("aaa-111")   middleware: set_correlation_id("bbb-222")
   └─ stores in Context A                     └─ stores in Context B

handler: get_correlation_id()               handler: get_correlation_id()
   └─ reads from Context A → "aaa-111"        └─ reads from Context B → "bbb-222"
```

Even if both requests are running concurrently on the **same thread** (which is normal in async Python), they each have their own context, so they never interfere with each other.

## How asyncio Manages This

Under the hood:

- Python's `asyncio` event loop creates a **copy of the current context** for each new `Task`.
- When the event loop switches between tasks (at every `await` point), it also switches the active context.
- So when Request A is suspended at an `await` and Request B runs, Python automatically swaps to Request B's context.

## Important Caveat with `BaseHTTPMiddleware`

Starlette's `BaseHTTPMiddleware` (which you're using) runs `call_next()` in a **new task** internally. This means the context set in `dispatch()` is **copied** to the child task. Since `ContextVar.set()` was called **before** `call_next()`, the child task inherits that value — so your route handlers and downstream code will correctly see the correlation ID.
