export const allowedBoardUpdateFields = [
  "title",
  "category",
  "archived",
  "prefs.starred",
  "prefs.image",
  "prefs.color",
]
export const allowedListUpdateFields = ["title", "archived"]
export const allowedCardUpdateFields = [
  "title",
  "archived",
  "description",
  "label",
  "colorCover",
  "imageCover",
  "edgeColor",
  "coverUrl",
  "due",
  "dueComplete",
  "dueReminder",
  "start",
]

export const boardUnEditableFields = ["createdAt", "updatedAt", "id"]

export const allowedUploadTypes = [
  "jpeg",
  "png",
  "pdf",
  "doc",
  "jpg",
  "yaml",
  "yml",
  "svg",
  "x-yaml",
]

export const generateRandomColor = () => {
  var letters = "0123456789ABCDEF"
  var color = "#"
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
