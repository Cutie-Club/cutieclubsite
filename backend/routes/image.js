const sharp = require('sharp');
const fs = require('fs');

const imageDir = `${__dirname}/../pictures`

module.exports = (app, upload, db) => {
  app.get("/image/:id", async (req, res) => {
    const image = await db.get("images").get("id", req.params.id);

    if (image.length === 0) return res.json("Image does not exist!");

    if (image[0].hidden && !req.user.admin) return res.json("Snooping as usual, I see.");
  
    const readStream = fs.createReadStream(`${imageDir}${image[0].path}`);
      
    readStream.on('error', (error) => {
      res.json("File not found!");
      log.error(error);
    });

    readStream.on('open', () => {
      let w = parseInt(req.query.width) || undefined;
      let h = parseInt(req.query.height) || undefined;

      const format = req.query.format || "webp";

      try {
        const sharpOperation = sharp().resize(w, h, { withoutEnlargement: true }).toFormat(format);
        res.type(`image/${format}`);
        readStream.pipe(sharpOperation).pipe(res);
      } catch (error) {
        res.status(400);
        res.json(error.message);
        log.error(error);
      }
    });
  });
}