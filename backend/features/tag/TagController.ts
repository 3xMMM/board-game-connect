import { TagRepository } from './TagRepository';
import { Request, Response } from 'express';

export const TagController = {
    getAll: async (request: Request, response: Response) => {
        try {
            const tags = await TagRepository.getAll();
            return response.status(200).send(tags);
        } catch (e) {
            return response.status(400).send({
                message: 'Could not retrieve resource. Please try again',
            });
        }
    },
};
