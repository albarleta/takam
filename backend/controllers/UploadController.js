import cloudinary from "../utils/cloudinary.js";

const UploadController = {
  upload: async (req, res) => {
    try {
      const cloudUpload = await cloudinary.uploader.upload_stream(
        { folder: "batch-22" },
        (error, result) => {
          if (error) return res.status(500).json({ error: error.message });

          req.body.imageId = result.public_id;
          req.body.image = result.secure_url;

          res.send({ body: req.body, image: result });
        }
      );

      cloudUpload.end(req.file.buffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default UploadController;
