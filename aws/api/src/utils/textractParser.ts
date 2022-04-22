import { DetectDocumentTextResponse } from "aws-sdk/clients/textract";

const textractParser = (data: DetectDocumentTextResponse) => {
  const lines = data.Blocks.filter(block => block.BlockType == "LINE");

  const xLevels = lines
    .map(line => Math.round((line.Geometry.BoundingBox.Left + Number.EPSILON) * 100))
    .map(x => (x % 2 == 0 ? x : x - 1))
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(x => x / 100)
    .sort();

  // console.log(xLevels);

  let content = "";
  let currentX = 0;
  let currentY = 0;

  lines.forEach((line, index) => {
    let isNewLine = false;
    if (line.Geometry.BoundingBox.Top + line.Geometry.BoundingBox.Height > currentY * 1.1) {
      currentY = line.Geometry.BoundingBox.Top + line.Geometry.BoundingBox.Height;
      isNewLine = true;
      // console.log("[new line Y]");
    } else if (line.Geometry.BoundingBox.Left < currentX) {
      isNewLine = true;
      // console.log("[new line X]");
    }
    // console.log(line.Text);

    currentX = line.Geometry.BoundingBox.Left;

    if (isNewLine) {
      content += "\n";
      // find the nearest xLevel
      const nearestXLevels = xLevels.reduce((prev, curr) => {
        return Math.abs(curr - currentX) < Math.abs(prev - currentX) ? curr : prev;
      });

      const xLevelIndex = xLevels.indexOf(nearestXLevels);

      for (let i = 0; i < xLevelIndex; i++) {
        content += "  ";
      }
    }

    content += line.Text.trim() + " ";
  });

  return content;
};

export default textractParser;
