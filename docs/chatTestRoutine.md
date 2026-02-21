# Test routine for Chat feature

```
- Have 3 users
- Have 3 items
    - 2 from user 1, another from user 2
- Item 1 chat:
    With user 2:
        - user 2
        - user 1
        - user 2
    With user 3:
        - user 3
        - user 1
        - user 3
        - user 1
- Item 2:
    With user 2:
        - user 2
        - user 1
        - user 2
        - user 1
    With user 3:
        - user 3
        - user 1
        - user 3
- Item 3:
    With user 1:
        - user 1
        - user 2
        - user 1
    With user 3:
        - user 3
        - user 2
        - user 3
        - user 2
```

# Expected on each user's Chats Page:
## User 1
```
- Item 1, ends with user 2
- Item 1, ends with user 1
- Item 2, ends with user 1
- Item 2, ends with user 3
- Item 3, ends with user 1
```

## User 2
```
- Item 1, ends with user 2
- Item 2, ends with user 1
- Item 3, ends with user 1
- Item 3, ends with user 2
```

## User 3
```
- Item 1, ends with user 1
- Item 2, ends with user 3
- Item 3, ends with user 2
```

Further test by randomly clicking on the preview of each users in Chats page,
chat should be between the two expected users on an item.