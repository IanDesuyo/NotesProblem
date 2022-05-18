import { ObjectId } from "mongodb";
import { App, Privacy } from "../../types";
import { NewNote, UpdateNote } from "../../types/note";

const lookupAuthor = [
  {
    $lookup: {
      from: "Users",
      localField: "authorId",
      foreignField: "_id",
      as: "author",
    },
  },
  {
    $unwind: "$author",
  },
];

const projection = {
  $project: {
    title: 1,
    content: 1,
    createdAt: 1,
    updatedAt: 1,
    hashtags: 1,
    like: 1,
    likeAt: 1,
    likes: 1,
    originalFile: 1,
    "author._id": 1,
    "author.displayName": 1,
    "author.createdAt": 1,
    aiComment: 1,
    aiCommentAt: 1,
    audio: 1,
  },
};

const searchProjection = {
  $project: {
    title: 1,
    content: { $substr: ["$content", 0, 500] },
    createdAt: 1,
    updatedAt: 1,
    hashtags: 1,
    like: 1,
    likeAt: 1,
    likes: 1,
    "author._id": 1,
    "author.displayName": 1,
    "author.createdAt": 1,
  },
};

const lookupLike = (userId: ObjectId) => {
  return [
    {
      $lookup: {
        from: "Likes",
        let: {
          noteId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$userId", userId],
                  },
                  {
                    $eq: ["$noteId", "$$noteId"],
                  },
                ],
              },
            },
          },
        ],
        as: "likeData",
      },
    },
    {
      $addFields: {
        like: {
          $first: "$likeData.like",
        },
        likeAt: {
          $first: "$likeData.updatedAt",
        },
      },
    },
  ];
};

const searchQuery = (search: string) => {
  return [
    {
      $match: {
        $text: {
          $search: search,
        },
      },
    },
  ];
};

const searchSort = {
  $sort: {
    score: {
      $meta: "textScore",
    },
  },
};

const defaultSort = {
  $sort: {
    createdAt: -1,
  },
};

/**
 * Get note by id.
 * @param app - App instance
 * @param id - Note id
 * @param userId - User id to check if the user has liked the note
 * @returns Note data if found, otherwise null
 */
const get = async (app: App, id: ObjectId, userId?: ObjectId) => {
  const collection = app.db.collection("Notes");

  const notes = await collection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      ...lookupAuthor,
      ...(userId ? lookupLike(userId) : []),
      projection,
    ])
    .limit(1)
    .toArray();

  const note = notes[0];

  if (note && note.likes > 50 && !note.aiComment) {
    // run in background
    console.log("Generating AI comment");
    const res = await app.openai.createCompletion("text-curie-001", {
      prompt: `${note.content} \nTL; DR\n`,
      temperature: 0.3,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (res.status === 200) {
      const comment = res.data.choices.map(choice => choice.text).join("\n");

      console.log(res, comment);

      await collection.updateOne(
        {
          _id: note._id,
        },
        {
          $set: {
            aiComment: comment,
            aiCommentAt: new Date(),
          },
        }
      );

      console.log(`AI comment created for note ${note._id}`);
    }
  }

  return note || null;
};

/**
 * Search notes by title, hashtags, and content.
 * @param app - App instance
 * @param search - Search string
 * @param page - Page number, starts from 0
 * @param userId - User id to check if the user has liked the note
 * @returns Array of note data
 */
const search = async (app: App, search?: string, page: number = 0, userId?: ObjectId) => {
  const collection = app.db.collection("Notes");

  const notes = await collection
    .aggregate([
      ...(search ? searchQuery(search) : []),
      { $match: { privacy: Privacy.PUBLIC } },
      ...lookupAuthor,
      ...(userId ? lookupLike(userId) : []),
      searchProjection,
      search ? searchSort : defaultSort,
    ])
    .skip(page * 10)
    .limit(10)
    .toArray();

  return notes;
};

/**
 * Create a new note.
 * @param app - App instance
 * @param data - Note data to create
 * @returns Created note id
 */
const create = async (app: App, data: NewNote) => {
  const collection = app.db.collection("Notes");

  const note = await collection.insertOne({
    ...data,
    createdAt: new Date(),
  });

  return note.insertedId;
};

/**
 * Update note by id.
 * @param app - App instance
 * @param id - Note id
 * @param data - Note data to update
 * @returns MongoDB update result
 */
const update = async (app: App, id: ObjectId, data: UpdateNote) => {
  const collection = app.db.collection("Notes");

  const note = await collection.updateOne(
    {
      _id: id,
    },
    {
      $set: data,
    }
  );

  return note;
};

export default {
  get,
  search,
  create,
  update,
};
