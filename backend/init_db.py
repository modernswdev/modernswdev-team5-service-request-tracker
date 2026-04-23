from backend.setup import initialize_database

if __name__ == "__main__":
    initialize_database(force_reset=False)
    print("Database initialized and seeded.")
