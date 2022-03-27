# 資料庫格式

## Users

使用者帳號資訊

```json
{
  "_id": "***REMOVED***", // Object Id
  "email": "***REMOVED***",
  "displayName": "ian", // 顯示名稱, 可重複
  "password": "sha256-hash",
  "createdAt": 1640966400, // timestamp, 上傳時間
  "emailVerified": false, // email是否已驗證, 可能不會實作
  "bio": "Hello!" // 個人簡介
}
```

## Notes

筆記資訊

```json
{
  "_id": "***REMOVED***", // Object Id
  "authorId": 1, // 作者id
  "createdAt": 1640966400, // timestamp, 上傳時間
  "updatedAt": 1640966400, // timestamp, 最後更新時間
  "title": "我的英文筆記", // 筆記名稱, 可被搜尋
  "hashtags": ["English", "大一上"], // hashtags, 可被搜尋
  "content": "Note (n.) 筆記\nProblem (n.) 問題", // 筆記內文
  "originalFile": "http://***REMOVED***-us-east-1.amazonaws.com/notes/original/{uuid}.png", // 原始檔案連結
  "isBestNote": false, // 是否為自動產生的最佳筆記
  "translateCache": {
    // 翻譯快取
    "zh-tw": "http://***REMOVED***-us-east-1.amazonaws.com/notes/translate/zh-tw_{uuid}",
    "zh-cn": "http://***REMOVED***-us-east-1.amazonaws.com/notes/translate/zh-cn_{uuid}"
  },
  "audioCache": {
    // 語音快取
    "zh-tw": "http://***REMOVED***-us-east-1.amazonaws.com/notes/audio/zh-tw_{uuid}",
    "zh-cn": "http://***REMOVED***-us-east-1.amazonaws.com/notes/audio/zh-cn_{uuid}"
  }
}
```

## UserLikes

使用者按讚關聯
另外建一張表的優點是可避免 User 或 Post 內出現無限長的陣列

```json
{
  "userId": "***REMOVED***", // Object Id
  "noteId": "***REMOVED***", // Object Id
  "like": 1, // like = 1, dislike = -1
  "updatedAt": 1640966400 // timestamp, 最後更新時間
}
```

## PostComments

筆記頻論關聯
另外建一張表的優點是可避免 Post 內出現無限長的陣列

```json
{
  "_id": "***REMOVED***", // Object Id
  "userId": 1,
  "noteId": 1,
  "comment": "Nice!", // 頻論
  "replyTo": null // 回覆目標頻論id, 無則為null
}
```
