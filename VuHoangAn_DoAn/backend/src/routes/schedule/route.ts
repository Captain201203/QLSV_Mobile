import express from 'express';
import {ScheduleController} from '../../controller/schedule/controller.js';

const router = express.Router();

router.get('/class/:className', ScheduleController.getByClass);

router.post('/', ScheduleController.create);

router.put('/:id', ScheduleController.update);

router.delete('/:id', ScheduleController.delete); 

export default router;
