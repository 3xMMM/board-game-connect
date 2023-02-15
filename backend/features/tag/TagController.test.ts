import nodeMocksHttp from 'node-mocks-http';
import { TagController } from './TagController';
import { TagRepository } from './TagRepository';
import Tag from './Tag';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(); // hide expected error logs
});

const createTagsFromArray = (stringArray: string[]) => stringArray.map(tagString => new Tag({ name: tagString }));
const tags = createTagsFromArray(['a', 'b', 'c']);

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

describe('the postMany handler', () => {
    const setup = async (tagsToAdd: string, output: Tag[]) => {
        const request = nodeMocksHttp.createRequest({
            body: {
                tagsToAdd,
            },
        });
        const response = nodeMocksHttp.createResponse();
        const repositoryCreateMany = jest.spyOn(TagRepository, 'createMany').mockResolvedValue(output);
        await TagController.postMany(request, response);
        return {
            request,
            response,
            repositoryCreateMany,
        };
    };

    describe('a successful response', () => {
        describe.each([
            ['a', createTagsFromArray(['a'])],
            [' a ', createTagsFromArray(['a'])],
            ['a,b', createTagsFromArray(['a', 'b'])],
            ['a,b,c', createTagsFromArray(['a', 'b', 'c'])],
            [' a , b , c ', createTagsFromArray(['a', 'b', 'c'])],
        ])('with an input of "%s"', (input, expected) => {
            it('returns a 201 response', async () => {
                const result = await setup(input, expected);
                expect(result.response.statusCode).toEqual(201);
            });
            it('returns a response body with all created tags', async () => {
                const result = await setup(input, expected);
                expect(result.response._getData()).toEqual(expected);
            });
        });
    });

    describe('an unsuccessful validation response', () => {
        describe.each([
            ['', []],
            [1, []],
        ])('with an input of "%s"', (input, expected) => {
            it('returns a 400 response', async () => {
                // @ts-expect-error
                const result = await setup(input, expected);
                expect(result.response.statusCode).toEqual(400);
            });
            it('returns a response body with an error message', async () => {
                // @ts-expect-error
                const result = await setup(input, expected);
                expect(result.response._getData().message).toBeTruthy();
            });
        });
    });

    describe('a database insertion error', () => {
        const setup = async (tagsToAdd: string, output: Tag[]) => {
            const request = nodeMocksHttp.createRequest({
                body: {
                    tagsToAdd,
                },
            });
            const response = nodeMocksHttp.createResponse();
            const repositoryCreateMany = jest.spyOn(TagRepository, 'createMany').mockImplementation(() => {
                throw new Error('it broke');
            });
            await TagController.postMany(request, response);
            return {
                request,
                response,
                repositoryCreateMany,
            };
        };

        it('returns a 500 response', async () => {
            const result = await setup('this will fail', []);
            expect(result.response.statusCode).toEqual(500);
        });

        it('returns a response body with an error message', async () => {
            const result = await setup('this will also fail', []);
            expect(result.response._getData().message).toBeTruthy();
        });
    });
});
