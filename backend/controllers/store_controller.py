from typing import List, Optional
from models.store_model import Store, StoreHours

class StoreController:
    def __init__(self):
        # Temporary in-memory storage until database is set up
        self.stores = []

    def get_all_stores(self) -> List[Store]:
        return self.stores

    def get_store_by_id(self, store_id: str) -> Optional[Store]:
        return next((store for store in self.stores if store.id == store_id), None)

    def create_store(self, store_data: dict) -> Store:
        store = Store(
            id=store_data['id'],
            name=store_data['name'],
            address=store_data['address'],
            lat=store_data['lat'],
            lng=store_data['lng'],
            rating=store_data['rating'],
            num_reviews=store_data['numReviews'],
            phone=store_data['phone'],
            email=store_data['email'],
            website=store_data.get('website'),
            hours=[
                StoreHours(
                    day=h['day'],
                    open=h['open'],
                    close=h['close'],
                    is_closed=h['isClosed']
                ) for h in store_data['hours']
            ]
        )
        self.stores.append(store)
        return store