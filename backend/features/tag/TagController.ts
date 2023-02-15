import { TagRepository } from './TagRepository';
import { Request, Response } from 'express';
import Joi from 'joi';

export interface TagPostManyRequest extends Request {
    body: {
        tagsToAdd: string // Comma-separated string
    }
}

export const TagController = {
    getAll: async (request: Request, response: Response) => {
        const tags = await TagRepository.getAll();
        return response.status(200).send(tags);
    },
    postMany: async (request: TagPostManyRequest, response: Response) => {
        const schema = Joi.object({
            tagsToAdd: Joi.string()
                .required()
                .min(1)
                .label('Tags'),
        });

        const validation = schema.validate(request.body, { abortEarly: false });
        if (validation.error) {
            return response.status(400).send({
                message: validation.error.message,
            });
        }

        const tagsAsArray = request.body.tagsToAdd.split(',').map(tagWithSpaces => tagWithSpaces.trim());

        try {
            const createdTags = await TagRepository.createMany(tagsAsArray);
            return response.status(201).send(createdTags);
        } catch (e) {
            let message = 'Could not create Tags. Please try again later.';
            if (e instanceof Error && e.message.includes('Duplicate Tag(s): ')) {
                message = e.message;
                console.error(message);
                return response.status(409).send({
                    message,
                });
            }
            return response.status(500).send({
                message,
            });
        }
    },
};
