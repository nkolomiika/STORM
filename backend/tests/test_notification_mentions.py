import pytest
from app.notification_events import mentioned_names


@pytest.mark.parametrize('content,names,expected', [
    ('@alice проверь', ['alice'], {'alice'}),
    ('@alice. Спасибо', ['alice'], {'alice'}),
    ('@alice.smith', ['alice', 'alice.smith'], {'alice.smith'}),
    ('@Иван Иванов, проверь', ['Иван', 'Иван Иванов'], {'Иван Иванов'}),
    ('@{Иван Иванов} и @"Анна Петрова"', ['Иван Иванов', 'Анна Петрова'], {'Иван Иванов', 'Анна Петрова'}),
    ('user@alice.example and @@alice', ['alice'], set()),
    ('@alice-extra', ['alice'], set()),
    ('@alice @alice', ['alice'], {'alice'}),
    ('Обычный текст', ['alice'], set()),
    ('@a.b', ['a.b', 'a'], {'a.b'}),
])
def test_mention_boundaries(content, names, expected):
    assert mentioned_names(content, names) == expected
