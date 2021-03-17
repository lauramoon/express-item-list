const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

router.get("/", function(req,res){
  res.json(items)
})

router.post("/", function (req, res) {
  const newItem = { name: req.body.name, price: req.body.price }
  items.push(newItem)
  res.status(201).json({ added: newItem })
})

router.get("/:name", function (req, res) {
  const foundItem = items.find(item => item.name === req.params.name)
  if(foundItem === undefined){
    throw new ExpressError("Item not found", 404)
  }
  res.json({ item: foundItem })
})

router.patch("/:name", function (req, res) {
  const foundIndex = items.findIndex(item => item.name === req.params.name)
  if (foundIndex === -1) {
    throw new ExpressError("Item not found", 404)
  }
  let updatedItem = items[foundIndex];
  if (req.body.name) updatedItem.name = req.body.name;
  if (req.body.price) updatedItem.price = req.body.price;
  items[foundIndex] = updatedItem;
  res.json({ updated: updatedItem });
})

router.delete("/:name", function (req, res) {
  const foundItem = items.findIndex(item => item.name === req.params.name)
  if (foundItem === -1) {
    throw new ExpressError("Item not found", 404)
  }
  items.splice(foundItem, 1)
  res.json({ message: "Deleted" })
})

module.exports = router;