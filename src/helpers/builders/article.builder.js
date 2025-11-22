import { faker } from '@faker-js/faker';

export class ArticleBuilder {
    addTitle() {
        this.title = faker.word.noun();
        return this;
    }

    addDescription() {
        this.description = faker.word.noun();
        return this;
    }

    addBody() {
        this.body = faker.lorem.paragraph();
        return this;
    }

    addTags() {
        this.tags = faker.word.noun(10);
        return this;
    }

    addText() {
        this.commentText = faker.word.noun(10);
        return this;
    }

    generate() {
        return { ...this };
    }
}