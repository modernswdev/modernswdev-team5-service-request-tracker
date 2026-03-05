# Testing Datasets (Synthetic)

These files contain **fake** data for testing the Service Request Tracker without using real user data.

## Files
- `users.csv`
- `service_requests.csv`

## Columns
### `users.csv`
- `user_id, first_name, last_name, email, role, created_date`

### `service_requests.csv`
- `request_id, title, description, status, priority, created_date, updated_date, created_by_user_id, assigned_to_user_id, comment`

## Notes
- `created_by_user_id` and `assigned_to_user_id` reference `user_id` from `users.csv`.
- `assigned_to_user_id` may be blank to represent an unassigned request.
- `comment` is optional staff/admin notes (based on the flow chart).

## Import Order
Import `users.csv` first, then `service_requests.csv`.
