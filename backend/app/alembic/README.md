Alembic is a lightweight database migration tool for usage with SQLAlchemy. It is used to handle the schema changes of a database in a consistent and structured manner. Here are some common Alembic commands :

1. **Initialize Alembic**

   ```bash
   alembic init alembic
   ```

   This command creates an `alembic` directory with the necessary configuration files.

2. **Create a New Migration**

   ```bash
   alembic revision -m "description of migration"
   ```

   This command creates a new revision file in the `versions` directory with the provided description.

3. **Autogenerate a Migration Script**

   ```bash
   alembic revision --autogenerate -m "description of migration"
   ```

   This command generates a new migration script by comparing the database schema to the SQLAlchemy models.

4. **Upgrade the Database**

   ```bash
   alembic upgrade head
   ```

   This command applies all pending migrations to the database, upgrading it to the latest revision.

5. **Downgrade the Database**

   ```bash
   alembic downgrade -1
   ```

   This command reverts the database to the previous revision.

6. **Show the Current Revision**

   ```bash
   alembic current
   ```

   This command shows the current revision applied to the database.

7. **Show the History of Revisions**

   ```bash
   alembic history
   ```

   This command shows the history of all the migrations that have been applied.

8. **Stamp the Database with a Specific Revision**

   ```bash
   alembic stamp head
   ```

   This command stamps the database with a specific revision without performing any migrations.

9. **Check for Revision Changes**

   ```bash
   alembic check
   ```

   This command checks for changes in the revision files.

10. **Merge Multiple Branches**
    ```bash
    alembic merge -m "merge description" <revision1> <revision2>
    ```
    This command creates a new merge revision to reconcile two branches of migrations.

## DB Check

```
psql -U postgres -d "app_db"
\dt

```
