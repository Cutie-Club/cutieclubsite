const sharp = require('sharp');
const fs = require('fs');

module.exports = (app, upload, db) => {
  app.get("/image/:id", async (req, res) => {
    const image = await db.get("images").get("id", req.params.id);

    if (image.length === 0) return res.json("image does not exist");
    const readStream = fs.createReadStream(`.${image[0].path}`);
      
    readStream.on('error', (error) => {
      res.json("file not found");
      log.error(error)
    });

    readStream.on('open', () => {
      const w = parseInt(req.query.width) || 500;
      const h = parseInt(req.query.height) || 500;
      const format = req.query.format || "jpeg";

      const sharpOperation = sharp().resize(w, h).toFormat(format);
      
      res.type(`image/${format}`);
      readStream.pipe(sharpOperation).pipe(res);
    });
  });
}