# backend/database.py
from __future__ import annotations
from typing import Any
from .extensions import db

def commit_session() -> None:
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise

def save_instance(instance: Any) -> Any:
    db.session.add(instance)
    commit_session()
    return instance