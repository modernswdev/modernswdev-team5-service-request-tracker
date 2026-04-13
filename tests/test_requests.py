import pytest
import sqlite3
from backend.setup import (get_connection)
from backend.requests import (view_requests, create_request, update_status, sort_by_priority, filter_by_status)

def test_get_connection_without_error():
    connection = get_connection()
    connection.close()

def test_view_requests_witout_error():
    view_requests("avery.wright@test.local", "password7")

def test_create_normal_request_without_error():
    create_request("test_title", "test_description", 1, "avery.wright@test.local", "password7")

def test_normal_update_status_without_error():
    assert update_status(1010, 2, "avery.wright@test.local", "password7") == True

def test_create_abnormal_request_with_error():
    with pytest.raises(sqlite3.Error):
        create_request("test_title2", "test_description2", "Banana", "avery.wright@test.local", "password7")

def test_abnormal_update_status_with_error():
    assert update_status(-5, 7, "avery.wright@test.local", "password7") == False

def test_sort_by_priority_without_error():
    sort_by_priority("avery.wright@test.local", "password7")

def test_normal_filter_by_status_without_error():
    filter_by_status(0, "avery.wright@test.local", "password7")

def test_abnormal_filter_by_status_with_error():
    assert filter_by_status(-2, "avery.wright@test.local", "password7") == 0