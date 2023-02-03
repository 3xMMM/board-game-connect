import nodeMocksHttp from 'node-mocks-http';
import { TagController } from './TagController';
import { TagRepository } from './TagRepository';
import Tag from './Tag';

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(); // hide expected error logs
});

const tags = ['a', 'b', 'c'].map(tag => new Tag({ name: tag }));

describe('the getAll handler', () => {
    const setup = async () => {
        const request = nodeMocksHttp.createRequest();
        const response = nodeMocksHttp.createResponse();
        const repositoryGetAll = jest.spyOn(TagRepository, 'getAll').mockResolvedValue(tags);
        await TagController.getAll(request, response);
        return {
            request,
            response,
            repositoryGetAll,
        };
    };

    it('returns a 200 response', async () => {
        const result = await setup();
        expect(result.response.statusCode).toEqual(200);
    });

    it('returns a response body with all tags in the database', async () => {
        const result = await setup();
        expect(result.response._getData()).toEqual(tags);
    });
});
