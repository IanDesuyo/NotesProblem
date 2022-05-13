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
        $or: [
          {
            $text: {
              $search: search,
            },
          },
          {
            hashtags: {
              $in: [search],
            },
          },
        ],
      },
    },
    {
      $sort: {
        score: {
          $meta: "textScore",
        },
      },
    },
  ];
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

  const note = await collection
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

  return note[0] || null;
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
      { $match: { privacy: Privacy.PUBLIC } },
      ...(search ? searchQuery(search) : []),
      ...lookupAuthor,
      ...(userId ? lookupLike(userId) : []),
      projection,
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
