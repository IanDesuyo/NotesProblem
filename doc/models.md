## Login

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string"
    }
  },
  "required": ["email", "password"]
}
```

## Register

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string"
    },
    "displayName": {
      "type": "string"
    }
  },
  "required": ["email", "password", "displayName"]
}
```
