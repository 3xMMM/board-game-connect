import { TagRepository } from './TagRepository';
import { Request, Response } from 'express';

export const TagController = {
    getAll: async (request: Request, response: Response) => {
        const tags = await TagRepository.getAll();
        return response.status(200).send(tags);
    },
};
