import psycopg

# Connect to an existing database
with psycopg.connect("dbname=db-name host=localhost password='change-me' user=username") as connection:
    # Open a cursor to perform database operations
    with connection.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tests (
                id UUID PRIMARY KEY,
                name VARCHAR(255)
            )""")
        cursor.execute("""
                INSERT INTO public.tests
                VALUES (gen_random_uuid(), %(name)s)
            """, {
                "name": "Mohammad Jawad (Kasir)"
            })
        cursor.execute("""
            SELECT *
            FROM public.tests
        """)

        record = cursor.fetchone()

        print(record)

        # Make the changes to the database persistent
        connection.commit()
