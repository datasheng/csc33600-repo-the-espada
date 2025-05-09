from dataclasses import dataclass
from typing import List, Optional

@dataclass
class StoreHours:
    day: str
    open: str
    close: str
    is_closed: bool

@dataclass
class Store:
    id: str
    name: str
    address: str
    lat: float
    lng: float
    rating: float
    num_reviews: int
    phone: str
    email: str
    website: Optional[str]
    hours: List[StoreHours]