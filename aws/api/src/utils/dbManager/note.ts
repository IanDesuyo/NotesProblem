import { ObjectId } from "mongodb";
import { App } from "../../types";
import { NewNote } from "../../types/note";

const lookup = [
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
  {
    $project: {
      authorId: 0,
      "author.password": 0,
      "author.email": 0,
      "author.emailVerified": 0,
      "author.createdAt": 0,
    },
  },
];

/**
 * Get note by id.
 * @param app - App instance
 * @param id - Note id
 * @returns Note data if found, otherwise null
 */
const get = async (app: App, id: ObjectId) => {
  const collection = app.db.collection("Notes");

  const note = await collection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      ...lookup,
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
 * @returns Array of note data
 */
const search = async (app: App, search?: string, page: number = 0) => {
  const collection = app.db.collection("Notes");

  const searchQuery = search
    ? [
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
      ]
    : [];

  const notes = await collection
    .aggregate([...searchQuery, ...lookup])
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
const update = async (app: App, id: ObjectId, data: any[]) => {
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
