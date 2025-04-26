const { Router } = require("express")
const {addNamespace, getListOfNamespaces} = require("./nameSpace.controller")
const router = Router();

router.post("/add", addNamespace)
router.get("/list", getListOfNamespaces)

module.exports = {
    namespaceRoutes: router
}