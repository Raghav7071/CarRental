import express from "express";
import { listCars, carDetails, searchCars } from "../controllers/carController.js";

const carRouter = express.Router();

carRouter.get('/list', listCars);
carRouter.get('/search', searchCars);
carRouter.get('/details/:id', carDetails);

export default carRouter;
