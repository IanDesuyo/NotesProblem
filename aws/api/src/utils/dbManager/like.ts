import { ObjectId } from "mongodb";
import { App, Privacy } from "../../types";

const projection = {
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

const getUserLikeNotes = async (app: App, userId: ObjectId, page: number = 0) => {
  const collection = app.db.collection("Likes");

  const likeNotes = await collection
    .aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: "Notes",
          localField: "noteId",
          foreignField: "_id",
          as: "note",
        },
      },
      {
        $unwind: "$note",
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                like: "$$ROOT.like",
                likeAt: "$$ROOT.updatedAt",
              },
              "$note",
            ],
          },
        },
      },
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
        $sort: {
          createdAt: -1,
        },
      },
      projection,
    ])
    .skip(page * 10)
    .limit(10)
    .toArray();

  return likeNotes;
};

const setUserLike = async (app: App, userId: ObjectId, noteId: ObjectId, isLike: boolean) => {
  const likesCollection = app.db.collection("Likes");
  const notesCollection = app.db.collection("Notes");

  // check if note is exist
  const note = await notesCollection.findOne({
    _id: noteId,
    privacy: { $ne: Privacy.HIDE },
  });

  if (!note) {
    throw {
      status: 404,
      message: "Note not found",
      i18n: "notes.notFound",
    };
  }

  // check if user already like this note
  const like = await likesCollection.findOne({
    userId,
    noteId,
  });

  if (isLike && like) {
    throw {
      status: 400,
      message: "You already like this note",
      i18n: "notes.alreadyLike",
    };
  }

  if (!isLike && !like) {
    throw {
      status: 400,
      message: "You haven't like this note",
      i18n: "notes.notLike",
    };
  }

  // update like
  if (isLike) {
    await likesCollection.insertOne({
      userId,
      noteId,
      like: true,
      updatedAt: new Date(),
    });
  } else {
    await likesCollection.deleteOne({
      userId,
      noteId,
    });
  }

  await notesCollection.updateOne(
    {
      _id: noteId,
    },
    {
      $inc: {
        likes: isLike ? 1 : -1,
      },
    }
  );

  return {
    like: isLike,
  };
};

export default {
  getUserLikeNotes,
  setUserLike,
};
