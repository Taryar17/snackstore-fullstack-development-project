import { Request, Response, NextFunction } from "express";
import { unlink } from "node:fs/promises";
import path from "path";
import { getUserbyId, updateUser } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";
import { checkUploadFile } from "../../utils/check";
import imageQueue from "../../jobs/queues/imageQueue";

interface CustomRequest extends Request {
  userId?: number;
}

export const uploadProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;
  const user = await getUserbyId(userId!);
  checkUserIfNotExist(user);
  checkUploadFile(image);

  const fileName = image!.filename;
  // const filePath = image!.path;
  //const filePath = image!.path.replace("\\", "/");

  if (user?.image) {
    try {
      const filePath = path.join(
        __dirname,
        "../../../",
        "uploads/images",
        user!.image!
      );
      await unlink(filePath);
    } catch (error) {
      console.log(error);
    }
  }

  const userData = {
    image: fileName,
  };

  await updateUser(userId!, userData);
  res.status(200).json({
    message: "Profile picture uploaded successfully",
  });
};

//Just for testing
export const getMyPhoto = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const file = path.join(
    __dirname,
    "../../../",
    "uploads/images",
    "1755280127672=415852824-coding_crocodile.jpg" // user.image
  );

  res.sendFile(file, (err) => res.status(404).send("File not found"));
};

export const uploadProfileMultiple = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("req.files-----", req.files);
  res.status(200).json({
    message: "Multiple files uploaded successfully",
  });
};

export const uploadProfileOptimize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;
  const user = await getUserbyId(userId!);
  checkUserIfNotExist(user);
  checkUploadFile(image);

  const splitFileName = req.file?.filename.split(".")[0];

  const job = await imageQueue.add(
    "optimize-image",
    {
      filePath: req.file?.path,
      fileName: `${splitFileName}.webp`,
      width: 200,
      height: 200,
      quality: 50,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );

  if (user?.image) {
    try {
      const originalFilePath = path.join(
        __dirname,
        "../../../",
        "uploads/images",
        user!.image!
      );

      const optimizedFilePath = path.join(
        __dirname,
        "../../../",
        "uploads/optimized",
        user!.image!.split(".")[0] + ".webp"
      );
      await unlink(originalFilePath);
      await unlink(optimizedFilePath);
    } catch (error) {
      console.log(error);
    }
  }
  const userData = {
    image: req.file?.originalname,
  };
  await updateUser(user?.id!, userData);

  res.status(200).json({
    message: "Profile picture optimized and uploaded successfully",
    image: splitFileName + ".webp",
    jobId: job.id,
  });
};
